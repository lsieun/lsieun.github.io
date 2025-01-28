---
title: "Channel"
sequence: "101"
---

[UP](/java-nio.html)


Channels are the second major innovation of `java.nio`.
They are not an extension or enhancement, but a new, first-class Java I/O paradigm.
They provide direct connections to I/O services.
A `Channel` is a conduit that transports data efficiently between **byte buffers** and **the entity on the other end of the channel** (usually a file or socket).

> 这个地方，我想理解到，为什么Channel会快呢？是指的direct connections吗？

In most cases, **channels** have a one-to-one relationship with operating-system **file descriptors**, or **file handles**.
Although channels are more generalized than file descriptors,
most channels you will use on a regular basis are connected to open file descriptors.
The channel classes provide the abstraction needed to maintain platform independence
but still model the native I/O capabilities of modern operating systems.

> 这里讲了channel和file descriptor的关系

`Channel`s are gateways
through which the **native I/O services** of the operating system can be accessed with a minimum of overhead,
and **buffers** are the internal endpoints used by channels to send and receive data.

> Channel高效率的原因，可能就在于尽量贴近于native I/O的操作

## Channel Basics

First, let's take a closer look at the basic `Channel` interface.
This is the full source of the `Channel` interface:

```java
package java.nio.channels;

public interface Channel extends Closeable {
    public boolean isOpen();
    public void close() throws IOException;
}
```

Unlike buffers, the channel APIs are primarily specified by interfaces.
Channel implementations vary radically between operating systems,
so the channel APIs simply describe what can be done.
**`Channel` implementations often use native code**, so this is only natural.
**The channel interfaces allow you to gain access to low-level I/O services in a controlled and portable way.**

> Channel是接口，它的实现是使用native code来完成的

As you can see by the top-level Channel interface, there are only two operations common to all channels:
checking to see if a channel is open (`isOpen()`) and closing an open channel (`close()`).

The `InterruptibleChannel` interface is a marker that, when implemented by a channel,
indicates that the channel is interruptible.
Interruptible channels behave in specific ways when a thread accessing them is interrupted.
**Most, but not all, channels are interruptible.**

> interruptible是从thread的角度来考虑问题

```java
package java.nio.channels;

public interface InterruptibleChannel extends Channel {
    public void close() throws IOException;
}
```

The other interfaces extending `Channel` are the byte-oriented subinterfaces
`WritableByteChannel` and `ReadableByteChannel`.
This supports what we learned earlier: **channels operate only on byte buffers.**
The structure of the hierarchy implies that channels for other data types could also extend from `Channel`.
This is good class design, but nonbyte implementations are unlikely because operating systems do low-level I/O in terms of bytes.

```java
package java.nio.channels;

public interface WritableByteChannel extends Channel {
    public int write(ByteBuffer src) throws IOException;
}
```

```java
package java.nio.channels;

public interface ReadableByteChannel extends Channel {
    public int read(ByteBuffer dst) throws IOException;
}
```

Two of the classes in this family tree live in a different package, `java.nio.channels.spi`.
These classes, `AbstractInterruptibleChannel` and `AbstractSelectableChannel`,
provide the common methods needed by channel implementations
that are interruptible or selectable, respectively.
Although the interfaces describing channel behaviors are defined in the `java.nio.channels` package,
the concrete implementations extend from classes in `java.nio.channels.spi`.
This allows them access to protected methods that normal users of channels should never invoke.

> 这里引入了SPI的内容

As a user of channels, you can safely ignore the intermediate classes in the SPI package.
The somewhat convoluted inheritance hierarchy is of interest only to those implementing new channels.
The SPI package allows new channel implementations to be plugged into the JVM in a controlled and modular way.
This means channels optimized for a particular operating system, filesystem, or application can be dropped in to maximize performance.

> 进一步介绍SPI的内容

## Opening Channels

Channels serve as conduits to I/O services.
As we discussed, I/O falls into two broad categories: file I/O and stream I/O.
So it's no surprise that there are two types of channels: file and socket.
There is one `FileChannel` class and three socket channel classes:
`SocketChannel`, `ServerSocketChannel`, and `DatagramChannel`.

```text
       ┌─── file I/O ─────┼─── FileChannel
       │
I/O ───┤                  ┌─── SocketChannel
       │                  │
       └─── stream I/O ───┼─── ServerSocketChannel
                          │
                          └─── DatagramChannel
```

**`Channel`s can be created in several ways.**
The socket channels have factory methods to create new socket channels directly.
But a `FileChannel` object can be obtained only by
calling the `getChannel()` method on an open `RandomAccessFile`, `FileInputStream`, or `FileOutputStream` object.
You cannot create a `FileChannel` object directly.

> 如何创建Channel对象

```text
SocketChannel sc = SocketChannel.open();
sc.connect(new InetSocketAddress("somehost", someport));

ServerSocketChannel ssc = ServerSocketChannel.open();
ssc.socket().bind(new InetSocketAddress(somelocalport));

DatagramChannel dc = DatagramChannel.open();

RandomAccessFile raf = new RandomAccessFile("somefile", "r");
FileChannel fc = raf.getChannel();
```

The socket classes of `java.net` have new `getChannel()` methods as well.
While these methods return a corresponding socket channel object,
they are not sources of new channels as `RandomAccessFile.getChannel()` is.
They return the channel associated with a socket if one already exists;
they never create new channels.

## Using Channels

Channels transfer data to and from `ByteBuffer` objects.

```java
package java.nio.channels;

public interface WritableByteChannel extends Channel {
    public int write(ByteBuffer src) throws IOException;
}
```

```java
package java.nio.channels;

public interface ReadableByteChannel extends Channel {
    public int read(ByteBuffer dst) throws IOException;
}
```

```java
package java.nio.channels;

public interface ByteChannel extends ReadableByteChannel, WritableByteChannel {
}
```

**Channels can be unidirectional or bidirectional.**
A given channel class might implement `ReadableByteChannel`, which defines the `read()`  method.
Another might implement `WritableByteChannel` to provide `write()`.
A class implementing one or the other of these interfaces is **unidirectional**: it can transfer data in only one direction.
If a class implements both interfaces, it is **bidirectional** and can transfer data in both directions.

The `ByteChannel` interface extends both `ReadableByteChannel` and `WritableByteChannel`.
`ByteChannel` doesn't declare any new API methods;
it's a convenience interface that aggregates the multiple interfaces it inherits under a new name.
By definition, a channel that implements `ByteChannel` implements both `ReadableByteChannel` and `WritableByteChannel`
and is therefore bidirectional.
This is syntactic sugar to simplify class definitions and
make it easier to test channel objects with the `instanceof` operator.

This is good class design technique, and if you were writing your own `Channel` implementation,
you would implement these interfaces as appropriate.
But it turns out that they are not of much interest to someone using the standard channel classes of the `java.nio.channels` package.
Each of the file and socket channels implement all three of these interfaces.
In terms of class definition, this means that **all file and socket channel objects are bidirectional**.
This is not a problem for sockets because they're always bidirectional, but it is an issue for files.

As you know, a given file can be opened with different permissions at different times.
A `FileChannel` object obtained from the `getChannel()` method of a `FileInputStream` object
is read-only but is bidirectional in terms of interface declarations because `FileChannel` implements `ByteChannel`.
Invoking `write()` on such a channel will throw the unchecked `NonWritableChannelException`
because `FileInputStream` always opens files with **read-only permission**.

> 从FileInputStream得到的FileChannel是单向的

It's important to keep in mind that **a channel connects to a specific I/O service**,
and **the capabilities of a given channel instance will be constrained by the characteristics of the service** to which it's connected.
A `Channel` instance connected to a read-only file cannot write,
even though the class to which that channel instance belongs may have a `write()` method.
It falls to the programmer to know how the channel was opened and
not to attempt an operation the underlying I/O service won't allow.

> Channel要依赖于I/O Service，因此要受到I/O Service的限制。

```text
// A ByteBuffer named buffer contains data to be written 

FileInputStream input = new FileInputStream(fileName);
FileChannel channel = input.getChannel();

// This will compile but will throw an IOException 
// because the underlying file is read-only 
channel.write(buffer);
```

`Channel` instances may not allow `read()` or `write()`, depending on the access mode(s) of the **underlying file handle**.

```java
package java.nio.channels;

public interface WritableByteChannel extends Channel {
    public int write(ByteBuffer src) throws IOException;
}
```

```java
package java.nio.channels;

public interface ReadableByteChannel extends Channel {
    public int read(ByteBuffer dst) throws IOException;
}
```

```java
package java.nio.channels;

public interface ByteChannel extends ReadableByteChannel, WritableByteChannel {
}
```

The `read()` and `write()` methods of `ByteChannel` take `ByteBuffer` objects as arguments.
Each returns the number of bytes transferred, which can be less than the number of bytes in the buffer, or even zero.
The `position` of the buffer will have been advanced by the same amount.
If a partial transfer was performed,
the buffer can be resubmitted to the channel to continue transferring data where it left off.
Repeat until the buffer's `hasRemaining()` method returns `false`.


```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        ReadableByteChannel src = Channels.newChannel(System.in);
        WritableByteChannel dst = Channels.newChannel(System.out);

        channelCopy1(src, dst);
        // alternatively, call
        // channelCopy2 (src, dest);

        src.close();
        dst.close();
    }

    private static void channelCopy1(ReadableByteChannel src, WritableByteChannel dst) throws IOException {
        ByteBuffer buffer = ByteBuffer.allocateDirect(16 * 1024);

        while (src.read(buffer) != -1) {
            // Prepare the buffer to be drained
            buffer.flip();

            // Write to the channel; may block
            dst.write(buffer);

            // If partial transfer, shift remainder down
            // If buffer is empty, same as doing clear()
            buffer.compact();
        }

        // EOF will leave buffer in fill state
        buffer.flip();

        // Make sure that the buffer is fully drained
        while (buffer.hasRemaining()) {
            dst.write(buffer);
        }
    }

    private static void channelCopy2(ReadableByteChannel src, WritableByteChannel dst) throws IOException {
        ByteBuffer buffer = ByteBuffer.allocateDirect(16 * 1024);

        while (src.read(buffer) != -1) {
            // Prepare the buffer to be drained
            buffer.flip();

            // Make sure that the buffer was fully drained
            while (buffer.hasRemaining()) {
                dst.write(buffer);
            }
            // Make the buffer empty, ready for filling
            buffer.clear();
        }
    }
}
```

**Channels can operate in blocking or nonblocking modes.**
A channel in **nonblocking mode** never puts the invoking thread to sleep.
The requested operation either completes immediately or returns a result indicating that nothing was done.
**Only stream-oriented channels, such as sockets and pipes, can be placed in nonblocking mode.**

> 这里讲Channel的两种模式

The socket channel classes extend from `SelectableChannel`.
Classes extending from `SelectableChannel` can be used with `Selector`s, which enable readiness selection.
**Combining nonblocking I/O with selectors allows your application to exploit multiplexed I/O.**

## Closing Channels

Unlike **buffers**, **channels cannot be reused.**
An open channel represents a specific connection to a specific I/O service
and encapsulates the state of that connection.
When a channel is closed, that connection is lost, and the channel is no longer connected to anything.

```java
package java.nio.channels;

public interface Channel extends Closeable {
    public boolean isOpen();
    public void close() throws IOException;
}
```

Calling a channel's `close()` method might cause the thread to block briefly
while the channel finalizes the closing of the underlying I/O service, even if the channel is in nonblocking mode.
Blocking behavior when a channel is closed,
if any, is highly operating system- and filesystem-dependent.
It's harmless to call `close()` on a channel multiple times,
but if the first thread has blocked in `close()`,
any additional threads calling `close()` block until the first thread has completed closing the channel.
Subsequent calls to `close()` on the closed channel do nothing and return immediately.

The open state of a channel can be tested with the `isOpen()` method.
If it returns `true`, the channel can be used.
If `false`, the channel has been closed and can no longer be used.
Attempting to read, write, or perform any other operation
that requires the channel to be in an open state will result in a `ClosedChannelException`.

Channels introduce **some new behaviors** related to **closing** and **interrupts**.
If a channel implements the `InterruptibleChannel` interface, then it's subject to the following semantics.
If a thread is blocked on a channel, and that thread is interrupted
(by another thread calling the blocked thread's `interrupt()` method),
the channel will be closed, and the blocked thread will be sent a `ClosedByInterruptException`.

Additionally, if a thread's **interrupt status** is set, and that thread attempts to access a channel,
the channel will immediately be closed, and the same exception will be thrown.
A thread's **interrupt status** is set when its `interrupt()` method is called.
A thread's current **interrupt status** can be tested with the `isInterrupted()` method.
The **interrupt status** of the current thread can be cleared by calling the static `Thread.interrupted()` method.

> 这里讲了thread的interrupt status

Don't confuse interrupting **threads sleeping on Channels** with **those sleeping on Selectors**.
The former shuts down the channel; the latter does not.
However, your thread's **interrupt status** will be set if it is interrupted while sleeping on a `Selector`.
If that thread then touches a `Channel`, that channel will be closed.

> 这里讲thread在channel上sleep 和 thread在selector上sleep的区别

It may seem rather draconian(严酷的；残忍的) to shut down a channel just because a thread sleeping on that channel was interrupted.
But this is an explicit design decision made by the NIO architects.
Experience has shown that **it's impossible to reliably handle interrupted I/O operations consistently across all operating systems.**
**The requirement to provide deterministic channel behavior on all platforms
led to the design choice of always closing channels when I/O operations are interrupted.**
This was deemed acceptable, because a thread is most often interrupted so it can be told to shut down.
The `java.nio` package mandates this behavior to avoid the quagmire(泥沼；困境) of operating-system peculiarities,
which is especially treacherous(有潜在危险的) in this area.
This is a classic trade-off of features for **robustness**.

> 这里是进行解释，为什么thread被interrupt之后会关闭channel？

Interruptible channels are also asynchronously closable.
A channel that implements `InterruptibleChannel` can be closed at any time,
even if another thread is blocked waiting for an I/O to complete on that channel.
When a channel is closed,
any threads sleeping on that channel will be awakened and receive an `AsynchronousCloseException`.
The channel will then be closed and will be no longer usable.

> 一个channel被关闭，所有在该channel上sleep的thread都会接收到AsynchronousCloseException

```java
package java.nio.channels;

public interface InterruptibleChannel extends Channel {
    public void close() throws IOException;
}
```

Channels that don't implement `InterruptibleChannel` are typically special-purpose channels
without low-level, native-code implementations.
These may be special-purpose channels that never block,
wrappers around legacy streams, or writer classes for which these interruptible semantics cannot be implemented.
