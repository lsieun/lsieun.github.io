---
title: "ServerSocketChannel"
sequence: "101"
---

[UP](/java-nio.html)


## ServerSocketChannel

The `ServerSocketChannel` class has one purpose: **to accept incoming connections**.
You **cannot read from, write to, or connect a** `ServerSocketChannel`.
The only operation it supports is accepting a new incoming connection.
The class itself **only declares four methods**, of which `accept()` is the most important.
`ServerSocketChannel` also **inherits several methods** from its superclasses,
mostly related to registering with a `Selector` for notification of incoming connections.
And finally, like all channels, it has a `close()` method that shuts down the server socket.

## Creating server socket channels

The static factory method `ServerSocketChannel.open()` creates a new `ServerSocketChannel` object.
However, the name is a little deceptive.
This method does not actually open a new server socket.
Instead, it just creates the object.
Before you can use it, you need to call the `socket()` method to get the corresponding peer `ServerSocket`.
At this point, you can **configure any server options** you like,
such as the receive buffer size or the socket timeout, using the various setter methods in `ServerSocket`.
Then connect this `ServerSocket` to a `SocketAddress` for the port you want to bind to.
For example, this code fragment opens a `ServerSocketChannel` on port 80:

```text
try {
    ServerSocketChannel serverChannel = ServerSocketChannel.open();
    ServerSocket socket = serverChannel.socket();
    SocketAddress address = new InetSocketAddress(80);
    socket.bind(address);
} catch (IOException ex) {
    System.err.println("Could not bind to port 80 because " + ex.getMessage());
}
```

In Java 7, this gets a little simpler because `ServerSocketChannel` now has a `bind()` method of its own:

```text
try {
    ServerSocketChannel server = ServerSocketChannel.open();
    SocketAddress address = new InetSocketAddress(80);
    server.bind(address);
} catch (IOException ex) {
    System.err.println("Could not bind to port 80 because " + ex.getMessage());
}
```

A factory method is used here rather than a constructor
so that different virtual machines can provide different implementations of this class,
more closely tuned to the local hardware and OS.
However, this factory is not user configurable.
The `open()` method always returns an instance of the same class when running in the same virtual machine.

## Accepting connections

Once you've opened and bound a `ServerSocketChannel` object, the `accept()` method can listen for incoming connections:

```text
public abstract SocketChannel accept() throws IOException
```

`accept()` can operate in either **blocking** or **nonblocking** mode.

### blocking mode

In **blocking mode**, the `accept()` method waits for an incoming connection.
It then accepts that connection and returns a `SocketChannel` object connected to the remote client.
The thread cannot do anything until a connection is made.
This strategy might be appropriate for simple servers that can respond to each request immediately.
**Blocking mode is the default**.

### nonblocking mode

A `ServerSocketChannel` can also operate in **nonblocking mode**.
In this case, the `accept()` method returns `null` if there are no incoming connections.
**Nonblocking mode is more appropriate for servers**
that need to do a lot of work for each connection and thus may want to process multiple requests in parallel.
**Nonblocking mode** is normally used in conjunction with a `Selector`.
To make a `ServerSocketChannel` nonblocking, pass `false` to its `configureBlocking()` method.

## 异常

The `accept()` method is declared to throw an `IOException` if anything goes wrong.
There are several subclasses of `IOException` that indicate more detailed problems,
as well as a couple of runtime exceptions:

- `ClosedChannelException`: You cannot reopen a `ServerSocketChannel` after closing it.
- `AsynchronousCloseException`: Another thread closed this `ServerSocketChannel` while `accept()` was executing.
- `ClosedByInterruptException`: Another thread interrupted this thread while a blocking `ServerSocketChannel` was waiting.
- `NotYetBoundException`: You called `open()` but did not bind the `ServerSocketChannel`'s peer `ServerSocket` to an address before calling `accept()`. This is a runtime exception, not an `IOException`.
- `SecurityException`: The security manager refused to allow this application to bind to the requested port.
