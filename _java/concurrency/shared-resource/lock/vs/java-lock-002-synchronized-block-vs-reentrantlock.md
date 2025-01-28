---
title: "synchronized 与 ReentrantLock 的区别"
sequence: "102"
---

[UP](/java-concurrency.html)


## 对比

`ReentrantLock` 设计的目标是用来替代 `synchronized` 关键字。
但是，实际上，并没有替代掉。官方仍然推荐使用 `synchronized` 关键字。


| 特征     | synchronized（推荐） | ReentrantLock                   |
|--------|------------------|---------------------------------|
| 底层原理   | JVM 实现           | JDK 实现                          |
| 性能区别   | 低 -> 高 （JDK5+）   | 高                               |
| 锁的释放   | 自动释放（编译器保证）      | 手动释放（finally 保证）                 |
| 编码复杂程度 | 简单               | 复杂                              |
| 锁的粒度   | 读写不区分            | 读锁、写锁                           |
| 高级功能   | 无                | 公平锁、非公平锁唤醒、Condition 分组唤醒、中断等待锁 |
|        |                  |                                 |
