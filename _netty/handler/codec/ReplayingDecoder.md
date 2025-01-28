---
title: "ReplayingDecoder"
sequence: "106"
---

[UP](/netty.html)


```java
public abstract class ReplayingDecoder<S> extends ByteToMessageDecoder {}
```

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ReplayingDecoder;

import java.util.List;

public class ToIntegerDecoder2 extends ReplayingDecoder<Void> {
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        int value = in.readInt();
        out.add(value);
    }
}
```
