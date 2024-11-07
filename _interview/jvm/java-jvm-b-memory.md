---
title: "Java JVM 内存"
sequence: "jvm-memory"
---

## 内存

- Runtime Data Area
    - 线程共享
        - 堆（Heap）：主要存储对象
        - 方法区（Method Area）：存储类、方法、字段等定义（元）数据
            - 运行时常量区：保存常量 static 数据
    - 线程私有
        - 程序计数器（Program Count Register）：存储线程执行位置
        - 虚拟机栈（VM Stack）：存储方法调用与执行过程的数据
        - 本地方法栈（Native Method Stack）：存储本地方法执行的数据

![](/assets/images/java/jvm/jvm-runtime-data-area.png)

**方法区**存储的是：常量池、类信息(类变量)、静态变量(static)以及方法信息(修饰符、方法名、返回值、参数等)等

**堆**是线程共享的内存区域，它是虚拟机管理内存中最大的一块。

## TLAB

堆，线程私有的缓冲区（TLAB，Thread Local AllocationBuffer，线程本地分配缓冲区），用于提高 JVM 并发处理效率。

TLAB （Thread Local Allocation Buffer，线程本地分配缓冲区）是 Java 中内存分配的一个概念，
它是在 Java 堆中划分出来的针对每个线程的内存区域，专门在该区域为该线程创建的对象分配内存。
它的主要目的是在多线程并发环境下需要进行内存分配的时候，减少线程之间对于内存分配区域的竞争，加速内存分配的速度。
TLAB 本质上还是在 Java 堆中的，因此在 TLAB 区域的对象，也可以被其他线程访问。

如果没有启用 TLAB，多个并发执行的线程需要创建对象、申请分配内存的时候，有可能在 Java 堆的同一个位置申请，
这时就需要对拟分配的内存区域进行加锁或者采用 CAS 等操作，保证这个区域只能分配给一个线程。

启用了 TLAB 之后(`-XX:+UseTLAB`, 默认是开启的)，JVM 会针对每一个线程在 Java 堆中预留一个内存区域，
在预留这个动作发生的时候，需要进行加锁或者采用 CAS 等操作进行保护，避免多个线程预留同一个区域。
一旦某个区域确定划分给某个线程，之后该线程需要分配内存的时候，会优先在这片区域中申请。
这个区域针对分配内存这个动作而言是该线程私有的，因此在分配的时候不用进行加锁等保护性的操作。


## 堆结构

GC 主要在新生区（伊甸园区）、老年区。

- 新生区（伊甸园区（对象都是在这个区 new 出来的）、幸存区 to、幸存区 from：幸存区位置会互相交换，谁空谁是 to）
- 老年区
- 永久区/元空间：存储的是 java 的运行环境或类信息，这个区域不存在垃圾回收，关闭 jvm 就会释放内存

![](/assets/images/java/jvm/jvm-heap-8-after.png)

![](/assets/images/java/jvm/jvm-heap-8-before.png)

设置堆空间大小的参数：

- `-Xms`：用来设置堆空间（年经代 + 老年代）的初始内存大小
- `-Xmx`：用来设置堆空间（年经代 + 老年代）的最大内存大小

默认堆空间大小：

- 初始内存大小：物理电脑内存大小 / 64
- 最大内存大小：物理电脑内存大小 / 4

年轻代与老年代的占用比例：

- 年经代固定占用 1/3
- 老年代固定占用 2/3

手动设置：`-Xms1g -Xmx1g`

- 开发中，建议将初始堆内存和最大堆内存设置成相同的值。
- Java 整个堆大小设置建议：`Xmx` 和 `Xms` 设置为老年代 FullGC 后存活对象的 3-4 倍

查看设置的参数：`-XX:PrintGCDetails`

## 方法区

方法区，是线程共享的区域，是物理分散存储而逻辑为整体的内存区域。

方法区保存的内容：

- 类加载器信息
- 类信息（包含字段、方法）
- 常量
- 即时编译器编译后的代码缓存
- 静态变量（1.6 版本前，之后存储在堆中）

方法区是个概念，JVM 没有对方法区（Method Area）如何实现做更多要求：

- 1.7 前 HotSpot 的方法区实现称为“永久代”（Permanent Generation）
- 1.8 后 HotSpot 的方法区实现称为“元空间”（Metaspace）

### 永久代与元空间的区别

规范说明，方法区是堆的逻辑部分，在实现中与堆内存无关，称为“非堆”（Non-Heap）。

永久代（Permanent）是 JDK7 （含）之前的方法区实现：

- 特点：占用 **JVM 内存**保存数据，`-XX:MaxPermSize` 有上限，容易内存溢出，且与其它 JVM （JRockit、J9）实现不一致

元空间（Metaspace）是 JDK8 之后的方法区实现

- 特点：使用**本地内存**（Native Memory）保存数据，最大为可用物理内存，与其它 JVM 保持一致。

### 设置元空间

- `-XX:MetaspaceSize=xxx(M|G)`
  - 设置元空间初始大小，默认尺寸与平台相关（12mb~21mb），到达进行调整并自动触发 Full GC
  - 设置建议：调整为一个较大的值，减少 Full GC 的可能
- `-XX:MaxMetaspaceSize=xxx(M|G)`
  - 设置元空间最大尺寸，默认值为 `-1`，代表最大可用内存，一般不设置最大值
  - 超过最大值后，将会出现 `OutOfMemoryError:Metaspace`

### 常量池

jdk1.6 之前：永久代，常量池是在方法区
jdk1.7 去永久代，常量池在堆中
jdk1.8 之后：无永久代，常量池在元空间中

## 异常

一个启动类加载大量的 jar 包。tomcat 部署太多应用。内存满了就 oom

## OOM 原因

1、一次性申请的太多：更改申请对象数量

2、内存资源耗尽未释放：找到未释放的对象进行释放

3、内存本身资源不够：jmap -heap PID 查看堆信息


如果系统已经 OOM 挂了，则提前设置：

```text
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=./jvm_logs/
```

系统运行中，还未 OOM，则导出 dump 文件：

```text
jmap -dump:format=b,file=mydump.hprof PID
```

或者使用 Arthas

结合 VisualVM 进行查找：

```text
查看最多与业务有关的对象 --> 找到 RCRoot --> 查看线程
```
