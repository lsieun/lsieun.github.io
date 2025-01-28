---
title: "对比"
sequence: "101"
---

[UP](/java-nio.html)


## AIO VS. NIO

Java 的 AIO（Asynchronous I/O，异步 I/O）是 Java NIO（New I/O）包中的一种 I/O 模型，与 NIO 相关但并不相同。

AIO 和 NIO 都是为了提高 I/O 操作的效率而引入的。它们的主要区别在于处理方式和代码编程模型：

1. **同步 vs 异步**：在 NIO 中，I/O 操作是同步的，即程序会阻塞等待 I/O 完成；而在 AIO 中，I/O 操作是异步的，即程序可以继续执行其他任务，当 I/O 操作完成后会通过回调函数通知应用程序。

2. **阻塞 vs 非阻塞**：NIO 使用非阻塞 I/O 模型，通过使用选择器（Selector）来实现多路复用，一个线程可以同时处理多个连接；AIO 则使用异步 I/O 模型，通过操作系统提供的异步 I/O 机制来实现真正的异步操作。

3. **编程模型**：NIO 使用 Channel 和 Buffer，通过手动地将数据从 Channel 读取到 Buffer 中，再从 Buffer 写入到 Channel 中；AIO 使用 AsynchronousChannel 和 CompletionHandler，通过回调函数的方式来处理 I/O 事件，减少了手动的数据拷贝过程。

尽管 AIO 和 NIO 都是为了提高 I/O 操作的效率和并发性，但它们的使用场景略有差异。AIO 更适合处理连接数较多、但每个连接的数据量不大的场景。因为 AIO 可以利用异步操作的特性，更高效地处理大量连接的 I/O 事件，避免了线程阻塞和上下文切换开销。

总结起来，AIO 是 Java NIO 包中的一种 I/O 模型，与 NIO 相关但有明显区别。AIO 使用异步、非阻塞的方式处理 I/O 操作，通过回调函数实现异步通知，适用于高并发连接的场景。

## Java IO and NIO

### Introduction

Sockets use TCP/IP transport protocol. You do not usually have to deal with them since there are protocols built on top of them like HTTP or FTP; however, it is important to know how they work.

> TCP: It is a reliable data transfer protocol that ensures that the data sent is complete and correct and requires to establish a connection.

Java offers a blocking and non-blocking alternative to create sockets, and depending on your requirements, you might consider the one or the other.

### Java Blocking IO

## Java NIO

`java.nio` is a non-blocking API for socket connections, which means you are not tight to the number of threads available. With this library, one thread can handle multiple connections at once.

![](images/nio_java.png)

Main elements:

- **Channel**: channels are a combination of input and output streams, so they allow you to read and write, and they use buffers to do these operations.
- **Buffer**: it is a block of memory used to read from a Channel and write into it. When you want to read data from a Buffer, you need to invoke `flip()`, so that it will set `pos` to `0`.
- **Selector**: A Selector can register multiple Channels and will check which ones are ready for accepting new connections. Similar to `accept()` method of blocking IO, when `select()` is invoked, it will block the application until a Channel is ready to do an operation. Because a Selector can register many channels, only one thread is required to handle multiple connections.
- **Selection Key**: It contains properties for a particular Channel (interest set, ready set, selector/channel, and an optional attached object). Selection keys are mainly used to know the current interest of the channel (`isAcceptable()`, `isReadable()`, `isWritable()`), get the channel and do operations with that channel.

## Reference

- [Java IO and NIO](https://dzone.com/articles/java-io-and-nio) 这篇文章写的好
