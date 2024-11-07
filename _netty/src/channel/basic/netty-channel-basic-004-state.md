---
title: "Channel 状态：Open/Registered/Active/Writable"
sequence: "104"
---

[UP](/netty.html)

## 方法定义

```java
public interface Channel extends AttributeMap, ChannelOutboundInvoker, Comparable<Channel> {
    /**
     * Returns {@code true} if the {@link Channel} is open and may get active later
     */
    boolean isOpen();

    /**
     * Returns {@code true} if the {@link Channel} is registered with an {@link EventLoop}.
     */
    boolean isRegistered();

    /**
     * Return {@code true} if the {@link Channel} is active and so connected.
     */
    boolean isActive();

    /**
     * Returns {@code true} if and only if the I/O thread will perform the
     * requested write operation immediately.  Any write requests made when
     * this method returns {@code false} are queued until the I/O thread is
     * ready to process the queued write requests.
     */
    boolean isWritable();
}
```

![](/assets/images/netty/channel/netty-channel-state.svg)


## 方法实现

### isOpen()

```java
public abstract class AbstractNioChannel extends AbstractChannel {
    private final SelectableChannel ch;

    @Override
    public boolean isOpen() {
        return ch.isOpen();
    }
}
```

在 `java.nio.channels.Channel` 的文档中描述如下：

```text
A channel is either open or closed.
A channel is open upon creation, and once closed it remains closed.
```

### isRegistered()

在 Netty 当中，register 有两个阶段：

- 第一个阶段，是将 Netty Channel 注册到 EventLoop 上
- 第二个阶段，是将 Java NIO Channel 注册到 Selector 上

```java
public abstract class AbstractChannel extends DefaultAttributeMap implements Channel {
    /**
     * true if the channel has never been registered, false otherwise
     */
    private boolean neverRegistered = true;
    
    private volatile boolean registered;

    @Override
    public boolean isRegistered() {
        return registered;
    }

    protected abstract class AbstractUnsafe implements Unsafe {
        @Override
        public final void register(EventLoop eventLoop, final ChannelPromise promise) {
            // TRACE: Channel 进行 Register 的两个阶段中的第一阶段，将 Netty Channel 注册到 EventLoop 上
            //  channel.eventLoop = eventLoop
            AbstractChannel.this.eventLoop = eventLoop;

            register0(promise);
        }

        private void register0(ChannelPromise promise) {
            // NOTE: 是否首次注册 
            boolean firstRegistration = neverRegistered;
            
            // TRACE: Channel 进行 Register 的两个阶段中的第二阶段，将 Java NIO Channel 注册到 Selector 上
            //  channel.register(selector, ops, attachment)
            doRegister();

            // NOTE: 不再是首次注册
            neverRegistered = false;

            // TRACE: Channel 进行 Register 的两个阶段完成，将 registered 设置为 true
            registered = true;

            // TRACE: pipeline - fireChannelRegistered
            pipeline.fireChannelRegistered();

            // NOTE: 如果是 NioSocketChannel，isActive() 会返回 true；如果是 NioServerSocketChannel，则返回 false。
            if (isActive()) {
                if (firstRegistration) {
                    // TRACE: pipeline - fireChannelActive
                    pipeline.fireChannelActive();
                }
                else if (config().isAutoRead()) {
                    beginRead();
                }
            }
        }

        @Override
        public final void deregister(final ChannelPromise promise) {
            deregister(promise, false);
        }
        
        private void deregister(final ChannelPromise promise, final boolean fireChannelInactive) {
            if (registered) {
                // NOTE: 修改 register 为 false
                registered = false;

                // TRACE: pipeline - fireChannelUnregistered
                pipeline.fireChannelUnregistered();
            }
        }
    }
}
```

### isActive()

对于 `NioServerSocketChannel` 类来说，`isActive()` 返回 `true` 需要三个条件：

- 第 1 个条件，`ServerSocketChannel ssc = ServerSocketChannel.open();`
- 第 2 个条件，`SelectionKey sscKey = ssc.register(selector, 0, null);`
- 第 3 个条件，`ssc.bind(new InetSocketAddress(PORT));`

```java
public class NioServerSocketChannel extends AbstractNioMessageChannel
                             implements io.netty.channel.socket.ServerSocketChannel {
    @Override
    public boolean isActive() {
        // As java.nio.ServerSocketChannel.isBound() will continue to return true
        // even after the channel was closed
        // we will also need to check if it is open.
        return isOpen() && javaChannel().socket().isBound();
    }
}
```

对于 `NioSocketChannel` 类来说，`isActive()` 返回 `true` 分为两种情况：

如果在服务端，需要一个条件即可：

- 第 1 个条件，`SocketChannel sc = ssc.accept();`

如果在客户端，需要两个条件：

- 第 1 个条件，`SocketChannel sc = SocketChannel.open();`
- 第 2 个条件，`sc.connect(new InetSocketAddress(HOST, PORT));`

```java
public class NioSocketChannel extends AbstractNioByteChannel implements io.netty.channel.socket.SocketChannel {
    @Override
    public boolean isActive() {
        SocketChannel ch = javaChannel();
        return ch.isOpen() && ch.isConnected();
    }
}
```

### isWritable()

```java
public abstract class AbstractChannel extends DefaultAttributeMap implements Channel {
    private final Unsafe unsafe;

    protected AbstractChannel(Channel parent) {
        unsafe = newUnsafe();
    }

    @Override
    public boolean isWritable() {
        ChannelOutboundBuffer buf = unsafe.outboundBuffer();
        return buf != null && buf.isWritable();
    }

    protected abstract class AbstractUnsafe implements Unsafe {
        private volatile ChannelOutboundBuffer outboundBuffer = new ChannelOutboundBuffer(AbstractChannel.this);

        @Override
        public final ChannelOutboundBuffer outboundBuffer() {
            return outboundBuffer;
        }
    }
}
```
