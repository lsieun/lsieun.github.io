---
title: "java.nio.Buffer"
sequence: "101"
---

[UP](/java-nio.html)


The `Buffer` classes are the foundation upon which `java.nio` is built.

> 描述Buffer类在整个java.nio包里的地位

A `Buffer` object is a container for a fixed amount of data.
It acts as a holding tank, or staging area,
where data can be stored and later retrieved.
**Buffers are filled and drained.**

> Buffer的本质是一个data container，可以进行fill和drain操作。

There is one buffer class for each of the nonboolean primitive data types.
Although buffers act upon the primitive data types they store, **buffers have a strong bias toward bytes.**
Nonbyte buffers can perform translation to and from bytes behind the scenes, depending on how the buffer was created.

> 一个父亲生了七个儿子，但是最疼爱的是小儿子，这在许多故事当中都是这样描述的。

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

**Buffers work hand in glove with channels.**
**Channels are portals** through which I/O transfers take place,
and **buffers are the sources or targets** of those data transfers.
For outgoing transfers, data you want to send is placed in a buffer, which is passed to a channel.
For inbound transfers, a channel deposits data in a buffer you provide.
This hand-off(交接) of buffers between cooperating objects
(usually objects you write and one or more Channel objects)
is key to efficient data handling.

> Buffer和Channel密切相关的。

```text
                                       ┌─── byte[]
                         ┌─── data ────┤
                         │             └─── direct
                         │
          ┌─── field ────┤             ┌─── mark
          │              │             │
          │              │             ├─── position
          │              └─── index ───┤
          │                            ├─── limit
          │                            │
          │                            └─── capacity
          │
          │                                    ┌─── isDirect()
          │                                    │
          │                                    ├─── isReadOnly()
          │              ┌─── data ────────────┤
          │              │                     │                    ┌─── hasArray()
Buffer ───┤              │                     │                    │
          │              │                     └─── array ──────────┼─── array()
          │              │                                          │
          │              │                                          └─── arrayOffset()
          │              │
          │              │                                                          ┌─── capacity()               : capacity
          │              │                                                          │
          │              │                                                          ├─── position()               : position
          │              │                                                          │
          │              │                     ┌─── basic ──────────────────────────┼─── position(int newPosition): position
          │              │                     │                                    │
          │              │                     │                                    ├─── limit()                  : limit
          │              │                     │                                    │
          │              │                     │                                    └─── limit(int newLimit)      : limit
          └─── method ───┤                     │
                         │                     │                                    ┌─── mark() : mark = position
                         │                     ├─── mark and reset ─────────────────┤
                         ├─── index ───────────┤                                    └─── reset(): position = mark
                         │                     │
                         │                     │                                    ┌─── clear()  : limit = capacity,  position = 0, mark = -1
                         │                     │                                    │
                         │                     ├─── clear, flip, rewind, compact ───┼─── flip()   : limit = position,  position = 0, mark = -1
                         │                     │                                    │
                         │                     │                                    └─── rewind() :                    position = 0, mark = -1
                         │                     │
                         │                     │                                    ┌─── hasRemaining(): position < limit
                         │                     └─── remain ─────────────────────────┤
                         │                                                          └─── remaining()   : limit - position
                         │
                         │                     ┌─── relative operations
                         └─── transfer data ───┤
                                               └─── absolute operations
```

## Buffer Basics

Conceptually, a buffer is an array of primitive data elements wrapped inside an object.
The advantage of a `Buffer` class over a simple array(`byte[]`) is that
it encapsulates data content and information about the data into a single object.

> 一个ByteBuffer与一个byte[]之间的区别

### Attributes

There are four attributes all buffers possess
that provide information about the contained data elements.
These are:

- Capacity:
  The maximum number of data elements the buffer can hold.
  The capacity is set when the buffer is created and can never be changed.  
- Limit:  
  The first element of the buffer that should not be read or written.
  In other words, the count of live elements in the buffer.  
- Position:
  The index of the next element to be read or written.
  The position is updated automatically by relative `get()` and `put()` methods.  
- Mark:
  A remembered position.
  Calling `mark()` sets `mark = position`.
  Calling `reset()` sets `position = mark`.
  The `mark` is undefined until set.

The following relationship between these four attributes always holds: (Invariants)

```text
0 <= mark <= position <= limit <= capacity
```

## Index

```java
package java.nio; 
 
public abstract class Buffer { 
    public final int capacity();
    public final int position();
    public final Buffer position (int newPosition);
    public final int limit();
    public final Buffer limit (int newLimit);
    
    public final Buffer mark();
    public final Buffer reset();
  
    public final Buffer clear();
    public final Buffer flip();
    public final Buffer rewind();
  
    public final int remaining();
    public final boolean hasRemaining();
  
    public abstract boolean isReadOnly();
} 
```

### clear, flip, and rewind

#### flip

```text
                                ┌─── clear()  : limit = capacity,  position =         0, mark = -1
                                │
                                ├─── flip()   : limit = position,  position =         0, mark = -1
clear, flip, rewind, compact ───┤
                                ├─── rewind() :                    position =         0, mark = -1
                                │
                                └─── compact(): limit = capacity,  position = remaining, mark = -1
```

The `flip()` method flips a buffer from a **fill state**, where data elements can be appended,
to a **drain state** ready for elements to be read out.

> flip导致状态变化：fill state ---> drain state

You must call `flip` exactly once. If you fail to call it or call it twice, the `ByteBuffer` will appear to be empty.

> 调用次数

What if you flip a buffer twice?
It effectively becomes zero-sized.
Apply the same steps to the buffer:
set the `limit` to the `position` and the `position` to `0`.
Both the `limit` and `position` become `0`.
Attempting `get()` on a buffer with `position` and `limit` of `0` results in a `BufferUnderflowException`.
`put()` causes a `BufferOverflowException`.

To make things worse, `ByteBuffer` often calls `flip` for you automatically e.g. on `FileChannel.map(FileChannel. MapMode. READ_ONLY,…)` and on `ByteBuffer.wrap`.
I consider this design grossly incompetent. The design maliciously attempts to trip up programmers.

> 这一段没有验证

You must use `flip` before the first read pass and `rewind` before subsequent ones.

#### rewind

```text
                                ┌─── clear()  : limit = capacity,  position =         0, mark = -1
                                │
                                ├─── flip()   : limit = position,  position =         0, mark = -1
clear, flip, rewind, compact ───┤
                                ├─── rewind() :                    position =         0, mark = -1
                                │
                                └─── compact(): limit = capacity,  position = remaining, mark = -1
```

The `rewind()` method is similar to `flip()` but does not affect the `limit`.
It only sets the `position` back to `0`.

> 两个方法对比

**You can use `rewind()` to go back and reread the data in a buffer that has already been flipped.**

> 作用：rewind方法可以对data进行重复读取

#### clear

Once a buffer has been filled and drained, it can be reused.

> 作用：reuse

The `clear()` method resets a buffer to an empty state.
It doesn't change any of the data elements of the buffer
but simply sets the `limit` to the `capacity` and the `position` back to `0`.
This leaves the buffer ready to be filled again.

> 对index的影响

```java
import java.nio.CharBuffer;

public class BufferFillDrain {
    private static final String[] array = {
            "All human beings are born free and equal in dignity and rights.",
            "Everyone has the right to life, liberty and security of person.",
            "No one shall be held in slavery or servitude; slavery and the slave trade shall be prohibited in all their forms.",
            "No one shall be subjected to torture or to cruel, inhuman or degrading treatment or punishment.",
            "Everyone has the right to recognition everywhere as a person before the law.",
            "No one shall be subjected to arbitrary arrest, detention or exile.",
    };

    private static void fillBuffer(CharBuffer buffer, String str) {
        for (int i = 0; i < str.length(); i++) {
            buffer.put(str.charAt(i));
        }
    }

    private static void drainBuffer(CharBuffer buffer) {
        while (buffer.hasRemaining()) {
            System.out.print(buffer.get());
        }
        System.out.println();
    }

    public static void main(String[] args) {
        CharBuffer buffer = CharBuffer.allocate(120);

        for (String str : array) {
            fillBuffer(buffer, str); // fill state
            buffer.flip();           // fill state ---> drain state
            drainBuffer(buffer);     // drain state
            buffer.clear();          // clear ---> fill state
        }
    }
}
```

### mark and reset

```text
                 ┌─── mark() : mark = position
mark and reset ──┤
                 └─── reset(): position = mark
```

The `mark` allows a buffer to remember a `position` and return to it later.
A buffer's `mark` is undefined until the `mark()` method is called, at which time the `mark` is set to the current `position`.

The `reset()` method sets the `position` to the current `mark`.
If the `mark` is undefined, calling `reset()` will result in an `InvalidMarkException`.

Some buffer methods will discard the `mark` if one is set (`rewind()`, `clear()`, and `flip()` always discard the `mark`).
Calling the versions of `limit()` or `position()` that take `index` arguments will discard the `mark`
if the new value being set is less than the current `mark`.

> 什么时候会让mark失效

Be careful not to confuse `reset()` and `clear()`.
The `clear()` method makes a buffer empty,
while `reset()` returns the `position` to a previously set `mark`.

> 注意reset()和clear()方法的区别

### remain

```text
           ┌─── hasRemaining(): position < limit
remain ────┤
           └─── remaining()   : limit - position
```

The `boolean` method `hasRemaining()` will tell you if you've reached the buffer's `limit` when draining.

```text
for (int i = 0; buffer.hasRemaining(); i++) {
    dst[i] = buffer.get();
}
```

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        // 第一步，得到buffer对象
        String str = "TO BE OR NOT TO BE";
        byte[] src = str.getBytes(StandardCharsets.UTF_8);
        ByteBuffer buffer = ByteBuffer.wrap(src);

        // 第二步，使用hasRemaining方法
        byte[] dst = new byte[20];
        for (int i = 0; buffer.hasRemaining(); i++) {
            dst[i] = buffer.get();
        }
        
        // 第三步，打印
        for (byte b : dst) {
            System.out.print((char) b);
        }
    }
}
```

Alternatively, the `remaining()` method will tell you the number of elements that remain from the current `position` to the `limit`.

```text
int count = buffer.remaining();
for (int i = 0; i < count; i++) {
    dst[i] = buffer.get();
}
```

If you have exclusive control of the buffer,
this would be more efficient because the `limit` will not be checked
(which requires invocation of an instance method on `buffer`)  on every iteration of the loop.
The first example above (`hasRemaining()`) would allow for multiple threads to drain elements from the `buffer` concurrently.

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        // 第一步，得到buffer对象
        String str = "TO BE OR NOT TO BE";
        byte[] src = str.getBytes(StandardCharsets.UTF_8);
        ByteBuffer buffer = ByteBuffer.wrap(src);

        // 第二步，使用hasRemaining方法
        byte[] dst = new byte[20];
        int count = buffer.remaining();
        for (int i = 0; i < count; i++) {
            dst[i] = buffer.get();
        }

        // 第三步，打印
        for (int i = 0; i < count; i++) {
            byte b = dst[i];
            System.out.print((char) b);
        }
    }
}
```

### Invocation chaining

One thing to notice about this API is that methods you would normally expect to return `void`,
such as `clear()`, instead return a `Buffer` reference.
These methods return a reference to the object they were invoked upon (`this`).
This is a class design technique that allows for **invocation chaining**.
Chaining invocations allows code like this:

```text
buffer.mark(); 
buffer.position(5); 
buffer.reset();
```

to be written like this:

```text
buffer.mark().position(5).reset();
```

The classes in `java.nio` were designed with **invocation chaining** in mind.
You may have seen invocation chaining used with the `StringBuffer` class.

When used wisely, **invocation chaining** can produce concise, elegant, and easy-to-read code.
When abused, it yields a cryptic tangle of muddled gibberish.
Use invocation chaining when it improves readability and makes your intentions clearer.
If clarity of purpose suffers when using invocation chaining, don't use it.
Always make your code easy for others to read.

> 使用invocation chaining是为了让代码具有易读性

## View

When a buffer that manages data elements contained in another buffer is created, it's known as a **view buffer**.

Most **view buffers** are views of `ByteBuffer`s.
Before moving on to the specifics of byte buffers,
we'll concentrate on the views that are common to all buffer types.

**View buffers** are always created by calling methods on **an existing buffer instance**.
Using a factory method on an existing buffer instance means that
**the view object will be privy to internal implementation details of the original buffer.**
It will be able to access the **data elements directly**,
whether they are stored in an array or by some other means,
rather than going through the `get()`/`put()` API of the original buffer object.
If the original buffer is direct, views of that buffer will have the same efficiency advantages.
Likewise for mapped buffers.

> privy 准许知情；可参与秘事 allowed to know about sth secret

In this section, we'll again use `CharBuffer` as an example,
but the same operations can be done on any of the primary buffer types.

```java
public abstract class CharBuffer extends Buffer implements CharSequence, Comparable { 
    // This is a partial API listing 
    
    public abstract CharBuffer duplicate();
    public abstract CharBuffer asReadOnlyBuffer();
    public abstract CharBuffer slice();
}
```

### duplicate

The `duplicate()` method creates a new buffer that is just like the original.
Both buffers share the data elements and have the same `capacity`,
but each buffer will have its own `position`, `limit`, and `mark`.
The duplicate buffer has the same view of the data as the original buffer.

> 两个buffer相似，但有些数据是独立的

Duplicating a buffer creates a new `Buffer` object but does not make a copy of the data.
Both the original buffer and the copy will act upon the same data elements.

> 操作的是同一份数据

Changes made to data elements in one buffer will be reflected in the other.

> data element发生改变之后

If the original buffer is **read-only**, or **direct**, the new buffer will inherit those attributes.

> direct和read-only会被view继承

### asReadOnlyBuffer

You can make a **read-only view** of a buffer with the `asReadOnlyBuffer()` method.
This is the same as `duplicate()`, except that the new buffer will disallow `put()`s,
and its `isReadOnly()` method will return `true`.

Attempting a call to `put()` on the read-only buffer will throw a `ReadOnlyBufferException`.

> 如果尝试put操作，会导致ReadOnlyBufferException

If a read-only buffer is sharing data elements with a writable buffer,
or is backed by a wrapped array, changes made to the writable buffer or
directly to the array will be reflected in all associated buffers,
including the read-only buffer.

> 当data element发生改变

### slice

Slicing a buffer is similar to duplicating,
but `slice()` creates a new buffer that starts at the original buffer's current `position` and
whose `capacity` is the number of elements remaining in the original buffer (`limit - position`).
The new buffer shares a subsequence of the data elements of the original buffer.

> 注意index的值

The **slice buffer** will also inherit **read-only** and **direct** attributes.

> 属性继承

To create a buffer that maps to positions 12-20 (nine elements) of a preexisting array, code like this does the trick:

```text
char[] myBuffer = new char[100];
CharBuffer charBuffer = CharBuffer.wrap(myBuffer);
charBuffer.position(12).limit(21);

CharBuffer slicedBuffer = charBuffer.slice();
BufferUtils.printIndex(slicedBuffer);
```

## Miscellaneous

### isReadOnly

Another thing to note about this API is the `isReadOnly()` method.
**All buffers are readable, but not all are writable.**

Each concrete buffer class implements `isReadOnly()` to indicate whether it will allow the buffer content to be modified.

> buffer子类当中对isReadOnly()方法进行实现

Some types of buffers may not have their data elements stored in an array.
The content of `MappedByteBuffer`, for example, may actually be a read-only file.

> 有些buffer并不是bytes，举例MappedByteBuffer

You can also explicitly create **read-only view buffers** to protect the content from accidental modification.
Attempting to modify a read-only buffer will cause a `ReadOnlyBufferException` to be thrown.

> view也会与read-only相关

### Byte Ordering

**Bytes Are Always Eight Bits, Right?**

These days, bytes are almost universally recognized as being eight bits.
But this wasn't always the case.
In ages past, bytes ranged anywhere from 3 to 12 or more bits each, with the most common being 6 to 9 bits.
The eight-bit byte was arrived at through a combination of **practicality** and **market forces**.
It's **practical** because eight bits are enough to represent a usable character set (English characters anyway),
eight is a power of two (which makes hardware design simpler),
eight neatly holds two hexadecimal digits,
and multiples of eight provide enough combined bits to store useful numeric values.
The **market force** was IBM.
The IBM 360 mainframe, first introduced in the 1960s, used eight-bit bytes.
That pretty much settled the matter.

> 小故事：解释为什么1个byte是8 bit

Although **the size of a byte** has been settled, the issue of **byte order** has not been universally agreed upon.

> byte order的是未决定的

The way multibyte numeric values are stored in memory is commonly referred to as **endian-ness**.
If the numerically most-significant byte of the number, the **big end**, is at the lower address,
then the system is **big-endian**.
If the least-significant byte comes first, it's **little-endian**.

> 两个概念：big-endian和little-endian

**Endian-ness is rarely a choice for software designers; it's usually dictated by the hardware design.**
Both types of endian-ness, sometimes known as **byte sex**, are in wide-spread use today.
There are good arguments for both approaches.
Intel processors use the little-endian design.
The Motorola CPU family, Sun Sparc, and PowerPC CPU architectures are all big-endian.

> Endian-ness是由硬件决定的，而是软件层面决定的。

The question of **byte order** even transcends **CPU hardware design**.
When the architects of the Internet were designing the Internet Protocol (IP) suite to interconnect all types of computers,
they recognized the problem of exchanging numeric data between systems with differing internal byte orders.
Therefore, the IPs define a notion of **network byte order**, which is big-endian.
All **multibyte numeric values** used within the protocol portions of IP packets must be converted
between the **local host byte order** and the common **network byte order**.

> Internet terminology refers to bytes as octets. The size of a byte can be ambiguous.
> By using the term "octet," the IP specifications explicitly mandate that bytes consist of eight bits.
>
> byte order也是network层面考虑的问题

In `java.nio`, byte order is encapsulated by the `ByteOrder` class:

```text
package java.nio; 
 
public final class ByteOrder 
{ 
    public static final ByteOrder BIG_ENDIAN;
    public static final ByteOrder LITTLE_ENDIAN; 
    
    public static ByteOrder nativeOrder();
    public String toString();
}
```

The `ByteOrder` class defines the constants that determine which byte order to use
when storing or retrieving multibyte values from a buffer.
The class acts as a type-safe enumeration.
It defines two public fields that are preinitialized with instances of itself.
Only these two instances of `ByteOrder` ever exist in the JVM, so they can be compared using the `==` operator.

> 介绍ByteOrder类的两个字段

If you need to know the native byte order of the hardware platform the JVM is running on,
invoke the `nativeOrder()` static class method.
It will return one of the two defined constants.
Calling `toString()` returns a `String` containing one of the two literal strings `BIG_ENDIAN` or `LITTLE_ENDIAN`.

> 介绍操作系统的byte order

Every buffer class has a current byte-order setting that can be queried by calling `order()`:

> 每一个buffer子类都有order()方法，但是Buffer类本身并没有定义order()方法

```text
public abstract class CharBuffer extends Buffer implements Comparable, CharSequence 
{
    // This is a partial API listing 
    
    public final ByteOrder order();
}
```

This method returns one of the two constants from `ByteOrder`.

For buffer classes other than `ByteBuffer`, the byte order is a read-only property and
may take on different values depending on how the buffer was created.

> 只有ByteBuffer类，可以修改byte order 

Except for `ByteBuffer`, buffers created by **allocation** or by **wrapping** an array
will return the same value from `order()`, as does `ByteOrder.nativeOrder()`.
This is because the elements contained in the buffer are directly accessed as primitive data within the JVM.

> 除了ByteBuffer，其它的buffer子类的byte order都与ByteOrder.nativeOrder()相同



### Not Thread Safe

Buffers are not thread-safe.
If you want to access a given buffer concurrently from multiple threads,
you'll need to do your own synchronization (e.g., acquiring a lock on the buffer object) prior to accessing the buffer.

## Exception

### Transferring data

Each subclass of this class defines two categories of `get` and `put` operations:

- Relative operations read or write one or more elements starting at the current position and then increment the position by the number of elements transferred.
  If the requested transfer exceeds the limit then
  - a relative `get` operation throws a `BufferUnderflowException` and
  - a relative `put` operation throws a `BufferOverflowException`; in either case, no data is transferred.
- Absolute operations take an explicit element `index` and do not affect the `position`.
  Absolute `get` and `put` operations throw an `IndexOutOfBoundsException` if the `index` argument exceeds the limit.

Relative operations can throw exceptions if the position advances too far.
For `put()`, if the operation would cause the `position` to exceed the `limit`, a `BufferOverflowException` will be thrown.
For `get()`, `BufferUnderflowException` is thrown if the position is not smaller than the limit.
Absolute accesses do not affect the buffer's position,
but can throw `java.lang.IndexOutOfBoundsException`
if the index you provide is out of range (negative or not less than the `limit`).

#### BufferOverflow

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        // bytes.length = 18
        String str = "TO BE OR NOT TO BE";
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);

        // buffer.capacity = 10
        ByteBuffer buffer = ByteBuffer.allocate(10);
        buffer.put(bytes);
    }
}
```

```text
Exception in thread "main" java.nio.BufferOverflowException
	at java.nio.HeapByteBuffer.put(HeapByteBuffer.java:192)
	at java.nio.ByteBuffer.put(ByteBuffer.java:859)
	at sample.HelloWorld.main(HelloWorld.java:15)
```

#### BufferUnderflow

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        // buffer.capacity = 18
        String str = "TO BE OR NOT TO BE";
        byte[] src = str.getBytes(StandardCharsets.UTF_8);
        ByteBuffer buffer = ByteBuffer.wrap(src);

        // dst.length = 20
        byte[] dst = new byte[20];
        buffer.get(dst);
    }
}
```

```text
Exception in thread "main" java.nio.BufferUnderflowException
	at java.nio.HeapByteBuffer.get(HeapByteBuffer.java:154)
	at java.nio.ByteBuffer.get(ByteBuffer.java:715)
	at sample.HelloWorld.main(HelloWorld.java:16)
```

#### IndexOutOfBounds

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        // buffer.capacity = 18
        String str = "TO BE OR NOT TO BE";
        byte[] src = str.getBytes(StandardCharsets.UTF_8);
        ByteBuffer buffer = ByteBuffer.wrap(src);

        // -1 or 18
        byte b = buffer.get(18);
        System.out.println(b);
    }
}
```

```text
Exception in thread "main" java.lang.IndexOutOfBoundsException
	at java.nio.Buffer.checkIndex(Buffer.java:567)
	at java.nio.HeapByteBuffer.get(HeapByteBuffer.java:142)
	at sample.HelloWorld.main(HelloWorld.java:15)
```

### ReadOnly
