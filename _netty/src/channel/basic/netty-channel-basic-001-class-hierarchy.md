---
title: "Channel 类继承层次"
sequence: "101"
---

[UP](/netty.html)

## 类层次结构

### Java NIO Channel

在 Java NIO 中，定义了一个 `Channel` 接口，位于 `java.nio.channels` 包：

```java
package java.nio.channels;

public interface Channel extends Closeable {
    public boolean isOpen();

    public void close() throws IOException;
}
```

![](/assets/images/netty/channel/java-nio-channel-class-hierarchy.svg)

### Netty Channel

在 Netty 中，也定义了一个 `Channel` 接口，位于 `io.netty.channel` 包：

```java
package io.netty.channel;

public interface Channel extends AttributeMap, ChannelOutboundInvoker, Comparable<Channel> {
    // 
}
```

![](/assets/images/netty/channel/netty-channel-class-hierarchy-hide-members.svg)

### 合并

在下图当中，我们要注意：**在 Java NIO 和 Netty 中，都各自定义了 `ServerSocketChannel` 和 `SocketChannel`**。

![](/assets/images/netty/channel/netty-channel-class-hierarchy-merged.svg)

上图经过简化之后：

![](/assets/images/netty/channel/netty-channel-class-hierarchy-merged-simple.svg)
