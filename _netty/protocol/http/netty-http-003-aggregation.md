---
title: "Http message aggregation"
sequence: "103"
---

[UP](/netty.html)


问题描述：当我们使用 `HttpRequestDecoder` 和 `HttpResponseDecoder` 时，会生成不同的 `HttpObject` 对象；
接下来，需要我们将这些不同的 `HttpObject` 对象组织成一个完整的 request 或 response，这个处理过程是比较麻烦的。

解决方法：Netty 提供了 `HttpObjectAggregator` 类，帮助我们将零散的信息组织成完整的 `FullHttpRequest` 或 `FullHttpResponse` 对象。

![](/assets/images/netty/protocol/http/http-object-aggregator-illustrated.png)

使用 `HttpObjectAggregator` 类，有优点，也有缺点：

- 优点：我们不需要关注零散的信息片段，能直接获取完整的 request 或 response
- 缺点：对性能有一定的损耗。因为它需要更多的内存空间对数据进行缓存，来生成完整的信息。

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.codec.http.HttpClientCodec;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;

public class HttpAggregatorInitializer extends ChannelInitializer<Channel> {
    private final boolean isClient;

    public HttpAggregatorInitializer(boolean isClient) {
        this.isClient = isClient;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        if (isClient) {
            pipeline.addLast("codec", new HttpClientCodec());
        }
        else {
            pipeline.addLast("codec", new HttpServerCodec());
        }
        pipeline.addLast("aggregator", new HttpObjectAggregator(512 * 1024));
    }
}
```

## Server

### HttpServer

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import lsieun.netty.theme.http.handler.HttpDirectoryServerHandler;
import lsieun.netty.component.handler.initializer.idle.ChannelIdleShutdownInitializer;
import lsieun.netty.theme.http.initializer.HttpAggregatorInitializer;
import lsieun.utils.LogUtils;

public class HttpServer {
    public static final String HOST = "localhost";
    public static final int PORT = 9999;

    public static void main(String[] args) throws Exception {
        NioEventLoopGroup bossGroup = new NioEventLoopGroup(1);
        NioEventLoopGroup workGroup = new NioEventLoopGroup();

        try {
            // 第 1 步，bootstrap 配置
            ServerBootstrap bootstrap = new ServerBootstrap()
                    .group(bossGroup, workGroup)
                    .channel(NioServerSocketChannel.class)
                    .handler(new ChannelIdleShutdownInitializer(60))
                    .childHandler(new ChannelInitializer<NioSocketChannel>() {
                        @Override
                        protected void initChannel(NioSocketChannel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new HttpAggregatorInitializer(false));
                            pipeline.addLast(new HttpDirectoryServerHandler());
                        }
                    });

            // 第 2 步，等待绑定端口（阻塞）
            ChannelFuture future = bootstrap.bind(HOST, PORT).sync();
            LogUtils.color("服务器启动：http://{}:{}", HOST, PORT);

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

### HttpDirectoryServerHandler

```java
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import lsieun.utils.LogUtils;

import java.io.File;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

public class HttpDirectoryServerHandler extends SimpleChannelInboundHandler<FullHttpRequest> {

    private final String workDir;

    public HttpDirectoryServerHandler() {
        String resourcePath = "/static/index.html";
        URL resource = HttpDirectoryServerHandler.class.getResource(resourcePath);
        String filepath = resource.getFile();
        File file = new File(filepath);
        if (!file.exists()) {
            throw new RuntimeException("file not exist: " + resourcePath);
        }
        this.workDir = file.getParent();
    }

    public HttpDirectoryServerHandler(String workDir) {
        this.workDir = workDir;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        HttpVersion httpVersion = request.protocolVersion();
        QueryStringDecoder qsd = new QueryStringDecoder(request.uri());
        String uri = qsd.path();

        if ("/".equals(uri)) {
            uri = "/index.html";
        }


        File f = new File(workDir, uri);
        boolean found = true;
        if (!f.exists()) {
            found = false;
            FullHttpResponse response = new DefaultFullHttpResponse(httpVersion, HttpResponseStatus.NOT_FOUND);
            ctx.writeAndFlush(response);
        }
        else {
            Path path = f.toPath();
            byte[] bytes = Files.readAllBytes(path);

            FullHttpResponse response = new DefaultFullHttpResponse(httpVersion, HttpResponseStatus.OK);
            HttpUtil.setContentLength(response, bytes.length);
            response.content().writeBytes(bytes);
            ctx.writeAndFlush(response);
        }

        LogUtils.color("client = {}, uri = {}  [{}]", ctx.channel().remoteAddress(), uri, found ? "OK" : "NOT FOUND");
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
```

## Client

### HttpClient

```java
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import lsieun.netty.theme.http.handler.HttpOneRequestHandler;
import lsieun.netty.theme.http.initializer.HttpAggregatorInitializer;
import lsieun.utils.LogUtils;

public class HttpClient {
    public static void main(String[] args) throws Exception {
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            // 第 1 步，bootstrap 配置
            Bootstrap bootstrap = new Bootstrap()
                    .group(workerGroup)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new HttpAggregatorInitializer(true));
                            pipeline.addLast(new HttpOneRequestHandler());
                        }
                    });

            // 第 2 步，连接服务器（阻塞）
            ChannelFuture future = bootstrap.connect(HttpServer.HOST, HttpServer.PORT).sync();
            LogUtils.color("客户端启动");

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

### HttpOneRequestHandler

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import io.netty.util.CharsetUtil;
import lsieun.utils.LogUtils;

import java.util.Map;

public class HttpOneRequestHandler extends SimpleChannelInboundHandler<FullHttpResponse> {

    private final String uri;
    private final boolean compression;

    public HttpOneRequestHandler() {
        this("/", false);
    }

    public HttpOneRequestHandler(String uri, boolean compression) {
        this.uri = uri;
        this.compression = compression;
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        FullHttpRequest request = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.GET, uri);
        HttpUtil.setContentLength(request, request.content().readableBytes());
        if (compression) {
            request.headers().set("Accept-Encoding", "gzip, deflate");
        }
        ctx.writeAndFlush(request);
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpResponse response) throws Exception {
        HttpHeaders headers = response.headers();
        for (Map.Entry<String, String> entry : headers) {
            LogUtils.color("{}: {}", entry.getKey(), entry.getValue());
        }

        ByteBuf content = response.content();
        String str = content.toString(CharsetUtil.UTF_8);
        LogUtils.color(str);
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.close();
    }
}
```
