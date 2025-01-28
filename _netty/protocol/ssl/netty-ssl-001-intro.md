---
title: "TLS Intro"
sequence: "101"
---

[UP](/netty.html)

- 亚热带水果：subtropical fruits
- 荔枝：litchi


## SslChannelInitializer

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.ssl.SslContext;


public class SslChannelInitializer extends ChannelInitializer<Channel> {
    private final SslContext sslContext;
    private final boolean isClient;

    private final String host;
    private final int port;

    public SslChannelInitializer(SslContext sslContext) {
        this(sslContext, false, "", 0);
    }

    public SslChannelInitializer(SslContext sslContext, String host, int port) {
        this(sslContext, true, host, port);
    }

    public SslChannelInitializer(SslContext sslContext, boolean isClient, String host, int port) {
        this.sslContext = sslContext;
        this.isClient = isClient;
        this.host = host;
        this.port = port;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();

        if (isClient) {
            pipeline.addLast(sslContext.newHandler(ch.alloc(), host, port));
        }
        else {
            pipeline.addLast(sslContext.newHandler(ch.alloc()));
        }
    }
}
```

## CharGen

### Server

#### SslServer

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.ssl.SslContext;
import lsieun.netty.component.handler.business.CharGenServerHandler;
import lsieun.utils.CertUtils;
import lsieun.utils.LogUtils;

import javax.net.ssl.SSLException;

public class SslServer {
    public static final String HOST = "localhost";
    public static final int PORT = 9999;

    public static void main(String[] args) throws SSLException, InterruptedException {
        NioEventLoopGroup bossGroup = new NioEventLoopGroup(1);
        NioEventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            SslContext sslContext = CertUtils.getServerSslContext();

            // 第 1 步，bootstrap 配置
            ServerBootstrap bootstrap = new ServerBootstrap()
                    .group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<Channel>() {
                        @Override
                        protected void initChannel(Channel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new SslChannelInitializer(sslContext));
                            pipeline.addLast(new CharGenServerHandler());
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
            workerGroup.shutdownGracefully();
        }
    }
}
```

#### CharGenServerHandler

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.util.CharsetUtil;
import lsieun.utils.CharGen;
import lsieun.utils.LogUtils;

public class CharGenServerHandler extends SimpleChannelInboundHandler<ByteBuf> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        // 第 1 步，读取客户端的数据
        String str = msg.toString(CharsetUtil.UTF_8);
        LogUtils.color("[{}]: {}", ctx.channel().remoteAddress(), str);

        try {
            // 第 2 步，如果 str 是数值，则返回数据
            int num = Integer.parseInt(str);
            byte[] bytes = CharGen.getBytes(num);

            ctx.writeAndFlush(Unpooled.copiedBuffer(bytes));
        }
        catch (Exception ex) {
            // 第 2 步，如果 str 不是数值，则进行关闭
            ctx.close();
            ctx.channel().parent().close();
        }
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        LogUtils.color("[{}]: Active", ctx.channel().remoteAddress());
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        LogUtils.color("[{}]: Inactive", ctx.channel().remoteAddress());
    }
}
```

### Client

#### SslClient

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.ssl.SslContext;
import lsieun.netty.component.handler.business.CharGenClientHandler;
import lsieun.netty.theme.http.HttpServer;
import lsieun.utils.CertUtils;
import lsieun.utils.ConsoleUtils;
import lsieun.utils.LogUtils;


public class SslClient {
    public static void main(String[] args) throws Exception {
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            // 读取 SslContext
            SslContext sslContext = CertUtils.getClientSslContext();

            // 第 1 步，bootstrap 配置
            Bootstrap bootstrap = new Bootstrap()
                    .group(workerGroup)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<Channel>() {
                        @Override
                        protected void initChannel(Channel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new SslChannelInitializer(sslContext, HttpServer.HOST, HttpServer.PORT));
                            pipeline.addLast(new CharGenClientHandler());
                        }
                    });

            // 第 2 步，连接服务器（阻塞）
            ChannelFuture future = bootstrap.connect(HttpServer.HOST, HttpServer.PORT).sync();
            LogUtils.color("客户端启动");

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

#### CharGenClientHandler

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import lsieun.utils.ByteUtils;
import lsieun.utils.LogUtils;

public class CharGenClientHandler extends SimpleChannelInboundHandler<ByteBuf> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) throws Exception {
        // 读取服务器端的数据
        String str = ByteUtils.toStr(msg);
        LogUtils.log("[{}]: {}", ctx.channel().remoteAddress(), str);
    }
}
```

## Reference

- [Netty SSL/TLS with CA signed certificates](https://goldius.org/posts/casignednettysecuredchat/)
    - [atozncoder/netty_secured_chat](https://github.com/atozncoder/netty_secured_chat)
- [HTTP/2 in Netty](https://www.baeldung.com/netty-http2)

- [使用 TLS 单向/双向认证，加密 Netty 程序](https://blog.csdn.net/u013071014/article/details/117334644)

- [Netty with HTTPS/TLS](https://medium.com/@maanadev/netty-with-https-tls-9bf699e07f01)
- [SanjayVas/netty-tls-example](https://github.com/SanjayVas/netty-tls-example)


- [Netty reloading SSL/TLS certificate](https://goldius.medium.com/netty-reloading-ssl-tls-certificate-2078cdf6bfc1)
- [使用 SSL/TLS 加密 Netty 程序](https://waylau.com/essential-netty-in-action/CORE%20FUNCTIONS/Securing%20Netty%20applications%20with%20SSLTLS.html)
- [netty tls client example](https://juejin.cn/s/netty%20tls%20client%20example)
- [A Quick Guide to Java on Netty](https://developer.okta.com/blog/2019/11/25/java-netty-webflux)
- [Integrating OpenSSL / BoringSSL](https://docs.hazelcast.com/imdg/4.2/security/integrating-openssl)

- [How to Configure SSL/TLS for a HTTP Client or a Server](https://dzone.com/articles/configuring-ssl-tls-connection-made-easy)
- [TLS 1.3 Communication using Java Netty Framework 4.1.55 | Step wise step Tutorial](https://www.youtube.com/watch?v=65oU2tJkYnU&ab_channel=Learner%27sCapital)
- [Java Tutorial](https://www.youtube.com/playlist?list=PLmMRPe_LkAGg6ik8mB8cZQXgQHN2aaxUc)


---

- [RedisClient.java](https://github.com/netty/netty/blob/4.1/example/src/main/java/io/netty/example/redis/RedisClient.java)
- [Reactor Netty Reference Guide](https://projectreactor.io/docs/netty/0.9.19.RELEASE/reference/index.html)
