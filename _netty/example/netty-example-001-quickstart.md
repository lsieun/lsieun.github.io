---
title: "快速开始"
sequence: "101"
---

[UP](/netty.html)


## 引入依赖

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>${netty.version}</version>
</dependency>
```

## 服务器

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.string.StringDecoder;

public class MyServer {
    public static void main(String[] args) {
        // 启动器，负责组装 netty 组件，启动服务器
        new ServerBootstrap()
                // 创建 NioEventLoopGroup，可以简单理解为 线程池 + Selector
                .group(new NioEventLoopGroup()) // 1
                // NioServerSocketChannel 表示基于 NIO 的服务器端实现
                .channel(NioServerSocketChannel.class) // 2
                // 接下来添加的处理器都是给 SocketChannel 用的
                .childHandler(
                        // ChannelInitializer 处理器（仅执行一次），
                        // 它的作用是待客户端 SocketChannel 建立连接后，执行 initChannel 以便添加更多的处理器
                        new ChannelInitializer<NioSocketChannel>() { // 3
                            protected void initChannel(NioSocketChannel ch) {
                                // SocketChannel 的处理器，解码 ByteBuf => String
                                ch.pipeline().addLast(new StringDecoder()); // 5
                                // SocketChannel 的业务处理器，使用上一个处理器的处理结果
                                ch.pipeline().addLast(new SimpleChannelInboundHandler<String>() { //
                                    // 读事件
                                    @Override
                                    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
                                        // 打印上一步转换好的字符串
                                        System.out.println(msg);
                                    }
                                });
                            }
                        })
                // ServerSocketChannel 绑定的监听端口
                .bind(9999); // 4
    }
}
```

## 客户端

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.string.StringEncoder;

import java.util.Date;

public class MyClient {
    public static void main(String[] args) throws InterruptedException {
        new Bootstrap()
                .group(new NioEventLoopGroup()) // 1
                // NioSocketChannel 表示基于 NIO 的客户端实现
                .channel(NioSocketChannel.class) // 2
                // 添加 SocketChannel 的处理器
                .handler(
                        // ChannelInitializer 处理器（仅执行一次），
                        // 它的作用是待客户端 SocketChannel 建立连接后，执行 initChannel 以便添加更多的处理器
                        new ChannelInitializer<Channel>() { // 3
                            @Override
                            protected void initChannel(Channel ch) {
                                // 消息会经过通道 handler 处理，这里是将 String => ByteBuf 发出
                                ch.pipeline().addLast(new StringEncoder()); // 8
                            }
                        })
                // 指定要连接的服务器和端口
                .connect("127.0.0.1", 9999) // 4
                // Netty 中很多方法都是异步的，如 connect，这时需要使用 sync 方法等待 connect 建立连接完毕
                .sync() // 5
                // 获取 channel 对象，它即为通道抽象，可以进行数据读写操作
                .channel() // 6
                // 写入消息并清空缓冲区
                .writeAndFlush(new Date() + ": hello world!"); // 7
    }
}
```
