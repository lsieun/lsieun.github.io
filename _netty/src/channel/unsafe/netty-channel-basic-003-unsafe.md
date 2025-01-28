---
title: "Unsafe"
sequence: "103"
---

[UP](/netty.html)

![](/assets/images/netty/channel/netty-channel-unsafe-class-hierarchy.svg)

```java
public interface Channel extends AttributeMap, ChannelOutboundInvoker, Comparable<Channel> {
    /**
     * <em>Unsafe</em> operations that should <em>never</em> be called from user-code.
     */
    interface Unsafe {
        void register(EventLoop eventLoop, ChannelPromise promise);
        void deregister(ChannelPromise promise);
        void bind(SocketAddress localAddress, ChannelPromise promise);
        void connect(SocketAddress remoteAddress, SocketAddress localAddress, ChannelPromise promise);
        void disconnect(ChannelPromise promise);
        void close(ChannelPromise promise);
        void closeForcibly();

        void beginRead();
        void write(Object msg, ChannelPromise promise);
        void flush();

        SocketAddress localAddress();
        SocketAddress remoteAddress();
        
        ChannelPromise voidPromise();

        RecvByteBufAllocator.Handle recvBufAllocHandle();
        ChannelOutboundBuffer outboundBuffer();
    }
}
```

| Unsafe               | Server | Client |
|----------------------|--------|--------|
| `register`           | OK     | OK     |
| `deregister`         | OK     | OK     |
| `bind`               | OK     | OK     |
| `connect`            |        | OK     |
| `disconnect`         |        | OK     |
| `close`              | OK     | OK     |
| `closeForcibly`      | OK     | OK     |
| `beginRead`          | OK     | OK     |
| `write`              |        | OK     |
| `flush`              |        | OK     |
| `localAddress`       | OK     | OK     |
| `remoteAddress`      |        | OK     |
| `voidPromise`        | OK     | OK     |
| `recvBufAllocHandle` | OK     | OK     |
| `outboundBuffer`     | OK     | OK     |


![](/assets/images/netty/channel/unsafe/netty-channel-unsafe-methods.svg)

