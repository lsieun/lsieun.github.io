---
title: "Pipeline: read()"
sequence: "105"
---

[UP](/netty.html)

## read 方法

在 `DefaultChannelPipeline` 中，有三个与读相关的方法：

- `read()`
- `fireChannelRead()`
- `fireChannelReadComplete()`

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    @Override
    public final ChannelPipeline read() {
        tail.read();
        return this;
    }

    @Override
    public final ChannelPipeline fireChannelRead(Object msg) {
        AbstractChannelHandlerContext.invokeChannelRead(head, msg);
        return this;
    }

    @Override
    public final ChannelPipeline fireChannelReadComplete() {
        AbstractChannelHandlerContext.invokeChannelReadComplete(head);
        return this;
    }
}
```

其中，`fireChannelRead()` 和 `fireChannelReadComplete()` 方法是由 `ChannelInboundInvoker` 接口定义的，
它们是属于 inbound 方法：

```java
public interface ChannelInboundInvoker {
    ChannelInboundInvoker fireChannelRead(Object msg);

    ChannelInboundInvoker fireChannelReadComplete();
}
```

而 `read()` 方法是由 `ChannelOutboundInvoker` 接口定义的，
它是属于 outbound 方法：

```java
public interface ChannelOutboundInvoker {
    ChannelOutboundInvoker read();
}
```

那么，`read()` 方法起到什么作用呢？

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-read.svg)

## Begin Read

在 `HeadContext` 类中，有一个 `readIfIsAutoRead()` 方法：

```java
public class DefaultChannelPipeline implements ChannelPipeline {
    final class HeadContext extends AbstractChannelHandlerContext
            implements ChannelOutboundHandler, ChannelInboundHandler {
        private void readIfIsAutoRead() {
            if (channel.config().isAutoRead()) {
                channel.read();
            }
        }
    }
}
```

`readIfIsAutoRead()` = `channel.read() if config.isAutoRead()`：
如果（If）配置（config）中是自动读（isAutoRead），就进行 channel 的读（read）操作。

- read: `channel.read()`
- IfIsAutoRead(): `config().isAutoRead()`

```java
public class DefaultChannelConfig implements ChannelConfig {
    private volatile int autoRead = 1;

    @Override
    public boolean isAutoRead() {
        return autoRead == 1;
    }
}
```

### 从何处来

```text
                                                                                         ┌─── ctx.fireChannelActive()
                          ┌─── fireChannelActive() ─────────┼─── head.channelActive() ───┤
                          │                                                              └─── readIfIsAutoRead()
                          │
DefaultChannelPipeline ───┼─── fireChannelRead(msg) ────────┼─── handler.channelRead(ctx, msg)
                          │
                          │                                                                    ┌─── ctx.fireChannelReadComplete()
                          └─── fireChannelReadComplete() ───┼─── head.channelReadComplete() ───┤
                                                                                               └─── readIfIsAutoRead()
```

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-propagation-inbound-head-context-event.svg)

### 到何处去

`readIfIsAutoRead()` 方法主要是对 `Channel.doBeginRead()` 方法的调用。

```text
readIfIsAutoRead() --> channel.read() --> pipeline.read() -->
tail.read() --> head.read() -->
unsafe.beginRead() --> channel.doBeginRead()
```

## 示例代码

```text
ChannelInboundHandler ---> channelActive - 31
ChannelInboundHandler ---> channelActive - 32
ChannelInboundHandler ---> channelActive - 33
ChannelInboundHandler ---> channelActive - 34
ChannelInboundHandler ---> channelActive - 35
ChannelInboundHandler ---> channelActive - 36
ChannelOutboundHandler <--- beginRead - 36
ChannelOutboundHandler <--- beginRead - 35
ChannelOutboundHandler <--- beginRead - 34
ChannelOutboundHandler <--- beginRead - 33
ChannelOutboundHandler <--- beginRead - 32
ChannelOutboundHandler <--- beginRead - 31
```

```text
ChannelInboundHandler ---> channelReadComplete - 31
ChannelInboundHandler ---> channelReadComplete - 32
ChannelInboundHandler ---> channelReadComplete - 33
ChannelInboundHandler ---> channelReadComplete - 34
ChannelInboundHandler ---> channelReadComplete - 35
ChannelInboundHandler ---> channelReadComplete - 36
ChannelOutboundHandler <--- beginRead - 36
ChannelOutboundHandler <--- beginRead - 35
ChannelOutboundHandler <--- beginRead - 34
ChannelOutboundHandler <--- beginRead - 33
ChannelOutboundHandler <--- beginRead - 32
ChannelOutboundHandler <--- beginRead - 31
```
