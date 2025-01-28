---
title: "Java 内存模型"
sequence: "101"
---

[UP](/java-concurrency.html)


JMM 即 Java Memory Model，它定义了**主存**、**工作内存**抽象概念，
底层对应着 CPU、寄存器、缓存、硬件内存、CPU 指令优化等。

线程的**工作内存**在多核处理器中通常会映射到 CPU 的**缓存层次结构**，包括 L1、L2、L3 缓存。

JMM 体现在以下几个方面

- 原子性 - 保证指令不会受到线程上下文切换的影响
- 可见性 - 保证指令不会受 CPU 缓存的影响
- 有序性 - 保证指令不会受 CPU 指令并行优化的影响

## Why the Java Memory Model?

Since each architecture can have its own memory model,
the JMM abstracts all of them out by providing a common memory model on any architecture.
The programmer does not have to worry himself about the underlying architecture,
as long as he/she is following the rules of the JMM.

## Other

The Java Memory Model (JMM) is a specification
that defines how the Java programming language handles
memory, threads, and synchronization in a multithreaded environment.
It ensures that Java programs behave predictably and consistently across different hardware and platforms.
The JMM is crucial for understanding and avoiding issues related to
**thread safety**, **race conditions**, and **visibility** problems in concurrent Java applications.

Key aspects of the Java Memory Model include:

1. **Main Memory (Heap)**: In Java, objects and data are stored in the main memory,
also known as the heap. All threads share access to this memory space.

2. **Thread-Specific Memory**: Each thread has its own thread-specific memory,
known as the **thread stack**, which stores the local variables, method call stack, and thread-specific data.
These local variables are not shared with other threads.

3. **Happens-Before Relationship**: The JMM defines a happens-before relationship
that establishes the order of actions between threads.
If action A happens before action B, then any thread seeing action B will also see action A.

4. **Synchronization**: Java provides mechanisms for synchronization,
such as synchronized blocks and methods, as well as the keyword.
These mechanisms ensure that changes to shared variables are properly visible to other threads.

5. **Atomicity**: The JMM guarantees that certain operations are atomic.
For example, reads and writes of reference variables are atomic,
but reads and writes of longs and doubles may not be atomic by default.

6. **Memory Barriers**: The JMM includes memory barriers, such as the acquire and release semantics,
to enforce ordering and synchronization of memory operations.
These barriers ensure that actions in one thread are visible to other threads at the appropriate times.

7. **Volatile Variables**: The keyword is used to declare variables that require visibility guarantees.
When a variable is declared as `volatile`, changes made to that variable are immediately visible to all threads,
and reads and writes to the variable are atomic.

8. **Synchronized Blocks and Methods**: The keyword is used to create mutually exclusive regions,
ensuring that only one thread at a time can execute a synchronized block or method.
This helps prevent race conditions and ensures data consistency.

9. **Thread Start and Join**: When one thread starts another thread or waits for its completion using the and methods,
the JMM ensures that actions taken by the starting thread are visible to the newly created thread.

10. **Final Fields**: The JMM provides guarantees for fields.
Once a field is initialized, it is guaranteed to be visible to all threads without synchronization.

Understanding the Java Memory Model is essential for writing correct and efficient multithreaded Java programs.
It helps developers reason about the behavior of their code in a concurrent environment and ensures that
data consistency and visibility are maintained as expected.
It's important to use synchronization mechanisms and follow best practices to
avoid common concurrency issues and ensure thread safety in Java applications.

## Reference

- [17.4. Memory Model](https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html#jls-17.4)
- [Java Memory Model](https://jenkov.com/tutorials/java-concurrency/java-memory-model.html)
- [Stack Memory and Heap Space in Java](https://www.baeldung.com/java-stack-heap)
- [The OpenJDK Revised Java Memory Model](https://www.infoq.com/articles/The-OpenJDK9-Revised-Java-Memory-Model/)
- [The Java Memory Model](https://www.cs.umd.edu/~pugh/java/memoryModel/)
- [Understanding Java Memory Model](https://medium.com/platform-engineer/understanding-java-memory-model-1d0863f6d973)
- [Java (JVM) Memory Model - Memory Management in Java](https://www.digitalocean.com/community/tutorials/java-jvm-memory-model-memory-management-in-java)

- [x] [JSR 133 (Java Memory Model) FAQ](https://www.cs.umd.edu/~pugh/java/memoryModel/jsr-133-faq.html) 写的很好，有些东西没有掌握
- [x] [Let's Discuss Java Memory Model](https://www.linkedin.com/pulse/lets-discuss-java-memory-model-inzmam-ul-hassan-yuooe)

- [ ] https://www.infoq.com/articles/memory_barriers_jvm_concurrency/
- [ ] https://eksimtech.com/deep-dive-into-java-memory-model-29f7ed4d6ceb
- [ ] https://www.cnblogs.com/liaozhiwei/p/17618432.html
- [ ] https://gee.cs.oswego.edu/dl/jmm/cookbook.html
- [ ] https://medium.com/swlh/an-introduction-to-the-java-memory-model-8c306697acad
- [ ] https://juejin.cn/post/7102427339518132238
- [ ] https://www.cswiki.top/pages/7214c6/
- [ ] http://www.mobiletrain.org/about/BBS/101719.html
- [ ] https://redspider.gitbook.io/concurrent/di-er-pian-yuan-li-pian/6
