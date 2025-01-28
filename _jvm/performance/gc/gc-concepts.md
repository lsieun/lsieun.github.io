---
title: "GC相关概念"
sequence: "103"
---

## Minor GC, Major GC and Full GC



- Minor GC或Young GC是发生在Eden区和Survior from区
- Major GC发生在Old Generation Space

关于垃圾回收：频繁在新生区（Young Generation Space）收集，很少在老年区收集，向乎不在永久/元空间收集。

JVM在进行GC时，并非每次都对上面三个内存区域（新生代、老年代和方法区）一起回收，大部分回收的都是指新生代。

针对HotSpot VM的实现，它里面的GC按照回收区域又分为两大种类型：一种是部分收集（Partial GC），一种是整堆收集（Full GC）

- 部分收集：不是完整收集整个Java堆的垃圾，又进一步细分为
  - 新生代收集（Minor GC/Young GC）：只是新生代（Eden,Survivor）的垃圾收集
  - 老年代收集（Major GC/Old GC）：只是老年代（Old Generation Space）的垃圾收集
    - 目前，只有CMS GC会单独收集老年代的行为
    - 注意，很多时候Major GC会和Full GC混淆使用，需要具体分辨是老年代回收还是整个堆回收
  - 混合收集（Mixed GC）：收集整个新生代以及部分老年代的垃圾收集
    - 目前，只有G1 GC会有这种行为
- 整堆收集（Full GC）：收集整个Java堆或方法区的垃圾收集

## GC策略的触发条件

### 新生代GC（Minor GC）触发机制

新生代GC（Minor GC）触发机制：

- 当新生代空间不足时，就会触发Minor GC，这里的年轻代满指的是Eden代满，Survior满不会引发GC。（每次Minor GC会清理年经代的内存）
- 因为Java对象大多都具备“朝生暮死”的特性，所以Minor GC非常频繁，一般回收速度也比较快。
- Minor GC会引发STW，暂停其它用户的线程，等垃圾回收结束，用户线程才恢复运行。

### 老年代GC（Major GC/Full GC）触发机制

老年代GC（Major GC/Full GC）触发机制：

- 指发生在老年代的GC，对象从老年代消失时，我们说“Major GC”或“Full GC”发生了
- 出现了Major GC，经常会伴随至少一次Minor GC。（但并非绝对的，在Parallel Scavenge收集器的收集策略里就有直接进行Major GC的策略选择过程。）
  - 也就是在老年代空间不足时，会先尝试触发Minor GC。如果之后空间还不足，则触发Major GC
- Major GC的速度一般比Minor GC慢10倍以上，STW的时间更长
- 如果Major GC后，内存还不足，就报OOM了

### Full GC触发机制

触发Full GC执行的情况有如下五种：

- 调用`System.gc()`时，系统建议执行Full GC，但是不必然执行
- 老年代空间不足
- 方法区空间不足
- 通过Minor GC后进入老年代的平均大小大于老年代的可用内存
- 由Eden区、Survivor space 0（From Space）区向Survivor Space 1（To Space）区复制时，
  对象大小大于To Space可用内存，则把该对象转存到老年代，且老年代的可用内存小于该对象的大小

注意：Full GC是开发或调优中尽量要避免的，这样暂停时间会短一些。

## 常见调优工具

- JDK命令行
  - jps
  - jinfo
  - jstat
  - jmap
- Eclipse: Memory Analyzer Tool
- JConsole
- VisualVM
- JProfiler
- Java Flight Recorder
- GCViewer
- GC Easy
