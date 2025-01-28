---
title: "GC 参数"
sequence: "105"
---

## 设置 GC 收集器组合

| 新生代（别名）                        | 老年代                      | JVM 参数                  |
|--------------------------------|--------------------------|-------------------------|
| Serial(DefNew)                 | Serial Old(PSOldGen)     | -XX:+UseSerialGC        |
| Parallel Scavenge (PSYoungGen) | Serial Old(PSOldGen)     | -XX:+UseParallelGC      |
| Parallel Scavenge (PSYoungGen) | Parallel Old (ParOldGen) | -XX:+UseParallelOldGC   |
| ParNew(ParNew)                 | Serial Old(PSOldGen)     | -XX:+UseParNewGC        |
| ParNew(ParNew)                 | CMS+Serial Old(PSOldGen) | -XX:+UseConcMarkSweepGC |
| G1                             | G1                       | -XX:+UseG1GC            |

查看当前 GC 收集器组合：

```text
java -XX:+PrintCommandLineFlags -version
```

设置 GC 收集器组合：

```text
java -jar -XX:+UseSerialGC app.jar
```
