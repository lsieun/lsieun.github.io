---
title: "Minor GC, Major GC, Full GC"
sequence: "103"
---

在 Java 虚拟机（JVM）中，Minor GC、Major GC 和 Full GC 是三种不同类型的垃圾收集（GC）操作，
它们分别表示不同类型的内存区域进行垃圾收集。

## Minor GC

Minor GC：也称为年轻代 GC。在 JVM 中，内存被分为新生代和老年代。
新创建的对象首先进入新生代（分为 Eden 区和两个 Survivor 区）。
Minor GC 发生在新生代，主要清理 Eden 区，以及 Survivor 区中不再被使用的对象。
通常，Minor GC 执行得非常频繁，而且速度较快。

## Major GC

Major GC：也称为老年代 GC 或老年代垃圾收集。
Major GC 会扫描老年代（存储存活时间比较长的对象），并清理不再使用的对象。
通常，Major GC 执行得不太频繁，但因为它涉及到扫描整个老年代，所以可能会花费较长的时间。

## Full GC

Full GC：全量垃圾收集。Full GC 扫描整个 JVM 堆，包括新生代和老年代，以清理不再使用的对象。
Full GC 通常是最慢的，而且会暂停应用程序的执行，因此应尽量避免。

Full GC 一般会在以下几种情况下发生：

- 系统启动时：此时 JVM 会执行一次 Full GC 以将整个堆空间都初始化。
- 用户设置了 `-XX:+DisableExplicitGC` 参数：此参数开启后，禁止用户通过 `System.gc()` 方法进行显式垃圾收集，
  但 JVM 会在一些特定的情况下（例如：内存不足）自动触发 Full GC。
- 老年代空间不足：当老年代空间不足以容纳新的对象时，会触发 Full GC。

一般来说，如果需要频繁进行垃圾收集，那么应该尽量减少 Full GC 的次数，而主要依赖 Minor GC 和 Major GC。
这通常可以通过调整 JVM 的内存参数（例如设置年轻代和老年代的大小）来实现。
