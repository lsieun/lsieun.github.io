---
title: "线程上下文切换（Thread Context Switch）"
sequence: "103"
---

[UP](/java-concurrency.html)


线程上下文切换：因为以下一些原因导致 CPU 不再执行当前的线程，转而执行另一个线程的代码

- 被动（线程本身不能决定，由 CPU 或 JVM 决定）
    - 线程的 CPU 时间片用完 （CPU 层面）
    - 垃圾回收 （JVM 层面）
    - 有更高优先级的线程需要运行 （线程层面）
- 主动（线程主动让出）
    - 线程自己调用了 `sleep`、`yield`、`wait`、`join`、`park`、`synchronized`、`lock` 等方法

当 Context Switch 发生时，需要由操作系统保存当前线程的**状态**，并恢复另一个线程的**状态**，
Java 中对应的概念就是程序计数器（Program Counter Register），它的作用是记住下一条 JVM 指令的执行地址，是线程私有的。

- **状态**包括程序计数器、虚拟机栈中每个栈帧的信息，如局部变量、操作数栈、返回地址等
- Context Switch 频繁发生会影响性能
