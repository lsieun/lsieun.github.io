---
title: "ServerSocketChannel.accept()"
sequence: "102"
---

[UP](/netty.html)

```java
public final class NioEventLoop extends SingleThreadEventLoop {
    private void processSelectedKey(SelectionKey k, AbstractNioChannel ch) {
        final AbstractNioChannel.NioUnsafe unsafe = ch.unsafe();
        int readyOps = k.readyOps();
        
        // 代码省略

        if ((readyOps & (SelectionKey.OP_READ | SelectionKey.OP_ACCEPT)) != 0 || readyOps == 0) {
            unsafe.read();
        }
    }
}
```

```java
public abstract class AbstractNioMessageChannel extends AbstractNioChannel {
    private final class NioMessageUnsafe extends AbstractNioUnsafe {
        private final List<Object> readBuf = new ArrayList<Object>();

        @Override
        public void read() {
            int localRead = doReadMessages(readBuf);
            pipeline.fireChannelRead(readBuf.get(i));
        }
    }
}
```

```java
public class NioServerSocketChannel extends AbstractNioMessageChannel
                             implements io.netty.channel.socket.ServerSocketChannel {
    @Override
    protected int doReadMessages(List<Object> buf) throws Exception {
        SocketChannel ch = SocketUtils.accept(javaChannel());
        buf.add(new NioSocketChannel(this, ch));
        return 1;
    }
}
```

## Channel

### NioSocketChannel

在 `NioSocketChannel` 的构造方法中，主要做两件事：

- 调用父类的构造方法
- 创建 `NioSocketChannelConfig` 对象

```java
public class NioSocketChannel extends AbstractNioByteChannel implements io.netty.channel.socket.SocketChannel {
    public NioSocketChannel(Channel parent, SocketChannel socket) {
        super(parent, socket);
        config = new NioSocketChannelConfig(this, socket.socket());
    }
}
```

在 `AbstractNioByteChannel` 的构造方法中，又增加了 `SelectionKey.OP_READ` 参数：

```java
public abstract class AbstractNioByteChannel extends AbstractNioChannel {
    protected AbstractNioByteChannel(Channel parent, SelectableChannel ch) {
        super(parent, ch, SelectionKey.OP_READ);
    }
}
```

在 `AbstractNioChannel` 的构造方法中，做三步操作：

- 将 `parent` 参数传递给父类
- 将 `ch` 和 `readInterestOp` 存储起来
- 将 `ch` 设置为非阻塞

```java
public abstract class AbstractNioChannel extends AbstractChannel {
    protected AbstractNioChannel(Channel parent, SelectableChannel ch, int readInterestOp) {
        super(parent);
        this.ch = ch;
        this.readInterestOp = readInterestOp;
        ch.configureBlocking(false);
    }
}
```

在 `AbstractChannel` 的构造方法中，完成以下事情：

- 将 `parent` 参数存储起来
- 初始化 `id`、`unsafe` 和 `pipeline`

```java
public abstract class AbstractChannel extends DefaultAttributeMap implements Channel {
    protected AbstractChannel(Channel parent) {
        this.parent = parent;
        id = newId();
        unsafe = newUnsafe();
        pipeline = newChannelPipeline();
    }
}
```

## Config

```java
public class NioSocketChannel extends AbstractNioByteChannel implements io.netty.channel.socket.SocketChannel {
    private final class NioSocketChannelConfig extends DefaultSocketChannelConfig {
        private NioSocketChannelConfig(NioSocketChannel channel, Socket javaSocket) {
            super(channel, javaSocket);
            calculateMaxBytesPerGatheringWrite();
        }
    }
}
```

```java
public class DefaultSocketChannelConfig extends DefaultChannelConfig
                                        implements SocketChannelConfig {
    public DefaultSocketChannelConfig(SocketChannel channel, Socket javaSocket) {
        super(channel);
        
        // 代码简化
        this.javaSocket = javaSocket;

        // 代码简化
        // Enable TCP_NODELAY by default if possible.
        if (PlatformDependent.canEnableTcpNoDelayByDefault()) {
            setTcpNoDelay(true);
        }
    }

    @Override
    public SocketChannelConfig setTcpNoDelay(boolean tcpNoDelay) {
        // 代码简化
        javaSocket.setTcpNoDelay(tcpNoDelay);
        return this;
    }
}
```
