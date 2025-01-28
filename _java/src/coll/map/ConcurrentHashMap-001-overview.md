---
title: "ConcurrentHashMap 源码解析"
sequence: "ConcurrentHashMap-101"
---

- ConcurrentHashMap 集合
    - 基础知识
        - synchronized 与 lock 锁
        - 如何理解分段锁概念
        - CAS 算法 和 volatile
    - 底层实现
        - JDK 1.7
            - 数据结构：数组 + Segments 分段锁 + HashEntry 链表
            - 锁的实现：Lock 锁 + CAS 乐观锁 + Unsafe 类
            - 扩容实现：支持多个 segment 同时扩容
        - JDK 1.8
            - 数据结构：
                - 直接使用 Node 数组来保存数据
                - 数组 + 链表 + 红黑树
            - 锁的实现：
                - 取消 segment 分段设计
                - index 没有发生冲突，使用 CAS 锁
                - index 发生冲突使用 synchronized
            - 扩容实现：支持并发扩容

## 类的继承结构

### HashMap

![](/assets/images/java/collection/map/hash-map-class-hierarchy.png)

### ConcurrentHashMap



![](/assets/images/java/collection/map/concurrent-hash-map-class-hierarchy.png)

## 优化

在 JDK 1.8 中，`ConcurrentHashMap` 做了哪些优化：

- 第 1 点，数据结构的优化：
    - **红黑树**进行查询的时间复杂度是 `O(LogN)`，这比**链表**的查询效率 `O(N)` 要高很多。
- 第 2 点，锁的粒度的优化。
    - 在 JDK 1.7 的 `ConcurrentHashMap`，它是通过 segment 的分段锁的方式去帮我们实现**线程安全**；
      虽然说锁的粒度比 `Hashtable` 要细了很多，但是呢，还是不够细
    - 在 JDK 1.8 中，它是基于 `CAS` + `synchronized` 的锁“头节点”的方式去实现**线程安全**。
      数据放在 **数组**上，使用 CAS 的方式，线程不用挂起；数据放在 **链表** 上，才会涉及到 `synchronized`，
    - 操作哪个节点下的链表，就只锁这一块儿，它的锁的粒度，要比 JDK 1.7 中的 segment 要细的多。
- 第 3 点，扩容操作。
- 第 4 点，计数器的优化。

## FAQ

### 不支持 null

`ConcurrentHashMap` 不支持 `key` 或者 `value` 为 `null` 的原因？

`ConcurrentHashMap` 和 `HashMap` 不同的是，`ConcurrentHashMap` 的 key 和 value 都不允许为 null，

因为 `ConcurrentHashMap` 是用于多线程的，并发的 ，如果 `map.get(key)` 得到了 `null`，
不能判断到底是映射的 `value` 是 `null`，还是因为没有找到对应的 `key` 而为空。

而用于单线程状态的 `HashMap` 却可以用 `containKey(key)` 去判断到底是否包含了这个 `null`。

