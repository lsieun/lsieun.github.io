---
title: "监控和调优"
sequence: "java-jvm-runtime"
---

## JVM 调优

减少 Full GC 是 JVM 优化的重点

1、大多数情况下，JVM 生产环境考虑调整下面三方面：

- 最大堆和最小堆大小
- GC 收集器
- 新生代（年轻代）大小

2、在没有全面监控、收集性能数据之前，调优就是扯淡

3、99% 的情况是你的代码出了问题，而不是 JVM 参数不对

具体点：

- 1.8+ 优先使用 G1 收集器，摆脱各种选项烦恼
- `-Xms` 与 `-Xmx` 设置相同，减少内存交换
- 评估 `Xmx` 方法：第一次起始设置大一点，跟踪监控日志，调整为堆峰值的 2~3 倍即可
- 最多 300 毫秒 STW 时间，200~500 区间，增大可减少 GC 次数，提高吞吐
- `-Xss128k/256k` 虚拟机栈空间一般 128K 就够用了。超过 256K 考虑优化，不建议超过 256K
- G1 一般不设置新生代的大小，G1 新生代是动态调整的。

```text
java -jar -XX:+UseG1GC -Xms2G -Xmx2G -Xss256k
-XX:MaxGCPauseMillis=300 -Xloggc:/logs/gc.log -XX:+PrintGCTimeStamps
-XX:+PrintGCDetails test.jar
```

## 参数

- `-Xmx60M -Xmx60M`：堆总内存大小为 60MB
- `-Xmn10M`：强制设置新生代为 10MB，剩余 50MB 分给老年代。
- `-XX:SurvivorRatio=8`：设置 Eden 与 Survivor 比例为 `8:1:1`。如果年轻代总共有 10MB，那么 Eden 为 8MB，S0 与 S1 分别为 1MB。
- `-XX:+PrintGCDetails` 打印详细 GC 日志

## JVM 监控命令

- jps: 查看 Java 进程 PID，`jps`
- jinfo：查看 JVM 环境与参数 `jinfo PID > out.txt`
- jstat：查看 JVM 内存及 GC 状态 `jstat -gcutil PID 1000 10`，其中，`1000` 表示 1 秒钟刷新一次，`10` 表示刷新 10 次
- jstack：查看各种线程调用方法堆栈 `jstack -l PID`
- jmap：生成统计、生成堆 dump 文件 `jmap -histo PID | head -n 20`, `jmap -dump:live,format=b,file=dump.hprof PID`
- jhat：dump 分析工具 `jhat dump.hprof`

![](/assets/images/java/jvm/jstat-output-reference.png)

## Reference

- [常用的 JVM 性能调优监控工具有哪些？](https://www.zhihu.com/question/483956732/answer/3065601667?utm_id=0)
- [JVM java 虚拟机调优](https://www.jianshu.com/p/237dcde01e84)

