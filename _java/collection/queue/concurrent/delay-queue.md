---
title: "DelayQueue"
sequence: "102"
---

## 示例

```java
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

public class DelayObject implements Delayed {
    private final String data;
    private final long startTime;

    public DelayObject(String data, long delayInMilliseconds) {
        this.data = data;
        this.startTime = System.currentTimeMillis() + delayInMilliseconds;
    }

    @Override
    public long getDelay(TimeUnit unit) {
        long diff = startTime - System.currentTimeMillis();
        return unit.convert(diff, TimeUnit.MILLISECONDS);
    }

    @Override
    public int compareTo(Delayed o) {
        DelayObject other = (DelayObject) o;
        return Long.compare(this.startTime, other.startTime);
    }

    @Override
    public String toString() {
        return "{" + "data='" + data + '\'' + ", startTime=" + startTime + '}';
    }
}
```

### 示例一

```java
import java.time.LocalDateTime;
import java.util.concurrent.DelayQueue;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        DelayQueue<DelayObject> queue = new DelayQueue<>();
        queue.put(new DelayObject("Hello", 3000));

        System.out.println(LocalDateTime.now());
        DelayObject obj = queue.take();
        System.out.println(obj);
        System.out.println(LocalDateTime.now());
    }
}
```

### 示例二

```java
import java.util.UUID;
import java.util.concurrent.BlockingQueue;


public class DelayQueueProducer implements Runnable {
    private BlockingQueue<DelayObject> queue;
    private final Integer numberOfElementsToProduce;
    private final Integer delayOfEachProducedMessageMilliseconds;

    public DelayQueueProducer(BlockingQueue<DelayObject> queue,
                              Integer numberOfElementsToProduce,
                              Integer delayOfEachProducedMessageMilliseconds) {
        this.queue = queue;
        this.numberOfElementsToProduce = numberOfElementsToProduce;
        this.delayOfEachProducedMessageMilliseconds = delayOfEachProducedMessageMilliseconds;
    }

    @Override
    public void run() {
        for (int i = 0; i < numberOfElementsToProduce; i++) {
            DelayObject object = new DelayObject(UUID.randomUUID().toString(), delayOfEachProducedMessageMilliseconds);
            System.out.println("Put object = " + object);
            try {
                queue.put(object);
                Thread.sleep(500);
            } catch (InterruptedException ie) {
                ie.printStackTrace();
            }
        }
    }
}
```

```java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;


public class DelayQueueConsumer implements Runnable {
    private BlockingQueue<DelayObject> queue;
    private final Integer numberOfElementsToTake;
    final AtomicInteger numberOfConsumedElements = new AtomicInteger();

    public DelayQueueConsumer(BlockingQueue<DelayObject> queue, Integer numberOfElementsToTake) {
        this.queue = queue;
        this.numberOfElementsToTake = numberOfElementsToTake;
    }


    @Override
    public void run() {
        for (int i = 0; i < numberOfElementsToTake; i++) {
            try {
                DelayObject object = queue.take();
                numberOfConsumedElements.incrementAndGet();
                System.out.println("Consumer take: " + object);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

```java
import java.util.concurrent.*;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(2);

        BlockingQueue<DelayObject> queue = new DelayQueue<>();
        int numberOfElementsToProduce = 2;
        int delayOfEachProducedMessageMilliseconds = 1000;
        DelayQueueConsumer consumer = new DelayQueueConsumer(
                queue, numberOfElementsToProduce);
        DelayQueueProducer producer = new DelayQueueProducer(
                queue, numberOfElementsToProduce, delayOfEachProducedMessageMilliseconds);

        // when
        executor.submit(producer);
        executor.submit(consumer);

        // then
        executor.awaitTermination(5, TimeUnit.SECONDS);
        executor.shutdown();
    }
}
```

## Reference

- [Guide to DelayQueue](https://www.baeldung.com/java-delay-queue)

