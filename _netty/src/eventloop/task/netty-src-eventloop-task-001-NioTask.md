---
title: "NioTask"
sequence: "101"
---

[UP](/netty.html)

```java
public interface NioTask<C extends SelectableChannel> {
    void channelReady(C ch, SelectionKey key) throws Exception;

    void channelUnregistered(C ch, Throwable cause) throws Exception;
}
```
