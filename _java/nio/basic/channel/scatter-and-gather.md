---
title: "Scatter/Gather"
sequence: "111"
---

[UP](/java-nio.html)


**Channels** provide an important new capability known as **scatter/gather** (referred to in some circles as vectored I/O).
Scatter/gather is a simple yet powerful concept.
It refers to performing **a single I/O operation** across **multiple buffers**.

> channel支持scatter/gather操作

For a **write operation**, data is gathered (drained) from several buffers in turn and sent along the channel.
The buffers do not need to have the same capcity (and they usually don't).
The effect is the same as if the content of all the buffers was concatenated into one large buffer before being sent.

> write

For **reads**, the data read from the channel is scattered to **multiple buffers** in sequence,
filling each to its limit, until the data from the channel or the total buffer space is exhausted.

> read

Most modern operating systems support **native vectored I/O**.
When you request a **scatter/gather operation** on a **channel**,
the request will be translated into appropriate **native calls** to fill or drain the buffers directly.
This is a big win, because **buffer copies** and **system calls** are reduced or eliminated.
**Scatter/gather** should be used with **direct `ByteBuffer`s** to gain the greatest advantage from **native I/O**,
especially if the **buffers** are long-lived.

> scatter/gather和direct buffer更搭配

```java
public interface ScatteringByteChannel extends ReadableByteChannel {
    public long read(ByteBuffer[] dsts, int offset, int length) throws IOException;
    public long read(ByteBuffer[] dsts) throws IOException;
}
```

```java
public interface GatheringByteChannel extends WritableByteChannel {
    public long write(ByteBuffer[] srcs, int offset, int length) throws IOException;
    public long write(ByteBuffer[] srcs) throws IOException;
}
```

You can see that each interface adds two new methods that take an array of buffers as arguments.
Also, each method provides a form that takes an `offset` and `length`.
Let's understand first how to use the simple form.

In the code below, let's assume that channel is connected to a socket that has 48 bytes ready to read:

```text
ByteBuffer header = ByteBuffer.allocateDirect(10);
ByteBuffer body = ByteBuffer.allocateDirect(80);
ByteBuffer[] buffers = {header, body};
int bytesRead = channel.read(buffers);
```

Upon returning from `read()`, `bytesRead` holds the value `48`,
the `header` buffer contains the first 10 bytes read from the channel,
and `body` holds the following 38 bytes.
The channel automatically scattered the data into the two buffers.
The buffers have been filled (although in this case `body` has room for more)
and will need to be flipped to make them ready for draining.
In a case like this, we may not bother flipping the header buffer
but access it randomly with absolute gets to check various header fields.
The `body` buffer can be flipped and passed to the `write()` method of another channel to send it on its way.

Just as easily, we can assemble data in **multiple buffers** to be sent in one gather operation.
Using the same buffers, we could put together and send packets on a socket channel like this:

```text
body.clear();
body.put("FOO".getBytes()).flip();   // "FOO" as bytes 

header.clear();
header.putShort(TYPE_FILE).putLong(body.limit()).flip();

long bytesWritten = channel.write(buffers);
```

```java
public interface ScatteringByteChannel extends ReadableByteChannel {
    public long read(ByteBuffer[] dsts, int offset, int length) throws IOException;
    public long read(ByteBuffer[] dsts) throws IOException;
}
```

```java
public interface GatheringByteChannel extends WritableByteChannel {
    public long write(ByteBuffer[] srcs, int offset, int length) throws IOException;
    public long write(ByteBuffer[] srcs) throws IOException;
}
```

The versions of `read()` and `write()` that take `offset` and `length` arguments
provide a way to use subsets of the buffers in an array of buffers.
The `offset` value in this case refers to which buffer to begin using,
not an offset into the data.
The `length` argument indicates the number of buffers to use.

For example, if we have a five-element array named `fiveBuffers`
that has already been initialized with references to five buffers,
the following code would write the content of the second, third, and fourth buffers:

```text
int bytesRead = channel.write (fiveBuffers, 1, 3);
```

**Scatter/gather can be an extraordinarily powerful tool when used properly.**
It allows you to delegate to the operating system the grunt work of separating out the data you read into multiple buckets,
or assembling disparate chunks of data into a whole.
This can be a huge win because the operating system is highly optimized for this sort of thing.
It saves you the work of moving things around, thereby avoiding buffer copies,
and reduces the amount of code you need to write and debug.
Since you are basically assembling data by providing references to data containers,
the various chunks can be assembled in different ways by building multiple arrays of buffer references in different combinations.
