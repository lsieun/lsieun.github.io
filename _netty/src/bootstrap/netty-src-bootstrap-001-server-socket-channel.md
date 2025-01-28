---
title: "ServerBootstrap 启动"
sequence: "101"
---

[UP](/netty.html)

![](/assets/images/netty/bootstrap/netty-bootstrap-invoke-java-nio-1.svg)

![](/assets/images/netty/bootstrap/netty-bootstrap-invoke-java-nio-2.svg)

![](/assets/images/netty/bootstrap/netty-bootstrap-invoke-java-nio-3.svg)

![](/assets/images/netty/bootstrap/server-bootstrap-channel-java-nio.svg)

```text
Selector selector = Selector.open();

ServerSocketChannel ssc = ServerSocketChannel.open();
ssc.configureBlocking(false);
        
SelectionKey sscKey = ssc.register(selector, 0, null);

ssc.bind(new InetSocketAddress(PORT));

sscKey.interestOps(SelectionKey.OP_ACCEPT);
```

```text
channel -> eventloop --> newThread --> registerChannel
```

- 创建服务器 Channel
- 初始化服务端 Channel
- 注册 Selector
- 端口绑定

两个注册：

- Netty Channel 注册：NioServerSocketChannel 到 EventLoop 的注册
- Java NIO Channel 注册：ServerSocketChannel 到 Selector 的注册

## ServerBootstrap

### bind

```java
public abstract class AbstractBootstrap<B extends AbstractBootstrap<B, C>, C extends Channel> implements Cloneable {
    public ChannelFuture bind(int inetPort) {
        return bind(new InetSocketAddress(inetPort));
    }

    private ChannelFuture doBind(final SocketAddress localAddress) {
        final ChannelFuture regFuture = initAndRegister();

        doBind0(regFuture, channel, localAddress, promise);
    }
}
```

```java
package java.nio.channels;

public abstract class ServerSocketChannel
    extends AbstractSelectableChannel
    implements NetworkChannel
{
    public static ServerSocketChannel open() throws IOException {
        return SelectorProvider.provider().openServerSocketChannel();
    }
}
```

## AbstractNioChannel

```java
public abstract class AbstractNioChannel extends AbstractChannel {
    protected AbstractNioChannel(Channel parent, SelectableChannel ch, int readInterestOp) {
        this.ch = ch;
        this.readInterestOp = readInterestOp;
        // 非阻塞
        ch.configureBlocking(false);
    }

    @Override
    protected void doRegister() throws Exception {
        selectionKey = javaChannel().register(eventLoop().unwrappedSelector(), 0, this);
    }

    @Override
    protected void doBeginRead() throws Exception {
        final SelectionKey selectionKey = this.selectionKey;
        final int interestOps = selectionKey.interestOps();
        if ((interestOps & readInterestOp) == 0) {
            // CODE:【ServerBootstrap 启动】selectionKey.interestOps(ops)
            selectionKey.interestOps(interestOps | readInterestOp);
        }
    }
}
```

## NioServerSocketChannel

```java
public class NioServerSocketChannel extends AbstractNioMessageChannel
                             implements io.netty.channel.socket.ServerSocketChannel {

    private static ServerSocketChannel newChannel(SelectorProvider provider, InternetProtocolFamily family) {
        return provider.openServerSocketChannel();
    }
    
    @Override
    protected void doBind(SocketAddress localAddress) throws Exception {
        if (PlatformDependent.javaVersion() >= 7) {
            // CODE: channel.bind(address, backlog)
            javaChannel().bind(localAddress, config.getBacklog());
        } else {
            javaChannel().socket().bind(localAddress, config.getBacklog());
        }
    }
}
```




```java
public abstract class Selector implements Closeable {
    public abstract Set<SelectionKey> selectedKeys();
}
```
