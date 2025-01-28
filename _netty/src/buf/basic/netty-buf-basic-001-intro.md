---
title: "ByteBuf 类介绍"
sequence: "101"
---

[UP](/netty.html)

## ByteBuf 类

在 Java NIO 中，定义了 `ByteBuffer` 类作为『数据的容器』；
在 Netty 中，定义了 `ByteBuf` 类，用于取代 `ByteBuffer` 类，并提供了更多的功能。

## 基本概念

```text
+-------------------+------------------+------------------+
| discardable bytes |  readable bytes  |  writable bytes  |
|                   |     (CONTENT)    |                  |
+-------------------+------------------+------------------+
|                   |                  |                  |
0      <=      readerIndex   <=   writerIndex    <=    capacity
```

## 方法分类

![](/assets/images/netty/buf/netty-buffer-structure.svg)


