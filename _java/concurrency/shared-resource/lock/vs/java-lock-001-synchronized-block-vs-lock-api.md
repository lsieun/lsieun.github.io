---
title: "synchronized 代码块与 Lock API 对比"
sequence: "101"
---

[UP](/java-concurrency.html)


## Lock API 与 Synchronized Block 对比

There are a few differences between the use of synchronized block and using Lock APIs:

第 1 个区别，使用地方：方法内部、跨越多个方法

A `synchronized` block is fully contained within a method.
We can have `Lock` APIs `lock()` and `unlock()` operation in separate methods.

`Lock` APIs can operate in different methods,
while **synchronized blocks** are fully contained within one method.

第 2 个区别，是否支持公平锁

A `synchronized` block doesn't support the fairness.
Any thread can acquire the lock once released, and no preference can be specified.
We can achieve fairness within the `Lock` APIs by specifying the fairness property.
It makes sure that the longest waiting thread is given access to the lock.

第 3 个区别，是否阻塞：

A thread gets blocked if it can't get access to the `synchronized` block.
The `Lock` API provides `tryLock()` method.
The thread acquires lock only if it's available and not held by any other thread.
This reduces blocking time of thread waiting for the lock.

第 4 个区别，是否被打断

A thread that is in “waiting” state to acquire the access to synchronized block can't be interrupted.
The `Lock` API provides a method `lockInterruptibly()`
that can be used to interrupt the thread when it's waiting for the lock.
