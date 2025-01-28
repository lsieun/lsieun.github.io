---
title: "Redis"
sequence: "104"
---

[UP](/netty.html)


## 第一版

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        NioEventLoopGroup group = new NioEventLoopGroup();

        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group);
            bootstrap.channel(NioSocketChannel.class);
            bootstrap.handler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) throws Exception {
                    ChannelPipeline pipeline = ch.pipeline();
                    pipeline.addLast(new LoggingHandler(LogLevel.INFO));
                    pipeline.addLast(new ChannelInboundHandlerAdapter() {
                        @Override
                        public void channelActive(ChannelHandlerContext ctx) throws Exception {
                            ByteBuf buf = ByteBufAllocator.DEFAULT.buffer();
                            buf.writeBytes("*3".getBytes());
                            buf.writeBytes("\r\n".getBytes());
                            buf.writeBytes("$3".getBytes());
                            buf.writeBytes("\r\n".getBytes());
                            buf.writeBytes("set".getBytes());
                            buf.writeBytes("\r\n".getBytes());
                            buf.writeBytes("$8".getBytes());
                            buf.writeBytes("\r\n".getBytes());
                            buf.writeBytes("username".getBytes());
                            buf.writeBytes("\r\n".getBytes());
                            buf.writeBytes("$6".getBytes());
                            buf.writeBytes("\r\n".getBytes());
                            buf.writeBytes("tomcat".getBytes());
                            buf.writeBytes("\r\n".getBytes());
                            ctx.writeAndFlush(buf);
                        }

                        @Override
                        public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                            ByteBuf buf = (ByteBuf) msg;
                            String str = buf.toString(StandardCharsets.UTF_8);
                            log.info(color("str = {}"), str);
                            super.channelRead(ctx, msg);
                            ctx.channel().close();
                        }
                    });
                }
            });

            ChannelFuture channelFuture = bootstrap.connect("127.0.0.1", 6379);
            channelFuture.sync();

            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            log.info("error", e);
        } finally {
            group.shutdownGracefully();
        }
    }

}
```

### 第二版

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.util.Scanner;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        NioEventLoopGroup group = new NioEventLoopGroup();

        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group);
            bootstrap.channel(NioSocketChannel.class);
            bootstrap.handler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) throws Exception {
                    ChannelPipeline pipeline = ch.pipeline();
                    pipeline.addLast(new LoggingHandler(LogLevel.INFO));
                    pipeline.addLast(new ChannelInboundHandlerAdapter() {
                        @Override
                        public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                            ByteBuf buf = (ByteBuf) msg;
                            String str = buf.toString(StandardCharsets.UTF_8);
                            log.info(color("str = {}"), str);
                            super.channelRead(ctx, msg);
                        }
                    });
                }
            });

            ChannelFuture channelFuture = bootstrap.connect("127.0.0.1", 6379);
            channelFuture.sync();

            Channel channel = channelFuture.channel();

            Scanner scanner = new Scanner(System.in);
            while (true) {
                String line = scanner.nextLine();
                if ("quit".equalsIgnoreCase(line)) {
                    break;
                }
                if ("exit".equalsIgnoreCase(line)) {
                    break;
                }
                ByteBuf buff = getBuff(line);
                channel.writeAndFlush(buff);
            }

            scanner.close();
            channel.close();
            channel.closeFuture().sync();
        } catch (InterruptedException e) {
            log.info("error", e);
        } finally {
            group.shutdownGracefully();
        }
    }

    private static ByteBuf getBuff(String line) {
        String[] array = line.trim().split(" ");
        int length = array.length;

        StringBuilder sb = new StringBuilder();
        sb.append("*").append(length).append("\r\n");
        for (String element : array) {
            sb.append("$").append(element.length()).append("\r\n")
                    .append(element).append("\r\n");
        }
        byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);
        ByteBuf buf = ByteBufAllocator.DEFAULT.buffer();
        buf.writeBytes(bytes);
        return buf;
    }
}
```
