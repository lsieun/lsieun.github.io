---
title: "GraalVM for JDK 17 (Linux)"
sequence: "102"
---

## 下载

```text
https://www.oracle.com/java/technologies/downloads/
```

```text
https://download.oracle.com/graalvm/17/latest/graalvm-jdk-17_linux-x64_bin.tar.gz
```

## 解压

```text
$ tar -zxvf graalvm-jdk-17_linux-x64*.tar.gz
```

```text
$ sudo mv graalvm-jdk-17.0.8+9.1/ /opt/jdk17
```

```text
$ sudo vi /etc/profile
```

添加如下内容：

```bash
JAVA_HOME=/opt/jdk17
PATH=$JAVA_HOME/bin:$PATH
export JAVA_HOME PATH
```

```bash
$ source /etc/profile
```

验证：

```bash
java -version
javac -version
```

## Java

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

```text
$ javac HelloWorld.java
$ java HelloWorld
Hello, World!
```

## Native Executable

### Prerequisites

For compilation `native-image` depends on the **local toolchain**.

```text
$ sudo yum -y install gcc glibc-devel zlib-devel
```

### Build

```text
$ native-image HelloWorld
```

```text
$ native-image HelloWorld
========================================================================================================================
GraalVM Native Image: Generating 'helloworld' (executable)...
========================================================================================================================
[1/8] Initializing...                                                                                    (4.3s @ 0.09GB)
 Java version: 17.0.8+9-LTS, vendor version: Oracle GraalVM 17.0.8+9.1
 Graal compiler: optimization level: 2, target machine: x86-64-v3, PGO: ML-inferred
 C compiler: gcc (redhat, x86_64, 4.8.5)
 Garbage collector: Serial GC (max heap size: 80% of RAM)
[2/8] Performing analysis...  [****]                                                                     (9.6s @ 0.24GB)
   1,855 (59.17%) of  3,135 types reachable
   1,737 (46.37%) of  3,746 fields reachable
   7,716 (35.62%) of 21,661 methods reachable
     640 types,     0 fields, and   283 methods registered for reflection
      49 types,    32 fields, and    48 methods registered for JNI access
       4 native libraries: dl, pthread, rt, z
[3/8] Building universe...                                                                               (1.7s @ 0.25GB)
[4/8] Parsing methods...      [**]                                                                       (3.4s @ 0.31GB)
[5/8] Inlining methods...     [***]                                                                      (0.8s @ 0.23GB)
[6/8] Compiling methods...    [*****]                                                                   (23.1s @ 0.26GB)
[7/8] Layouting methods...    [*]                                                                        (0.5s @ 0.39GB)
[8/8] Creating image...       [*]                                                                        (0.8s @ 0.24GB)
   2.75MB (43.16%) for code area:     3,486 compilation units
   3.46MB (54.30%) for image heap:   48,970 objects and 1 resources
 165.63kB ( 2.53%) for other data
   6.38MB in total
------------------------------------------------------------------------------------------------------------------------
Top 10 origins of code area:                                Top 10 object types in image heap:
   1.44MB java.base                                          548.70kB byte[] for code metadata
   1.13MB svm.jar (Native Image)                             415.23kB byte[] for java.lang.String
  69.54kB com.oracle.svm.svm_enterprise                      325.71kB java.lang.String
  33.89kB org.graalvm.nativeimage.base                       304.84kB java.lang.Class
  30.23kB org.graalvm.sdk                                    253.60kB byte[] for general heap data
  18.95kB jdk.internal.vm.ci                                 150.09kB java.util.HashMap$Node
  14.10kB jdk.internal.vm.compiler                           111.71kB char[]
   1.17kB jdk.proxy3                                          78.92kB java.lang.Object[]
   1.15kB jdk.proxy1                                          72.46kB com.oracle.svm.core.hub.DynamicHubCompanion
  360.00B jdk.proxy2                                          70.45kB byte[] for reflection metadata
   54.00B for 1 more packages                                442.27kB for 506 more object types
------------------------------------------------------------------------------------------------------------------------
Recommendations:
 G1GC: Use the G1 GC ('--gc=G1') for improved latency and throughput.
 PGO:  Use Profile-Guided Optimizations ('--pgo') for improved throughput.
 HEAP: Set max heap for improved and more predictable memory usage.
 CPU:  Enable more CPU features with '-march=native' for improved performance.
 QBM:  Use the quick build mode ('-Ob') to speed up builds during development.
------------------------------------------------------------------------------------------------------------------------
                        3.0s (6.6% of total time) in 101 GCs | Peak RSS: 0.97GB | CPU load: 1.98
------------------------------------------------------------------------------------------------------------------------
Produced artifacts:
 /home/liusen/test/helloworld (executable)
========================================================================================================================
Finished generating 'helloworld' in 44.8s.
```

```text
$ ls -lh
total 6.5M
-rwxrwxr-x. 1 liusen liusen 6.4M Aug  5 10:44 helloworld
-rw-rw-r--. 1 liusen liusen  427 Aug  5 10:37 HelloWorld.class
-rw-rw-r--. 1 liusen liusen  116 Aug  5 10:36 HelloWorld.java
-rw-rw-r--. 1 liusen liusen  30K Aug  5 10:41 svm_err_b_20230805T104101.496_pid1699.md
```

```text
$ ./helloworld 
Hello, World!
```

## Reference

- [Installation on Linux Platforms](https://docs.oracle.com/en/graalvm/jdk/20/docs/getting-started/installation-linux/)
