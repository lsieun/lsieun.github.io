---
title: "内存屏障"
sequence: "102"
---

[UP](/java-concurrency.html)


```text
The Java Language Specification (JLS) doesn't refer to barriers explicitly,
as it considers them to be implementation details
that operate based on the concept of happens before semantics.
Implementing proper specifications for these semantics in accordance with the JMM ( Java Memory Model)
would require significant changes to the JMM.
```

## Stackoverflow

- [Memory barriers force cache coherency?](https://stackoverflow.com/questions/30958375/memory-barriers-force-cache-coherency)

**Short Answer**: Cache coherency works most of the time but not always.
You can still read stale data. If you don't want to take chances, then just use a memory barrier

**Long Answer**: CPU core is no longer directly connected to the main memory.
All loads and stores have to go through the cache.
The fact that each CPU has its own private cache causes new problems.
If more than one CPU is accessing the same memory it must still be assured that
both processors see the same memory content at all times.
If a cache line is dirty on one processor (i.e., it has not been written back yet to main memory) and
a second processor tries to read the same memory location, the read operation cannot just go out to the main memory.
Instead, the content of the first processor's cacheline is needed.
The question now is when does this cache line transfer have to happen?
This question is pretty easy to answer:
when one processor needs a cache line which is dirty in another processor's cache for reading or writing.
But how can a processor determine whether a cache line is dirty in another processor's cache?
Assuming it's just because a cache line is loaded by another processor would be suboptimal (at best).
Usually the majority of memory accesses are read accesses and the resulting cache lines are not dirty.
Here comes cache coherency protocols. CPU's maintain data consistency across their caches
via MESI or some other cache coherence protocol.

With cache coherency in place, should we not see that latest value always for the cacheline
even if it was modified by another CPU?
After all that is whole purpose of the cache coherency protocols.
Usually when a cacheline is modified, the corresponding CPU sends an "invalidate cacheline" request to all other CPUs.
It turns out that CPUs can send acknowledgement to the invalidate requests immediately
but defer the actual invalidation of the cacheline to a later point in time.
This is done via invalidation queues.
Now if we get un-lucky enough to read the cacheline within this short window
(between the CPU acknowledging an invalidation request and actually invalidating the cacheline)
then we can read a stale value.
Now why would a CPU do such a horrible thing.
The simple answer is PERFORMANCE.
So lets look into different scenarios where invalidation queues can improve performance

**Scenario 1**: CPU1 receives an invalidation request from CPU2.
CPU1 also has a lot of stores and loads queued up for the cache.
This means that the invalidation of the requested cacheline takes times and
CPU2 gets stalled waiting for the acknowledgment

**Scenario 2**: CPU1 receives a lot of invalidation requests in a short amount of time.
Now it takes time for CPU1 to invalidate all the cachelines.

Placing an entry into the invalidate queue is essentially a promise by the CPU
to process that entry before transmitting any MESI protocol messages regarding that cache line.
So invalidation queues are the reason why we may not see the latest value
even when doing a simple read of a single variable.

Now the keen reader might be thinking, when the CPU wants to read a cacheline,
it could scan the invalidation queue first before reading from the cache.
This should avoid the problem.
However, the CPU and invalidation queue are physically placed on opposite sides of the cache and
this limits the CPU from directly accessing the invalidation queue.
(Invalidation queues of one CPU's cache are populated by cache coherency messages from other CPU's via the system bus.
So it kind of makes sense for the invalidation queues to be placed between the cache and the system bus).
So in order to actually see the latest value of any shared variable,
we should empty the invalidation queue.
Usually a read memory barrier does that.

I just talked about invalidation queues and read memory barriers.
[1] is a good reference for understanding the need for read and write memory barriers and
details of MESI cache coherency protocol

- [1](http://www.puppetmastertrading.com/images/hwViewForSwHackers.pdf)

## What's a Memory Barrier?

It's a CPU instruction.

Basically it's an instruction to

- a) ensure the **order** in which certain operations are executed and
- b) influence **visibility** of some data (which might be the result of executing some instruction).

Compilers and CPUs can re-order instructions, provided the end result is the same, to try and optimise performance.
**Inserting a memory barrier** tells the **CPU** and the **compiler** that
**what happened before that command needs to stay before that command,
and what happens after needs to stay after.**

![](/assets/images/java/concurrency/memory/memory-barrier.png)

The other thing a memory barrier does is **force an update of the various CPU caches** - for example,
a write barrier will flush all the data that was written before the barrier out to cache,
therefore any other thread that tries to read that data will get the most up-to-date version
regardless of which core or which socket it might be executing by.

## What's this got to do with Java?

The magic incantation here is the word `volatile`.
If your field is `volatile`, the Java Memory Model inserts
a write barrier instruction after you write to it,
and a read barrier instruction before you read from it.

![](/assets/images/java/concurrency/memory/memory-barrier-write.png)

This means if you write to a `volatile` field, you know that:

- Any thread accessing that field after the point at which you wrote to it will get the updated value
- Anything you did before you wrote that field is guaranteed to have happened and
  any updated data values will also be visible, because the memory barrier flushed all earlier writes to the cache.

## 不同的实现

Memory barriers are a complex subject.
They are implemented very differently across CPU architectures.

## Barrier

### Store Barrier

A store barrier, "sfence" instruction on x86,
forces all store instructions prior to the barrier to happen before the barrier and
have the store buffers flushed to cache for the CPU on which it is issued.
This will make the program state visible to other CPUs, so they can act on it if necessary.

### Load Barrier

A load barrier, "lfence" instruction on x86,
forces all load instructions after the barrier to happen after the barrier and
then wait on the load buffer to drain for that CPU.
This makes program state exposed from other CPUs visible to this CPU before making further progress.


### Full Barrier

A full barrier, "mfence" instruction on x86,
is a composite of both load and store barriers happening on a CPU.

## 添加位置

### volatile

In the Java Memory Model,
a `volatile` field has a **store barrier** inserted after a write to it and
a **load barrier** inserted before a read of it.

```text
StoreStore
volatile store
StoreLoad
```

```text
volatile load
LoadLoad
LoadStore
```

- LFENCE: LoadLoad + LoadStore
- SFENCE: StoreStore + LoadStore
- MFENCE: StoreLoad

### final

Qualified `final` fields of a class have a **store barrier** inserted after their initialisation
to ensure these fields are visible once the constructor completes
when a reference to the object is available.

## ChatGPT 问答

问题：LFENCE、SFENCE、MFENCE 与 LoadLoad、StoreStore、LoadStore、StoreLoad 之间的对应关系；在 Java 中，vilatile 又与它们是什么关系？

回答：

在深入理解 LFENCE、SFENCE、MFENCE 以及 LoadLoad、StoreStore、LoadStore、StoreLoad 与 Java 中的 volatile 关键字之间的关系之前，我们需要先了解这些内存屏障的基本概念和作用。

**硬件内存屏障（x86 指令集）**

- `LFENCE` (Load Fence)：这是一个加载屏障，它确保所有在 LFENCE 指令之前的加载指令完成后，才能执行 LFENCE 之后的加载指令。
- `SFENCE` (Store Fence)：这是一个存储屏障，用于确保所有在 SFENCE 指令之前的存储操作完成后，才能执行 SFENCE 之后的存储操作。
- `MFENCE` (Memory Fence)：这是一个全功能的内存屏障，它确保所有在 MFENCE 指令之前的存储和加载操作完成后，才能开始执行 MFENCE 之后的加载和存储操作。

**Java 内存屏障类型**

- `LoadLoad`：在此屏障之后的『读操作』必须在屏障之前的『读操作』完成后执行。
- `StoreStore`：保证在此屏障之后的『写操作』必须在屏障之前的『写操作』完成后执行。
- `LoadStore`：保证在此屏障之后的『写操作』必须在屏障之前的『读操作』完成后执行。
- `StoreLoad`：最强的内存屏障，确保在此屏障之后的『读操作』必须在屏障之前的『写操作』完成后执行。

**Java 中的 volatile 与内存屏障的关系**

在 Java 中，volatile 变量的读写操作与上述内存屏障有直接的关系：

- 写 volatile 变量：当写入 volatile 变量时，JVM 会插入一个或多个内存屏障来确保操作的可见性和有序性。
  通常，这涉及到一个 `StoreStore` 屏障（确保写操作的顺序），后跟一个 `StoreLoad` 屏障（确保写操作之后的读操作看到更新后的值）。
- 读 volatile 变量：在读取 volatile 变量时，JVM 也会插入内存屏障，通常是 LoadLoad 屏障和 LoadStore 屏障，确保读操作不会与先前的读操作或后续的写操作重排序。

```text
StoreStore
volatile store
StoreLoad
```

```text
volatile load
LoadLoad
LoadStore
```

**对应关系**

在硬件层面，例如在 x86 架构上，volatile 变量的读操作可能与 LFENCE 关联，而写操作可能与 SFENCE 或 MFENCE 关联。
然而，实际的关联关系可能根据 JVM 的实现和运行的硬件平台有所不同。
一般来说，JVM 在实现 volatile 时，会选择合适的内存屏障指令来满足内存模型的要求，
而这些选择通常是由 JVM 的内部优化决定的，以确保兼容性和最佳性能。

## Atomic Instructions and Software Locks

Atomic instructions, such as the “lock ...” instructions on x86,
are effectively **a full barrier** as they lock the memory sub-system
to perform an operation and have guaranteed total order, even across CPUs.

Software locks usually employ memory barriers, or atomic instructions,
to achieve visibility and preserve program order.

## Performance Impact of Memory Barriers

Memory barriers, being another CPU-level instruction,
don't have the same cost as locks - the kernel isn't interfering and arbitrating between multiple threads.
But nothing comes for free.
Memory barriers do have a cost - the compiler/CPU cannot re-order instructions,
which could potentially lead to not using the CPU as efficiently as possible,
and refreshing the caches obviously has a performance impact.
So don't think that using `volatile` instead of locking will get you away scot-free.

```text
memory barrier 也对性能有影响
```

Memory barriers are CPU instructions that allow you to make certain assumptions about
when data will be visible to other processes.
In Java, you implement them with the `volatile` keyword.
Using `volatile` means you don't necessarily have to add locks willy-nilly,
and will give you performance improvements over using them.
However, you need to think a little more carefully about your design,
in particular how frequently you use `volatile` fields, and how frequently you read and write them.

```text
使用 volatile 比使用 lock 的效率要高一些，但是还是需要注意
```

Memory barriers prevent a CPU from performing a lot of techniques to hide memory latency
therefore they have **a significant performance cost** which must be considered.

To achieve maximum performance, it is best to model the problem
so the processor can do units of work,
then have all the necessary memory barriers occur on the boundaries of these work units.

Taking this approach allows the processor to optimise the units of work without restriction.
There is an advantage to grouping necessary memory barriers in that
buffers flushed after the first one will be less costly
because no work will be under way to refill them.

## Reference

- [x] [Dissecting the Disruptor: Demystifying Memory Barriers](https://trishagee.com/2011/08/07/dissecting_the_disruptor_demystifying_memory_barriers/)
- [x] [Memory Barriers/Fences](https://mechanical-sympathy.blogspot.com/2011/07/memory-barriersfences.html)
- [Memory Barriers and JVM Concurrency](https://www.infoq.com/articles/memory_barriers_jvm_concurrency/)
- [Deep Dive Into Java Memory Model](https://eksimtech.com/deep-dive-into-java-memory-model-29f7ed4d6ceb)
- [ ] [JSR 133 (Java Memory Model) FAQ](https://www.cs.umd.edu/~pugh/java/memoryModel/jsr-133-faq.html)
- [ ] [The JSR-133 Cookbook for Compiler Writers](https://gee.cs.oswego.edu/dl/jmm/cookbook.html)

我感觉还不错的文章，但是有些地方不懂：

- [On The Fence With Dependencies](https://shipilev.net/blog/2014/on-the-fence-with-dependencies/)
- [Making sense of Memory Barriers](https://groups.google.com/g/mechanical-sympathy/c/T0pNhJSkZWQ)
- [Java - Volatile & Barriers](https://rsnowit.blogspot.com/p/java-volatile.html)
- [The JMM Cookbook for Java Developers](https://giltene.github.io/DeveloperJMMCookbook/) 重新版，有人更推崇
- [The JSR-133 Cookbook for Compiler Writers](https://gee.cs.oswego.edu/dl/jmm/cookbook.html) 原版

- [Java Memory Fences: Their Purpose and Function](https://copyprogramming.com/howto/what-are-memory-fences-used-for-in-java)
