---
title: "Channel Pipeline"
sequence: "105"
---

[UP](/netty.html)

在下图当中，我们可以看到：`Channel`、`ChannelPipeline` 和 `ChannelHandlerContext` 各自实现了 `ChannelOutboundInvoker` 接口。

![](/assets/images/netty/channel/netty-channel-invoker-class-hierarchy.svg)

但是，三个接口是合作的关系，即 `Channel` 会调用 `ChannelPipeline` 的方法，
而 `ChannelPipeline` 会调用 `ChannelHandlerContext` 的方法：

```text
Channel --> ChannelPipeline --> ChannelHandlerContext
```
