---
title: "JUC 介绍"
sequence: "101"
---

[UP](/java-concurrency.html)


并发，是伴随着多核处理器的诞生产生的，为了充分利用硬件资源，诞生了多线程技术。
但是，多线程又存在资源竞争的问题，引发了同步和互斥的问题。

JDK 1.5 推出了 `java.util.concurrent` 并发工具包，来解决这些问题。

`java.util.concurrent` 包含许多线程安全、测试良好、高性能的并发构建块。
创建 concurrent 的目标，就是要实现 Collection 框架对数据结构所执行的并发操作。
通过提供一组可靠的、高性能并发构建块，开发人员可以提高并发类的线程安全、可伸缩性、性能、可读性和可靠性。

- 并发编程
    - 基本概念
        - JMM、线程、并发/并行、异步、线程安全
    - 多线程
        - Thread
        - Runnable
        - 同步机制
        - 死锁
    - JUC
        - 线程池
            - CachedThreadPool
            - FixedThreadPool
            - ScheduledThreadPool
            - SingleThreadExecutor
        - 同步工具
            - CountDownLatch
            - Semaphore
            - CyclicBarrier
            - ReentrantLock
            - Callable&Future
        - 并发容器
            - CopyOnWriteArraySet
            - CopyOnWriteArrayList
            - ConcurrentHashMap
        - 原子对象（Atomic）
            - AtomicInteger
            - AtomicLong
            - AtomicBoolean
