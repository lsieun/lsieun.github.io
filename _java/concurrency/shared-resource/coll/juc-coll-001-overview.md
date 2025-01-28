---
title: "线程安全 - 集合类 - 概述"
sequence: "101"
---

[UP](/java-concurrency.html)


![](/assets/images/java/concurrency/juc/coll/juc-coll-overview.png)

## 线程安全集合类

线程安全集合类可以分为三大类：

- 遗留的线程安全集合如 `Hashtable`， `Vector`。线程安全的实现无非直接加 synchronized
- 使用 `Collections` 装饰的线程安全集合，如：使用装饰器模式，把所装饰的类的所有方法，套了一个 synchronized
    - Collections.synchronizedCollection
    - Collections.synchronizedList
    - Collections.synchronizedMap
    - Collections.synchronizedSet
    - Collections.synchronizedNavigableMap
    - Collections.synchronizedNavigableSet
    - Collections.synchronizedSortedMap
    - Collections.synchronizedSortedSet
- `java.util.concurrent.*`

重点介绍 `java.util.concurrent.*` 下的线程安全集合类，可以发现它们有规律，
里面包含三类关键词：Blocking、CopyOnWrite、Concurrent

- Blocking 大部分实现基于锁，并提供用来阻塞的方法
- CopyOnWrite 之类容器，适合“读多改少”的情况，因为“修改”操作开销相对较重
- Concurrent 类型的容器

## Concurrent 类型的容器

- 优点：内部很多操作使用 cas 优化，一般可以提供较高吞吐量
- 缺点：弱一致性
    - 遍历时弱一致性，例如，当利用迭代器遍历时，如果容器发生修改，迭代器仍然可以继续进行遍历，这时内容是旧的
    - 求大小弱一致性，size 操作未必是 100% 准确
    - 读取弱一致性
