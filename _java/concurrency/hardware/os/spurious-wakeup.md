---
title: "虚假唤醒（spurious wakeup）"
sequence: "102"
---

[UP](/java-concurrency.html)

![](/assets/images/java/concurrency/spurious-wakeup-midnight.jpg)


## 介绍

Spurious wakeup 是指线程在没有接收到预期的信号或条件满足的情况下，意外地从等待状态（如等待一个条件变量）中唤醒。

### 理想情况

在多线程编程中，线程可能因为等待某个条件而进入阻塞状态。
在理想情况下，线程应该在条件满足时被唤醒。

### 现实情况

然而，操作系统为了处理可能的虚假或错误的信号（可能由于软件错误或其他系统级的异常），会允许线程在没有显式信号的情况下被唤醒。
这种设计可以避免线程在某些异常情况下无限期地阻塞。

### 归因-操作系统

Spurious wakeup 并不是由 CPU 或硬件层面直接引起的，而是多线程操作系统调度行为中的一种现象。

```text
不是 CPU 和 硬件 的原因
```

Spurious wakeup 主要是由操作系统内核中的线程调度和同步机制的设计引起的。
这种现象是多线程环境中的一个特性，通常与操作系统如何实现线程的等待和唤醒机制有关。

```text
原因：操作系统
```

在操作系统内核层面，为了提高系统的健壮性和可靠性，以及处理各种边缘情况，内核可能允许线程在没有显式地接收到触发其唤醒的事件或信号时就唤醒。
这样做的目的是防止线程因某些特定情况而永久阻塞在等待状态，尤其是在面对错误或异常信号处理时。
因此，spurious wakeup 可以视为一种由内核调度策略导致的必要的、设计上的折衷。

## 编程模式

由于 spurious wakeup 的存在，**编程模式**需要适应这种情况，
通常通过在等待某个条件时使用循环来反复检查该条件是否满足，从而确保程序逻辑的正确性和稳定性。
这种编程实践帮助程序能够正确处理由于意外唤醒导致的潜在问题。


由于 spurious wakeup 可能导致程序逻辑出错，开发者在使用条件变量等待某个条件时，应该总是在一个循环中检查条件。
这是因为即使线程被错误地唤醒，循环会再次检查条件是否真正满足，从而保证程序的正确执行。
例如，在使用 POSIX 线程库中的条件变量时，通常建议如下的使用模式：

```text
pthread_mutex_lock(&mutex);
while (!condition)
    pthread_cond_wait(&cond, &mutex);

// 进行一些操作，假设条件已满足
pthread_mutex_unlock(&mutex);
```

在这个模式中，即使发生了 spurious wakeup，while 循环会确保条件真正满足才继续执行。

```text
Powerful idiom in waiting
--------------------------   
    while (!predicate) {
        wait();
    }
```

## 总结

总结来说，spurious wakeup 是操作系统在实现线程调度和同步机制时可能会引入的一种现象，它不是由具体的硬件错误引起的。
正确的处理方法是在编程时考虑这一现象，通过循环检查条件来避免因意外唤醒导致的错误。

## Reference

- [Curious case of spurious wakeups](https://www.linkedin.com/pulse/curious-case-spurious-wakeups-ramkumar-sunderbabu-fwqzc/) 写的很好
