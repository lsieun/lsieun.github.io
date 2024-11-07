---
title: "Idle Connection"
sequence: "101"
---

[UP](/netty.html)

## IdleStateHandler

```java
package io.netty.handler.timeout;

public class IdleStateHandler extends ChannelDuplexHandler {
}
```

![](/assets/images/netty/uml/uml-class-diagram-IdleStateHandler.png)

## 示例

### Initializer

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.timeout.IdleStateHandler;

import java.util.concurrent.TimeUnit;

public class ChannelIdleShutdownInitializer extends ChannelInitializer<Channel> {
    private final long allIdleSeconds;

    public ChannelIdleShutdownInitializer() {
        this(15);
    }

    public ChannelIdleShutdownInitializer(long allIdleSeconds) {
        this.allIdleSeconds = allIdleSeconds;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(
                "idleStateHandler",
                new IdleStateHandler(0, 0, allIdleSeconds, TimeUnit.SECONDS)
        );
        pipeline.addLast("myIdleHandler", new ChannelIdleShutdownHandler());
    }
}
```

```java
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.timeout.IdleStateEvent;

public class ChannelIdleShutdownHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof IdleStateEvent) {
            ctx.close();
        }
        else {
            super.userEventTriggered(ctx, evt);
        }
    }
}
```

### Server

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;


public class MyServer {

    public static final String HOST = "localhost";
    public static final int PORT = 9999;

    public static void main(String[] args) throws InterruptedException {
        NioEventLoopGroup bossGroup = new NioEventLoopGroup(1);
        NioEventLoopGroup workGroup = new NioEventLoopGroup();

        try {
            // 第 1 步，bootstrap 配置
            ServerBootstrap bootstrap = new ServerBootstrap()
                    .group(bossGroup, workGroup)
                    .channel(NioServerSocketChannel.class)
                    .handler(new ChannelIdleShutdownInitializer(30))
                    .childHandler(new ChannelInitializer<Channel>() {
                        @Override
                        protected void initChannel(Channel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new ChannelStateHandler());
                            pipeline.addLast(new EchoServerHandler());
                        }
                    });

            // 第 2 步，等待绑定端口（阻塞）
            ChannelFuture future = bootstrap.bind(HOST, PORT).sync();
            LogUtils.color("服务器启动：{}:{}", HOST, PORT);

            // 第 3 步，获取 ServerSocketChannel
            Channel channel = future.channel();

            // 第 4 步，等待 ServerSocketChannel 关闭（阻塞）
            channel.closeFuture().sync();
            LogUtils.color("服务器关闭");
        }
        finally {
            bossGroup.shutdownGracefully();
            workGroup.shutdownGracefully();
        }
    }
}
```

### Client

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;


public class MyClient {
    public static void main(String[] args) throws InterruptedException {
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            // 第 1 步，bootstrap 配置
            Bootstrap bootstrap = new Bootstrap()
                    .group(workerGroup)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<Channel>() {
                        @Override
                        protected void initChannel(Channel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new ChannelIdleShutdownInitializer(10));
                            pipeline.addLast(new EchoClientHandler());
                        }
                    });

            // 第 2 步，连接服务器（阻塞）
            ChannelFuture future = bootstrap.connect(MyServer.HOST, MyServer.PORT).sync();
            LogUtils.color("客户端启动: {}", future.channel().localAddress());

            // 第 3 步，获取 SocketChannel
            Channel channel = future.channel();
            ConsoleUtils.messageLoop(channel);

            // 第 4 步，等待 SocketChannel 关闭（阻塞）
            channel.closeFuture().sync();
            LogUtils.color("客户端关闭");
        }
        finally {
            workerGroup.shutdownGracefully();
        }
    }
}
```
