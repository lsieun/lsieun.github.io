---
title: "SocketChannel"
sequence: "102"
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
Each `SocketChannel` is associated with a peer `Socket` object
that can be used for advanced configuration,
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

You might choose this more roundabout approach
in order to **configure various options** on the channel and/or the socket before connecting.
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
Finally, if the connection could not be established, for instance because the network is down, this method throws an exception.

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
When it encounters the end of stream,
the channel fills the buffer with any remaining bytes and then returns `-1` on the next call to `read()`.
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

To fill an array of buffers, just loop while the last buffer in the list has space remaining. For example:

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
which drains it while copying the data onto the output—pretty much the reverse of the reading process.

The basic `write()` method takes a single buffer as an argument:

```text
public abstract int write(ByteBuffer src) throws IOException
```

As with reads (and unlike `OutputStream`s),
this method is **not guaranteed** to write **the complete contents of the buffer** if the channel is nonblocking.
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

The first variant drains all the buffers. The second method drains `length` buffers, starting with the one at `offset`.

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
`true` if it's open (`close()` and `isOpen()` are the only two methods
declared in the `Channel` interface and shared by all channel classes).

Starting in Java 7, `SocketChannel` implements `AutoCloseable`, so you can use it in try-with-resources.
