---
title: "Zero-Copy"
sequence: "102"
---

[UP](/netty.html)

## FileRegion

```text
FileRegion, defined in the Netty API documentation as 
"a region of a file that is sent via a Channel that supports zero-copy file transfer."
```

```text
String filepath = "/path/to/file";
File file = new File(filepath);
FileInputStream in = new FileInputStream(file);
FileRegion region = new DefaultFileRegion(in.getChannel(), 0, file.length());

channel.writeAndFlush(region).addListener(new ChannelFutureListener() {
    @Override
    public void operationComplete(ChannelFuture future) throws Exception {
        if (!future.isSuccess()) {
            Throwable cause = future.cause();
            cause.printStackTrace();
        }
    }
});
```

```text
This example applies only to the **direct transmission of a file's contents**,
excluding any processing of the data by the application.
```

## 示例发送文件

### Server

#### BootStrap

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import lsieun.netty.handler.initializer.idle.ChannelIdleShutdownInitializer;
import lsieun.utils.LogUtils;

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
                    .handler(new ChannelIdleShutdownInitializer(60))
                    .childHandler(new MyServerInitializer());

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

#### Initializer

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;


public class MyServerInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new ChannelStateHandler());
        pipeline.addLast(new FileTransferZeroCopyServerHandler("D:\\tmp"));
    }
}
```

#### Handler

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;
import io.netty.util.CharsetUtil;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileInputStream;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
@ChannelHandler.Sharable
public class FileTransferZeroCopyServerHandler extends SimpleChannelInboundHandler<ByteBuf> {
    private final String workDir;

    public FileTransferZeroCopyServerHandler(String workDir) {
        this.workDir = workDir;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        // 第 1 步，接收文件名称
        String filename = msg.toString(CharsetUtil.UTF_8);
        log.info(color("[{}]: filename = {}"), ctx.channel().remoteAddress(), filename);

        // 第 2 步，判断文件是否存在
        File file = new File(workDir, filename);
        if (!file.exists() || !file.isFile()) {
            log.info(color("[{}]: File Not Exist"), ctx.channel().remoteAddress());
            ctx.close();
            return;
        }

        // 第 3 步，传输数据
        log.info(color("[{}]: Transfer Data ..."), ctx.channel().remoteAddress());
        FileInputStream in = new FileInputStream(file);
        FileRegion region = new DefaultFileRegion(in.getChannel(), 0, file.length());
        ChannelFuture future = ctx.channel().writeAndFlush(region);

        // 第 4 步，传输完成：打印信息、关闭资源
        future.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                // 打印信息
                if (future.isSuccess()) {
                    log.info(color("[{}]: SUCCESS"), future.channel().remoteAddress());
                }
                else {
                    Throwable cause = future.cause();
                    log.info(color("[{}]: FAILED"), future.channel().remoteAddress(), cause);
                }

                // 关闭资源：文件
                in.close();

                // 关闭资源：channel
                future.channel().close();
            }
        });
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        log.info(color("exceptionCaught"), cause);
        ctx.close();
    }
}
```

### Client

#### Bootstrap

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import lsieun.utils.ConsoleUtils;
import lsieun.utils.LogUtils;


public class MyClient {
    public static void main(String[] args) throws InterruptedException {
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            // 第 1 步，bootstrap 配置
            Bootstrap bootstrap = new Bootstrap()
                    .group(workerGroup)
                    .channel(NioSocketChannel.class)
                    .handler(new MyClientInitializer());

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

#### Initializer

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import lsieun.netty.handler.raw.file.FileReceiveClientHandler;

public class MyClientInitializer extends ChannelInitializer<Channel> {
    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new FileReceiveClientHandler("mp4"));
    }
}
```

#### Handler

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import lombok.extern.slf4j.Slf4j;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

@Slf4j
public class FileReceiveClientHandler extends SimpleChannelInboundHandler<ByteBuf> {
    private final String filename;

    public FileReceiveClientHandler(String ext) {
        this.filename = String.format("%s.%s", System.currentTimeMillis(), ext);
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        // 第 1 步，读取数据长度
        int readableBytes = msg.readableBytes();
        log.info("[{}]: readableBytes - {}", ctx.channel().remoteAddress(), readableBytes);
        
        // 第 2 步，读取数据
        byte[] bytes = new byte[readableBytes];
        msg.readBytes(bytes);

        // 第 3 步，保存数据
        try (
                FileOutputStream out = new FileOutputStream(filename, true);
                BufferedOutputStream bos = new BufferedOutputStream(out);
        ) {
            bos.write(bytes);
            bos.flush();
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        File file = new File(filename);
        if (file.exists()) {
            log.info("[{}]: Receive File - {}", ctx.channel().remoteAddress(), filename);
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        log.info("exceptionCaught", cause);
        ctx.close();
    }
}
```

## 注意事项

- 不能使用 try-with-resource

正确方式：

```text
FileInputStream in = new FileInputStream(file);
FileRegion region = new DefaultFileRegion(in.getChannel(), 0, file.length());

// 在回调当中，关闭资源
```

错误方式：

```text
// 错误原因：数据还没有传输完成，但文件已经关闭了
try (FileInputStream in = new FileInputStream(file)) {
    FileRegion region = new DefaultFileRegion(in.getChannel(), 0, file.length());
}
```

## ChunkedWriteHandler

In cases where you need to copy the data from the file system into user memory, you can use `ChunkedWriteHandler`,
which provides support for writing a large data stream asynchronously without incurring high memory consumption.

The key is interface `ChunkedInput<B>`, where the parameter `B` is the type returned by the method `readChunk()`.
Four implementations of this interface are provided.
Each one represents a data stream of indefinite length to be consumed by a `ChunkedWriteHandler`.

- `ChunkedFile` Fetches data from a file chunk by chunk, for use when your platform doesn't support zero-copy, or you need to transform the data
- `ChunkedNioFile` Similar to `ChunkedFile` except that it uses `FileChannel`
- `ChunkedStream` Transfers content chunk by chunk from an `InputStream`
- `ChunkedNioStream` Transfers content chunk by chunk from a `ReadableByteChannel`

## Reference

- [Zero-copy 零拷贝之技术原理探秘](https://juejin.cn/post/6863264864140935175)
- [The Introduction to Zero-Copy Technology](https://medium.com/thedevproject/the-introduction-to-zero-copy-technology-cd8908165700)
- [Efficient data transfer through zero copy](https://developer.ibm.com/articles/j-zerocopy/)
- [Zero Copy Reads Explained](https://medium.com/@emreeaydiinn/zero-copy-reads-explained-8d54e6084857)
