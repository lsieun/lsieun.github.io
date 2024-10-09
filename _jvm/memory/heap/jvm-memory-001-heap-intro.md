---
title: "堆"
sequence: "101"
---

一个 JVM 实例只存在一个堆内存，堆也是 Java 内存管理的核心区域。

## 物理 和 逻辑

《Java 虚拟机规范》规定，堆可以处于物理上不连续的内存空间中，但在逻辑上它应该被视为连续的。

## 容量

Java 堆区在 JVM 启动的时候即被创建，其空间大小也就确定了，是 JVM 管理的最大一块内存空间。

### 默认大小

默认情况下，初始内存大小，物理电脑内存大小/64，最大内存大小，物理电脑内存大小/4。

```java
public class HelloWorldRun {
    private static final int KB = 1024;
    private static final int MB = KB * KB;

    public static void main(String[] args) {
        long initialMemory = Runtime.getRuntime().totalMemory() / MB;
        long maxMemory = Runtime.getRuntime().maxMemory() / MB;

        System.out.println("initial Memory: " + initialMemory);
        System.out.println("max Memory: " + maxMemory);

        System.out.println("Computer Memory: " + initialMemory * 64 / 1024);
        System.out.println("Computer Memory: " + maxMemory * 4 / 1024);
    }
}
```

### 手工设置

堆内存的大小是可以调节的。

- `-Xms` 用于表示堆区的起始内存，等价于 `-XX:InitialHeapSize`
- `-Xmx` 用于表示堆区的最大内存，等价于 `-XX:MaxHeapSize`

> `-X` 是 JVM 的运行参数，`ms` 是 memory start 的缩写

通常会将 `-Xms` 和 `-Xmx` 两个参数配置相同的值，
其目的是为了能够在 Java 垃圾回收机制清理完堆区后不需要重新分隔计算堆区的大小，从而提高性能。

### 内存不够

一旦堆区中的内存大小超过 `-Xmx` 所指定的最大内存时，将会抛出 `OutOfMemoryError` 异常。

### 如何查看

- 第一种方式，`jps` 找到进程 ID，然后使用 `jstat -gc pid`
- 第二种方式，添加 `-XX:+PrintGCDetails` 参数

https://www.bilibili.com/video/BV1PJ411n7xZ?p=69

## 线程

所有的线程共享 Java 堆，在这里还可以划分线程私有的缓冲区（Thread Local Allocation Buffer，TLAB）

```text
-Xms10m -Xmx10m
```

## 对象分配

《Java 虚拟机规范》中对 Java 堆的描述：所有的对象实例以及数组都应当在运行时分配在堆上。

The heap is the run-time data area
from which memory for all class instances and arrays is allocated.

但是，从实际使用的角度来说，并不是所有的对象实例都分配在堆上。

数组和对象可能永远不会存储在栈上，因为栈桢中保存引用，这个引用指向对象或数组在堆中的位置。

在方法结束后，堆中的对象不会马上被移除，仅仅在垃圾收集的时候才会被移除。

堆，是 GC（Garbage Collection）执行垃圾回收的重点区域。

## 代码示例

### OutOfMemory 示例

```text
-Xms10m -Xmx10m
```

```java
import java.util.ArrayList;
import java.util.List;

public class HelloWorldRun {
    public static void main(String[] args) {
        List<Data> list = new ArrayList<>();
        while (true) {
            try {
                Thread.sleep(20);
            }
            catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            list.add(new Data(2 * 1024));
        }
    }

    private static class Data {
        private byte[] bytes;

        public Data(int length) {
            bytes = new byte[length];
        }
    }
}
```

出现如下错误：

```text
java.lang.OutOfMemoryError: Java heap space
```
