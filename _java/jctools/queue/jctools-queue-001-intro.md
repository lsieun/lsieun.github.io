---
title: "Intro"
sequence: "101"
---

The library offers a number of queues to use in a multi-threaded environment,
i.e. one or more threads write to a queue and one or more threads read from it in a thread-safe lock-free manner.

The common interface for all Queue implementations is `org.jctools.queues.MessagePassingQueue`.

```text
                                       ┌─── size
                                       │
                                       ├─── clear
                       ┌─── queue ─────┤
                       │               ├─── isEmpty
                       │               │
                       │               └─── capacity
MessagePassingQueue ───┤
                       │                              ┌─── offer
                       │                              │
                       │               ┌─── single ───┼─── poll
                       │               │              │
                       └─── message ───┤              └─── peek
                                       │
                                       │              ┌─── fill
                                       └─── batch ────┤
                                                      └─── drain
```

## Types of Queues

All queues can be categorized on their producer/consumer policies:

- **single producer, single consumer** – such classes are named using the prefix `Spsc`, e.g. `SpscArrayQueue`
- **single producer, multiple consumers** – use `Spmc` prefix, e.g. `SpmcArrayQueue`
- **multiple producers, single consumer** – use `Mpsc` prefix, e.g. `MpscArrayQueue`
- **multiple producers, multiple consumers** – use `Mpmc` prefix, e.g. `MpmcArrayQueue`

It's important to note that **there are no policy checks internally,
i.e. a queue might silently misfunction in case of incorrect usage.**

E.g. the test below populates a single-producer queue from two threads and passes
even though the consumer is not guaranteed to see data from different producers:

## Queue Implementations

Summarizing the classifications above, here is the list of JCTools queues:

- Spsc
    - `SpscArrayQueue` – single producer, single consumer, uses an array internally, bound capacity
    - `SpscLinkedQueue` – single producer, single consumer, uses linked list internally, unbound capacity
    - `SpscChunkedArrayQueue` – single producer, single consumer, starts with initial capacity and grows up to max
      capacity
    - `SpscGrowableArrayQueue` – single producer, single consumer,
      starts with initial capacity and grows up to max capacity.
      This is the same contract as SpscChunkedArrayQueue, the only difference is internal chunks management.
      It's recommended to use SpscChunkedArrayQueue because it has a simplified implementation
    - `SpscUnboundedArrayQueue` – single producer, single consumer, uses an array internally, unbound capacity
- Spmc
    - `SpmcArrayQueue` – single producer, multiple consumers, uses an array internally, bound capacity
- Mpsc
    - `MpscArrayQueue` – multiple producers, single consumer, uses an array internally, bound capacity
    - `MpscLinkedQueue` – multiple producers, single consumer, uses a linked list internally, unbound capacity
- Mpmc
    - `MpmcArrayQueue` – multiple producers, multiple consumers, uses an array internally, bound capacity

```java
import org.jctools.queues.MessagePassingQueue;
import org.jctools.queues.SpscArrayQueue;

import java.util.ArrayList;
import java.util.List;


public class SpscRun {
    public static void main(String[] args) {
        MessagePassingQueue<Integer> queue = new SpscArrayQueue<>(5);
        for (int i = 0; i < 10; i++) {
            // offer
            queue.offer(i);
        }

        // capacity
        System.out.println("capacity = " + queue.capacity());

        // poll
        Integer num = queue.poll();
        System.out.println("num = " + num);

        List<Integer> numList = new ArrayList<>();
        MessagePassingQueue.Consumer<Integer> c = numList::add;
        // drain
        queue.drain(c);
        System.out.println(numList);
    }
}
```

## Atomic Queues

All queues mentioned in the previous section use `sun.misc.Unsafe`.
However, with the advent of Java 9 and the [JEP-260](http://openjdk.java.net/jeps/260)
this API becomes inaccessible by default.

So, there are alternative queues which use `java.util.concurrent.atomic.AtomicLongFieldUpdater`
(public API, less performant) instead of `sun.misc.Unsafe`.

They are generated from the queues above and
their names have the word `Atomic` inserted in between,
e.g. `SpscChunkedAtomicArrayQueue` or `MpmcAtomicArrayQueue`.

It's recommended to use "regular" queues if possible and
resort to AtomicQueues only in environments
where `sun.misc.Unsafe` is prohibited/ineffective like HotSpot Java9+ and JRockit.

## Capacity

All JCTools queues might also have a maximum capacity or be unbound.
When a queue is full, and it's bound by capacity, it stops accepting new elements.

In the following example, we:

- fill the queue
- ensure that it stops accepting new elements after that
- drain from it and ensure that it's possible to add more elements afterward

Please note that a couple of code statements are dropped for readability.

```text
SpscChunkedArrayQueue<Integer> queue = new SpscChunkedArrayQueue<>(8, 16);
CountDownLatch startConsuming = new CountDownLatch(1);
CountDownLatch awakeProducer = new CountDownLatch(1);

Thread producer = new Thread(() -> {
    IntStream.range(0, queue.capacity()).forEach(i -> {
        assertThat(queue.offer(i)).isTrue();
    });
    assertThat(queue.offer(queue.capacity())).isFalse();
    startConsuming.countDown();
    awakeProducer.await();
    assertThat(queue.offer(queue.capacity())).isTrue();
});

producer.start();
startConsuming.await();

Set<Integer> fromQueue = new HashSet<>();
queue.drain(fromQueue::add);
awakeProducer.countDown();
producer.join();
queue.drain(fromQueue::add);

assertThat(fromQueue).containsAll(
  IntStream.range(0, 17).boxed().collect(toSet()));
```
