---
title: "volatile 介绍"
sequence: "103"
---

[UP](/java-concurrency.html)


- MESI 缓存一致性协议
- volatile 与内存屏障

## JMM 中的 八大操作

这八大操作，是硬件层面的，保证都是原子操作：

- read（读取）
- load（载入）
- store（存储）
- write（写入）
- use（使用）
- assign（赋值）
- lock（锁定）
- unlock（解锁）

![](/assets/images/java/concurrency/volatile/jmm-8-ops.png)

## volatile 缓存可见性实现原理

在 Java 语言中，使用了 volatile，汇编指令里添加了 lock 指令：

- 第 1 步，将当前处理器缓存行数据**立刻写回主内存**
- 第 2 步，这个写操作，会触发**总线嗅探机制**（MESI 协议）

```text
线程栈内存（工作内存）

------------------------

总线：总线嗅探机制

-----------------------

堆内存（主内存）
```

## Java 程序汇编代码查看

```text
-server
-Xcomp
-XX:+UnlockDiagnosticVMOptions
-XX:+PrintAssembly
-XX:CompileCommand=compileonly,*JMMTest.*
```


```text
高级语言  ： 虚拟机器 M3
汇编语言  ： 虚拟机器 M2
操作系统  ： 虚拟机器
机器语言  ： 实际机器 M1
微指令系统： 微程序机器 M0
```

HSDIS 插件（反汇编插件）

OpenJDK hsdis (HotSpot disassembly plugin) downloads

```text
https://chriswhocodes.com/hsdis/
```

![](/assets/images/java/concurrency/volatile/openjdk-hsdis-downloads.png)

将 `hsdis-amd64.dll` 文件放到如下目录：

```text
C:\Program Files\Java\jdk1.8.0_301\jre\bin\server
```

```java
public class JMMTest {
    private volatile boolean flag = false; // 主内存，共享变量

    public static void main(String[] args) throws Exception {
        JMMTest instance = new JMMTest();

        new Thread(
                () -> {
                    System.out.println("Thread1 -- start");
                    while (!instance.flag) {
                        System.out.println("flag is false");
                    }
                    System.out.println("Thread1 -- end");
                }
        ).start();

        Thread.sleep(100);

        new Thread(
                () -> {
                    System.out.println("Thread2 -- start");
                    instance.flag = true;
                    System.out.println("Thread2 -- end");
                }
        ).start();
    }
}
```

## Reference

- [Java 反汇编：HSDIS、JITWatch](https://zhuanlan.zhihu.com/p/158168592)
- [JVM 执行篇：使用 HSDIS 插件分析 JVM 代码执行细节](https://www.infoq.cn/article/zzm-java-hsdis-jvm)
- [idea 安装 hsdis](https://blog.csdn.net/qq_41571459/article/details/115118997)
- [Guide to the Volatile Keyword in Java](https://www.baeldung.com/java-volatile)
