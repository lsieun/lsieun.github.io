---
title: "Asynchronous Channels (Java 7)"
sequence: "109"
---

[UP](/java-nio.html)


Java 7 introduces the `AsynchronousSocketChannel` and `AsynchronousServerSocketChannel` classes.
These behave like and have almost the same interface as `SocketChannel` and `ServerSocketChannel`
(though they are not subclasses of those classes).
However, unlike `SocketChannel` and `ServerSocketChannel`,
reads from and writes to asynchronous channels return immediately, even before the I/O is complete.
The data read or written is further processed by a `Future` or a `CompletionHandler`.
The `connect()` and `accept()` methods also execute asynchronously and return `Future`s.
`Selector`s are not used.
