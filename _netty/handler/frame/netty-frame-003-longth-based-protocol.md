---
title: "Frame：长度解码器"
sequence: "103"
---

[UP](/netty.html)

A length-based protocol defines a frame by encoding its length in a header segment of
the frame, rather than by marking its end with a special delimiter.

FixedLengthFrameDecoder Extracts frames of a fixed size, specified when the constructor is called.
LengthFieldBasedFrameDecoder Extracts frames based on a length value encoded in a field in the frame header; the offset and length of the field are specified in the constructor.

## 定长解码器

![](/assets/images/netty/frame/decoding-a-frame-length-of-8-bytes.png)

让所有数据包长度固定（假设长度为 8 字节），『关键代码』：

```text
pipeline.addLast(new FixedLengthFrameDecoder(8));
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
import io.netty.handler.codec.FixedLengthFrameDecoder;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;


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
                            pipeline.addLast(new FixedLengthFrameDecoder(8));
                            pipeline.addLast(new LoggingHandler(LogLevel.INFO));
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
import io.netty.buffer.ByteBuf;
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
                    .handler(new ChannelInboundHandlerAdapter() {
                        @Override
                        public void channelActive(ChannelHandlerContext ctx) throws Exception {
                            // 获取 bytes
                            CharGen.skip(32);
                            byte[] bytes = CharGen.getBytes(32);

                            // 将 bytes 转换为 ByteBuf
                            ByteBuf buffer = ctx.alloc().buffer();
                            buffer.writeBytes(bytes);
                            ByteUtils.print(buffer);

                            // 发送到服务器端
                            ctx.writeAndFlush(buffer).sync();
                            ctx.close();
                        }
                    });

            // 第 2 步，连接服务器（阻塞）
            ChannelFuture future = bootstrap.connect(MyServer.HOST, MyServer.PORT).sync();
            LogUtils.color("客户端启动: {}", future.channel().localAddress());

            // 第 3 步，获取 SocketChannel
            Channel channel = future.channel();

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

## 变长解码器

![](/assets/images/netty/frame/length-field-based-frame-index.png)

```text
  lengthFieldOffset   = 0
  lengthFieldLength   = 2
  lengthAdjustment    = 0
  initialBytesToStrip = 0 (= do not strip header)
 
  BEFORE DECODE (14 bytes)         AFTER DECODE (14 bytes)
  +--------+----------------+      +--------+----------------+
  | Length | Actual Content |----->| Length | Actual Content |
  | 0x000C | "HELLO, WORLD" |      | 0x000C | "HELLO, WORLD" |
  +--------+----------------+      +--------+----------------+

  lengthFieldOffset   = 0
  lengthFieldLength   = 2
  lengthAdjustment    = 0
  initialBytesToStrip = 2 (= the length of the Length field)
 
  BEFORE DECODE (14 bytes)         AFTER DECODE (12 bytes)
  +--------+----------------+      +----------------+
  | Length | Actual Content |----->| Actual Content |
  | 0x000C | "HELLO, WORLD" |      | "HELLO, WORLD" |
  +--------+----------------+      +----------------+

  lengthFieldOffset   =  0
  lengthFieldLength   =  2
  lengthAdjustment    = -2 (= the length of the Length field)
  initialBytesToStrip =  0
 
  BEFORE DECODE (14 bytes)         AFTER DECODE (14 bytes)
  +--------+----------------+      +--------+----------------+
  | Length | Actual Content |----->| Length | Actual Content |
  | 0x000E | "HELLO, WORLD" |      | 0x000E | "HELLO, WORLD" |
  +--------+----------------+      +--------+----------------+

  lengthFieldOffset   = 2 (= the length of Header 1)
  lengthFieldLength   = 3
  lengthAdjustment    = 0
  initialBytesToStrip = 0
  BEFORE DECODE (17 bytes)                      AFTER DECODE (17 bytes)
  +----------+----------+----------------+      +----------+----------+----------------+
  | Header 1 |  Length  | Actual Content |----->| Header 1 |  Length  | Actual Content |
  |  0xCAFE  | 0x00000C | "HELLO, WORLD" |      |  0xCAFE  | 0x00000C | "HELLO, WORLD" |
  +----------+----------+----------------+      +----------+----------+----------------+
  
  lengthFieldOffset   = 0
  lengthFieldLength   = 3
  lengthAdjustment    = 2 (= the length of Header 1)
  initialBytesToStrip = 0
 
  BEFORE DECODE (17 bytes)                      AFTER DECODE (17 bytes)
  +----------+----------+----------------+      +----------+----------+----------------+
  |  Length  | Header 1 | Actual Content |----->|  Length  | Header 1 | Actual Content |
  | 0x00000C |  0xCAFE  | "HELLO, WORLD" |      | 0x00000C |  0xCAFE  | "HELLO, WORLD" |
  +----------+----------+----------------+      +----------+----------+----------------+

  lengthFieldOffset   = 1 (= the length of HDR1)
  lengthFieldLength   = 2
  lengthAdjustment    = 1 (= the length of HDR2)
  initialBytesToStrip = 3 (= the length of HDR1 + LEN)
 
  BEFORE DECODE (16 bytes)                       AFTER DECODE (13 bytes)
  +------+--------+------+----------------+      +------+----------------+
  | HDR1 | Length | HDR2 | Actual Content |----->| HDR2 | Actual Content |
  | 0xCA | 0x000C | 0xFE | "HELLO, WORLD" |      | 0xFE | "HELLO, WORLD" |
  +------+--------+------+----------------+      +------+----------------+

  lengthFieldOffset   =  1
  lengthFieldLength   =  2
  lengthAdjustment    = -3 (= the length of HDR1 + LEN, negative)
  initialBytesToStrip =  3
 
  BEFORE DECODE (16 bytes)                       AFTER DECODE (13 bytes)
  +------+--------+------+----------------+      +------+----------------+
  | HDR1 | Length | HDR2 | Actual Content |----->| HDR2 | Actual Content |
  | 0xCA | 0x0010 | 0xFE | "HELLO, WORLD" |      | 0xFE | "HELLO, WORLD" |
  +------+--------+------+----------------+      +------+----------------+
```

### LengthFieldBasedFrameDecoder

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.embedded.EmbeddedChannel;
import io.netty.handler.codec.LengthFieldBasedFrameDecoder;

import java.util.Random;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        // 第 1 步，准备 pipeline
        EmbeddedChannel channel = new EmbeddedChannel();
        ChannelPipeline pipeline = channel.pipeline();
        pipeline.addLast(new LengthFieldBasedFrameDecoder(
                1024, 0, 4, 0, 4
        ));

        // 第 2 步，输入数据
        ByteBuf input = getByteBuf();
        ByteUtils.print(input);

        // 第 3 步，处理数据
        channel.writeInbound(input);
        channel.finish();

        // 第 4 步，输出数据
        ByteBuf output = channel.readInbound();
        ByteUtils.print(output);
    }

    private static ByteBuf getByteBuf() {
        Random rand = new Random();
        int n = rand.nextInt(1, 27);

        ByteBuf buf = ByteBufAllocator.DEFAULT.buffer();
        buf.writeInt(n);

        for (int i = 0; i < n; i++) {
            int val = 'A' + i;
            buf.writeByte(val);
        }

        return buf;
    }
}
```

### Initializer

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.codec.LengthFieldBasedFrameDecoder;
import io.netty.handler.logging.LoggingHandler;

public class LengthBasedHandlerInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new LengthFieldBasedFrameDecoder(1024, 0, 4, 0, 0));
        pipeline.addLast(new LoggingHandler());
    }
}
```

### Server

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
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
                    .childHandler(new LengthBasedHandlerInitializer());

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
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;


import java.util.Random;


public class MyClient {
    public static void main(String[] args) throws InterruptedException {
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            // 第 1 步，bootstrap 配置
            Bootstrap bootstrap = new Bootstrap()
                    .group(workerGroup)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInboundHandlerAdapter() {
                        @Override
                        public void channelActive(ChannelHandlerContext ctx) throws Exception {
                            // 循环添加数据
                            ByteBuf buffer = ctx.alloc().buffer();
                            for (int i = 0; i < 5; i++) {
                                ByteBuf buf = getByteBuf();
                                ByteUtils.print(buf);
                                buffer.writeBytes(buf);
                            }

                            // 发送到服务器端
                            ctx.writeAndFlush(buffer).sync();
                            ctx.close();
                        }
                    });

            // 第 2 步，连接服务器（阻塞）
            ChannelFuture future = bootstrap.connect(MyServer.HOST, MyServer.PORT).sync();
            LogUtils.color("客户端启动: {}", future.channel().localAddress());

            // 第 3 步，获取 SocketChannel
            Channel channel = future.channel();

            // 第 4 步，等待 SocketChannel 关闭（阻塞）
            channel.closeFuture().sync();
            LogUtils.color("客户端关闭");
        }
        finally {
            workerGroup.shutdownGracefully();
        }
    }

    private static ByteBuf getByteBuf() {
        Random rand = new Random();
        int n = rand.nextInt(1, 27);

        ByteBuf buf = ByteBufAllocator.DEFAULT.buffer();
        buf.writeInt(n);

        for (int i = 0; i < n; i++) {
            int val = 'A' + i;
            buf.writeByte(val);
        }

        return buf;
    }
}
```


