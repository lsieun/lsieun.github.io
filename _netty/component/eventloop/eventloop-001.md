---
title: "EventLoop"
sequence: "101"
---

[UP](/netty.html)


## 普通任务和定时任务

```java
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        // 1. 创建事件循环组对象
        EventLoopGroup group = new NioEventLoopGroup(2);

        // 2. 获取下一个事件循环对象
        log.info(color("event loop = {}"), group.next());
        log.info(color("event loop = {}"), group.next());
        log.info(color("event loop = {}"), group.next());
        log.info(color("event loop = {}"), group.next());


        // 3. 执行普通任务
        group.next().submit(() -> {
            log.info(color("Hello {}"), new Date());
        });

        // 4. 执行定时任务
        group.next().scheduleAtFixedRate(() -> {
            log.info("ok");
        }, 1, 2, TimeUnit.SECONDS);


        TimeUnit.SECONDS.sleep(10);
        group.shutdownGracefully();
    }
}
```

## IO 任务

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;

@Slf4j
public class MyServer {
    public static void main(String[] args) {
        new ServerBootstrap()
                .group(new NioEventLoopGroup())
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel ch) throws Exception {
                        ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                ByteBuf buf = (ByteBuf) msg;
                                log.info(buf.toString(StandardCharsets.UTF_8));
                            }
                        });
                    }
                })
                .bind(9999);
    }
}
```

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.string.StringEncoder;
import lombok.extern.slf4j.Slf4j;

import java.util.Scanner;

@Slf4j
public class MyClient {
    public static void main(String[] args) throws InterruptedException {
        Channel channel = new Bootstrap()
                .group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(
                        new ChannelInitializer<Channel>() {
                            @Override
                            protected void initChannel(Channel ch) {
                                ch.pipeline().addLast(new StringEncoder());
                            }
                        })
                .connect("127.0.0.1", 9999)
                .sync()
                .channel();

        Scanner scanner = new Scanner(System.in);
        while (true) {
            String line = scanner.nextLine();
            if ("quit".equalsIgnoreCase(line)) {
                break;
            }
            if ("exit".equalsIgnoreCase(line)) {
                break;
            }
            channel.writeAndFlush(line);
        }
        scanner.close();

        channel.close();
    }
}
```

## 分工细化

### boss 和 worker

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class MyServer {
    public static void main(String[] args) {
        new ServerBootstrap()
                // boss 和 worker
                // boss 只负责 ServerSocketChannel 上的 accept 事件，而 worker 只负责 SocketChannel 上的 read/write 事件
                .group(new NioEventLoopGroup(1), new NioEventLoopGroup(2))
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel ch) throws Exception {
                        ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                ByteBuf buf = (ByteBuf) msg;
                                String str = buf.toString(StandardCharsets.UTF_8);
                                log.info(color(str));
                            }
                        });
                    }
                })
                .bind(9999);
    }
}
```

### worker 细分

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class MyServer {
    public static void main(String[] args) {
        // 细分 2:创建一个独立的 EventLoopGroup
        EventLoopGroup group = new DefaultEventLoopGroup();

        new ServerBootstrap()
                // boss 和 worker
                // boss 只负责 ServerSocketChannel 上的 accept 事件，而 worker 只负责 SocketChannel 上的 read/write 事件
                .group(new NioEventLoopGroup(1), new NioEventLoopGroup(2))
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    @Override
                    protected void initChannel(NioSocketChannel ch) throws Exception {
                        ch.pipeline().addLast("handler1", new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                ByteBuf buf = (ByteBuf) msg;
                                String str = buf.toString(StandardCharsets.UTF_8);
                                log.info(color(str));
                                ctx.fireChannelRead(msg); // 将消息传递给下一个 handler
                            }
                        }).addLast(group, "handler2", new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                ByteBuf buf = (ByteBuf) msg;
                                String str = buf.toString(StandardCharsets.UTF_8);
                                log.info(color(str));
                            }
                        });
                    }
                })
                .bind(9999);
    }
}
```

## Reference

- [Event Loop Threading Visualized](https://blog.stackademic.com/event-loop-threading-visualized-3cba36449772)
