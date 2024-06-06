---
title: "Synchronization primitives（同步原语）"
sequence: "105"
---

[UP](/java-concurrency.html)

When more than one thread needs to write or modify a single resource, such as a data structure,
the threads generally need to coordinate their access.
Java has **synchronization primitives** as part of the languages.
These include the **`synchronized` keyword**, **the `synchronized` block**, and
**the methods of the class `java.lang.Object` `wait`, `notify` and `notifyAll`.**

同步原语是在多线程或多进程的编程环境中，用来控制不同线程或进程间操作顺序，保证数据一致性和防止资源冲突的一组基础工具和机制。
它们是实现并发控制的基本构件，帮助开发者管理线程间的协作和竞争。以下是一些常见的同步原语：

1. 互斥锁（Mutex）
   互斥锁是最基本的同步原语之一，用来确保某个资源或代码块在同一时间只能被一个线程访问。当一个线程获得了互斥锁，其他试图访问被锁保护的资源的线程将被阻塞，直到锁被释放。
2. 自旋锁（Spinlock）
   自旋锁与互斥锁类似，但在等待锁释放时，线程不会被挂起，而是在循环中持续检查锁的状态。这种方式适用于锁持有时间非常短的场景，因为它避免了线程挂起和恢复的开销。
3. 读写锁（Read-Write Lock）
   读写锁允许多个读操作并行执行，但写操作会独占访问。当没有线程持有写锁时，多个线程可以同时持有读锁，这样可以提高在多读少写场景中的并发性。
4. 条件变量（Condition Variable）
   条件变量用来在某些条件下阻塞线程，直到另一个线程修改了条件并通知条件变量。它通常与互斥锁一起使用，以便在条件不满足时安全地暂停线程。
5. 信号量（Semaphore）
   信号量是一个更为通用的同步工具，可以用来控制对共享资源的访问。信号量维护一个计数器，表示可用资源的数量。线程在访问资源前必须获取信号量（通常意味着将计数器减一），如果信号量值为零，则线程阻塞直到资源变得可用。
6. 栅栏（Barrier）
   栅栏是一种同步原语，用于多个线程中，使所有线程都达到某个点后才能继续执行。这通常用于在并行计算中同步不同阶段的完成。
   这些同步原语在操作系统、并发库以及多线程应用程序中广泛使用，以确保线程安全、避免死锁和减少资源冲突，从而实现更稳定和高效的并发执行。

## Reference

- [Synchronization primitives](https://www.cs.columbia.edu/~hgs/os/sync.html)
- [Lesson 11: Synchronization](https://www.cs.miami.edu/home/burt/learning/globalis/lessonB/)
- [Bad Practices With Synchronization](https://www.baeldung.com/java-synchronization-bad-practices)
- [Relearning Java Thread Primitives](https://debugagent.com/relearning-java-thread-primitives)
