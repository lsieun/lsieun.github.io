---
title: "Channel Parent"
sequence: "103"
---

[UP](/netty.html)

```java
public abstract class AbstractChannel extends DefaultAttributeMap implements Channel {
    private final Channel parent;

    protected AbstractChannel(Channel parent) {
        this.parent = parent;
    }
}
```

## NioServerSocketChannel

对于 `NioServerSocketChannel` 类来说，`parent` 字段总是 `null` 值：

```java
public class NioServerSocketChannel extends AbstractNioMessageChannel
                             implements io.netty.channel.socket.ServerSocketChannel {
    public NioServerSocketChannel(ServerSocketChannel channel) {
        // 第 1 个参数为 parent，值为 null
        super(null, channel, SelectionKey.OP_ACCEPT);
    }
}
```

## NioSocketChannel

对于 `NioSocketChannel` 类来说，`parent` 字段可能为 `null`，也可能不为 `null`：

```java
public class NioSocketChannel extends AbstractNioByteChannel implements io.netty.channel.socket.SocketChannel {
    public NioSocketChannel(SocketChannel socket) {
        this(null, socket);
    }

    public NioSocketChannel(Channel parent, SocketChannel socket) {
        super(parent, socket);
    }
}
```

在 `NioServerSocketChannel.doReadMessages()` 方法中，将 `this` 作为 `parent` 参数传递给 `NioSocketChannel` 的构造方法：

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

