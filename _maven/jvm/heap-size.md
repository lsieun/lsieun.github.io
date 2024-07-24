---
title: "Maven JVM: Configuring the heap size"
sequence: "104"
---

[UP](/maven-index.html)


Once you have Maven installed in your system, the very next step is to fine-tune it for an optimal performance.
By default, the maximum heap allocation is 512 MB, which starts from 256 MB (`-Xms256m` to `-Xmx512m`).
This default limit is not good enough to build a large, complex Java project,
and it is recommended that you have at least 1024 MB of the maximum heap.

If you encounter `java.lang.OutOfMemoryError` at any point during a Maven build,
then it is mostly due to a lack of memory.
You can use the `MAVEN_OPTS` environment variable to set the maximum allowed heap size for Maven at a global level.

The following command will set the heap size in any Unix-based operating system, including Linux and Mac OS X.
Make sure that the value set as the maximum heap size does not exceed your system memory of the machine, which runs Maven:

```text
export MAVEN_OPTS="-Xmx1024m -XX:MaxPermSize=128m"
```

If you are on Microsoft Windows, use the following command:

```text
set MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=128m
```

Here, `-Xmx` takes the maximum heap size and `-XX:MaxPermSize` takes the **maximum Permanent Generation** (PermGen) size.


Maven runs as a Java process on JVM.
As it proceeds with a build, it keeps on creating Java objects.
These objects are stored in the memory allocated to Maven.
This area of memory where Java objects are stored is known as heap.
Heap is created at the JVM start, and
it increases as more and more objects are created up to the defined maximum limit.
The `-Xms` JVM flag is used to instruct JVM about the minimum value
that it should set at the time of creating the heap.
The `-Xmx` JVM flag sets the maximum heap size.

PermGen is an area of memory managed by JVM,
which stores the internal representations of Java classes.
The maximum size of PermGen can be set by the `-XX:MaxPermSize` JVM flag.
