---
title: "WebSocket Chat"
sequence: "102"
---

[UP](/netty.html)


## 代码示例

### Bootstrap

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.concurrent.ImmediateEventExecutor;

import java.net.InetSocketAddress;

public class WebSocketChatServer {
    private final ChannelGroup channelGroup = new DefaultChannelGroup(ImmediateEventExecutor.INSTANCE);
    private final EventLoopGroup group = new NioEventLoopGroup();
    private Channel channel;

    public ChannelFuture start(InetSocketAddress address) {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(group)
                .channel(NioServerSocketChannel.class)
                .childHandler(createInitializer(channelGroup));
        ChannelFuture future = bootstrap.bind(address);
        future.syncUninterruptibly();
        channel = future.channel();
        return future;
    }

    protected ChannelInitializer<Channel> createInitializer(ChannelGroup group) {
        return new WebSocketChatServerInitializer(group);
    }

    public void destroy() {
        if (channel != null) {
            channel.close();
        }
        channelGroup.close();
        group.shutdownGracefully();
    }

    public static void main(String[] args) {
        int port = 9999;
        WebSocketChatServer endpoint = new WebSocketChatServer();
        ChannelFuture future = endpoint.start(new InetSocketAddress(port));
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                endpoint.destroy();
            }
        });
        future.channel().closeFuture().syncUninterruptibly();
    }
}
```

### Initializer

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.stream.ChunkedWriteHandler;

public class WebSocketChatServerInitializer extends ChannelInitializer<Channel> {
    private final ChannelGroup group;

    public WebSocketChatServerInitializer(ChannelGroup group) {
        this.group = group;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new HttpServerCodec());
        pipeline.addLast(new ChunkedWriteHandler());
        pipeline.addLast(new HttpObjectAggregator(64 * 1024));
        pipeline.addLast(new HttpRequestHandler("/ws"));
        pipeline.addLast(new WebSocketServerProtocolHandler("/ws"));
        pipeline.addLast(new TextWebSocketFrameHandler(group));
    }
}
```

### ChannelHandler

#### HttpRequestHandler

```java
import io.netty.channel.*;
import io.netty.handler.codec.http.*;
import io.netty.handler.ssl.SslHandler;
import io.netty.handler.stream.ChunkedNioFile;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.RandomAccessFile;
import java.net.URISyntaxException;
import java.net.URL;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class HttpRequestHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private static final File INDEX;

    static {
        URL location = HttpRequestHandler.class.getProtectionDomain()
                .getCodeSource().getLocation();
        try {
            String path = location.toURI() + "index.html";
            path = !path.contains("file:") ? path : path.substring(5);
            INDEX = new File(path);
        }
        catch (URISyntaxException e) {
            throw new IllegalStateException("Unable to locate index.html", e);
        }
    }

    private final String wsUri;

    public HttpRequestHandler(String wsUri) {
        this.wsUri = wsUri;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) throws Exception {
        if (wsUri.equalsIgnoreCase(request.uri())) {
            ctx.fireChannelRead(request.retain());
        }
        else {
            if (HttpUtil.is100ContinueExpected(request)) {
                send100Continue(ctx);
                return;
            }

            RandomAccessFile file = new RandomAccessFile(INDEX, "r");
            HttpResponse response = new DefaultHttpResponse(
                    request.protocolVersion(), HttpResponseStatus.OK
            );
            response.headers().set(HttpHeaderNames.CONTENT_TYPE, "text/html; charset=UTF-8");
            boolean keepAlive = HttpUtil.isKeepAlive(request);
            if (keepAlive) {
                response.headers().set(HttpHeaderNames.CONTENT_LENGTH, file.length());
                response.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderValues.KEEP_ALIVE);
            }
            ctx.write(response);

            if (ctx.pipeline().get(SslHandler.class) == null) {
                FileRegion fileRegion = new DefaultFileRegion(file.getChannel(), 0, file.length());
                ctx.write(fileRegion);
            }
            else {
                ctx.write(new ChunkedNioFile(file.getChannel()));
            }

            ChannelFuture future = ctx.writeAndFlush(LastHttpContent.EMPTY_LAST_CONTENT);
            if (!keepAlive) {
                future.addListener(ChannelFutureListener.CLOSE);
            }
        }
    }

    private static void send100Continue(ChannelHandlerContext ctx) {
        FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.CONTINUE);
        ctx.writeAndFlush(response);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        log.info(color("exceptionCaught"), cause);
        ctx.close();
    }
}
```

#### TextWebSocketFrameHandler

```java
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;

public class TextWebSocketFrameHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {
    private final ChannelGroup group;

    public TextWebSocketFrameHandler(ChannelGroup group) {
        this.group = group;
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt == WebSocketServerProtocolHandler.ServerHandshakeStateEvent.HANDSHAKE_COMPLETE) {
            ctx.pipeline().remove(HttpRequestHandler.class);
            group.writeAndFlush(new TextWebSocketFrame(
                    "Client " + ctx.channel() + " joined"
            ));
            group.add(ctx.channel());
        }
        else {
            super.userEventTriggered(ctx, evt);
        }
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TextWebSocketFrame msg) throws Exception {
        group.writeAndFlush(msg.retain());
    }
}
```

### index.html

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>WebSocket Chat</title>
</head>
<body>
<script type="text/javascript">
    let socket;
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
        const protocol = location.protocol;
        const domain = location.hostname;
        const port = location.port;

        // "ws://localhost:9999/ws"
        // "wss://localhost:9999/ws"
        const newProtocol = protocol.endsWith("s:") ? "wss:" : "ws:";
        const websocketUrl = `${newProtocol}//${domain}:${port}/ws`;
        console.log(websocketUrl);

        socket = new WebSocket(websocketUrl);
        socket.onmessage = function (event) {
            const txtArea = document.getElementById('chatContent');
            if (txtArea.value === '') {
                txtArea.value = event.data
            } else {
                txtArea.value = txtArea.value + '\n' + event.data
            }
        };
        socket.onopen = function (event) {
            const txtArea = document.getElementById('chatContent');
            txtArea.value = "连接开启!";
        };
        socket.onclose = function (event) {
            const txtArea = document.getElementById('chatContent');
            txtArea.value = txtArea.value + '\n' + "连接被关闭";
        };
    } else {
        alert("您的浏览器不支持 WebSocket！");
    }

    function send() {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState === WebSocket.OPEN) {
            const message = document.getElementById('msgTxt').value;
            socket.send(message);
        } else {
            alert("连接没有开启");
        }
    }

    function clearContent() {
        document.getElementById('chatContent').value = '';
    }
</script>

<table>
    <caption>WebSocket 聊天室</caption>
    <tr>
        <td><label for="chatContent">聊天内容</label></td>
        <td><textarea id="chatContent" style="width: 500px; height: 300px;"></textarea></td>
    </tr>
    <tr>
        <td><label for="msgTxt">输入信息</label></td>
        <td>
            <input id="msgTxt" type="text" name="message" style="width: 500px" value="">
        </td>
    </tr>
    <tr>
        <td colspan="2" style="text-align: center">
            <input type="button" value="发送消息" onclick="send()">
            <input type="button" value="清空聊天记录" onclick="clearContent()">
        </td>
    </tr>
</table>

</body>
</html>
```

## Secure Chat

### Bootstrap

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.ssl.SslContext;
import lsieun.utils.CertUtils;

import java.net.InetSocketAddress;

public class WebSocketSecureChatServer extends WebSocketChatServer {
    private final SslContext sslContext;

    public WebSocketSecureChatServer(SslContext sslContext) {
        this.sslContext = sslContext;
    }

    @Override
    protected ChannelInitializer<Channel> createInitializer(ChannelGroup group) {
        return new WebSocketSecureChatServerInitializer(group, sslContext);
    }

    public static void main(String[] args) {
        int port = 9999;
        SslContext context = CertUtils.getServerSslContext();
        WebSocketSecureChatServer endpoint = new WebSocketSecureChatServer(context);
        ChannelFuture future = endpoint.start(new InetSocketAddress(port));
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                endpoint.destroy();
            }
        });
        future.channel().closeFuture().syncUninterruptibly();
    }
}
```

### Initializer

```java
import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslHandler;

public class WebSocketSecureChatServerInitializer extends WebSocketChatServerInitializer {
    private final SslContext sslContext;

    public WebSocketSecureChatServerInitializer(ChannelGroup group, SslContext sslContext) {
        super(group);
        this.sslContext = sslContext;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        super.initChannel(ch);
        SslHandler serverSslHandler = sslContext.newHandler(ch.alloc());
        ch.pipeline().addFirst(serverSslHandler);
    }
}
```

## Reference

- [Netty 实现 WebSocket 聊天功能](https://waylau.com/netty-websocket-chat/)
- [Netty In Action-第十一章 WebSocket](https://blog.csdn.net/chenjian723122704/article/details/109988259)
