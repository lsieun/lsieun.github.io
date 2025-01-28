---
title: "Channels"
sequence: "101"
---

[UP](/java-nio.html)


**Channels** move **blocks of data** into and out of **buffers** to and from various I/O sources
such as **files**, **sockets**, **datagrams**, and so forth.
The channel class hierarchy is rather convoluted, with multiple interfaces and many optional operations.
However, for purposes of **network programming** there are only **three really important channel classes**,
`SocketChannel`, `ServerSocketChannel`, and `DatagramChannel`;
and for the TCP connections we've talked about so far you only need the first two.

## SocketChannel

The `SocketChannel` class reads from and writes to **TCP sockets**.
The data must be encoded in `ByteBuffer` objects for reading and writing.
Each `SocketChannel` is associated with a peer `Socket` object that can be used for advanced configuration,
but this requirement can be ignored for applications where the default options are fine.

> Socket（原始） --> SocketChannel（封装） --> ByteBuffer（数据）

### Connecting

The `SocketChannel` class **does not have any public constructors**.
Instead, you create a new `SocketChannel` object using one of the two static `open()` methods:

```text
public static SocketChannel open(SocketAddress remote) throws IOException
public static SocketChannel open() throws IOException
```

**The first variant makes the connection**.
This method blocks (i.e., the method will not return until the connection is made or an exception is thrown).
For example:

```text
SocketAddress address = new InetSocketAddress("www.cafeaulait.org", 80);
SocketChannel channel = SocketChannel.open(address);
```

**The noargs version does not immediately connect**.
It creates an initially unconnected socket that must be connected later using the `connect()` method.
For example:

```text
SocketChannel channel = SocketChannel.open();
SocketAddress address = new InetSocketAddress("www.cafeaulait.org", 80);
channel.connect(address);
```

You might choose this more roundabout approach in order to
**configure various options** on the channel and/or the socket before connecting.
Specifically, use this approach if you want to open the channel **without blocking**:

```text
SocketChannel channel = SocketChannel.open();
SocketAddress address = new InetSocketAddress("www.cafeaulait.org", 80);
channel.configureBlocking(false);
channel.connect();
```

With a **nonblocking channel**, the `connect()` method returns immediately, even before the connection is established.
The program can do other things while it waits for the operating system to finish the connection.
However, before it can actually use the connection, the program must call `finishConnect()`:

```text
public abstract boolean finishConnect() throws IOException
```

(This is only necessary in nonblocking mode. For a blocking channel, this method returns `true` immediately.)
If the connection is now ready for use, `finishConnect()` returns `true`.
If the connection has not been established yet, `finishConnect()` returns `false`.
Finally, if the connection could not be established,
for instance because the network is down, this method throws an exception.

If the program wants to check **whether the connection is complete**, it can call these two methods:

```text
public abstract boolean isConnected()
public abstract boolean isConnectionPending()
```

The `isConnected()` method returns `true` if the connection is open.
The `isConnectionPending()` method returns `true` if the connection is still being set up but is not yet open.

### Reading

To read from a `SocketChannel`, first create a `ByteBuffer` the channel can store data in.
Then pass it to the `read()` method:

```text
public abstract int read(ByteBuffer dst) throws IOException
```

The channel fills the buffer with as much data as it can, then returns the number of bytes it put there.
When it encounters the end of stream, the channel fills the buffer with any remaining bytes and
then returns `-1` on the next call to `read()`.
If the channel is blocking, this method will read at least one byte or return `-1` or throw an exception.
If the channel is nonblocking, however, this method may return `0`.

Because the data is stored into the buffer at the current `position`,
which is updated automatically as more data is added,
**you can keep passing the same buffer to the `read()` method until the buffer is filled**.
For example, this loop will read until **the buffer is filled** or **the end of stream is detected**:

```text
while (buffer.hasRemaining() && channel.read(buffer) != -1);
```

It is sometimes useful to be able to fill several buffers from one source.
This is called a **scatter**.
These two methods accept an array of `ByteBuffer` objects as arguments and fill each one in turn:

```text
public final long read(ByteBuffer[] dsts) throws IOException
public final long read(ByteBuffer[] dsts, int offset, int length) throws IOException
```

The first variant fills all the buffers.
The second method fills `length` buffers, starting with the one at `offset`.

To fill an array of buffers, just loop while the last buffer in the list has space remaining.
For example:

```text
ByteBuffer[] buffers = new ByteBuffer[2];
buffers[0] = ByteBuffer.allocate(1000);
buffers[1] = ByteBuffer.allocate(1000);

while (buffers[1].hasRemaining() && channel.read(buffers) != -1);
```

### Writing

Socket channels have both read and write methods.
In general, they are full duplex.
In order to write, simply fill a `ByteBuffer`, flip it, and pass it to one of the `write` methods,
which drains it while copying the data onto the output — pretty much the reverse of the reading process.

The basic `write()` method takes a single buffer as an argument:

```text
public abstract int write(ByteBuffer src) throws IOException
```

As with reads (and unlike `OutputStream`s), this method is **not guaranteed** to
write **the complete contents of the buffer** if the channel is nonblocking.
Again, however, the cursor-based nature of buffers enables you to easily call this method again and again
until **the buffer is fully drained** and **the data has been completely written**:

```text
while (buffer.hasRemaining() && channel.write(buffer) != -1);
```

It is often useful to be able to write **data from several buffers** onto one socket.
This is called a **gather**.
For example, you might want to store the HTTP header in one buffer and the HTTP body in another buffer.
The implementation might even fill the two buffers simultaneously using two threads or overlapped I/O.
These two methods accept an array of `ByteBuffer` objects as arguments, and drain each one in turn:

```text
public final long write(ByteBuffer[] dsts) throws IOException
public final long write(ByteBuffer[] dsts, int offset, int length) throws IOException
```

The first variant drains all the buffers.
The second method drains `length` buffers, starting with the one at `offset`.

### Closing

Just as with regular sockets, you should close a channel
when you're done with it to free up the port and any other resources it may be using:

```text
public void close() throws IOException
```

Closing an already closed channel has no effect.
Attempting to write data to or read data from a closed channel throws an exception.
If you're uncertain whether a channel has been closed, check with `isOpen()`:

```text
public boolean isOpen()
```

Naturally, this returns `false` if the channel is closed,
`true` if it's open (`close()` and `isOpen()` are the only two methods declared in the `Channel` interface
and shared by all channel classes).

Starting in Java 7, `SocketChannel` implements `AutoCloseable`, so you can use it in try-with-resources.

## ServerSocketChannel

The `ServerSocketChannel` class has one purpose: **to accept incoming connections**.
You **cannot read from, write to, or connect a** `ServerSocketChannel`.
The only operation it supports is accepting a new incoming connection.
The class itself **only declares four methods**, of which `accept()` is the most important.
`ServerSocketChannel` also **inherits several methods** from its superclasses,
mostly related to registering with a `Selector` for notification of incoming connections.
And finally, like all channels, it has a `close()` method that shuts down the server socket.

### Creating server socket channels

The static factory method `ServerSocketChannel.open()` creates a new `ServerSocketChannel` object.
However, the name is a little deceptive.
This method does not actually open a new server socket.
Instead, it just creates the object.
Before you can use it, you need to call the `socket()` method to get the corresponding peer `ServerSocket`.
At this point, you can **configure any server options** you like,
such as the receive buffer size or the socket timeout,
using the various setter methods in `ServerSocket`.
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

### Accepting connections

Once you've opened and bound a `ServerSocketChannel` object, the `accept()` method can listen for incoming connections:

```text
public abstract SocketChannel accept() throws IOException
```

`accept()` can operate in either **blocking** or **nonblocking** mode.
In **blocking mode**, the `accept()` method waits for an incoming connection.
It then accepts that connection and returns a `SocketChannel` object connected to the remote client.
The thread cannot do anything until a connection is made.
This strategy might be appropriate for simple servers that can respond to each request immediately.
**Blocking mode is the default**.

A `ServerSocketChannel` can also operate in **nonblocking mode**.
In this case, the `accept()` method returns `null` if there are no incoming connections.
**Nonblocking mode is more appropriate for servers** that need to do a lot of work for each connection and
thus may want to process multiple requests in parallel.
**Nonblocking mode** is normally used in conjunction with a `Selector`.
To make a `ServerSocketChannel` nonblocking, pass `false` to its `configureBlocking()` method.

The `accept()` method is declared to throw an `IOException` if anything goes wrong.
There are several subclasses of `IOException` that indicate more detailed problems,
as well as a couple of runtime exceptions:

- `ClosedChannelException`: You cannot reopen a `ServerSocketChannel` after closing it.
- `AsynchronousCloseException`: Another thread closed this `ServerSocketChannel` while `accept()` was executing.
- `ClosedByInterruptException`: Another thread interrupted this thread while a blocking `ServerSocketChannel` was waiting.
- `NotYetBoundException`: You called `open()` but did not bind the `ServerSocketChannel`'s peer `ServerSocket` to an address before calling `accept()`. This is a runtime exception, not an `IOException`.
- `SecurityException`: The security manager refused to allow this application to bind to the requested port.

## The Channels Class

`Channels` is a simple utility class for wrapping **channels** around traditional I/O-based
**streams**, **readers**, and **writers**, and vice versa.
It's useful when you want to use the new I/O model in one part of a program for performance,
but still interoperate with legacy APIs that expect streams.
It has methods that convert from **streams** to **channels** and
methods that convert from **channels** to **streams**, **readers**, and **writers**:

```text
public static InputStream newInputStream(ReadableByteChannel ch)
public static OutputStream newOutputStream(WritableByteChannel ch)
public static ReadableByteChannel newChannel(InputStream in)
public static WritableByteChannel newChannel(OutputStream out)
public static Reader newReader (ReadableByteChannel channel, CharsetDecoder decoder, int minimumBufferCapacity)
public static Reader newReader (ReadableByteChannel ch, String encoding)
public static Writer newWriter (WritableByteChannel ch, String encoding)
```

The `SocketChannel` class implements both the `ReadableByteChannel` and `WritableByteChannel` interfaces.
`ServerSocketChannel` implements neither of these because you can't read from or write to it.

For example, all current XML APIs use **streams**, **files**, **readers**,
and other traditional I/O APIs to read the XML document.
If you're writing an HTTP server designed to process SOAP requests,
you may want to read the HTTP request bodies using **channels** and parse the XML using SAX for performance.
In this case, you'd need to convert these **channels** into **streams**
before passing them to `XMLReader`'s `parse()` method:

```text
SocketChannel channel = server.accept();
processHTTPHeader(channel);
XMLReader parser = XMLReaderFactory.createXMLReader();
parser.setContentHandler(someContentHandlerObject);
InputStream in = Channels.newInputStream(channel);
parser.parse(in);
```

## Asynchronous Channels (Java 7)

Java 7 introduces the `AsynchronousSocketChannel` and `AsynchronousServerSocketChannel` classes.
These behave like and have almost the same interface as `SocketChannel` and `ServerSocketChannel`
(though they are not subclasses of those classes).
However, unlike `SocketChannel` and `ServerSocketChannel`,
reads from and writes to asynchronous channels return immediately, even before the I/O is complete.
The data read or written is further processed by a `Future` or a `CompletionHandler`.
The `connect()` and `accept()` methods also execute asynchronously and return `Future`s.
`Selector`s are not used.
