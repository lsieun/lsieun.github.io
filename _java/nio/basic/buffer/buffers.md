---
title: "Buffers"
sequence: "101"
---

[UP](/java-nio.html)


## Intro

Almost nothing has a greater impact on **the performance of network programs** than **a big enough buffer**. In the new I/O model, you're no longer given the choice. **All I/O is buffered**. Indeed, the buffers are fundamental parts of the API. Instead of **writing data onto output streams** and **reading data from input streams**, you read and write data from **buffers**. **Buffers** may appear to be just **an array of bytes** as in buffered streams. However, **native implementations** can connect them directly to hardware or memory or use other, very efficient implementations.

> 足够的buffer，能够有效的提升network program的性能。在NIO中，并没有提供给我们是否要选择buffer，而是都使用buffer的；当然buffer有不同的实现方式。

### streams vs channels

From a programming perspective, **the key difference** between **streams** and **channels** is that **streams are byte-based** whereas **channels are block-based**. A stream is designed to provide one byte after the other, in order. Arrays of bytes can be passed for performance. However, the basic notion is to pass data one byte at a time. By contrast, a channel passes blocks of data around in buffers. Before bytes can be read from or written to a channel, the bytes have to be stored in a buffer, and the data is written or read one buffer at a time.

> streams和channels之间的第一个区别是：streams是byte-based的，而channels是block-based的。我所疑惑的地方在于：block-based难道不就是多个字节的意思吗？

**The second key difference** between **streams** and **channels/buffers** is that **channels and buffers** tend to support **both reading and writing** on **the same object**. This isn't always true. For instance, a channel that points to a file on a CD-ROM can be read but not written. A channel connected to a socket that has shutdown input could be written but not read. If you try to write to a read-only channel or read from a write-only channel, an `UnsupportedOperationException` will be thrown. However, more often than not network programs can read from and write to the same channels.

> 第二个区别，我有点不懂。不懂的地方在于“the same object”，它是指的是Buffer对象吗？

### Buffer implementation

Without worrying too much about **the underlying details** (which can **vary hugely from one implementation to the next**, mostly as a result of being tuned very closely to the host operating system and hardware), you can think of **a buffer** as **a fixed-size list of elements of a particular, normally primitive data type, like an array**. However, it's not necessarily an array behind the scenes. Sometimes it is; sometimes it isn't.

> 在Buffer的实现上，并不是统一的；但是，在概念上，我们可以将Buffer认为是一个数组。

### Buffer subclasses

There are specific subclasses of `Buffer` for all of **Java's primitive data types** except `boolean`: `ByteBuffer`, `CharBuffer`, `ShortBuffer`, `IntBuffer`, `LongBuffer`, `FloatBuffer`, and `DoubleBuffer`. The methods in **each subclass** have **appropriately typed return values and argument lists**. For example, the `DoubleBuffer` class has methods to put and get `double`s. The `IntBuffer` class has methods to put and get `int`s.

> Buffer有许多的subclasses。

The common `Buffer` superclass only provides methods that don't need to know the type of the data the buffer contains. (The lack of primitive-aware generics really hurts here.) Network programs use `ByteBuffer` almost exclusively, although occasionally one program might use a view that overlays the `ByteBuffer` with one of the other types.

> 在Network program中，主要是使用ByteBuffer。

### Buffer four key pieces of information

Besides its list of data, each buffer tracks **four key pieces of information**. All buffers have the same methods to set and get these values, regardless of the buffer's type:

- position

The next location in the buffer that will be read from or written to. This starts counting at `0` and has a maximum value equal to the size of the buffer. It can be set or gotten with these two methods:

```text
public final int position()
public final Buffer position(int newPosition)
```

- capacity

The maximum number of elements the buffer can hold. This is set when the buffer is created and cannot be changed thereafter. It can be read with this method:

```text
public final int capacity()
```

- limit

The end of accessible data in the buffer. You cannot write or read at or past this point without changing the limit, even if the buffer has more capacity. It is set and
gotten with these two methods:

```text
public final int limit()
public final Buffer limit(int newLimit)
```

- mark

A client-specified index in the buffer. It is set at the current position by invoking the `mark()` method. The current position is set to the marked position by invoking `reset()`:

```text
public final Buffer mark()
public final Buffer reset()
```

If the position is set below an existing mark, the mark is discarded.

### reading from a buffer

Unlike reading from an `InputStream`, **reading from a buffer** does not actually change the buffer's data in any way. It's possible to set the `position` either forward or backward so you can start reading from a particular place in the buffer. Similarly, a program can adjust the `limit` to control the end of the data that will be read. Only the `capacity` is fixed.

The common `Buffer` superclass also provides a few other methods that operate by reference to these common properties.

The `clear()` method “empties” the buffer by setting the `position` to zero and the `limit` to the `capacity`. This allows the buffer to be completely refilled:

```text
public final Buffer clear()
```

However, the `clear()` method does not remove the old data from the buffer. It's still present and could be read using absolute `get` methods or changing the `limit` and `position` again.

The `rewind()` method sets the `position` to **zero**, but does not change the `limit`:

```text
public final Buffer rewind()
```

This allows the buffer to be reread.

The `flip()` method sets the `limit` to the current `position` and the `position` to **zero**:

```text
public final Buffer flip()
```

It is called when you want to drain a buffer you've just filled.

Finally, there are two methods that return information about the buffer but don't change it. The `remaining()` method returns the number of elements in the buffer between the
current `position` and the `limit`. The `hasRemaining()` method returns `true` if the number of remaining elements is greater than zero:

```text
public final int remaining()
public final boolean hasRemaining()
```

## Creating Buffers

The buffer class hierarchy is based on inheritance but not really on polymorphism, at least not at the top level. You normally need to know whether you're dealing with an `IntBuffer` or a `ByteBuffer` or a `CharBuffer` or something else. You write code to one of these subclasses, not to the common `Buffer` superclass.

Each typed buffer class has several **factory methods** that create implementation-specific subclasses of that type in various ways. **Empty buffers** are normally created by `allocate` methods. **Buffers that are prefilled with data** are created by `wrap` methods. The `allocate` methods are often useful for input, and the `wrap` methods are normally used for output.

### Allocation

The basic `allocate()` method simply returns a new, empty buffer with a specified fixed `capacity`. For example, these lines create byte and int buffers, each with a size of 100:

```text
ByteBuffer buffer1 = ByteBuffer.allocate(100);
IntBuffer buffer2 = IntBuffer.allocate(100);
```

The cursor is positioned at the beginning of the buffer (i.e., the `position` is `0`). A buffer created by `allocate()` will be implemented on top of a Java array, which can be accessed by the `array()` and `arrayOffset()` methods. For example, you could read a large chunk of data into a buffer using a channel and then retrieve the array from the buffer to pass to other methods:

```text
byte[] data1 = buffer1.array();
int[] data2 = buffer2.array();
```

The `array()` method does expose the **buffer's private data**, so use it with caution. Changes to the backing array are reflected in the buffer and vice versa. The normal pattern here is to fill the buffer with data, retrieve its backing array, and then operate on the array. This isn't a problem as long as you don't write to the buffer after you've started working with the array.

### Direct allocation

The `ByteBuffer` class (but not the other buffer classes) has an additional `allocateDirect()` method that may not create a backing array for the buffer. The VM may implement a directly allocated `ByteBuffer` using **direct memory access to the buffer** on an Ethernet card, kernel memory, or something else. It's not required, but it's allowed, and this can improve performance for I/O operations. From an API perspective, `allocateDirect()` is used exactly like `allocate()`:

```text
ByteBuffer buffer = ByteBuffer.allocateDirect(100);
```

Invoking `array()` and `arrayOffset()` on a direct buffer will throw an `UnsupportedOperationException`. Direct buffers may be faster on some virtual machines, especially if the buffer is large (roughly a megabyte or more). **However, direct buffers are more expensive to create than indirect buffers**, so they should only be allocated when the buffer is expected to be around for a while. The details are highly VM dependent. As is generally true for most performance advice, you probably shouldn't even consider using direct buffers until measurements prove performance is an issue.

### Wrapping

If you already have **an array of data** that you want to output, you'll normally wrap a buffer around it, rather than allocating a new buffer and copying its components into the buffer one at a time. For example:

```text
byte[] data = "Some data".getBytes("UTF-8");
ByteBuffer buffer1 = ByteBuffer.wrap(data);

char[] text = "Some text".toCharArray();
CharBuffer buffer2 = CharBuffer.wrap(text);
```

Here, the **buffer** contains **a reference to the array**, which serves as **its backing array**. Buffers created by wrapping are never direct. Again, changes to the array are reflected in the buffer and vice versa, so don't wrap the array until you're finished with it.

## Filling and Draining

**Buffers are designed for sequential access**. Recall that each buffer has **a current position** identified by the `position()` method that is somewhere between **zero** and **the number of elements** in the buffer, inclusive. The buffer's `position` is incremented by one when an element is read from or written to the buffer.

### filling the buffer

For example, suppose you allocate a `CharBuffer` with capacity `12`, and fill it by putting five characters into it:

```text
CharBuffer buffer = CharBuffer.allocate(12);
buffer.put('H');
buffer.put('e');
buffer.put('l');
buffer.put('l');
buffer.put('o');
```

The `position` of the buffer is now `5`. This is called **filling the buffer**.

You can only fill the buffer up to its `capacity`. If you tried to fill it past its initially set `capacity`, the `put()` method would throw a `BufferOverflowException`.

### draining the buffer

If you now tried to `get()` from the buffer, you'd get the `null` character (`\u0000`) that Java initializes char buffers with that's found at position `5`. Before you can read the data you wrote in out again, you need to **flip the buffer**:

```text
buffer.flip();
```

This sets the `limit` to the position (5 in this example) and resets the `position` to `0`, the start of the buffer. Now you can drain it into a new string:

```text
String result = "";
while (buffer.hasRemaining()) {
    result += buffer.get();
}
```

Each call to `get()` moves the `position` forward **one**. When the `position` reaches the `limit`, `hasRemaining()` returns `false`. This is called **draining the buffer**.

### absolute methods

`Buffer` classes also have **absolute methods** that fill and drain at specific `position`s within the buffer without updating the `position`. For example, `ByteBuffer` has these two:

```text
public abstract byte get(int index)
public abstract ByteBuffer put(int index, byte b)
```

These both throw an `IndexOutOfBoundsException` if you try to access a `position` at or past the `limit` of the buffer. For example, using **absolute methods**, you can put the same text into a buffer like this:

```text
CharBuffer buffer = CharBuffer.allocate(12);
buffer.put(0, 'H');
buffer.put(1, 'e');
buffer.put(2, 'l');
buffer.put(3, 'l');
buffer.put(4, 'o');
```

However, you no longer need to flip before reading it out, because the absolute methods don't change the position. Furthermore, order no longer matters. This produces the same end result:

```text
CharBuffer buffer = CharBuffer.allocate(12);
buffer.put(1, 'e');
buffer.put(4, 'o');
buffer.put(0, 'H');
buffer.put(3, 'l');
buffer.put(2, 'l');
```

## Bulk Methods

Even with buffers, it's often faster to work with **blocks of data** rather than filling and draining one element at a time. The different buffer classes have bulk methods that fill and drain an array of their element type.

For example, `ByteBuffer` has `put()` and `get()` methods that fill and drain a `ByteBuffer` from a preexisting byte array or subarray:

```text
public ByteBuffer get(byte[] dst, int offset, int length)
public ByteBuffer get(byte[] dst)
public ByteBuffer put(byte[] array, int offset, int length)
public ByteBuffer put(byte[] array)
```

These `put` methods insert the data from the specified array or subarray, beginning at the current `position`. The `get` methods read the data into the argument array or subarray beginning at the current `position`. Both `put` and `get` increment the `position` by the length of the array or subarray. The `put` methods throw a `BufferOverflowException` if the buffer does not have sufficient space for the array or subarray. The `get` methods throw a `BufferUnderflowException` if the buffer does not have enough data remaining to fill the array or subarrray. These are runtime exceptions.

## Data Conversion
