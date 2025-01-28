---
title: "JVM 最大支持多少线程"
sequence: "103"
---

[UP](/java-concurrency.html)


JVM 能够最大创建多少线程呢？
它并不是一个具体的数值，而是取决于许多因素。

## Stack Memory

One of the most important components of a thread is its stack.
The maximum stack size and the number of threads
that we create have a direct correlation to **the amount of system memory** available.

Thus, increasing the memory capacity also increases the maximum number of threads that we can run on a system.
More details about the stack size can be found in our article Configuring Stack Sizes in the JVM.

Finally, it's worth mentioning that, since Java 11,
the JVM doesn't aggressively commit all of the reserved memory for a stack.
This helps to increase the number of threads that we can run.
In other words, even if we increase the maximum stack size,
the amount of memory used by the thread will be based on the actual stack size.

## Heap Memory

The heap doesn't directly affect the number of threads that we can execute.
But, it's also using the same system memory.

Thus, increasing the heap size limits the available memory for the stack,
thereby decreasing the maximum number of threads we can create.

## Operating System Choice

When creating a new Java thread, a new native OS thread is created and directly linked to the one from the VM.

Therefore, the Operating System is in control of managing the thread.

Moreover, a variety of limits may be applied, based on the type of the operating system.

In the following subsections, we'll cover these aspects for the most common systems.

### Linux

Linux-based systems, at the kernel level, treat threads as processes.
Thus, process limits like the `pid_max` kernel parameter will directly affect the number of threads that we can create.

Another kernel parameter is `threads-max`, which describes the overall maximum number of threads.

We can retrieve all these parameters by executing `sysctl kernel.<parameter-name>`.

Finally, there's the limit for the maximum processes per user, retrievable using the `ulimit -u` command.

```text
[liusen@centos7 ~]$ ulimit -u
4096

[root@centos7 ~]# ulimit -u
7826
```

### Windows

On Windows machines, there's no limit specified for threads.
Thus, we can create as many threads as we want, until our system runs out of available system memory.

### macOS

There are two main limitations on systems that run macOS, defined by two kernel parameters:

- `num_threads` represents the overall maximum number of threads that can be created
- `num_taskthreads` represents the maximum number of threads per process

The values of these parameters can be accessed by executing `sysctl kern.<parameter-name>`.

One point worth mentioning is that when one of these limits is reached,
an `OutOfMemoryError` will be thrown, which can be misleading.

## Virtual Threads

We can further increase the number of threads
that we can create by leveraging lightweight Virtual Threads
that come with Project Loom, which is not yet publicly available.

Virtual threads are created by the JVM and do not utilize OS threads,
which means that we can literally create millions of them at the same time.

## Reference

- [How Many Threads Can a Java VM Support?](https://www.baeldung.com/jvm-max-threads)
