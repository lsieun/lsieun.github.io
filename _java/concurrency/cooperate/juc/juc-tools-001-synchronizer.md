---
title: "Synchronizer"
sequence: "101"
---

[UP](/java-concurrency.html)


## Synchronizer

The `java.util.concurrent` package contains several classes
that **help manage a set of threads that collaborate with each other**.

常用的类：

- CyclicBarrier
- Phaser
- CountDownLatch
- Exchanger
- Semaphore
- SynchronousQueue

These classes offer out of the box functionality for common interaction patterns between threads.

If we have a set of threads that communicate with each other and resemble one of the common patterns,
we can **simply reuse the appropriate library classes** (also called **Synchronizer**s)
instead of trying to come up with a custom scheme
using a set of locks and condition objects and the `synchronized` keyword.
