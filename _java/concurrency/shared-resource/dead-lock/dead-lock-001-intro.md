---
title: "死锁"
sequence: "101"
---

[UP](/java-concurrency.html)


## 死锁产生的原因

死锁是在多线程情况下最严重的问题。在多线程对公共资源（文件、数据）等进行操作时，彼此不释放自己的资源，
而去试图操作其它线程的资源，而形成交叉引用，就会产生死锁。

死锁原因：在并发情况，线程因为相互等待对方资源，导致“永久”阻塞的现象。



## 如何发现死锁



## 如何避免/解决死锁

- 尽量减少公共资源的引用，用完马上释放
- 减少 `synchronized` 使用，采用“副本”方式替代

## Reference

- [Preventing Deadlocks](https://www.atomikos.com/Documentation/PreventingDeadlocks)
