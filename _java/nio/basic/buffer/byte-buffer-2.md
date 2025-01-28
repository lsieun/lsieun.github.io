---
title: "ByteBuffer2"
sequence: "102"
---

[UP](/java-nio.html)


## Intro

`ByteBuffer` holds **a sequence of bytes** for use in an I/O operation.

> 笔记：ByteBuffer，顾其名，思其义，是字符的缓冲区。

## 创建 instance

`ByteBuffer` is an `abstract` class, so you cannot instantiate one by calling a constructor. Instead, you must use `allocate()`, `allocateDirect()`, or `wrap()`.

> 笔记：这里是说ByteBuffer是abstract类，不能直接创建，需要调用一些方法。

```java
public abstract class ByteBuffer extends Buffer implements Comparable<ByteBuffer>
```

`allocate()` returns a ByteBuffer with **the specified capacity**. The position of this new buffer is `0`, and its limit is set to its capacity.

> 笔记：allocate()方法，需要指定容量大小。

```text
    public static ByteBuffer allocate(int capacity) {
        if (capacity < 0)
            throw new IllegalArgumentException();
        return new HeapByteBuffer(capacity, capacity);
    }
```

`allocateDirect()` is like `allocate()` except that it
attempts to **allocate a buffer that the underlying operating system can use directly**. Such direct buffers may be substantially more efficient than normal buffers for low-level I/O operations but may also have significantly larger allocation costs.

> 笔记：我还是不熟悉，所以可能不会用到。

```text
    public static ByteBuffer allocateDirect(int capacity) {
        return new DirectByteBuffer(capacity);
    }
```

If you have already allocated **an array of bytes**, you can use the `wrap()` method to create a ByteBuffer that uses the byte array to store it. In the one-argument version of `wrap()`, you specify only the array; the buffer **capacity** and **limit** are set to the array length, and
the position is set to `0`.

> 笔记：wrap()是利用已经有的array of bytes。

```text
    public static ByteBuffer wrap(byte[] array) {
        return wrap(array, 0, array.length);
    }
```

In the other form of `wrap()`, you specify the array as well as an `offset` and `length` that specify a portion of that array. The **capacity** of the resulting `ByteBuffer` is again set to the total array length, but its **position** is set to the specified offset, and its **limit** is set to the offset plus length.

```text
    public static ByteBuffer wrap(byte[] array, int offset, int length)
    {
        try {
            return new HeapByteBuffer(array, offset, length);
        } catch (IllegalArgumentException x) {
            throw new IndexOutOfBoundsException();
        }
    }
```

## Methods: get() and put()

Once you have obtained a `ByteBuffer`, you can use the various `get()` and `put()` methods to **read** data from it or **write** data into it.

> 笔记：广泛的去讲get()和put()方法。get()用于读取数据，put()用于写入数据。

Several versions of these methods exist to read and write **single bytes** or **arrays of bytes**.

> 笔记：承接上句话，存在多个不同的get()和put()版本。

The **single-byte** methods come in two forms. **Relative** `get()` and `put()` methods query or set the byte at the current position and then increment the position. The **absolute** forms of the methods take **an additional argument** `index` that specifies the buffer element that will be read or written and do not affect the buffer position.

> 笔记：这里讲读取单个字节single-byte。

```text
    /**
     * Relative <i>get</i> method.  Reads the byte at this buffer's
     * current position, and then increments the position.
     *
     * @return  The byte at the buffer's current position
     *
     */
    public abstract byte get();

    /**
     * Relative <i>put</i> method&nbsp;&nbsp;<i>(optional operation)</i>.
     *
     * <p> Writes the given byte into this buffer at the current
     * position, and then increments the position. </p>
     *
     * @param  b
     *         The byte to be written
     *
     * @return  This buffer
     */
    public abstract ByteBuffer put(byte b);

    /**
     * Absolute <i>get</i> method.  Reads the byte at the given
     * index.
     *
     * @param  index
     *         The index from which the byte will be read
     *
     * @return  The byte at the given index
     *
     */
    public abstract byte get(int index);

    /**
     * Absolute <i>put</i> method&nbsp;&nbsp;<i>(optional operation)</i>.
     *
     * <p> Writes the given byte into this buffer at the given
     * index. </p>
     *
     * @param  index
     *         The index at which the byte will be written
     *
     * @param  b
     *         The byte value to be written
     *
     * @return  This buffer
     */
    public abstract ByteBuffer put(int index, byte b);
```

Two other **relative** forms of the `get()` method exist to read **a sequence of bytes** (starting at and incrementing the buffer's position) into a specified byte array or a specified subarray. These methods throw a `BufferUnderflowException` if there are not enough
bytes left in the buffer.

> 笔记：这里讲读取多个字节a sequence of bytes。

```text
    /**
     * Relative bulk <i>get</i> method.
     *
     * <p> This method transfers bytes from this buffer into the given
     * destination array.  An invocation of this method of the form
     * <tt>src.get(a)</tt> behaves in exactly the same way as the invocation
     *
     * <pre>
     *     src.get(a, 0, a.length) </pre>
     *
     * @param   dst
     *          The destination array
     *
     * @return  This buffer
     *
     * @throws  BufferUnderflowException
     *          If there are fewer than <tt>length</tt> bytes
     *          remaining in this buffer
     */
    public ByteBuffer get(byte[] dst) {
        return get(dst, 0, dst.length);
    }

    /**
     * Relative bulk <i>get</i> method.
     *
     * <p> This method transfers bytes from this buffer into the given
     * destination array.  If there are fewer bytes remaining in the
     * buffer than are required to satisfy the request, that is, if
     * <tt>length</tt>&nbsp;<tt>&gt;</tt>&nbsp;<tt>remaining()</tt>, then no
     * bytes are transferred and a {@link BufferUnderflowException} is
     * thrown.
     *
     * <p> Otherwise, this method copies <tt>length</tt> bytes from this
     * buffer into the given array, starting at the current position of this
     * buffer and at the given offset in the array.  The position of this
     * buffer is then incremented by <tt>length</tt>.
     *
     * <p> In other words, an invocation of this method of the form
     * <tt>src.get(dst,&nbsp;off,&nbsp;len)</tt> has exactly the same effect as
     * the loop
     *
     * <pre>{@code
     *     for (int i = off; i < off + len; i++)
     *         dst[i] = src.get():
     * }</pre>
     *
     * except that it first checks that there are sufficient bytes in
     * this buffer and it is potentially much more efficient.
     *
     * @param  dst
     *         The array into which bytes are to be written
     *
     * @param  offset
     *         The offset within the array of the first byte to be
     *         written; must be non-negative and no larger than
     *         <tt>dst.length</tt>
     *
     * @param  length
     *         The maximum number of bytes to be written to the given
     *         array; must be non-negative and no larger than
     *         <tt>dst.length - offset</tt>
     *
     * @return  This buffer
     *
     * @throws  BufferUnderflowException
     *          If there are fewer than <tt>length</tt> bytes
     *          remaining in this buffer
     *
     * @throws  IndexOutOfBoundsException
     *          If the preconditions on the <tt>offset</tt> and <tt>length</tt>
     *          parameters do not hold
     */
    public ByteBuffer get(byte[] dst, int offset, int length) {
        checkBounds(offset, length, dst.length);
        if (length > remaining())
            throw new BufferUnderflowException();
        int end = offset + length;
        for (int i = offset; i < end; i++)
            dst[i] = get();
        return this;
    }
```

Two **relative** forms of the `put()` method copy bytes from a specified array or subarray into the buffer (starting at and incrementing the buffer's position). They throw a `BufferOverflowException` if there is not enough room left in the buffer to hold the bytes.

```text
/**
     * Relative bulk <i>put</i> method&nbsp;&nbsp;<i>(optional operation)</i>.
     *
     * <p> This method transfers the entire content of the given source
     * byte array into this buffer.  An invocation of this method of the
     * form <tt>dst.put(a)</tt> behaves in exactly the same way as the
     * invocation
     *
     * <pre>
     *     dst.put(a, 0, a.length) </pre>
     *
     * @param   src
     *          The source array
     *
     * @return  This buffer
     *
     * @throws  BufferOverflowException
     *          If there is insufficient space in this buffer
     *
     * @throws  ReadOnlyBufferException
     *          If this buffer is read-only
     */
    public final ByteBuffer put(byte[] src) {
        return put(src, 0, src.length);
    }

    /**
     * Relative bulk <i>put</i> method&nbsp;&nbsp;<i>(optional operation)</i>.
     *
     * <p> This method transfers bytes into this buffer from the given
     * source array.  If there are more bytes to be copied from the array
     * than remain in this buffer, that is, if
     * <tt>length</tt>&nbsp;<tt>&gt;</tt>&nbsp;<tt>remaining()</tt>, then no
     * bytes are transferred and a {@link BufferOverflowException} is
     * thrown.
     *
     * <p> Otherwise, this method copies <tt>length</tt> bytes from the
     * given array into this buffer, starting at the given offset in the array
     * and at the current position of this buffer.  The position of this buffer
     * is then incremented by <tt>length</tt>.
     *
     * <p> In other words, an invocation of this method of the form
     * <tt>dst.put(src,&nbsp;off,&nbsp;len)</tt> has exactly the same effect as
     * the loop
     *
     * <pre>{@code
     *     for (int i = off; i < off + len; i++)
     *         dst.put(a[i]);
     * }</pre>
     *
     * except that it first checks that there is sufficient space in this
     * buffer and it is potentially much more efficient.
     *
     * @param  src
     *         The array from which bytes are to be read
     *
     * @param  offset
     *         The offset within the array of the first byte to be read;
     *         must be non-negative and no larger than <tt>array.length</tt>
     *
     * @param  length
     *         The number of bytes to be read from the given array;
     *         must be non-negative and no larger than
     *         <tt>array.length - offset</tt>
     *
     * @return  This buffer
     *
     * @throws  BufferOverflowException
     *          If there is insufficient space in this buffer
     *
     * @throws  IndexOutOfBoundsException
     *          If the preconditions on the <tt>offset</tt> and <tt>length</tt>
     *          parameters do not hold
     *
     * @throws  ReadOnlyBufferException
     *          If this buffer is read-only
     */
    public ByteBuffer put(byte[] src, int offset, int length) {
        checkBounds(offset, length, src.length);
        if (length > remaining())
            throw new BufferOverflowException();
        int end = offset + length;
        for (int i = offset; i < end; i++)
            this.put(src[i]);
        return this;
    }
```

One final form of the `put()` method transfers all the remaining bytes from one `ByteBuffer` into this buffer, incrementing the positions of both buffers.

```text
    /**
     * Relative bulk <i>put</i> method&nbsp;&nbsp;<i>(optional operation)</i>.
     *
     * <p> This method transfers the bytes remaining in the given source
     * buffer into this buffer.  If there are more bytes remaining in the
     * source buffer than in this buffer, that is, if
     * <tt>src.remaining()</tt>&nbsp;<tt>&gt;</tt>&nbsp;<tt>remaining()</tt>,
     * then no bytes are transferred and a {@link
     * BufferOverflowException} is thrown.
     *
     * <p> Otherwise, this method copies
     * <i>n</i>&nbsp;=&nbsp;<tt>src.remaining()</tt> bytes from the given
     * buffer into this buffer, starting at each buffer's current position.
     * The positions of both buffers are then incremented by <i>n</i>.
     *
     * <p> In other words, an invocation of this method of the form
     * <tt>dst.put(src)</tt> has exactly the same effect as the loop
     *
     * <pre>
     *     while (src.hasRemaining())
     *         dst.put(src.get()); </pre>
     *
     * except that it first checks that there is sufficient space in this
     * buffer and it is potentially much more efficient.
     *
     * @param  src
     *         The source buffer from which bytes are to be read;
     *         must not be this buffer
     *
     * @return  This buffer
     *
     * @throws  BufferOverflowException
     *          If there is insufficient space in this buffer
     *          for the remaining bytes in the source buffer
     *
     * @throws  IllegalArgumentException
     *          If the source buffer is this buffer
     *
     * @throws  ReadOnlyBufferException
     *          If this buffer is read-only
     */
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
```

## Methods: compact()

In addition to the `get()` and `put()` methods, `ByteBuffer` also defines another operation that affects the buffer's content. `compact()` **discards** any bytes before the buffer `position` and **copies** all bytes between the `position` and `limit` **to** the beginning of the buffer. The `position` is then set to the new limit, and the `limit` is set to the `capacity`. This method compacts a buffer by discarding elements that have already been read, and then prepares the buffer for appending new elements to those that remain.

> 笔记：这里介绍了一个compact()，希望以后有用到它的场景。

## Methods: get primitive types

All `Buffer` subclasses, such as `CharBuffer`, `IntBuffer`, and `FloatBuffer`, have analogous methods that are just like the `get()` and `put()` methods except that they operate on different data types.

> 笔记：这里是谈Buffer子类的共同点

`ByteBuffer` is unique among `Buffer` subclasses in that it has additional methods for reading and writing values of other **primitive types** from and into the byte buffer.

> 笔记：这里是谈ByteBuffer的特殊的地方

These methods have names such as `getInt()` and `putChar()`, and there are methods for all **primitive types** except `byte` and `boolean`. Each method reads or writes a single primitive value.

```text
public abstract short getShort();
public abstract short getShort(int index);

public abstract char getChar();
public abstract char getChar(int index);

public abstract int getInt();
public abstract int getInt(int index);

public abstract long getLong();
public abstract long getLong(int index);

public abstract float getFloat();
public abstract float getFloat(int index);

public abstract double getDouble();
public abstract double getDouble(int index);
```

Like the `get()` and `put()` methods, they come in **relative** and **absolute** variations.

> 笔记：分为relative和absolute两种情况来介绍

The **relative** methods start with the byte at the buffer's position and increment the position by the appropriate number of bytes (**two bytes** for a `char`, **four bytes** for an `int`, **eight bytes** for a `double`, etc.).

The **absolute** methods take a buffer index (a byte index that is not multiplied by the size of the primitive value) as an argument and do not modify the buffer position. The encoding of multibyte primitive values into a byte buffer can be done most-significant byte to least-significant byte (big-endian byte order) or the reverse (little-endian byte order).

The **byte order** used by these primitive-type `get()` and `put()` methods is specified by a `ByteOrder` object. The byte order for a `ByteBuffer` can be queried and set with the two forms of the `order()` method. The default byte order for all newly created ByteBuffer objects is `ByteOrder.BIG_ENDIAN`.

> 笔记：后续内容还有许多，暂时用不到，不想继续了。
