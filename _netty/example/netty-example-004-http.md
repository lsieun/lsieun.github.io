---
title: "协议：Http"
sequence: "104"
---

[UP](/netty.html)


## Server

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.*;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;
import lombok.extern.slf4j.Slf4j;

import static lsieun.utils.ConsoleColors.color;

@Slf4j
public class MyServer {

    public static void main(String[] args) {
        NioEventLoopGroup boss = new NioEventLoopGroup();
        NioEventLoopGroup worker = new NioEventLoopGroup();

        try {
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(boss, worker);
            serverBootstrap.channel(NioServerSocketChannel.class);
            serverBootstrap.childHandler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel ch) throws Exception {
                    ch.pipeline().addLast(new LoggingHandler(LogLevel.INFO));

                    ch.pipeline().addLast(new HttpServerCodec());

                    ch.pipeline().addLast(new SimpleChannelInboundHandler<HttpRequest>() {
                        @Override
                        protected void channelRead0(ChannelHandlerContext ctx, HttpRequest msg) throws Exception {
                            // 读取 request
                            String uri = msg.uri();
                            log.info(color("uri = {}"), uri);

                            // 准备 response
                            DefaultFullHttpResponse response;
                            if ("/".equals(uri)) {
                                response = new DefaultFullHttpResponse(
                                        msg.protocolVersion(), HttpResponseStatus.OK
                                );

                                byte[] bytes = "<html><head><title>Hello</title></head><body><h1>World</h1></body></html>".getBytes();
                                response.headers().setInt(HttpHeaderNames.CONTENT_LENGTH, bytes.length);
                                response.content().writeBytes(bytes);
                            } else {
                                response = new DefaultFullHttpResponse(
                                        msg.protocolVersion(), HttpResponseStatus.NOT_FOUND
                                );
                            }


                            // 写回 response
                            ctx.writeAndFlush(response);
                        }
                    });
                }
            });

            ChannelFuture channelFuture = serverBootstrap.bind(9999);
            log.info(color("{} binding..."), channelFuture.channel());
            channelFuture.sync();
            log.info(color("{} bind..."), channelFuture.channel());
            channelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            log.error(color("server error"), e);
        } finally {
            boss.shutdownGracefully();
            worker.shutdownGracefully();
            log.info(color("stopped"));
        }
    }
}
```
