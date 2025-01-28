---
title: "Java Core"
sequence: "101"
---

## Java 基础部分

- HashMap 8 与 ConcurrentHashMap 源码解读 / List
- JUC 并发包 AQS/线程池原理/CAS/锁的特征原理
- JVM 垃圾回收算法、十种垃圾收集器、字节码文件阅读；调优策略、线上问题
- MySQL 参数性能优化、索引原理、SQL优化、事务隔离级别、行锁、表锁、间隙锁、MVCC 等
- 数据结构与算法、力扣 LeetCode
- 设计模式：单例、模板方法、外观、策略、动态代理

### HashMap 面试题

- HashMap 与 Hashtable 的区别？
  - 线程安全：HashMap是线程不安全的，Hashtable 是线程安全的
- HashMap 的 key 可以是 null 吗？

- 为什么重写 Equals 还要重写 HashCode 方法？
- HashMap 如何避免内存泄漏问题？
- HashMap 1.7 底层是如何实现的？
- HashMapKey 为 null 存放在什么位置？0
- HashMap 如何解决 Hash 冲突问题？
- HashMap 底层采用单链表，还是双链表
- 时间复杂度 O(1)、O(N)、O(LogN) 的区别
- HashMap 根据 key 查询的时间复杂度
- HashMap 如何实现数据扩容问题
- HashMap 底层是有序存放的吗？
- LinkedHashMap 和 TreeMap 底层如何实现有序的？


- HashMap 底层如何降低 Hash 冲突概率
- HashMap 中 hash 函数是怎么实现的？
- 为什么不直接将 key 作为哈希值而是与高 16 位做异或运算？
- HashMap 如何存放 1 万条 key 效率最高
- HashMap 高低位 与 取模运算 有哪些好处
- HashMap 1.8 如何避免多线程扩容死循环问题
- 为什么加载因子是 0.75，而不是 1？
- `>>>` 无符号 32 64


- 为什么 HashMap 1.8 需要引入红黑树？
- 为什么链表长度 > 8，需要转红黑树？而不是 6？
- 什么情况下，需要从红黑树转换成链表存放？
- HashMap 底层如何降低 hash 冲突概率？
- 如何在高并发的情况下，使用 HashMap
- ConcurrentHashMap 底层实现的原理

## 对象创建有几种方式

1、通过 new 语句创建对象

2、运用反向手段：调用 `java.lang.Class` 或 `java.lang.reflect.Constructor` 类的 `newInstance` 方法

3、调用对象的 `clone()` 方法

4、运用反序列化手段：调用 `java.io.ObjectInputStream` 对象的 `readObject()` 方法

- [ ] GC机制，什么时候出发Minor GC，什么时候出发Full GC
- [ ] 进程与线程区别
- [ ] 多进程与多线程区别
