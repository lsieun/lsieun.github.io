---
title: "Runtime Data Area"
sequence: "101"
---

对于一块内存区域，可以思考如下几个问题：

- 线程角度：该内存区域，是否线程共享，还是线程私有？
- 存储数据：存储的主要内容是什么？
- 特殊情况：内存空间不够的时候，出现什么异常？

## JVM 的组成部分

从 JVM 组成的角度来说，它由 Class Loader SubSystem、Runtime Data Areas 和 Execution Engine 三个部分组成：

- 类加载子系统（Class Loader SubSystem），负责加载具体的 `.class` 文件。
- 运行时数据区（Runtime Data Areas），主要负责为执行引擎（Execution Engine）提供“空间维度”的支持，
  为类（Class）、对象实例（object instance）、局部变量（local variable）提供存储空间。
- 执行引擎（Execution Engine），主要负责方法体里的 instruction 内容，它是 JVM 的核心部分。

![JVM Architecture](/assets/images/java/jvm/jvm-architecture.png)

## 方法区

- 线程共享：是
- 存储位置：方法区是逻辑上堆的一部分
- 存储什么数据：运行时常量池、字段和方法数据
- 内存不足时：JVM 会抛出 OutOfMemoryError

## 堆

- 线程共享：是
- 存储数据：堆是为所有类实例和数组分配内存的运行时数据区域
- 内存不足：抛出 OutOfMemoryError

## Reference

- [Java Memory Management for Java Virtual Machine](https://www.betsol.com/blog/java-memory-management-for-java-virtual-machine-jvm/)

- [PerfMa KO 系列之 JVM 参数【Memory 篇】](https://space.bilibili.com/516187506/video)系列视频，有人评论说讲的好，先收藏一下

