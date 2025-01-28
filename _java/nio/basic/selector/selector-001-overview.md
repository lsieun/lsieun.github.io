---
title: "Readiness Selection"
sequence: "101"
---

[UP](/java-nio.html)


```text
            ┌─── instance ───┼─── Selector.open()
            │
            │                ┌─── SelectableChannel.register(selector, ops)
            ├─── register ───┤
            │                └─── SelectableChannel.register(selector, ops, attachment)
            │
            │                ┌─── Selector.selectNow()
Selector ───┤                │
            ├─── select ─────┼─── Selector.select(long timeout)
            │                │
            │                └─── Selector.select()
            │
            ├─── process ────┼─── Selector.selectedKeys()
            │
            └─── close ──────┼─── Selector.close()
```

For network programming, the second part of the new I/O APIs is **readiness selection**,
the ability to choose a socket that will not block when read or written.
This is primarily of interest to servers,
although clients running multiple simultaneous connections with several windows open - 
such as a web spider or a browser - 
can take advantage of it as well.

In order to perform **readiness selection**, different channels are registered with a `Selector` object.
Each channel is assigned a `SelectionKey`.
The program can then ask the `Selector` object for **the set of keys to the channels**
that are ready to perform the operation you want to perform without blocking.

## Selector 类

### 创建实例

创建对象实例，使用 `Selector.open()` 方法:

```java
public abstract class Selector implements Closeable {
    // 构造方法是 protected 修饰，外界无法访问到
    protected Selector() { }

    public static Selector open() throws IOException {
        return SelectorProvider.provider().openSelector();
    }
}
```

### 注册 Channel

**注册，就是将 channel 注册到 selector。**

但是，这个『注册』操作，并不是 `Selector` 类提供的功能，而是 `SelectableChannel` 类的 `register()` 方法提供的功能：

```java
public abstract class SelectableChannel extends AbstractInterruptibleChannel implements Channel {
    public abstract SelectionKey register(Selector sel, int ops, Object att) throws ClosedChannelException;

    public final SelectionKey register(Selector sel, int ops) throws ClosedChannelException {
        // 调用上面的方法
        return register(sel, ops, null);
    }
}
```

注意：**并不是所有的 channel 都可以选择的（Not all channels are selectable）**。
例如，`FileChannel` 不支持注册到 selector，而所有的网络相关的 channel 都支持 selector。

```text
register(Selector sel, int ops, Object att)
register(Selector sel, int ops)
```

- 第 1 个参数，就是 selector
- 第 2 个参数，`ops` 需要使用 `SelectionKey` 类提供的常量

```java
public abstract class SelectionKey {
    public static final int OP_READ = 1 << 0;
    public static final int OP_WRITE = 1 << 2;
    public static final int OP_CONNECT = 1 << 3;
    public static final int OP_ACCEPT = 1 << 4;
}
```

在使用时，`ops` 参数可以包含多个值：

```text
channel.register(selector, SelectionKey.OP_READ | SelectionKey.OP_WRITE);
```

- 第 3 个参数，`att`（attachment）表示返回值 `SelectionKey` 的『附属信息』。

The optional third argument is an attachment for the key.
This object is often used to store state for the connection.
For example, if you were implementing a web server,
you might attach a `FileInputStream` or `FileChannel` connected to the local file the server streams to the client.

After the different channels have been registered with the selector,
you can query the selector at any time to find out which channels are ready to be processed.
Channels may be ready for some operations and not others.
For instance, a channel could be ready for reading but not writing.

### 选择 Channel

`Selector` 类提供了三个方法用来选择channel：

```java
public abstract class Selector implements Closeable {
    public abstract int selectNow() throws IOException;

    public abstract int select() throws IOException;
    public abstract int select(long timeout) throws IOException;
}
```

三者的区别：等待的时间不同。

They differ in how long they wait to find a ready channel.
The first, `selectNow()`, performs a nonblocking select.
It returns immediately if no connections are ready to be processed now:

```text
public abstract int selectNow() throws IOException
```

The other two select methods are blocking:

```text
public abstract int select() throws IOException
public abstract int select(long timeout) throws IOException
```

The first method waits until **at least one registered channel is ready to be processed** before returning.
The second waits no longer than timeout milliseconds for a channel to be ready before returning `0`.
These methods are useful if your program doesn't have anything to do when no channels are ready to be processed.

### 处理

When you know the channels are ready to be processed, retrieve the ready channels using `selectedKeys()`:

```java
public abstract class Selector implements Closeable {
    public abstract Set<SelectionKey> selectedKeys();
}
```

```text
public abstract Set<SelectionKey> selectedKeys()
```

- 处理

You iterate through the returned set, processing each `SelectionKey` in turn.

- 移除

You'll also want to remove the key from the iterator to tell the selector that you've handled it.
Otherwise, the selector will keep telling you about it on future passes through the loop.

### 关闭

Finally, when you're ready to shut down the server or when you no longer need the selector, you should close it:

```java
public abstract class Selector implements Closeable {
    public abstract void close() throws IOException;
}
```


This step releases any resources associated with the selector.
More importantly, it cancels all keys registered with the selector and
interrupts up any threads blocked by one of this selector's `select` methods.

## The SelectionKey Class

`SelectionKey` objects serve as pointers to channels.
They can also hold an object **attachment**,
which is how you normally store the state for the connection on that channel.

`SelectionKey` objects are returned by the `register()` method when registering a channel with a selector.
However, you don't usually need to retain this reference.
The `selectedKeys()` method returns the same objects again inside a `Set`.
A single channel can be registered with multiple selectors.

When retrieving a `SelectionKey` from the set of selected keys, you often first test what that key is ready to do.
There are four possibilities:

```text
public final boolean isAcceptable()
public final boolean isConnectable()
public final boolean isReadable()
public final boolean isWritable()
```

This test isn't always necessary.
In some cases, the selector is only testing for one possibility and will only return keys to do that one thing.
But if the selector does test for multiple readiness states,
you'll want to test which one kicked the channel into the ready state before operating on it.
It's also possible that a channel is ready to do more than one thing.

### channel

Once you know what the channel associated with the key is ready to do,
retrieve the channel with the `channel()` method:

```text
public abstract SelectableChannel channel()
```

### attachment

If you've stored an object in the `SelectionKey` to hold state information,
you can retrieve it with the `attachment()` method:

```text
public final Object attachment()
```

### cancel

Finally, when you're finished with a connection, deregister its `SelectionKey` object
so the selector doesn't waste any resources querying it for readiness.
I don't know that this is absolutely essential in all cases, but it doesn't hurt.
You do this by invoking the key's `cancel()` method:

```text
public abstract void cancel()
```

However, this step is only necessary if you haven't closed the channel.
**Closing a channel** automatically deregisters all keys for that channel in all selectors.
Similarly, **closing a selector** invalidates all keys in that selector.

三种方式：

- `SelectionKey.cancel()`
- `Channel.close()`
- `Selector.close()`

## Reference

- [Introduction to the Java NIO Selector](https://www.baeldung.com/java-nio-selector)
