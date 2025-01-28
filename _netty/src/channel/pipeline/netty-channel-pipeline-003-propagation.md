---
title: "Pipeline 的 InBound 和 OutBound"
sequence: "103"
---

[UP](/netty.html)

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-class-hierarchy.svg)

## Inbound



对于 `ChannelInboundInvoker` 接口定义的方法，`DefaultChannelPipeline` 类的实现是交给 `head` 字段处理：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    final HeadContext head;
    
    @Override
    public final ChannelPipeline fireChannelRegistered() {
        AbstractChannelHandlerContext.invokeChannelRegistered(head);
        return this;
    }

    @Override
    public final ChannelPipeline fireChannelActive() {
        AbstractChannelHandlerContext.invokeChannelActive(head);
        return this;
    }

    @Override
    public final ChannelPipeline fireChannelRead(Object msg) {
        // TRACE: head - invokeChannelRead
        AbstractChannelHandlerContext.invokeChannelRead(head, msg);
        return this;
    }
}
```

这些方法的总体逻辑如下：

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-propagation-inbound-fire-event.svg)

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-propagation-inbound-invoker-handler.svg)





## Outbound

对于 `ChannelOutboundInvoker` 接口定义的方法，`DefaultChannelPipeline` 类的实现是交给 `tail` 字段处理：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    final TailContext tail;

    @Override
    public final ChannelFuture bind(SocketAddress localAddress) {
        return tail.bind(localAddress);
    }

    @Override
    public final ChannelPipeline read() {
        tail.read();
        return this;
    }

    @Override
    public final ChannelFuture writeAndFlush(Object msg, ChannelPromise promise) {
        return tail.writeAndFlush(msg, promise);
    }
}
```

这些方法的总体逻辑如下：

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-propagation-outbound-invoke-xxx.svg)


## Exception

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    @Override
    public final ChannelPipeline fireExceptionCaught(Throwable cause) {
        AbstractChannelHandlerContext.invokeExceptionCaught(head, cause);
        return this;
    }
}
```
