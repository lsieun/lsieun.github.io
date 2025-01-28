---
title: "java.nio.ByteBuffer"
sequence: "102"
---

[UP](/java-nio.html)


```text
                                                            ┌─── allocate(int capacity)
                                         ┌─── allocation ───┤
                                         │                  └─── allocateDirect(int capacity)
                   ┌─── create ──────────┤
                   │                     │                  ┌─── wrap(byte[] array)
                   │                     └─── wrapping ─────┤
                   │                                        └─── wrap(byte[] array, int offset, int length)
                   │
                   │                                   ┌─── isDirect()
                   │                     ┌─── is ──────┤
                   │                     │             └─── isReadOnly()
                   │                     │
                   │                     │             ┌─── hasArray()
                   │                     │             │
                   ├─── data ────────────┼─── array ───┼─── array()
                   │                     │             │
                   │                     │             └─── arrayOffset()
                   │                     │
                   │                     │             ┌─── order()
                   │                     └─── order ───┤
                   │                                   └─── order(ByteOrder bo)
                   │
                   ├─── index ───────────┼─── compact()
                   │
                   │                                                   ┌─── get()
                   │                                                   │
                   │                                                   ├─── put(byte b)
                   │                                    ┌─── single ───┤
                   │                                    │              ├─── get(int index)
                   │                                    │              │
                   │                                    │              └─── put(int index, byte b)
                   │                     ┌─── byte ─────┤
                   │                     │              │              ┌─── get(byte[] dst)
                   │                     │              │              │
                   │                     │              │              ├─── get(byte[] dst, int offset, int length)
                   │                     │              │              │
                   │                     │              └─── bulk ─────┼─── put(byte[] src)
                   │                     │                             │
                   │                     │                             ├─── put(byte[] src, int offset, int length)
                   │                     │                             │
                   │                     │                             └─── put(ByteBuffer src)
                   │                     │
                   │                     │              ┌─── getChar()
                   │                     │              │
                   │                     │              ├─── putChar(char value)
                   │                     ├─── char ─────┤
                   │                     │              ├─── getChar(int index)
                   │                     │              │
                   │                     │              └─── putChar(int index, char value)
                   │                     │
                   │                     │              ┌─── getShort()
     ByteBuffer ───┤                     │              │
                   │                     │              ├─── putShort(short value)
                   │                     ├─── short ────┤
                   │                     │              ├─── getShort(int index)
                   │                     │              │
                   │                     │              └─── putShort(int index, short value)
                   │                     │
                   ├─── transfer data ───┤              ┌─── int getInt()
                   │                     │              │
                   │                     │              ├─── putInt(int value)
                   │                     ├─── int ──────┤
                   │                     │              ├─── getInt(int index)
                   │                     │              │
                   │                     │              └─── putInt(int index, int value)
                   │                     │
                   │                     │              ┌─── getLong()
                   │                     │              │
                   │                     │              ├─── putLong(long value)
                   │                     ├─── long ─────┤
                   │                     │              ├─── getLong(int index)
                   │                     │              │
                   │                     │              └─── putLong(int index, long value)
                   │                     │
                   │                     │              ┌─── getFloat()
                   │                     │              │
                   │                     │              ├─── putFloat(float value)
                   │                     ├─── float ────┤
                   │                     │              ├─── getFloat(int index)
                   │                     │              │
                   │                     │              └─── putFloat(int index, float value)
                   │                     │
                   │                     │              ┌─── getDouble()
                   │                     │              │
                   │                     │              ├─── putDouble(double value)
                   │                     └─── double ───┤
                   │                                    ├─── getDouble(int index)
                   │                                    │
                   │                                    └─── putDouble(int index, double value)
                   │
                   │                                              ┌─── duplicate()
                   │                                              │
                   │                     ┌─── ByteBuffer ─────────┼─── slice()
                   │                     │                        │
                   │                     │                        └─── asReadOnlyBuffer()
                   │                     │
                   │                     ├─── asCharBuffer()
                   │                     │
                   │                     ├─── asShortBuffer()
                   └─── view ────────────┤
                                         ├─── asIntBuffer()
                                         │
                                         ├─── asLongBuffer()
                                         │
                                         ├─── asFloatBuffer()
                                         │
                                         └─── asDoubleBuffer()
```

## Intro

There are buffer classes for all the primitive data types (except `boolean`),
but **byte buffers (`ByteBuffer`) have characteristics not shared by the others.**

**Bytes are the fundamental data unit** used by the operating system and its I/O facilities.
When moving data between the **JVM** and the **operating system**,
it's necessary to break down the other data types into their constituent bytes.
The byte-oriented nature of system-level I/O can be felt
throughout the design of buffers and the services with which they interact.

> 为什么byte类型是重要的

Look at a `ByteBuffer` as providing a **view** into some (undefined) underlying storage of bytes.

A `ByteBuffer` is more like a builder(例如，StringBuilder).
It creates a `byte[]`.
Unlike arrays, it has **more convenient helper methods**.
It's not that straightforward in terms of usage.

> ByteBuffer与byte[]相比，有哪些优点呢？

`ByteBuffer` is among several buffers provided by Java NIO.
Its just a **container** or **holding tank** to read data from or write data to.

```java
import java.io.IOException;
import java.nio.ByteBuffer;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        // 第一步，创建ByteBuffer
        ByteBuffer buffer = ByteBuffer.allocate(10);

        // 第二步，填充数据（fill）
        buffer.put((byte) 0xCA);
        buffer.put((byte) 0xFE);
        buffer.put((byte) 0xBA);
        buffer.put((byte) 0xBE);

        // 第三步，转换状态（fill ---> drain）
        buffer.flip();

        // 第四步，消耗数据（drain）
        int limit = buffer.limit();
        for (int i = 0; i < limit; i++) {
            byte b = buffer.get();
            System.out.println(b);
        }
    }
}
```

这个过程，与“饮水机”的工作方式相类似：

- 第一步，创建ByteBuffer，相当于有一个水桶
- 第二步，填充数据（fill），相当于给水桶注水
- 第三步，第三步，转换状态（fill ---> drain），相当于把水桶放到饮水机上
- 第四步，消耗数据（drain），相当于取水的过程
- 第五步，调用`clear()`或`compact()`方法，对水桶（buffer）进行重新使用

## ByteBuffer Creation

`ByteBuffer`是一个`abstract`类，因此不能直接创建对象。

```java
public abstract class ByteBuffer extends Buffer implements Comparable<ByteBuffer> {
}
```

There are seven primary buffer classes, one for each of the nonboolean primitive data types in the Java language.

```text
          ┌─── DoubleBuffer
          │
          ├─── FloatBuffer
          │
          ├─── LongBuffer
          │
Buffer ───┼─── IntBuffer
          │
          ├─── ShortBuffer
          │
          ├─── CharBuffer
          │
          │                    ┌─── HeapByteBuffer
          └─── ByteBuffer ─────┤
                               └─── MappedByteBuffer
```

None of these classes can be instantiated directly.
They are all abstract classes,
but each contains static factory methods to create new instances of the appropriate class.

For this discussion, we'll use the `CharBuffer` class as an example,
but the same applies to the other six primary buffer classes:
`IntBuffer`, `DoubleBuffer`, `ShortBuffer`, `LongBuffer`, `FloatBuffer`, and `ByteBuffer`.
Here are the key methods for creating buffers, common to all of the buffer classes (substitute class names as appropriate):

```java
public abstract class ByteBuffer extends Buffer implements Comparable<ByteBuffer> {
    public static ByteBuffer allocate(int capacity);

    public static ByteBuffer wrap(byte[] array);
    public static ByteBuffer wrap(byte[] array, int offset, int length);

    public final boolean hasArray();
    public final byte[] array();
    public final int arrayOffset();
}
```

New buffers are created by either **allocation** or **wrapping**.
**Allocation** creates a buffer object and allocates private space to hold `capacity` data elements.
**Wrapping** creates a buffer object but does not allocate any space to hold the data elements.
It uses the array you provide as backing storage to hold the data elements of the buffer.

### Allocation

To allocate a `ByteBuffer` capable of holding 100 bytes:

```text
ByteBuffer byteBuffer = ByteBuffer.allocate(100);
```

This implicitly allocates a `byte` array from the heap to act as backing store for the 100 bytes.

If you want to provide your own array to be used as the buffer's backing store, call the `wrap()` method:

```text
byte[] myArray = new byte[100];
ByteBuffer byteBuffer = ByteBuffer.wrap(myArray);
```

```text
mark: -1       position: 0        limit: 100       capacity: 100
```

This constructs a new buffer object, but the data elements will live in the array.
This implies that changes made to the buffer by invoking `put()` will be reflected in the array,
and any changes made directly to the array will be visible to the buffer object.

```text
public static ByteBuffer wrap(byte[] array, int offset, int length);
```

The version of `wrap()` that takes `offset` and `length` arguments will construct a buffer
with the `position` and `limit` set according to the `offset` and `length` values you provide. Doing this:

```text
byte[] myArray = new byte[100];
ByteBuffer byteBuffer = ByteBuffer.wrap(myArray, 12, 42);
BufferUtils.printIndex(byteBuffer);
```

```text
mark: -1       position: 12       limit: 54       capacity: 100      offset: 0
```

**This method does not, as you might expect, create a buffer that occupies only a subrange of the array.
The buffer will have access to the full extent of the array;**
the `offset` and `length` arguments only set the initial state.
Calling `clear()` on a buffer created this way and then filling it to its `limit` will overwrite all elements of the array.

```text
byte[] myArray = new byte[100];
ByteBuffer byteBuffer = ByteBuffer.wrap(myArray, 12, 42);
byteBuffer.clear();
BufferUtils.printIndex(byteBuffer);
```

```text
mark: -1       position: 0        limit: 100      capacity: 100      offset: 0
```

The `slice()` method can produce a buffer that occupies only part of a backing array.

```text
byte[] myArray = new byte[100];
ByteBuffer byteBuffer = ByteBuffer.wrap(myArray, 12, 42);
ByteBuffer slicedBuffer = byteBuffer.slice();
BufferUtils.printIndex(slicedBuffer);
```

```text
mark: -1       position: 0        limit: 42       capacity: 42       offset: 12       length: 100
```

### wrap

Creating a `ByteBuffer` by wrapping an existing `byte[]`:

```java
import java.io.IOException;
import java.nio.ByteBuffer;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        // 准备工作
        byte[] src = new byte[26];
        for (int i = 0; i < 26; i++) {
            src[i] = (byte) ('A' + i);
        }

        // 第一步，创建ByteBuffer
        ByteBuffer buffer = ByteBuffer.wrap(src);

        // 第二步，填充数据（fill）--- 不需要

        // 第三步，转换状态（fill ---> drain）--- 不需要

        // 第四步，消耗数据（drain）
        int limit = buffer.limit();
        for (int i = 0; i < limit; i++) {
            byte b = buffer.get();
            System.out.println((char) b);
        }
    }
}
```

## Index

### compact

```text
                                ┌─── clear()  : limit = capacity,  position =         0, mark = -1
                                │
                                ├─── flip()   : limit = position,  position =         0, mark = -1
clear, flip, rewind, compact ───┤
                                ├─── rewind() :                    position =         0, mark = -1
                                │
                                └─── compact(): limit = capacity,  position = remaining, mark = -1
```

**Occasionally, you may wish to drain some, but not all, of the data from a buffer, then resume filling it.**
To do this, the unread data elements need to be shifted down so that the first element is at index zero.
While this could be inefficient if done repeatedly, it's occasionally necessary,
and the API provides a method, `compact()`, to do it for you.

> compact()方法的作用

The `buffer` implementation can potentially copy the data much more efficiently
than you could by using the `get()` and `put()` methods.
So if you have a need to do this, use `compact()`.

> compact()方法的执行效率

You can use a buffer in this way as a First In First Out (FIFO) queue.
More efficient algorithms certainly exist (buffer shifting is not a very efficient way to do queuing),
but compacting may be a convenient way to synchronize a buffer with logical blocks of data
(packets) in a stream you are reading from a socket.

> compact()方法的一个使用场景，可以实现类似于Queue的功能

If you want to **drain** the buffer contents after **compaction**,
the buffer will need to be **flipped**.
This is true whether you have subsequently added any new data elements to the buffer or not.

> compact() ---> fill state ---> flip() ---> drain state

## Transfer Data

### Bulk Moves

The design goal of buffers is to enable efficient data transfer.
Moving data elements one at a time, such as the loops, is not very efficient.
As you can see in the following listing, the `Buffer` API provides methods to do
bulk moves of data elements in or out of a buffer.

#### bulk get

```java
public abstract class ByteBuffer extends Buffer implements Comparable<ByteBuffer> {
    public ByteBuffer get(byte[] dst) {
        return get(dst, 0, dst.length);
    }

    public ByteBuffer get(byte[] dst, int offset, int length) {
        checkBounds(offset, length, dst.length);
        if (length > remaining())
            throw new BufferUnderflowException();
        int end = offset + length;
        for (int i = offset; i < end; i++)
            dst[i] = get();
        return this;
    }    
}
```

There are two forms of `get()` for copying data from buffers to arrays.
The first, which takes only an array as argument, drains a buffer to the given array.
The second takes `offset` and `length` arguments to specify a subrange of the target array.
The net effect of these bulk moves is identical to the loops
but can potentially be much more efficient
since the buffer implementation may take advantage of native code or other optimizations to move the data.

**Bulk moves are always of a specified length.**
That is, you always request that a specific number of data elements be moved.
It's not obvious when looking at the method signatures, but this invocation of `get()`:

```text
buffer.get(myArray);
```

is equivalent to:

```text
buffer.get(myArray, 0, myArray.length);
```

**Bulk transfers are always of a fixed size.
Omitting the length means that the entire array will be filled.**

**If the number of elements you ask for cannot be transferred, no data is transferred,
the buffer state is left unchanged, and a BufferUnderflowException is thrown.**
So when you pass in an array and don't specify the length, you're asking for the entire array to be filled.
If the buffer does not contain at least enough elements to completely fill the array, you'll get an exception.
This means that if you want to transfer a small buffer into a large array,
you need to explicitly specify the length of the data remaining in the buffer.

The first example above will not, as you might conclude at first glance,
copy the remaining data elements of the buffer into the bottom of the array.
To drain a buffer into a larger array, do this:

```text
char[] bigArray = new char[1000];

// Get count of chars remaining in the buffer
int length = buffer.remaining();

// Buffer is known to contain < 1,000 chars
buffer.get(bigArrray, 0, length);

// Do something useful with the data
processData(bigArray, length);
```

Note that it's necessary to query the buffer for the number of elements before calling `get()`
(because we need to tell `processData()` the number of chars that were placed in `bigArray`).
Calling `get()` advances the buffer's position, so calling `remaining()` afterwards returns `0`.
The bulk versions of `get()` return the **buffer reference** to facilitate **invocation chaining**,
not a count of transferred data elements.

On the other hand, if the buffer holds more data than will fit in your array,
you can iterate and pull it out in chunks with code like this:

```text
char[] smallArray = new char[10]; 
 
while(buffer.hasRemaining()) { 
    int length = Math.min(buffer.remaining(), smallArray.length);

    buffer.get(smallArray, 0, length);
    processData(smallArray, length);
}
```

#### bulk put

```java
public abstract class ByteBuffer extends Buffer implements Comparable<ByteBuffer> {
    public final ByteBuffer put(byte[] src) {
        return put(src, 0, src.length);
    }

    public ByteBuffer put(byte[] src, int offset, int length) {
        checkBounds(offset, length, src.length);
        if (length > remaining())
            throw new BufferOverflowException();
        int end = offset + length;
        for (int i = offset; i < end; i++)
            this.put(src[i]);
        return this;
    }   
}
```

The bulk versions of `put()` behave similarly but move data in the opposite direction, from arrays into buffers.
They have similar semantics regarding the size of transfers:

```text
buffer.put(myArray);
```

is equivalent to:

```text
buffer.put(myArray, 0, myArray.length);
```

If the buffer has room to accept the data in the array (`buffer.remaining() >= myArray.length`),
the data will be copied into the buffer starting at the current `position`,
and the buffer `position` will be advanced by the number of data elements added.
If there is not sufficient room in the buffer, no data will be transferred,
and a `BufferOverflowException` will be thrown.

```java
public abstract class ByteBuffer extends Buffer implements Comparable<ByteBuffer> {
    public ByteBuffer put(ByteBuffer src) {
        if (src == this)
            throw new IllegalArgumentException();
        if (isReadOnly())
            throw new ReadOnlyBufferException();
        int n = src.remaining();
        if (n > remaining())
            throw new BufferOverflowException();
        for (int i = 0; i < n; i++)
            put(src.get());
        return this;
    }
}
```

It's also possible to do bulk moves of data from one buffer to another
by calling `put()` with a buffer reference as argument:

```text
dstBuffer.put(srcBuffer);
```

This is equivalent to (assuming `dstBuffer` has sufficient space):

```text
while (srcBuffer.hasRemaining()) { 
    dstBuffer.put(srcBuffer.get()); 
}
```

The `position`s of both buffers will be advanced by the number of data elements transferred.
Range checks are done as they are for arrays.

Specifically, if `srcBuffer.remaining()` is greater than `dstBuffer.remaining()`,
then no data will be transferred, and `BufferOverflowException` will be thrown.

In case you're wondering, if you pass a buffer to itself,
you'll receive a big, fat `java.lang.IllegalArgumentException` for your hubris.

> 特殊情况：传入this


## View Buffers

**I/O basically boils down to shuttling groups of bytes around.**
When doing high-volume I/O, odds are you'll be using `ByteBuffer`s to read in files, receive data from network connections, etc.
Once the data has arrived in your `ByteBuffer`,
you'll need to look at it to decide what to do or manipulate it before sending it along.
The `ByteBuffer` class provides a rich API for creating **view buffers**.

**View buffers** are created by a factory method on an existing buffer object instance.
The view object maintains its own attributes, `capacity`, `position`, `limit`, and `mark`,
but shares data elements with the original buffer.

> view buffers的特点是数据是共享的，索引是自己的。

### slice

Something else to remember: when you call `slice()` the new buffer shares the same backing store as the old.
Any changes that you make in one buffer will appear in the other.
If you don't want that to happen, you need to use `get()`, which copies the data.

```text
public ByteBuffer getDataAsBuffer()
{
    buf.position(getDataOffset());
    return buf.slice();
}
```

### asIntBuffer()

We saw the simple form of this, in which buffers were **duplicated** and **sliced**.
But `ByteBuffer` allows the creation of views to map the raw bytes of the byte buffer to other primitive data types.
For example, the `asLongBuffer()` method creates a view buffer that will access groups of eight bytes from the `ByteBuffer` as `long`s.

Each of the factory methods in the following listing create a new buffer that is a view into the original `ByteBuffer` object.
Invoking one of these methods will create a buffer of the corresponding type,
which is a **slice** of the underlying byte buffer corresponding to the byte buffer's current `position` and `limit`.

> 这种view的本质是slice

The new buffer will have a `capacity` equal to the number of elements remaining in the byte buffer
(as returned by `remaining()`) divided by the number of bytes comprising the view's primitive type.
Any remaining bytes at the end of the slice will not be visible in the view.

> 这里讲了new buffer里的元素数量，以及多余的元素如何处理

The first element of the view will begin at the position (as returned by `position()`) of the `ByteBuffer` object
at the time the view was created.

> 第一个元素是什么

View buffers with data elements that are aligned on natural modulo boundaries
may be eligible for optimization by the implementation.

```java
public abstract class ByteBuffer extends Buffer implements Comparable  
{ 
    // This is a partial API listing 

    public abstract CharBuffer asCharBuffer();
    public abstract ShortBuffer asShortBuffer();
    public abstract IntBuffer asIntBuffer();
    public abstract LongBuffer asLongBuffer();
    public abstract FloatBuffer asFloatBuffer();
    public abstract DoubleBuffer asDoubleBuffer();
}
```

```java
import lsieun.utils.BufferUtils;
import lsieun.utils.HexUtils;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.IntBuffer;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        // cafe babe, football, scalable, telecast, office
        String hex = "CA FE BA BE F007BA11 5CA1AB1E 7E1ECA57 0FF1CE".replace(" ", "");
        byte[] src = HexUtils.parse(hex);
        System.out.println(src.length);
        ByteBuffer byteBuffer = ByteBuffer.wrap(src);
        byteBuffer.position(4);
        BufferUtils.printIndex(byteBuffer);

        IntBuffer intBuffer = byteBuffer.asIntBuffer();
        System.out.println(intBuffer.hasArray());
        BufferUtils.printIndex(intBuffer);
    }
}
```

```text
19
mark: -1       position: 4        limit: 19       capacity: 19       offset: 0        length: 19 
false
mark: -1       position: 0        limit: 3        capacity: 3
```

Once you've obtained the view buffer, you can create further subviews
with `duplicate()`, `slice()`, and `asReadOnlyBuffer()`.

Whenever a view buffer accesses the underlying bytes of a `ByteBuffer`,
the bytes are packed to compose a data element according to the view buffer's **byte-order** setting.
When a view buffer is created,
it inherits the byte-order setting of the underlying `ByteBuffer` at the time the view is created.
**The byte-order setting of the view cannot be changed later.**

> byte order对于view的影响

View buffers can potentially be much more efficient when derived from **direct byte buffers**.
If the **byte order** of the view matches the **native hardware byte order**,
the low-level code may be able to access the data values directly rather than
going through the byte-packing and -unpacking process.

> direct buffer与view的关系

## Direct Buffers

The most significant way in which byte buffers are distinguished from other buffer types is that
they can be the **sources** and/or **targets** of I/O performed by `Channel`s.
`Channel`s accept only `ByteBuffer`s as arguments.

Operating systems perform I/O operations on memory areas.
These memory areas, as far as the operating system is concerned, are contiguous sequences of bytes.
It's no surprise then that only byte buffers are eligible to participate in I/O operations.
Also recall that the operating system will directly access the address space of the process,
in this case the JVM process, to transfer the data.
This means that **memory areas** that are targets of I/O operations must be **contiguous sequences of bytes**.
In the JVM, an array of bytes may not be stored contiguously in memory,
or the Garbage Collector could move it at any time.
Arrays are objects in Java, and the way data is stored inside that object could vary from one JVM implementation to another.

> 这里可能表达的意思是  
> memory area里面的bytes是最原始的状态；而在Java语言中，byte[]是一个对象，不同的JVM实现可能是不同的。

For this reason, the notion of a **direct buffer** was introduced.
**Direct buffers** are intended for interaction with channels and native I/O routines.
They make a best effort to store the byte elements in a memory area
that a channel can use for direct, or raw, access
by using native code to tell the operating system to drain or fill the **memory area** directly.

> Direct Buffer出现的目的，就是希望让Java语言直接操作memory area当中的raw bytes

Direct byte buffers are usually the best choice for I/O operations.
By design, they support the most efficient I/O mechanism available to the JVM.
Nondirect byte buffers can be passed to channels, but doing so may incur a **performance penalty**.
It's usually not possible for a nondirect buffer to be the target of a native I/O operation.
If you pass a nondirect `ByteBuffer` object to a channel for write,
the channel may implicitly do the following on each call:

1.  Create a temporary direct `ByteBuffer` object.
2.  Copy the content of the nondirect buffer to the temporary buffer.
3.  Perform the low-level I/O operation using the temporary buffer.
4.  The temporary buffer object goes out of scope and is eventually garbage collected.

This can potentially result in buffer copying and object churn on every I/O,
which are exactly the sorts of things we'd like to avoid.
However, depending on the implementation, things may not be this bad.
The runtime will likely cache and reuse direct buffers or perform other clever tricks to boost throughput.
If you're simply creating a buffer for one-time use, the difference is not significant.
On the other hand, if you will be using the buffer repeatedly in a high-performance scenario,
you're better off allocating direct buffers and reusing them.

> 网上的人说，这一段是猜测的，并不是真实的、具体的描述

**Direct buffers are optimal for I/O, but they may be more expensive to create than nondirect byte buffers.**
The memory used by direct buffers is allocated by calling through to native, operating system-specific code,
bypassing the standard JVM heap.
**Setting up and tearing down direct buffers could be significantly more expensive than heap-resident buffers,**
depending on the host operating system and JVM implementation.
The memory-storage areas of direct buffers are not subject to garbage collection
because they are outside the standard JVM heap.

The performance tradeoffs of using **direct** versus **nondirect buffers** can vary widely by JVM, operating system, and code design.
By allocating memory outside the heap, you may subject your application to additional forces of which the JVM is unaware.
When bringing additional moving parts into play, make sure that you're achieving the desired effect. I
recommend the old software maxim: **first make it work, then make it fast**.
Don't worry too much about optimization up front; concentrate first on correctness.
The JVM implementation may be able to perform buffer caching or other optimizations
that will give you the performance you need without a lot of unnecessary effort on your part.

A direct `ByteBuffer` is created by calling `ByteBuffer.allocateDirect()` with the desired capacity,
just like the `allocate()` method.


```java
public abstract class ByteBuffer extends Buffer implements Comparable  
{ 
        // This is a partial API listing 
 
        public static ByteBuffer allocate(int capacity);
        public static ByteBuffer allocateDirect(int capacity); 
        public abstract boolean isDirect(); 
}
```

## Miscellaneous

```text
                                   ┌─── isDirect()
                 ┌─── isXxx ───────┤
                 │                 └─── isReadOnly()
                 │
                 │                 ┌─── hasArray()
                 │                 │
                 ├─── array ───────┼─── array()
                 │                 │
miscellaneous ───┤                 └─── arrayOffset()
                 │
                 │                 ┌─── order()
                 ├─── order ───────┤
                 │                 └─── order(ByteOrder bo)
                 │
                 │                 ┌─── equals
                 └─── comparing ───┤
                                   └─── compareTo
```

### isXxx

#### isDirect

All buffers provide a `boolean` method named `isDirect()` to test
whether a particular buffer is direct.
While `ByteBuffer` is the only type that can be allocated as direct,
`isDirect()` could be `true` for nonbyte view buffers if the underlying buffer is a direct `ByteBuffer`.

**Note that wrapped buffers, those created with one of the `wrap()` methods, are always non-direct.**

#### isReadOnly

Some parts of the API of a `ByteBuffer` is specific to some types of byte buffers.
For example, a byte buffer can be **read-only**, restricting usage to a subset of methods.

### array

The `array()` method will only work for a byte buffer backed by a **byte array**
(which can be tested with `hasArray()`) and
should generally **only be used if you know exactly what you are doing**.

A common mistake is to use `array()` to "convert" a `ByteBuffer` into a **byte array**.
Not only does this only work for **byte array backed buffers**,
but it is **easily a source of bugs** because depending on how the buffer was created,
the beginning of the returned array **may or may not** correspond to the beginning of the `ByteBuffer`.
The result tends to be a subtle bug where the behavior of code differs depending on implementation details of the byte buffer and the code that created it.

> 这段不是很理解

**Buffers created by either `allocate()` or `wrap()` are always nondirect.**
Nondirect buffers have backing arrays, and you can gain access to those arrays with the remaining API methods.


The `boolean` method `hasArray()` tells you if the buffer has an accessible backing array or not.
If it returns `true`, the `array()` method returns a reference to the array storage used by the buffer object.

If `hasArray()` returns `false`, do not call `array()` or `arrayOffset()`.
You'll be rewarded with an `UnsupportedOperationException` if you do.

```text
ByteBuffer byteBuffer = ByteBuffer.allocateDirect(10);
boolean hasArray = byteBuffer.hasArray();
System.out.println(hasArray);      // false

byte[] array = byteBuffer.array(); // UnsupportedOperationException
```

If a buffer is **read-only**, **its backing array is off-limits**, even if an array was provided to `wrap()`.
Invoking `array()` or `arrayOffset()` will throw a `ReadOnlyBufferException` in such a case
to prevent you from gaining access to and modifying the data content of the read-only buffer.

```text
byte[] myArray = new byte[10];
ByteBuffer byteBuffer = ByteBuffer.wrap(myArray);

ByteBuffer readOnlyBuffer = byteBuffer.asReadOnlyBuffer();
boolean readOnly = readOnlyBuffer.isReadOnly();
System.out.println(readOnly);              // true

boolean hasArray = readOnlyBuffer.hasArray();
System.out.println(hasArray);              // false

byte[] array = readOnlyBuffer.array();     // ReadOnlyBufferException
int offset = readOnlyBuffer.arrayOffset(); // ReadOnlyBufferException
```

If you have access to the backing array by other means,
changes made to the array will be reflected in the read-only buffer.

```text
byte[] myArray = new byte[10];
ByteBuffer byteBuffer = ByteBuffer.wrap(myArray);

ByteBuffer readOnlyBuffer = byteBuffer.asReadOnlyBuffer();
BufferUtils.print(readOnlyBuffer);

myArray[0] = 5;
BufferUtils.print(readOnlyBuffer);
```

```text
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
[5, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

The `arrayOffset()` method returns the offset into the array where the buffer's data elements are stored.
If you create a buffer with the three-argument version of `wrap()`,
`arrayOffset()` will always return `0` for that buffer.

However, if you **slice** a buffer backed by an array, the resulting buffer may have a nonzero array offset.
The array offset and capacity of a buffer will tell you which elements of an array are used by a given buffer.

Generally, don't use `array()` casually.
In order for it to be used correctly you either have to know for a fact that the byte buffer is array backed,
or you have to test it with `hasArray()` and have two separate code paths for either case.

Additionally, when you use it, you must use `arrayOffset()` in order to determine what the zeroth position of the `ByteBuffer` corresponds to in the byte array.

In typical application code, you would not use `array()`
unless you really know what you are doing and you specifically need it.
That said, there are cases where it's useful.
For example, supposing you were implementing a `ByteBuffer` version of `UnsignedBytes.compare()` (again, from Guava) –
you may wish to optimize the case where either or both of the arguments are array backed,
to avoid unnecessary copying and frequent calls to the buffers.
For such a generic and potentially heavily used method, such an optimization would make sense.

### Byte Ordering

The `ByteBuffer` class is different: the default byte order is always `ByteOrder.BIG_ENDIAN`  
regardless of the native byte order of the system.
**Java's default byte order is big-endian**,
which allows things such as class files and serialized objects to work with any JVM.
This can have performance implications if the native hardware byte order is little-endian.
Accessing `ByteBuffer` content as other data types can potentially be much more efficient
when using the native hardware byte order.

Hopefully, you're a little puzzled at this point as to why the `ByteBuffer` class would need a byte order setting at all.
Bytes are bytes, right?
Sure, but `ByteBuffer` objects possess a host of convenience methods for
getting and putting the buffer content as other primitive data types.
The way these methods encode or decode the bytes is dependent on the `ByteBuffer`'s current byte-order setting.

The byte-order setting of a `ByteBuffer` can be changed at any time
by invoking `order()` with either `ByteOrder.BIG_ENDIAN` or `ByteOrder.LITTLE_ENDIAN` as an argument:

```text
public abstract class ByteBuffer extends Buffer implements Comparable 
{ 
        // This is a partial API listing 
 
        public final ByteOrder order(); 
        public final ByteBuffer order (ByteOrder bo); 
}
```

If a buffer was created as a view of a `ByteBuffer` object,
then the value returned by the `order()` method is the byte-order setting of the originating `ByteBuffer` at the time the view was created.
**The byte-order setting of the view cannot be changed** after it's created and
**will not be affected** if the original byte buffer's byte order is changed later.

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        byte[] src = new byte[]{(byte) 0xCA, (byte) 0xFE, (byte) 0xBA, (byte) 0xBE};
        ByteBuffer byteBuffer = ByteBuffer.wrap(src);

        int val1 = byteBuffer.getInt();
        System.out.println(Integer.toHexString(val1)); // cafebabe

        byteBuffer.rewind();
        byteBuffer.order(ByteOrder.LITTLE_ENDIAN);
        int val2 = byteBuffer.getInt();
        System.out.println(Integer.toHexString(val2)); // bebafeca
    }
}
```

You can use `ByteBuffer.order(ByteOrder.LITTLE_ENDIAN)` to set the endian byte-sex of the buffer to little endian.
Then when you use `ByteBuffer.getInt(int offset)`, it will collect the bytes least significant first.
Note that the `offset` is specified in `byte`s, not `int`s.

### Comparing

It's occasionally necessary to compare the data contained in one buffer with that in another buffer.
All buffers provide a custom `equals()` method for testing the equality of two buffers and a `compareTo()` method for comparing buffers:

```text
public abstract class ByteBuffer extends Buffer implements Comparable { 
        // This is a partial API listing 
 
        public boolean equals (Object ob)
        public int compareTo (Object ob)
}
```

- `Object` Perspective
- `Comparable` Perspective

Two buffers can be tested for **equality** with code like this:

```text
if (buffer1.equals (buffer2)) { 
    doSomething(); 
}
```

#### equals

The `equals()` method returns `true` if the remaining content of each buffer is identical;
otherwise, it returns `false`.
Because the test is for exact equality and is commutative(交换的（排列次序不影响结果）).
The names of the buffers in the previous listing could be reversed and produce the same result.

Two buffers are considered to be equal if and only if:

- **Both objects are the same type.**
  Buffers containing different data types are never equal, and no `Buffer` is ever equal to a non-Buffer object.
- **Both buffers have the same number of remaining elements.**
  The buffer capacities need not be the same, and the indexes of the data remaining in the buffers need not be the same.
  But the count of elements remaining (from `position` to `limit`) in each buffer must be the same.
- The sequence of remaining data elements, which would be returned from `get()`, must be identical in each buffer.

小总结：

- 类型相同（类层面）
- remaining的长度相同（字段，数组层面）
- 每个元素的值相同（数组里的元素）

If any of these conditions do not hold, `false` is returned.


That `ByteBuffer` would be equal to (in the sense of `equals()`) to any other `ByteBuffer`
whose contents in between `[position,limit)` is the same.

two buffers with different attributes that would compare as equal.

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        byte[] src1 = "World".getBytes(StandardCharsets.UTF_8);
        byte[] src2 = "HelloWorld".getBytes(StandardCharsets.UTF_8);

        ByteBuffer buffer1 = ByteBuffer.wrap(src1);
        ByteBuffer buffer2 = ByteBuffer.wrap(src2);
        buffer2.position(5);

        boolean equal = buffer1.equals(buffer2);
        System.out.println(equal); // true
    }
}
```

two similar buffers, possibly views of the same underlying buffer, which would test as unequal.

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        byte[] src = "HelloWorld".getBytes(StandardCharsets.UTF_8);
        ByteBuffer buffer = ByteBuffer.wrap(src);

        ByteBuffer view1 = buffer.asReadOnlyBuffer();
        view1.position(3);

        ByteBuffer view2 = buffer.asReadOnlyBuffer();
        view2.position(5);

        boolean equal = view1.equals(view2);
        System.out.println(equal); // false
    }
}
```

#### compareTo

Buffers also support lexicographic comparisons with the `compareTo()` method.
This method returns an integer that is negative, zero, or positive
if the buffer argument is less than, equal to or greater than, respectively, the object instance on which `compareTo()` was invoked.
These are the semantics of the `java.lang.Comparable` interface,
which all typed buffers implement.
This means that arrays of buffers(`ByteBuffer[]`) can be sorted
according to their content by invoking `java.util.Arrays.sort()`.

Like `equals()`, `compareTo()` does not allow comparisons between dissimilar objects.
But `compareTo()` is more strict:
it will throw `ClassCastException` if you pass in an object of the incorrect type,
whereas `equals()` would simply return `false`.

**Comparisons are performed on the remaining elements of each buffer**, in the same way as they are for `equals()`,
until an inequality is found or the `limit` of either buffer is reached.
If one buffer is exhausted before an inequality is found,
the shorter buffer is considered to be less than the longer buffer.
**Unlike `equals()`, `compareTo()` is not commutative: the order matters.**

In this example, a result less than 0 would indicate that buffer2 is less than buffer1,
and the expression would evaluate to true.

```text
if(buffer1.compareTo (buffer2) < 0) {
    doSomething();
}
```

## Memory-Mapped Buffers

**Mapped buffers** are byte buffers with **data elements** stored in a **file** and are accessed via **memory mapping**.
**Mapped buffers are always direct and can be created only from a `FileChannel` object.**
Usage of mapped buffers is similar to direct buffers,
but `MappedByteBuffer` objects possess many special characteristics unique to file access.

## 注意事项



A `ByteBuffer` offers the ability to duplicate itself by calling `duplicate()`.
This does not actually copy the underlying bytes,
it only creates a new `ByteBuffer` instance pointing to the same underlying storage.
A `ByteBuffer` representing a subset of another `ByteBuffer` may be created using `slice()`.

## Reference

- [Byte Buffers and Non-Heap Memory](https://www.kdgregory.com/index.php?page=java.byteBuffer)
- [ByteBuffer : Java Glossary](https://www.mindprod.com/jgloss/bytebuffer.html)
- [The Java ByteBuffer – a crash course](https://worldmodscode.wordpress.com/2012/12/14/the-java-bytebuffer-a-crash-course/)
