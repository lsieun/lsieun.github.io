---
title: "数据：字符串"
sequence: "103"
---

[UP](/netty.html)


## 第一版

### Server

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.CharsetUtil;

@ChannelHandler.Sharable
public class ServerChannelInboundHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 接收客户端数据
        ByteBuf in = (ByteBuf) msg;
        System.out.println("Received message: " + in.toString(CharsetUtil.UTF_8));

        // 向客户端写出回数据
        ctx.writeAndFlush(Unpooled.copiedBuffer(
                "Success", CharsetUtil.UTF_8
        ));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
```

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import lsieun.netty.handler.ServerChannelInboundHandler;

import java.net.InetSocketAddress;

public class MyServer {

    public static void main(String[] args) throws InterruptedException {
        NioEventLoopGroup group = new NioEventLoopGroup();

        try {
            ServerBootstrap serverBootstrap = new ServerBootstrap()
                    .group(group)
                    .localAddress(new InetSocketAddress(9999))
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<NioSocketChannel>() {
                @Override
                protected void initChannel(NioSocketChannel ch) throws Exception {
                    ch.pipeline().addLast(new ServerChannelInboundHandler());
                }
            });

            ChannelFuture channelFuture = serverBootstrap.bind();
            channelFuture.sync();

            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException ignored) {
        } finally {
            group.shutdownGracefully().sync();
        }
    }
}
```

### Client

- `@ChannelHandler.Sharable`
- `SimpleChannelInboundHandler`
    - channelRead0
    - exceptionCaught

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.util.CharsetUtil;

@ChannelHandler.Sharable
public class ClientChannelInboundHandler extends SimpleChannelInboundHandler<ByteBuf> {

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        String str = msg.toString(CharsetUtil.UTF_8);
        System.out.println("Received message: " + str);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
```

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.CharsetUtil;


public class MyClient {
    public static void main(String[] args) throws InterruptedException {
        NioEventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap bootstrap = new Bootstrap()
                    .group(group)
                    .remoteAddress("127.0.0.1", 9999)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<NioSocketChannel>() {
                        @Override
                        protected void initChannel(NioSocketChannel ch) throws Exception {
                            ch.pipeline().addLast(new ClientChannelInboundHandler());
                        }
                    });

            ChannelFuture channelFuture = bootstrap.connect();
            channelFuture.sync();

            Channel channel = channelFuture.channel();
            channel.writeAndFlush(Unpooled.copiedBuffer("Hello World", CharsetUtil.UTF_8));

            channel.closeFuture().sync();
        } catch (InterruptedException e) {
        } finally {
            group.shutdownGracefully().sync();
        }
    }
}
```
