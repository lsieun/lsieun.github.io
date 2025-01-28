---
title: "数据：字节"
sequence: "102"
---

[UP](/netty.html)


## Client

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import lombok.extern.slf4j.Slf4j;
import lsieun.utils.ByteUtils;
import lsieun.utils.CharGen;

import java.util.Random;

import static lsieun.utils.ConsoleColors.color;


@Slf4j
public class MyClient {
    public static void main(String[] args) {
        NioEventLoopGroup worker = new NioEventLoopGroup();
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.channel(NioSocketChannel.class);
            bootstrap.group(worker);
            bootstrap.handler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) throws Exception {
                    log.info(color("connected..."));
                    ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                        // 会在连接 channel 建立成功后，会触发 active 事件
                        @Override
                        public void channelActive(ChannelHandlerContext ctx) throws Exception {
                            log.info(color("sending..."));
                            CharGen.skip(32);

                            Random rand = new Random();

                            ByteBuf buf = ctx.alloc().buffer();
                            for (int i = 0; i < 5; i++) {
                                int n = rand.nextInt(10) + 10;
                                byte[] bytes = CharGen.getBytes(n);
                                buf.writeBytes(bytes).writeBytes(new byte[]{'\r', '\n'});
                            }
                            ByteUtils.log(buf);

                            ctx.writeAndFlush(buf);
                            ctx.channel().close();
                        }
                    });
                }
            });

            ChannelFuture channelFuture = bootstrap.connect("127.0.0.1", 9999).sync();
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            log.error(color("client error"), e);
        } finally {
            worker.shutdownGracefully();
        }
    }
}
```

## CharGen

### 服务端

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import lsieun.utils.CharGen;

@ChannelHandler.Sharable
public class ServerChannelInboundHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 接收客户端数据
        ByteBuf in = (ByteBuf) msg;
        int num = in.readInt();
        System.out.println("Received message: " + num);

        // 向客户端写出回数据
        byte[] bytes = CharGen.getBytes(num);
        ctx.writeAndFlush(Unpooled.copiedBuffer(bytes));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println("exceptionCaught: " + cause.getMessage());
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

### 客户端

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import lsieun.utils.ByteUtils;

@ChannelHandler.Sharable
public class ClientChannelInboundHandler extends SimpleChannelInboundHandler<ByteBuf> {

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        ByteUtils.log(msg);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println("exceptionCaught: " + cause.getMessage());
        ctx.close();
    }
}
```

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import lsieun.netty.handler.ClientChannelInboundHandler;

import java.util.Scanner;


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

            Scanner scanner = new Scanner(System.in);
            while (true) {
                String line = scanner.nextLine();
                if ("quit".equalsIgnoreCase(line)) {
                    break;
                }
                if ("exit".equalsIgnoreCase(line)) {
                    break;
                }

                int num = 0;
                try {
                    num = Integer.parseInt(line);
                }
                catch (Exception ignored) {
                }
                if (num == 0) {
                    break;
                }

                ByteBuf buff = ByteBufAllocator.DEFAULT.buffer(4);
                buff.writeInt(num);
                channel.writeAndFlush(buff);
            }

            scanner.close();
            channel.close();

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
