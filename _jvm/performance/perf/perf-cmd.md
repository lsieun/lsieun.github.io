---
title: "调优：命令行篇"
sequence: "102"
---

## 概述

- 使用**数据**说明问题，使用**知识**分析问题，使用**工具**处理问题。
- 无监控，不调优

## jps 查看Java进程

jps = Java Process Status

Java Virtual Machine Process Status Tool

Java进程和操作系统中的进程相同

- `jps`: 显示Java进程号和主类名称
- `jps -q`:只显示Java进程号
- `jps -l`:显示主类全类名
- `jps -m`:显示主类main()的参数
- `jps -v`:显示进程启动的JVM参数。比如`-Xms20m -Xmx50m`是启动程序指定的JVM参数。

如果某个Java进程关闭了默认开启的UsePerfData参数，那么`jps`命令将无法探知该Java进程：

```text
-XX:-UsePerfData
```

```text
jps <hostid>:port
```

- `hostid`：RMI注册表中注册的主机名

如果想要远程监控主机上的java程序，需要安装`jstatd`。

对于具有更严格的安全实践的网络场所而言，可能使用一个自定义的策略文件来显示对特定的可信主机或网络的访问，
尽管**这种技术容易受到IP地址欺诈攻击**。

如果安全问题无法使用一个定制的策略文件来处理，那么最安全的操作是不运行`jstat`服务器，
而是在本地使用`jstat`或`jps`工具。

## jstat查看JVM统计信息

JVM Statistics Monitoring Tool

它可以显示本地或远程JVM进程中的类加载、内存、垃圾收集、JIT编译等运行数据。

在没有GUI图形界面，只提供了纯文本控制台环境的服务器上，
它是运行期间定位虚拟机性能问题首选工具，常用于检查垃圾回收以及内存泄漏问题

## jinfo实时查看,修改JVM参数

Java Configuration Info:实时查看/修改JVM参数

在很多情况下，Java应用程序不会指定所有的Java虚拟机参数。
而此时，开发人员可能不知道某一个具体的Java虚拟机参数的默认值。
在这种情况下，可能需要通过查找文档获取某个参数的默认值。
这个查找过程是非常艰难的。
但有了`jinfo`工具，开发人员可以很方便地找到Java虚拟机参数的当前值。

### 查看

- `jinfo -sysprops pid`: 查看`System.getProperties()`取得的参数
- `jinfo -flags pid`: 查看曾经赋值的参数
- `jinfo -flag JVM参数名 pid`: 查看某个Java进程的具体某个参数信息

```text
jinfo -sysprops 9372
Attaching to process ID 9372, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.301-b09
java.runtime.name = Java(TM) SE Runtime Environment
java.vm.version = 25.301-b09
sun.boot.library.path = C:\Program Files\Java\jdk1.8.0_301\jre\bin
java.vendor.url = http://java.oracle.com/
...
```

```text
jinfo -flags 9372
Attaching to process ID 9372, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.301-b09
Non-default VM flags: -XX:CICompilerCount=4 -XX:InitialHeapSize=62914560 -XX:MaxHeapSize=62914560 -XX:MaxNewSize=20971520 -XX:MinHeapDeltaBytes=524288 -XX:NewRatio=2 -XX:NewSize=20971520 -XX:OldSize=41943040 -XX:+PrintGCDetails -XX:SurvivorRatio=8 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:-UseLargePagesIndividualAllocation -XX:+UseParallelGC
Command line:  -ea -Xms60m -Xmx60m -XX:NewRatio=2 -XX:SurvivorRatio=8 -XX:+PrintGCDetails -javaagent:C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2021.3\lib\idea_rt.jar=12805:C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2021.3\bin -Dfile.encoding=UTF-8
```

```text
jinfo -flag UseParallelGC 9372
-XX:+UseParallelGC
```

```text
jinfo -flag UseG1GC 9372
-XX:-UseG1GC
```

```text
jinfo -flag MaxHeapSize 9372
-XX:MaxHeapSize=62914560
```

### 修改

并非所有参数都支持动态修改。
参数只有被标记为manageable的flag可以被实时修改。
因此，这个修改能力是极其有限的。

查看被标记为manageable的参数：

```text
java -XX:+PrintFlagsFinal -version | grep manageable
```

```text
java -XX:+PrintFlagsFinal -version | grep manageable
     intx CMSAbortablePrecleanWaitMillis            = 100                                 {manageable}
     intx CMSTriggerInterval                        = -1                                  {manageable}
     intx CMSWaitDuration                           = 2000                                {manageable}
     bool HeapDumpAfterFullGC                       = false                               {manageable}
     bool HeapDumpBeforeFullGC                      = false                               {manageable}
     bool HeapDumpOnOutOfMemoryError                = false                               {manageable}
    ccstr HeapDumpPath                              =                                     {manageable}
    uintx MaxHeapFreeRatio                          = 100                                 {manageable}
    uintx MinHeapFreeRatio                          = 0                                   {manageable}
     bool PrintClassHistogram                       = false                               {manageable}
     bool PrintClassHistogramAfterFullGC            = false                               {manageable}
     bool PrintClassHistogramBeforeFullGC           = false                               {manageable}
     bool PrintConcurrentLocks                      = false                               {manageable}
     bool PrintGC                                   = false                               {manageable}
     bool PrintGCDateStamps                         = false                               {manageable}
     bool PrintGCDetails                            = false                               {manageable}
     bool PrintGCID                                 = false                               {manageable}
     bool PrintGCTimeStamps                         = false                               {manageable}
java version "1.8.0_301"
Java(TM) SE Runtime Environment (build 1.8.0_301-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.301-b09, mixed mode)
```

- `jinfo -flag [+/-]JVM参数名 pid`：修改布尔类型
- `jinfo -flag JVM参数名=参数值 pid`：修改非布尔类型

### 扩展

- `java -XX:+PrintFlagsInitial`: 查看所有JVM参数启动初始值
- `java -XX:+PrintFlagsFinal`: 查看所有JVM参数最终值
- `java -XX:+PrintCommandLineFlags -version`：查看被修改过的某些参数值

## jmap导出内存映像文件和内存使用情况

JVM Memory Map: 一方面是获取dump文件（堆转储快照文件，二进制文件）；
另一方面，它可以获取目标Java进程内存相关信息(堆使用情况,对象统计信息,类加载信息)

查看帮助：

```text
jmap -help
```

它的基本语法为

- `jmap [option] <pid>`
- `jmap [option] <executable core>`
- `jmap [option] [server_id@]<remote server IP or hostname>`

其中，option包括：

- `-dump`: 生成dump文件
- `-finalizeinfo`: 显示在F-Queue中等待Finalizer线程执行finalize方法的对象
- `-heap`: 输出整个堆空间的详细信息，包括GC的使用、堆配置信息、以及内存的使用信息等
- `-histo`:输出堆空间中对象的统计信息，包括类、实例数量和合计容量
- `-permstat`: 以ClassLoader为统计口径输出永久代的内存状态信息
- `-F`: 当虚拟机进程对-dump选项没有任何响应时，可以使用此选项强制执行生成dump文件

一般使用格式: `jmap [option] pid`

option参数说明

- `-dump`：
  - 生成Java堆转储快照：dump文件
  - 特别的：`-dump:live`只保存堆中的存活对象
- `-heap`：输出整个堆空间的详细信息，包括GC的使用、堆配置信息，以及内存的使用信息等
- `-histo`：
  - 输出堆中对象的统计信息，包括类、实例数量和总数量
  - 特别的：`-histo:live`只统计堆中存活对象
- `-permstat`：
  - 以ClassLoader为统计口径输出永久代的内存状态信息
  - 仅Linux/Solaris平台有效
- `-finalizerinfo`：
  - 显示在F-Queue中等待Finalizer线程执行finalize方法的对象
  - 仅Linux/Solaris平台有效
- `-F`：
  - 当虚拟机进程对-dump选项没有任何响应时，可以使用此选项强制执行生成dump文件
  - 仅Linux/Solaris平台有效
- `-h` or `-help`：jmap工具使用的帮助命令
- `-J <flag>`：传递参数给jmap启动的JVM

手动导出 : 手动直接立即导出

- `jmap -dump:format=b,file=导出目录\文件名.hprof pid`
- `jmap -dump:live,format=b,file=导出目录\文件名.hprof pid`
  - 只dump出存活对象的快照,节省dump时间,空间 (一般在手动时使用这种方式)

自动导出: 启动程序时需要带参数,发生OOM时自动导出

- `-XX:+HeapDumpOnOutOfMemoryError`：在程序发生OOM时，导出应用程序的当前堆快照
- `-XX:+HeapDumpBeforeFullGC`
- `-XX:HeapDumpPath=导出目录\文件名.hprof`：可以指定堆快照的保存位置

```text
java -Xmx100m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=D:\my.hprof
```

当程序发生OOM退出系统时，一些瞬时信息都会随着程序的终止而消失；
而重现OOM问题往往比较难或耗时。
此时，若能在OOM时，自动导出dump文件就显得非常迫切。

jmap会访问堆中的所有对象，为了保证在此过程中不被应用线程干扰，
jmap会借助于安全点机制，让所有线程停留在不改变堆中数据的状态。
也就是说，由jmap导出的内存快照文件必定是在安全点位置的，
这可能导致基于该堆快照的分析结果存在偏差。

举个例子，假设在编译生成的机器码中，某些对象的生命周期在两个安全点之间，
那么`:live`选项将无法探知到这些对象。

另外，如果某个线程长时间无法到安全点，jmap就会一直等下去。
与前面讲的jstat则不同，垃圾回收器会主动将jstat所需要的摘要数据保存在固定位置之中，
而jstat只需要直接读取即可。

Heap Dump又叫做堆存储文件，指一个Java进程在某个时间点的内存快照。
Heap Dump在触发内存快照的时候会保存此刻的信息如下：

- All Objects: Class, fields, primitive values and references
- All Classes: ClassLoader, name, super class, static fields
- Garbase Collection Roots: Objects defined to be reachable by the JVM
- Thread Stacks and Local Variables: The call-stacks of threads at the moment of the snapshot,
  and per-frame information about local objects

通常在写Heap Dump文件前会触发一次Full GC，所以heap dump文件里保存的都是Full GC后留下的对象信息。
（注意，这里说的是“自动导出内存映像”的情况，而手动导出不需要进行Full GC）

由于生成dump文件比较耗时，因此需要耐心等待，尤其是大内存镜像生成dump文件则需要耗费更长的时间来完成。

```text
jmap -dump:format=b,file=d:\1.hprof 9372
Dumping heap to D:\1.hprof ...
Heap dump file created
```

```text
jmap -dump:live,format=b,file=d:\2.hprof 9372
Dumping heap to D:\2.hprof ...
Heap dump file created
```

使用二，显示堆内存相关信息

- `jmap -heap <pid>`
- `jmap -histo <pid>`

```text
jmap -heap 9372
Attaching to process ID 9372, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.301-b09

using thread-local object allocation.
Parallel GC with 8 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 62914560 (60.0MB)
   NewSize                  = 20971520 (20.0MB)
   MaxNewSize               = 20971520 (20.0MB)
   OldSize                  = 41943040 (40.0MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 16777216 (16.0MB)
   used     = 0 (0.0MB)
   free     = 16777216 (16.0MB)
   0.0% used
From Space:
   capacity = 2097152 (2.0MB)
   used     = 0 (0.0MB)
   free     = 2097152 (2.0MB)
   0.0% used
To Space:
   capacity = 2097152 (2.0MB)
   used     = 0 (0.0MB)
   free     = 2097152 (2.0MB)
   0.0% used
PS Old Generation
   capacity = 41943040 (40.0MB)
   used     = 1082536 (1.0323867797851562MB)
   free     = 40860504 (38.967613220214844MB)
   2.5809669494628906% used

3923 interned Strings occupying 301416 bytes.
```

```text
jmap -histo 9372

 num     #instances         #bytes  class name
----------------------------------------------
   1:          5650         480600  [C
   2:           437         150760  [B
   3:          5513         132312  java.lang.String
   4:           794          90608  java.lang.Class
   5:           661          49432  [Ljava.lang.Object;
   6:           791          31640  java.util.TreeMap$Entry
   7:           706          22592  java.util.HashMap$Node
   8:           266          12648  [Ljava.lang.String;
   9:           146          11568  [I
```

使用三，其它作用

- `jmap -permstat <pid>`：查看系统的ClassLoader信息
- `jmap -finalizerinfo`：查看在finalizer队列中的对象

## jhat分析dump文件工具

Java Heap Analysis Tool:内置微型服务器分析jmap生成的dump文件

Sun JDK提供的jhat命令与jmap命令搭配使用，用于分析jmap生成的heap dump文件（堆转储快照）。
jhat内置了一个微型的HTTP/HTML服务器，生成dump文件的分析结果后，
用户可以在浏览器中查看分析结果（分析虚拟机转储快照信息）

使用了jhat命令，就启动了一个http服务，端口是7000，即http://localhost:7000/，就可以在浏览器里分析。

说明：jhat命令在JDK 9之后已经被删除，官方建议用VisualVM代替。

格式: `jhat [option] [dumpfile目录]`

option参数

- `-stack false|true`：关闭或打开对象分配调用栈跟踪
- `-refs false|true`：关闭或打开对象引用跟踪
- `-port port-number`：设置jhat HTTP Server的端口号，默认7000
- `-exclude exclude-file`：执行对象查询时需要排除的数据成员
- `-baseline exclude-file`：指定一个基准堆转储
- `-debug init`：设置debug级别
- `-version`：启动后显示版本信息就退出
- `-J<flag>`：传入启动参数，例如`-J -Xmx512m`


```text
jhat D:\1.hprof
Reading from D:\1.hprof...
Dump file created Sun May 22 23:14:55 CST 2022
Snapshot read, resolving...
Resolving 29277 objects...
Chasing references, expect 5 dots.....
Eliminating duplicate references.....
Snapshot resolved.
Started HTTP server on port 7000
Server is ready.
```

使用的时候会占用CPU所以不会在生成环境中使用jhat来分析

## jstack打印JVM线程快照

JVM Stack Trace: 
用于生成虚拟机指定进程当前时刻的线程快照（虚拟机堆栈跟踪）。
线程快照就是当前虚拟机内指定进程的每一条线程正在执行的方法堆栈的集合。

生成线程快照的作用：可用于定位线程出现长时间停顿的原因，如线程间死锁、死循环、请求外部资源导致的长时间等待等问题。
这些都是导致线程长时间停顿的常见原因，
当线程出现停顿时，就可以用jstack显示各个线程调用的堆栈情况。

在thread dump中，要留意下面几种状态：

- 死锁：Deadlock（重点关注）
- 等待资源：Waiting on condition（重点关注）
- 等待获取监视器：Waiting on monitor entry（重点关注）
- 阻塞，Block（重点关注）
- 执行中，Runnable
- 暂停，Suspended


格式: `jstack option <pid>`

```text
$ jstack -help
Usage:
    jstack [-l] <pid>
        (to connect to running process)
    jstack -F [-m] [-l] <pid>
        (to connect to a hung process)
    jstack [-m] [-l] <executable> <core>
        (to connect to a core file)
    jstack [-m] [-l] [server_id@]<remote server IP or hostname>
        (to connect to a remote debug server)

Options:
    -F  to force a thread dump. Use when jstack <pid> does not respond (process is hung)
    -m  to print both java and native frames (mixed mode)
    -l  long listing. Prints additional information about locks
    -h or -help to print this help message
```

```java
import java.util.Map;
import java.util.Set;

public class HelloWorldRun {
    public static void main(String[] args) {
        Map<Thread, StackTraceElement[]> allStackTraces = Thread.getAllStackTraces();
        Set<Map.Entry<Thread, StackTraceElement[]>> entries = allStackTraces.entrySet();
        for (Map.Entry<Thread, StackTraceElement[]> entry : entries) {
            Thread thread = entry.getKey();
            StackTraceElement[] stackTraceElements = entry.getValue();
            System.out.println("[Thread name is " + thread.getName() + "]");
            for (StackTraceElement element : stackTraceElements) {
                System.out.println("    " + element.toString());
            }
        }
    }
}
```

## jcmd多功能命令行

在JDK 1.7以后，新增了一个命令行工具jcmd。

它是一个多功能的工具，可以用来实现前面除了jstat之外所有命令的功能。
比如，用它来导出堆、内存使用、查看Java进程、导出线程信息、执行GC、JVM运行时间等。

jcmd拥有jmap的大部分功能，并且在Oracle的官网上也推荐使用jcmd命令代替jmap命令。

基本用法：

- `jcmd -l`：列出所有的JVM进程
- `jcmd <pid> help`：针对指定的进程，列出支持的所有具体命令
- `jcmd <pid> 具体命令`：显示指定进程的指令命令的数据

```text
jcmd <pid> GC.heap_dump D:\my.hprof
```

## jstatd远程主机信息收集

之前的指令只涉及到监控本机的Java应用程序，而在这些工具中，
一些工具也支持对远程计算机的监控（如jps、jstat）。
为了启用远程监控，则需要配合使用jstatd工具。

命令jstatd是一个RMI服务端程序，它的作用相当于代理服务器，
建立本地计算机与远程监控工具的通信。
jstatd服务器将本机的Java应用程序传递到远程计算机。



