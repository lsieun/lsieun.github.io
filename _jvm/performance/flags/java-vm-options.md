---
title: "参数总结"
sequence: "104"
---

打印所有`-XX`开头的参数：

```text
java -XX:+PrintFlagsFinal -version
```

- `-XX:+PrintFlagsInitial`: 查看所有的参数的默认初始值 
- `-XX:+PrintFlagsFinal`: 查看所有参数的最终值
- `-Xms`: 初始堆空间内存（默认为物理内存的1/64）
- `-Xmx`: 最大堆空间内存（默认为物理内存的1/4）
- `-Xmn`: 设置新生代的大小（初始值及最大值）
- `-XX:NewRatio`: 配置新生代与老年代在堆结构的占比
- `-XX:SurvivorRatio`: 设置新生代中Eden和S0/S1空间的比例
- `-XX:MaxTenuringThreshold`: 设置新生代垃圾的最大年龄
- `-XX:+PrintGCDetails`: 输出详细的GC处理日志
  - 打印GC简要信息：`-XX:+PrintGC` 或者 `-verboase:gc`
- `-XX:HandlePromotionFailure`: 是否设置空间分配担保

## GC

- `-XX:MaxGCPauseMillis`：暂停时间，在执行垃圾收集时，程序的工作线程被暂停的时间
- `-XX:GCTimeRatio=n`：运行用户代码的时间占总运行时间的比例


## Reference

- [Java HotSpot VM Options - JDK 7](https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html)
- [java 8 - unix](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html)
- [java 8 - windows](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/java.html)
