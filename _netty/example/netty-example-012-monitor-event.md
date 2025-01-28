---
title: "连接及活动状态监测"
sequence: "112"
---

[UP](/netty.html)


监测

- 新增连接 handlerAdd
- 断开连接 handlerRemove
- 连接活动 channelActive
- 连接非活动 channelInActive

## Server

### MyServer

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import lsieun.utils.LogUtils;

public class MyServer {

    public static void main(String[] args) throws InterruptedException {
        NioEventLoopGroup group = new NioEventLoopGroup();

        try {
            // 第 1 步，bootstrap 配置
            ServerBootstrap serverBootstrap = new ServerBootstrap()
                    .group(group)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<>() {
                        @Override
                        protected void initChannel(Channel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new MyServerHandler());
                        }
                    });

            // 第 2 步，等待绑定端口（阻塞）
            ChannelFuture channelFuture = serverBootstrap.bind(9999).sync();

            // 第 3 步，获取 ServerSocketChannel
            Channel channel = channelFuture.channel();
            LogUtils.color("服务器 {} 启动完成，等待客户端连接...", channel.localAddress());

            // 第 4 步，等待 ServerSocketChannel 关闭（阻塞）
            channel.closeFuture().sync();
        }
        finally {
            group.shutdownGracefully().sync();
            LogUtils.color("服务器关闭");
        }
    }
}
```

### MyServerHandler

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.CharsetUtil;
import io.netty.util.concurrent.GlobalEventExecutor;
import lsieun.utils.LogUtils;

import java.util.Formatter;

import static lsieun.utils.ConsoleColors.cyanBold;

@ChannelHandler.Sharable
public class MyServerHandler extends ChannelInboundHandlerAdapter {

    // 通道数组，保存所有注册到 EventLoop 的通道
    public static ChannelGroup channels = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 接收客户端数据
        ByteBuf in = (ByteBuf) msg;
        String str = in.toString(CharsetUtil.UTF_8);
        LogUtils.color("客户端 [{}] {}", ctx.channel().remoteAddress(), str);

        // 向客户端写出回数据
        if ("list".equalsIgnoreCase(str)) {
            StringBuilder sb = new StringBuilder();
            Formatter fm = new Formatter(sb);
            fm.format("client list:%n");
            for (Channel ch : channels) {
                fm.format("- %s%n", ch.remoteAddress());
            }
            ctx.writeAndFlush(Unpooled.copiedBuffer(cyanBold(sb.toString()), CharsetUtil.UTF_8));
        }
        else if ("shutdown".equals(str)) {
            for (Channel ch : channels) {
                ch.close();
            }
            ctx.channel().parent().close();
        }
        else {
            ctx.writeAndFlush(Unpooled.copiedBuffer(cyanBold(str), CharsetUtil.UTF_8));
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println("exceptionCaught: " + cause.getMessage());
        ctx.close();
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        // 新建立连接时触发的动作
        Channel ch = ctx.channel();
        LogUtils.color("客户端 [{}] 已连接", ch.remoteAddress());
        channels.add(ch);
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        // 连接断开时触发的动作
        Channel ch = ctx.channel();
        LogUtils.color("客户端 [{}] 已断开", ch.remoteAddress());
        channels.remove(ch);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        // 通道处于活动状态触发的动作，该方法只会在通道建立时调用一次
        Channel ch = ctx.channel();
        LogUtils.color("客户端 [{}] 在线", ch.remoteAddress());

        // 发送信息到客户端
        ctx.writeAndFlush(
                Unpooled.copiedBuffer(cyanBold("连接建立成功，准备接收消息"), CharsetUtil.UTF_8)
        );
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        Channel ch = ctx.channel();
        LogUtils.color("客户端 [{}] 掉线", ch.remoteAddress());
    }
}
```

## Client

### MyClient

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import lsieun.utils.ConsoleUtils;


public class MyClient {
    public static void main(String[] args) throws InterruptedException {
        NioEventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap bootstrap = new Bootstrap()
                    .group(group)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<NioSocketChannel>() {
                        @Override
                        protected void initChannel(NioSocketChannel ch) throws Exception {
                            ch.pipeline().addLast(new MyClientHandler());
                        }
                    });

            ChannelFuture channelFuture = bootstrap.connect("localhost", 9999).sync();

            Channel channel = channelFuture.channel();
            ConsoleUtils.readAndSend(channel);
            channel.closeFuture().sync();
        }
        catch (InterruptedException ignored) {
        }
        finally {
            group.shutdownGracefully().sync();
        }
    }
}
```

### MyClientHandler

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.util.CharsetUtil;
import lsieun.utils.LogUtils;


@ChannelHandler.Sharable
public class MyClientHandler extends SimpleChannelInboundHandler<ByteBuf> {

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        String str = msg.toString(CharsetUtil.UTF_8);
        LogUtils.log("客户端 [{}] 接收：{}", ctx.channel().localAddress(), str);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        LogUtils.color("exceptionCaught: {}", cause.getMessage());

        ctx.close();
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        // 通道处于活动状态触发的动作，该方法只会在通道建立时调用一次
        Channel ch = ctx.channel();
        LogUtils.color("与服务器端 [{}] 连接激活", ch.remoteAddress());
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        Channel ch = ctx.channel();
        LogUtils.color("与服务器端 [{}] 断开连接", ch.remoteAddress());
    }
}
```
