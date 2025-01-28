---
title: "JBoss Marshalling"
sequence: "103"
---

[UP](/netty.html)

## 介绍

第 1 个问题：什么是 Marshalling？

In computer science, **marshalling** is the process of transforming the memory representation of an object
into a data format suitable for storage or transmission. - [Wiki](https://en.wikipedia.org/wiki/Marshalling_(computer_science))

第 2 个问题：Marshalling 和 Serialization 有什么区别？

- [StackOverflow](https://stackoverflow.com/a/14658107)

Both do one thing in common - that is serializing an Object.
Serialization is used to transfer objects or to store them. But:

- **Serialization**: When you serialize an object,
  only the member data within that object is written to the byte stream;
  not the code that actually implements the object.
- **Marshalling**: Term Marshalling is used when we talk about passing Object to remote objects(RMI).
  In Marshalling Object is serialized(member data is serialized) + Codebase is attached.

**So Serialization is a part of Marshalling.**

第 3 个问题：为什么要使用 JBoss Marshalling？

JBoss Marshalling is up to **three times faster** than JDK Serialization and **more compact**.

JBoss Marshalling is an alternative serialization API
that **fixes many of the problems** found in the JDK serialization API while remaining fully
compatible with `java.io.Serializable` and its relatives, and adds several
new tunable parameters and additional features, all of which are pluggable
via factory configuration (externalizers, class/instance lookup tables, class
resolution, and object replacement, to name a few).

## 具体类

For compatibility with peers that use JDK serialization.

- CompatibleMarshallingDecoder
- CompatibleMarshallingEncoder

For use with peers that use JBoss Marshalling.
These classes must be used together.

- MarshallingDecoder
- MarshallingEncoder


```java

```

### 添加依赖

```xml
<dependency>
    <groupId>org.jboss.marshalling</groupId>
    <artifactId>jboss-marshalling-river</artifactId>
    <version>2.1.4.SP1</version>
</dependency>
```

## 基本使用

```java
import org.jboss.marshalling.Marshaller;
import org.jboss.marshalling.MarshallerFactory;
import org.jboss.marshalling.Marshalling;
import org.jboss.marshalling.MarshallingConfiguration;

import java.io.FileOutputStream;
import java.io.IOException;

public final class WriteExample {

    public static void main(String[] args) throws IOException {
        // 第 1 步，获取 factory
        MarshallerFactory marshallerFactory = Marshalling.getProvidedMarshallerFactory("river");

        // 第 2 步，创建 configuration
        MarshallingConfiguration configuration = new MarshallingConfiguration();
        // Use version 3
        configuration.setVersion(3);

        // 第 3 步，marshall
        try (
                Marshaller marshaller = marshallerFactory.createMarshaller(configuration);
                FileOutputStream os = new FileOutputStream("jboss.marshalling.txt")
        ) {
            marshaller.start(Marshalling.createByteOutput(os));
            marshaller.writeObject("This is a trivial example.");
            marshaller.finish();
        }
    }
}
```

```java
import org.jboss.marshalling.MarshallerFactory;
import org.jboss.marshalling.Marshalling;
import org.jboss.marshalling.MarshallingConfiguration;
import org.jboss.marshalling.Unmarshaller;

import java.io.FileInputStream;
import java.io.IOException;

public final class ReadExample {

    public static void main(String[] args) throws IOException, ClassNotFoundException {
        // 第 1 步，获取 factory
        MarshallerFactory marshallerFactory = Marshalling.getProvidedMarshallerFactory("river");

        // 第 2 步，创建 configuration
        MarshallingConfiguration configuration = new MarshallingConfiguration();

        // 第 3 步，unmarshall
        try (
                Unmarshaller unmarshaller = marshallerFactory.createUnmarshaller(configuration);
                FileInputStream is = new FileInputStream("jboss.marshalling.txt")
        ) {
            unmarshaller.start(Marshalling.createByteInput(is));
            System.out.println("Read object: " + unmarshaller.readObject());
            unmarshaller.finish();
        }
    }
}
```

## 代码示例

### Initializer

```java
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.handler.codec.marshalling.*;
import org.jboss.marshalling.MarshallerFactory;
import org.jboss.marshalling.Marshalling;
import org.jboss.marshalling.MarshallingConfiguration;

public class MarshallingInitializer extends ChannelInitializer<Channel> {
    private final MarshallerProvider marshallerProvider;
    private final UnmarshallerProvider unmarshallerProvider;

    public MarshallingInitializer() {
        MarshallerFactory marshallerFactory = Marshalling.getProvidedMarshallerFactory("river");
        MarshallingConfiguration configuration = new MarshallingConfiguration();
        this.marshallerProvider = new DefaultMarshallerProvider(marshallerFactory, configuration);
        this.unmarshallerProvider = new DefaultUnmarshallerProvider(marshallerFactory, configuration);
    }

    @Override
    protected void initChannel(Channel ch) throws Exception {
        ChannelPipeline pipeline = ch.pipeline();
        pipeline.addLast(new MarshallingDecoder(unmarshallerProvider));
        pipeline.addLast(new MarshallingEncoder(marshallerProvider));
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
                            pipeline.addLast(new MarshallingInitializer());
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
                            pipeline.addLast(new MarshallingInitializer());
                            // --------------------------------------------------------------------------------- <<<
                            pipeline.addLast(new EchoObjectClientHandler());
                        }
                    });

            // 第 2 步，连接服务器（阻塞）
            ChannelFuture future = bootstrap.connect(MyServer.HOST, MyServer.PORT).sync();
            LogUtils.color("客户端启动: {}", future.channel().localAddress());

            // 第 3 步，获取 SocketChannel
            Channel channel = future.channel();
            Object obj = new User("tom", 10);
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

- [JBoss Marshalling](https://jbossmarshalling.jboss.org/)
- [Marshalling API quick start](https://docs.jboss.org/author/display/JBMAR/Marshalling%20API%20quick%20start.html)
