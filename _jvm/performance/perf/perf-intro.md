---
title: "调优：概述篇"
sequence: "101"
---

## 调优概述

- 调优概述
  - 监控的依据
    - 运行日志 - Application Log
    - 异常堆栈 - Exception
    - GC日志 - GC
    - 线程快照 - Thread
    - 堆转储快照 - Heap
  - 调优的大方向
    - 合理的编写代码
    - 充分并合理的使用硬件资源
    - 合理地进行JVM调优

## 性能调优的步骤

- 性能调优的步骤
  - 第一步，发现问题：性能监控
    - GC频繁
    - CPU Load过高
    - OOM
    - 内存泄漏
    - 死锁
    - 程序响应时间过长
  - 第二步，排查问题：性能分析
    - 打印GC日志，通过GCViewer或者http://gceasy.io来分析日志信息
    - 灵活运用命令行工具：jstack、jmap、jinfo
    - dump出堆文件，使用内存分析工具分析文件
    - 使用阿里Arthas、JConsole、VisualVM来实时查看JVM状态
    - jstack查看堆栈状态
  - 第三步，解决问题：性能调优
    - Code: 优化代码，控制内存使用
    - Thread: 合理设置线程池数量
    - Memory+GC:适当增加内存，根据业务背景选择垃圾回收器
    - Hardware: 增加机器，分散节点压力
    - Midware: 使用中间件提高程序效率，比如缓存、消息队列
    - 其他

## 性能评价/测试指标

- 性能评价/测试指标
  - 停顿时间或响应时间
  - 吞吐量
    - 在单位时间内完成的工作量（请求）的量度
    - 在GC中：运行用户代码的时间占总运行时间的比例 （总运行时间 = 程序的运行时间+内存回收的时间）  吞吐量为`1-1/(1+n)`。`-XX:GCTimeRatio=n`
  - 并发数
    - 同一时刻，对服务器有实际交互的请求数。例如，1000人同时在线，估计并发数在5%~15%之间，也就是同时并发量为50~150
  - 内存占用
    - Java堆区所占的内存大小
  - 相互间的关系
    - 吞吐量：每天通过高速收费站的车辆的数量
    - 并发数：高速公路上正在行驶的车辆的数目
    - 响应时间：车速


## Reference

Oracle

- [Java SE 6 HotSpot Virtual Machine Garbage Collection Tuning](https://www.oracle.com/java/technologies/javase/gc-tuning-6.html)
- [Java Platform, Standard Edition HotSpot Virtual Machine Garbage Collection Tuning Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/)
- [The Garbage First Garbage Collector](https://www.oracle.com/java/technologies/javase/hotspot-garbage-collection.html)

