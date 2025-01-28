---
title: "jstat"
sequence: "110"
---

## Overview

```text
$ jstat -help
Usage: jstat -help|-options
       jstat -<option> [-t] [-h<lines>] <vmid> [<interval> [<count>]]

Definitions:
  <option>      An option reported by the -options option
  <vmid>        Virtual Machine Identifier. A vmid takes the following form:
                     <lvmid>[@<hostname>[:<port>]]
                Where <lvmid> is the local vm identifier for the target
                Java virtual machine, typically a process id; <hostname> is
                the name of the host running the target Java virtual machine;
                and <port> is the port number for the rmiregistry on the
                target host. See the jvmstat documentation for a more complete
                description of the Virtual Machine Identifier.
  <lines>       Number of samples between header lines.
  <interval>    Sampling interval. The following forms are allowed:
                    <n>["ms"|"s"]
                Where <n> is an integer and the suffix specifies the units as
                milliseconds("ms") or seconds("s"). The default units are "ms".
  <count>       Number of samples to take before terminating.
  -J<flag>      Pass <flag> directly to the runtime system.
```

```text
$ jstat -options
-class
-compiler
-gc
-gccapacity
-gccause
-gcmetacapacity
-gcnew
-gcnewcapacity
-gcold
-gcoldcapacity
-gcutil
-printcompilation
```

格式: `jstat -<option> [-t] [-h] <vmid> [interval] [count]`

- `option`: 要查看什么统计信息
- `-t`: 程序运行到现在耗时
- `-h`: 输出多少行后输出一次表头信息
- `vmid`: 要查看的进程号
- `interval`: 间隔多少毫秒输出一次统计信息，单位是毫秒。即查询间隔
- `count`: 输出多少次终止

选项`option`可以由以下值构成：

- 类装载相关的
    - `-class`：显示ClassLoader的相关信息，例如类的加载、卸载数量、总空间、类装载所消耗的时间等
- 垃圾回收相关的
    - `-gc`：显示与gc相关的堆信息，包括Eden区、两个Survivor区、老年代、永久代/元空间的容量、已用空间、GC时间合计等信息
    - `-gccapacity`：显示内容与`-gc`基本相同，但输出主要关注Java堆各个区域使用到的最大、最小空间
    - `-gcutil`：显示内容与`-gc`基本相同，但输出主要关注已经使用空间占总空间的百分比。
    - `-gccause`：与`-gcutils`功能一样，但是会额外输出导致最后一次或当前正在发生的GC产生的原因
    - `-gcnew`：显示新生代GC状况
    - `-gcnewcapacity`：显示内容与`-gcnew`基本相同，输出主要更关注使用到的最大、最小空间
    - `-geold`：显示老年代GC状况
    - `-gcoldcapacity`：显示内容与`-gcold`基本相同，输出主要关注使用到的最大、最小空间
    - `-gcpermcapacity`：显示永久代使用到的最大、最小空间
- JIT相关的
    - `-compiler`：显示JIT编译器编译过的方法、耗时
    - `-printcompilation`：输出已经被JIT编译过的方法



## options

### classloader

```java
import java.util.Scanner;

public class HelloWorldRun {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String str = scanner.nextLine();
        System.out.println(str);
    }
}
```

```text
jstat -class <vmid>
```

```text
jstat -class 9372
Loaded  Bytes  Unloaded  Bytes     Time
   708  1411.4        0     0.0       0.11
```

```text
jstat -<option> <vmid> [interval]
```

每隔1秒打印一下输出

```text
$ jstat -class 9372 1000
Loaded  Bytes  Unloaded  Bytes     Time
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
```

```text
jstat -<option> <vmid> [interval] [count]
```

```text
$ jstat -class 9372 1000 10
Loaded  Bytes  Unloaded  Bytes     Time
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
   708  1411.4        0     0.0       0.11
```

```text
jstat -<option> [-t] <vmid> [interval] [count]
```

```text
$ jstat -class -t 9372
Timestamp       Loaded  Bytes  Unloaded  Bytes     Time
          658.9    708  1411.4        0     0.0       0.11
```

```text
jstat -class -t 9372 1000 10
Timestamp       Loaded  Bytes  Unloaded  Bytes     Time
         1648.1    708  1411.4        0     0.0       0.11
         1649.1    708  1411.4        0     0.0       0.11
         1650.1    708  1411.4        0     0.0       0.11
         1651.1    708  1411.4        0     0.0       0.11
         1652.1    708  1411.4        0     0.0       0.11
         1653.1    708  1411.4        0     0.0       0.11
         1654.1    708  1411.4        0     0.0       0.11
         1655.1    708  1411.4        0     0.0       0.11
         1656.1    708  1411.4        0     0.0       0.11
         1657.1    708  1411.4        0     0.0       0.11
```

```text
jstat -<option> [-t] [-h] <vmid> [interval] [count]
```

```text
$ jstat -class -t -h3 9372 1000 10
Timestamp       Loaded  Bytes  Unloaded  Bytes     Time
         1602.6    708  1411.4        0     0.0       0.11
         1603.6    708  1411.4        0     0.0       0.11
         1604.6    708  1411.4        0     0.0       0.11
Timestamp       Loaded  Bytes  Unloaded  Bytes     Time
         1605.6    708  1411.4        0     0.0       0.11
         1606.6    708  1411.4        0     0.0       0.11
         1607.6    708  1411.4        0     0.0       0.11
Timestamp       Loaded  Bytes  Unloaded  Bytes     Time
         1608.6    708  1411.4        0     0.0       0.11
         1609.6    708  1411.4        0     0.0       0.11
         1610.6    708  1411.4        0     0.0       0.11
Timestamp       Loaded  Bytes  Unloaded  Bytes     Time
         1611.6    708  1411.4        0     0.0       0.11
```

### GC

#### gc

```text
jstat -gc 9372
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT
2048.0 2048.0  0.0    0.0   16384.0   3662.0   40960.0      0.0     4480.0 778.0  384.0   76.6       0    0.000   0      0.000    0.000
```

- 参数
  - 新生代相关
    - S0C是第一个幸存者的大小（字节）
    - S1C是第二个幸存者的大小（字节）
    - S0U是第一个幸存者已经使用的大小（字节）
    - S0U是第二个幸存者已经使用的大小（字节）
    - EC是Eden空间的大小（字节）
    - EU是Eden空间已经使用的大小（字节）
  - 老年代相关
    - OC是老年代的大小（字节）
    - OU是老年代已使用的大小（字节）
  - 方法区（元空间）相关
    - MC是方法区的大小
    - MU是方法区已经使用的大小
    - CCSC是压缩类空间的大小
    - CCSU是压缩类空间已经使用的大小
  - 其他
    - YGC是从应用程序启动到采样时Young GC的次数
    - YGCT是指从应用程序启动到采样时Young GC消耗的时间（秒）
    - FGC是从应用程序启动到采样时Full GC的次数
    - FGCT是从应用程序启动到采样时Full GC的消耗时间（秒）
    - GCT是从应用程序启动到采样时GC的总时间


```text
-Xms60m -Xmx60m -XX:SurvivorRatio=8
```

```java
import java.util.ArrayList;
import java.util.List;

public class HelloWorldRun {
    public static void main(String[] args) {
        List<byte[]> list = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            byte[] bytes = new byte[1024 * 100]; // 100KB
            list.add(bytes);
            try {
                Thread.sleep(120);
            }
            catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

### JIT

```text
jstat -compiler 9372
Compiled Failed Invalid   Time   FailedType FailedMethod
      92      0       0     0.04          0
```

```text
jstat -printcompilation 9372
Compiled  Size  Type Method
      92     19    1 java/lang/StringBuffer <init>
```
