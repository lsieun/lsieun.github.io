---
title: "伪共享（False Sharing）"
sequence: "101"
---

sometimes false sharing can turn multithreading against us.

## Motivation for Caches

Modern processors can run at clock speeds of several GHz and are able to execute several instructions per clock cycle.
This means that a processor may have a peak execution speed of several instructions per nanosecond.
For example, a 3 GHz processor capable of executing 3 instructions per cycle
has a peak execution speed of 9 instructions per ns.

```text
CPU 速度很快
```

Modern RAM memories on the other hand are quite slow.
Access to RAM memory takes 50 ns or more, causing the processor to stall waiting for the data to arrive.
This makes RAM accesses one of the slowest operations a processor can perform.
For example, a processor capable of executing 9 instructions per ns
could have executed up to 450 instructions in the time
it takes to perform a single RAM access with a latency of 50 ns.

```text
RAM 的速度很慢
```

The time it takes to load the data from memory is called the **latency** of the memory operation.
It is usually measured in processor clock cycles or ns.

Since memory accesses are very common in programs and can account for more than 25% of the instructions,
memory access latencies would have a devastating impact on processor execution speed
if they could not be avoided in some way.

```text
解决 memory access 慢的问题，对于 performance 很重要
```

To solve this problem computer designers have introduced cache memories, which are small, but extremely fast,
memories between the processor and the slow main memory.
Frequently used data is automatically copied to the cache memories.
This allows well written programs to make most of their memory accesses
to the fast cache memory and only rarely make accesses to the slow main memory.

```text
解决的办法：使用 cache memories
```

**Often a computer does not just use a single cache,
but a hierarchy of caches of increasing size and decreasing speed.**
For example, it may have a 64 kilobyte cache with a latency of 3 cycles for the most frequently accessed data,
and a 1 megabyte cache with a latency of 15 cycles for less frequently accessed data.
The caches in such a configuration are called the **first level cache** (the 64 kilobyte cache) and
the **second level cache** (the 1 megabyte cache), or shorter the `L1` and `L2` caches.
Some computers may also have an additional third cache level, the `L3` cache.

```text
由 Cache Memories 引出 L1、L2 和 L3
```

## Cache Lines and Cache Size

It could be left up to the programmer or compiler to determine what data should be placed in the cache memories,
but this would be complicated since different processors have different numbers of caches and different cache sizes.
It would also be hard to determine how much of the cache memory to allocate to each program
when several programs are running on the same processor.

```text
Cache Memories 是一个“容器”，应该存放一些数据。但是，存放什么数据，由 programmer 和 compiler 来决定，就会使事情变得非常复杂。 
```

Instead, **the allocation of space in the cache is managed by the processor.**
**When the processor accesses a part of memory that is not already in the cache
it loads a chunk of the memory around the accessed address into the cache,
hoping that it will soon be used again.**

```text
Cache Memories 中存放什么数据，还是交由 processor 来决定。
```

The chunks of memory handled by the cache are called **cache lines**.
The size of these chunks is called the **cache line size**.
Common cache line sizes are 32, 64 and 128 bytes.

```text
引入 cache line 的概念
```

A cache can only hold a limited number of lines, determined by the cache size.
For example, a 64 kilobyte cache with 64-byte lines has 1024 cache lines.

```text
cache line 的总体数量，是由 cache 的大小本身决定的
```

## Replacement Policies

If all the cache lines in the cache are in use when the processor accesses a new line,
one of the lines currently in the cache must be evicted to make room for the new line.
The policy for selecting which line to evict is called the **replacement policy**.

```text
Cache Memories 的空间大小是有限的，占满了，加载一些新数据，就要清空一些旧数据，这就是 replacement policy
```

The most common replacement policy in modern processors is **LRU**, for **least recently used**.
This replacement policy simply evicts the cache line that was least recently used,
assuming that the more recently used cache lines are more likely to soon be used again.

```text
LRU：时间维度
```

Another replacement policy is **random replacement**,
meaning that a random cache line is selected for eviction.

```text
随机的方式
```

## Cache Misses

When a program accesses a memory location that is not in the cache, it is called a **cache miss**.
Since the processor then has to wait for the data to be fetched from the next cache level or from main memory
before it can continue to execute, cache misses directly influence the performance of the application.

```text
引入 cache miss 的概念；同时，cache miss 会影响 performance
```

It is hard to tell from just the number of misses if cache misses are causing performance problems in an application.
The same number of misses will cause a much greater relative slowdown
in a short-running application than in a long-running one.

```text
难量化：cache miss 对于 performance 的影响，很难用一个具体的数字来表示
```

A more useful metric is the **cache miss ratio**, that is, the ratio of memory accesses that cause a cache miss.
From the miss ratio you can usually tell whether cache misses may be a performance problem in an application.

```text
换一个指标：cache miss ratio
```

The cache miss ratio of an application depends on the size of the cache.
A larger cache can hold more cache lines and is therefore expected to get fewer misses.

```text
cache miss ration 与 cache 的大小有关
```

The performance impact of a cache miss depends on
the latency of fetching the data from the next cache level or main memory.
For example, assume that you have a processor with two cache levels.
A miss in the L1 cache then causes data to be fetched from the L2 cache which has a relatively low latency,
so a quite high L1 miss ratio can be acceptable.
A miss in the L2 cache on the other hand will cause a long stall while fetching data from main memory,
so only a much lower L2 miss ratio is acceptable.

```text
cache miss 对 performance 的影响程度与 latency 相关 
```

A special case is cache misses caused by prefetch instructions, see Section 3.6.1, “Software Prefetching”.
Unlike other cache misses these do not cause any stalls,
but will instead trigger a fetch of the requested data so that later accesses will not experience a cache miss.
In fact, a prefetch instruction should ideally have a high miss ratio,
since that means the prefetch instruction is doing useful work.

## Data Locality

As described above, caches work on the assumption that data that is accessed once will usually be accessed soon again.
This kind of behaviour is known as **data locality**.
There are two kinds of locality that are sometimes distinguished:

- **Temporal locality** means that the program reuses the same data that it recently used,
  and that therefore is likely to be in the cache.
- **Spatial locality** means that the program uses data close to recently accessed locations.
  Since the processor loads a chunk of memory around an accessed location into the cache,
  locations close to recently accessed locations are also likely to be in the cache.

It is of course possible for a program exhibit both types of locality at the same time.

Good data locality is essential for good application performance.
Applications with poor data locality reduce the effectiveness of the cache,
causing long stall times waiting for memory accesses.

## Prefetching

Even programs with good data locality will now and then have to access a cache line that is not in the cache,
and will then stall until the data has been fetched from main memory.
It would of course be better if there was a way to load the data into the cache
before it is needed so the stall could be avoided.
This is called **prefetching** and there are two ways to achieve it, software prefetching and hardware prefetching.

### Software Prefetching

With software prefetching the programmer or compiler inserts prefetch instructions into the program.
These are instructions that initiate a load of a cache line into the cache,
but do not stall waiting for the data to arrive.

```text
software prefetching 是由 programmer 或 compiler 来决定的
```

A critical property of prefetch instructions is the time from when the prefetch is executed to when the data is used.
If the prefetch is too close to the instruction using the prefetched data,
the cache line will not have had time to arrive from main memory or the next cache level and the instruction will stall.
This reduces the effectiveness of the prefetch.

```text
prefetch 的时机很重要：太晚了不行
```

If the prefetch is too far ahead of the instruction using the prefetched data,
the prefetched cache line will instead already have been evicted again before the data is actually used.
The instruction using the data will then cause another fetch of the cache line and have to stall.
This not only eliminates the benefit of the prefetch instruction,
but introduces additional costs since the cache line is now fetched twice from main memory or the next cache level.
This increases the memory bandwidth requirement of the program.

```text
prefetch 的时机很重要：太早了不行
```

Processors that have multiple levels of caches often have different prefetch instructions
for prefetching data into different cache levels.
This can be used, for example,
to prefetch data from main memory to the L2 cache far ahead of the use with an L2 prefetch instruction,
and then prefetch data from the L2 cache to the L1 cache just before the use with a L1 prefetch instruction.

```text
有不同的 prefetch instructions
```

There is a cost for executing a prefetch instruction.
The instruction has to be decoded and it uses some execution resources.
A prefetch instruction that always prefetches cache lines that are already in the cache
will consume execution resources without providing any benefit.
It is therefore important to verify that prefetch instructions really prefetch data that is not already in the cache.

```text
prefetch instruction 也是要消费资源的
```

The cache miss ratio needed by a prefetch instruction to be useful depends on its purpose.
A prefetch instruction that fetches data from main memory only needs a very low miss ratio to be useful
because of the high main memory access latency.
A prefetch instruction that fetches cache lines from a cache further from the processor
to a cache closer to the processor may need a miss ratio of a few percent to do any good.

It is common that software prefetching fetches slightly more data than is actually used.
For example, when iterating over a large array it is common to prefetch data some distance ahead of the loop,
for example, 1 kilobyte ahead of the loop.
When the loop is approaching the end of the array the software prefetching should ideally stop.
However, it is often cheaper to continue to prefetch data beyond the end of the array than
to insert additional code to check when the end of the array is reached.
This means that 1 kilobyte of data beyond the end of the array that isn't needed is fetched.

### Hardware Prefetching

Many modern processors implement hardware prefetching.
This means that **the processor monitors the memory access pattern of the running program** and
**tries to predict what data the program will access next and prefetches that data.**
There are few different variants of how this can be done.

A **stream** prefetcher looks for streams where a sequence of consecutive cache lines are accessed by the program.
When such a stream is found the processor starts prefetching the cache lines ahead of the program's accesses.

A **stride** prefetcher looks for instructions that make accesses with regular strides,
that do not necessarily have to be to consecutive cache lines.
When such an instruction is detected the processor tries to prefetch the cache lines it will access ahead of it.

An **adjacent cache line** prefetcher automatically fetches adjacent cache lines to ones being accessed by the program.
This can be used to mimic behaviour of a larger cache line size in a cache level
without actually having to increase the line size.

Hardware prefetchers can generally only handle very regular access patterns.
The cost of prefetching data that isn't used can be high, so processor designers have to be conservative.

```text
Hardware prefetchers 只处理 regular access patterns，在设计上还是“保守”一些比较好
```

An advantage of hardware prefetching compared to software prefetching is that
**no extra instructions that use execution resources are needed in the program.**
If you know that an application is going to be run on processors with hardware prefetching,
a combination of hardware and software prefetching can be used.
The hardware prefetcher can be trusted to prefetch highly regular accesses,
while software prefetching can be used for irregular accesses that the hardware prefetcher can not handle.

```text
hardware prefetching 比 software prefetching 的优势：不需要额外开销

可以同时使用 hardware prefetching 和 software prefetching
```

## Multithreading and Cache Coherence

**Computers with multiple threads of execution,**
either with multiple processors, multiple cores per processor, or both,
**introduce additional complexity to caches.**
Different threads accessing the same data can now have private copies of the data in their local caches,
but writes to the data by one thread must still be seen by all other threads.
Some mechanism to keep the caches synchronized is needed.

```text
cache memories + multiple threads of execution --> 更复杂的情况
```

The mechanism that keeps the caches synchronized is called a **cache coherence protocol**.
There are different possible coherence protocols,
but most modern processors use the MESI protocol or some variation such as the MOESI protocol.

The MESI protocol is named after the four states of a cache line: modified, exclusive, shared and invalid:

Cache line states in the MESI protocol

M - Modified:
The data in the cache line is modified and is guaranteed to only reside in this cache.
The copy in main memory is not up-to-date,
so when the cache line leaves the modified state the data must be written back to main memory.

E - Exclusive:
The data in the cache line is unmodified, but is guaranteed to only reside in this cache.

S - Shared:
The data in the cache line is unmodified, and there may also be copies of it in other caches.

I - Invalid:
The cache line does not contain valid data.

This section is not intended to be a complete description of cache coherency,
but only a quick introduction allowing you to understand the types of multithreading problems.

We will now go through some examples of how the MESI protocol works.
For simplicity, we will assume that we are running on a two-processor system
where each processor has its own private cache on a single cache level:

![](/assets/images/java/concurrency/memory/cache/cc-system.png)

In these examples data transfers are drawn in red, while downgrade and invalidation traffic is drawn in blue.

If a thread reads data not present in any cache, it will fetch the line into its cache in exclusive state (E):

![](/assets/images/java/concurrency/memory/cache/cc-example-1.png)

If a thread reads from a cache line that is in shared state (S) in another thread's cache,
it fetches the cache line into its cache in shared state (S):

![](/assets/images/java/concurrency/memory/cache/cc-example-2.png)

If a thread reads from a cache line that is in exclusive state (E) in another thread's cache,
it fetches the cache line to its cache in shared state (S) and
downgrades the cache line to shared state (S) in the other cache:

![](/assets/images/java/concurrency/memory/cache/cc-example-3.png)

If a thread reads from a cache line that is in modified state (M) in another thread's cache,
the other cache must first write-back its modified version of the cache line and downgrade it to shared state (S).
The thread doing the read can then add the cache line to its cache in shared state (S):

![](/assets/images/java/concurrency/memory/cache/cc-example-4.png)

When a thread has a cache line in exclusive (E) or modified state (M) it can write to it with very low overhead,
since it knows that no other thread can have a copy of the line that needs to be invalidated.
A write to an exclusive cache line makes it modified (M):

![](/assets/images/java/concurrency/memory/cache/cc-example-5.png)

When a thread writes to a cache line that it has in shared state (S) it must upgrade the line to modified state (M).
In order to do this it must invalidate (I) any copies of the line in other caches,
so that they do not retain an outdated copy:

![](/assets/images/java/concurrency/memory/cache/cc-example-6.png)

When a thread writes to a cache line that it does not have in its cache,
it must fetch the line and invalidate (I) it in all other caches.
If another thread has a modified (M) copy of the cache line
it must first write it back before the thread doing the write can fetch it.

![](/assets/images/java/concurrency/memory/cache/cc-example-7.png)

The above is not a complete enumeration of coherence interaction,
and in reality there are other access types to consider such as prefetches and cache line flushes,
but it should give basic understanding of have cache coherence affects.

Based on the coherence related events, Freja presents statics about the following expensive thread interactions:

Upgrades
The upgrade count is the number of memory accesses
that cause a cache line to be upgraded from shared state to either exclusive or modified state.

There are two scenarios where this can happen.
A thread can read a cache line into its cache in shared state
because it is already in the cache of another thread, and then write to it.
Or, a thread has the cache line in its cache in exclusive or modified state,
but it is downgraded to shared state because of a read from another thread,
and the thread then writes to the line.

Coherence misses
The coherence miss count is the number of memory accesses that miss
because a cache line that would otherwise be present in the thread's cache has been invalidated
by a write from another thread.

Coherence write-backs
The coherence write-back count is the number of memory access that force a cache line
that is in modified state in another thread's cache to be written back.

All of the above can also be reported as ratios.
They are then reported as the percentage of memory accesses that suffer from one of these interactions.
For example, a coherence miss ratio of 3% means that on average 3 out of every 100 memory accesses
suffer from coherence misses.

## Spatial Locality and Temporal Locality

- 空间维度
- 时间维度

### Spatial Locality

Spatial Locality means that all those instructions
which are stored nearby to the recently executed instruction have high chances of execution.
It refers to the use of data elements(instructions) which are relatively close in storage locations.

### Temporal Locality

Temporal Locality means that an instruction which is recently executed have high chances of execution again.
So the instruction is kept in cache memory
such that it can be fetched easily and takes no time in searching for the same instruction.

<table>
    <thead>
    <tr>
        <th>S.No.</th>
        <th>Spatial Locality</th>
        <th>Temporal Locality</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>1</td>
        <td>In Spatial Locality, nearby instructions to recently executed instruction are likely to be executed soon.</td>
        <td>In Temporal Locality, a recently executed instruction is likely to be executed again very soon.</td>
    </tr>
    <tr>
        <td>2</td>
        <td>It refers to the tendency of execution which involve a number of memory locations .</td>
        <td>It refers to the tendency of execution where memory location that have been used recently have a access.</td>
    </tr>
    <tr>
        <td>3</td>
        <td>It is also known as locality in space.</td>
        <td>It is also known as locality in time.</td>
    </tr>
    <tr>
        <td>4</td>
        <td>It only refers to data item which are closed together in memory.</td>
        <td>It repeatedly refers to same data in short time span.</td>
    </tr>
    <tr>
        <td>5</td>
        <td>Each time new data comes into execution.</td>
        <td>Each time same useful data comes into execution.</td>
    </tr>
    <tr>
        <td>6</td>
        <td>Example: Data elements accessed in array (where each time different (or just next) element is being accessing ).</td>
        <td>Example: Data elements accessed in loops (where same data elements are accessed multiple times).</td>
    </tr>
    </tbody>
</table>

## Cache Line and Coherency

## Reference

- [Chapter 3. Introduction to Caches](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/ch_intro_caches.html)
    - [3.1. Motivation for Caches](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/ch03s01.html)
    - [3.2. Cache Lines and Cache Size](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/ch03s02.html)
    - [3.3. Replacement Policies](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/ch03s03.html)
    - [3.4. Cache Misses](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/miss_ratio.html)
    - [3.5. Data Locality](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/ch_intro_locality.html)
    - [3.6. Prefetching](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/ch_intro_prefetch.html)
    - [3.7. Multithreading and Cache Coherence](http://www.nic.uoregon.edu/~khuck/ts/acumem-report/manual_html/ch_intro_coherence.html)
- [A Guide to False Sharing and @Contended](https://www.baeldung.com/java-false-sharing-contended)

未读

- [Java and the modern CPU, Part 1: Memory and the cache hierarchy](https://blogs.oracle.com/javamagazine/post/java-and-the-modern-cpu-part-1-memory-and-the-cache-hierarchy)

