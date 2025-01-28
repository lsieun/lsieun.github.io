---
title: "Protocol Buffers"
sequence: "104"
---

[UP](/netty.html)

- `ProtobufDecoder` Decodes a message using protobuf
- `ProtobufEncoder` Encodes a message using protobuf
- `ProtobufVarint32FrameDecoder` Splits received ByteBufs dynamically by the value of the Google Protocol “Base 128 Varints” a  integer length field in the message

## 代码示例

### User.proto

- `src/main/proto/User.proto`

```protobuf
syntax = "proto3";
option java_package = "lsieun.protobuf";
option java_outer_classname = "UserModel"; // 生成的外部类名，同时也是文件名

// protobuf 使用 message 管理数据
message User { // 会在 UserModel 里面生成一个内部类 User，即是真正发送的 POJO 对象
  int32 id = 1;
  string name = 2;
}
```

### 添加依赖

```xml
<dependency>
    <groupId>com.google.protobuf</groupId>
    <artifactId>protobuf-java</artifactId>
    <version>4.26.0</version>
</dependency>
```

```xml
<build>
    <extensions>
        <extension>
            <groupId>kr.motd.maven</groupId>
            <artifactId>os-maven-plugin</artifactId>
            <version>1.7.1</version>
        </extension>
    </extensions>
    <plugins>
        <plugin>
            <groupId>org.xolstice.maven.plugins</groupId>
            <artifactId>protobuf-maven-plugin</artifactId>
            <version>0.6.1</version>
            <configuration>
                <protocArtifact>
                    com.google.protobuf:protoc:4.26.0:exe:${os.detected.classifier}
                </protocArtifact>
                <pluginId>grpc-java</pluginId>
                <pluginArtifact>
                    io.grpc:protoc-gen-grpc-java:1.62.2:exe:${os.detected.classifier}
                </pluginArtifact>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>compile</goal>
                        <goal>compile-custom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

### Initializer

```java
import com.google.protobuf.MessageLite;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.codec.LengthFieldBasedFrameDecoder;
import io.netty.handler.codec.LengthFieldPrepender;
import io.netty.handler.codec.protobuf.ProtobufDecoder;
import io.netty.handler.codec.protobuf.ProtobufEncoder;

public class ProtoBufInitializer extends ChannelInitializer<Channel> {
    private final MessageLite lite;

    public ProtoBufInitializer(MessageLite lite) {
        this.lite = lite;
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();

        // Decoder
        pipeline.addLast("frameDecoder",
                new LengthFieldBasedFrameDecoder(1048576, 0, 4, 0, 4));
        pipeline.addLast("protobufDecoder", new ProtobufDecoder(lite));

        // Encoder
        pipeline.addLast("frameEncoder", new LengthFieldPrepender(4));
        pipeline.addLast("protobufEncoder", new ProtobufEncoder());
    }
}
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
import lsieun.netty.handler.basic.ChannelStateHandler;
import lsieun.netty.handler.initializer.idle.ChannelIdleShutdownInitializer;
import lsieun.netty.handler.raw.EchoObjectServerHandler;
import lsieun.netty.handler.serde.ProtoBufInitializer;
import lsieun.protobuf.UserModel;
import lsieun.utils.LogUtils;

public class MyServer {

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
                    .handler(new ChannelIdleShutdownInitializer(30))
                    .childHandler(new ChannelInitializer<Channel>() {
                        @Override
                        protected void initChannel(Channel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            pipeline.addLast(new ChannelStateHandler());
                            // --------------------------------------------------------------------------------- >>>
                            pipeline.addLast(new ProtoBufInitializer(UserModel.User.getDefaultInstance()));
                            // --------------------------------------------------------------------------------- <<<
                            pipeline.addLast(new EchoObjectServerHandler());
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
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;
import lsieun.netty.handler.raw.EchoObjectClientHandler;
import lsieun.netty.handler.serde.ProtoBufInitializer;
import lsieun.protobuf.UserModel;
import lsieun.utils.LogUtils;


public class MyClient {
    public static void main(String[] args) throws InterruptedException {
        EventLoopGroup workerGroup = new NioEventLoopGroup();

        try {
            // 第 1 步，bootstrap 配置
            Bootstrap bootstrap = new Bootstrap()
                    .group(workerGroup)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<Channel>() {
                        @Override
                        protected void initChannel(Channel ch) throws Exception {
                            ChannelPipeline pipeline = ch.pipeline();
                            // --------------------------------------------------------------------------------- >>>
                            pipeline.addLast(new ProtoBufInitializer(UserModel.User.getDefaultInstance()));
                            // --------------------------------------------------------------------------------- <<<
                            pipeline.addLast(new EchoObjectClientHandler());
                        }
                    });

            // 第 2 步，连接服务器（阻塞）
            ChannelFuture future = bootstrap.connect(MyServer.HOST, MyServer.PORT).sync();
            LogUtils.color("客户端启动: {}", future.channel().localAddress());

            // 第 3 步，获取 SocketChannel
            Channel channel = future.channel();
            Object obj = UserModel.User.newBuilder().setId(10).setName("Tom");
            // Object obj = new Student("Jerry", new Date());
            channel.writeAndFlush(obj);
            LogUtils.color("[{}]: Send - {}", channel.remoteAddress(), obj);

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

## Reference

- []()
