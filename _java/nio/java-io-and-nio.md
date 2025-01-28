---
title: "Java IO and NIO"
sequence: "103"
---

[UP](/java-nio.html)


## Introduction

Sockets use TCP/IP transport protocol.
You do not usually have to deal with them since there are protocols built on top of them like HTTP or FTP;
however, it is important to know how they work.

> TCP: It is a reliable data transfer protocol that ensures that the data sent is complete and correct and requires to establish a connection.

Java offers a blocking and non-blocking alternative to create sockets,
and depending on your requirements, you might consider the one or the other.

## Java Blocking IO

## Java NIO

`java.nio` is a non-blocking API for socket connections,
which means you are not tight to the number of threads available.
With this library, one thread can handle multiple connections at once.

![](/assets/images/java/nio/server-socket-channel.png)

Main elements:

- **Channel**: channels are a combination of input and output streams,
  so they allow you to read and write, and they use buffers to do these operations.
- **Buffer**: it is a block of memory used to read from a `Channel` and write into it.
  When you want to read data from a `Buffer`, you need to invoke `flip()`, so that it will set `pos` to `0`.
- **Selector**: A `Selector` can register multiple `Channel`s and will check which ones are ready for accepting new connections.
  Similar to `accept()` method of blocking IO, when `select()` is invoked,
  it will block the application until a `Channel` is ready to do an operation.
  Because a `Selector` can register many channels, only one thread is required to handle multiple connections.
- **Selection Key**: It contains properties for a particular `Channel`
  (interest set, ready set, selector/channel, and an optional attached object).
  Selection keys are mainly used to know the current interest of the channel (`isAcceptable()`, `isReadable()`, `isWritable()`),
  get the channel and do operations with that channel.

## Reference

- [Java IO and NIO](https://dzone.com/articles/java-io-and-nio) 这篇文章写的好
