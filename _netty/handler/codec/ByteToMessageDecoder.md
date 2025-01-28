---
title: "ByteToMessageDecoder"
sequence: "105"
---

[UP](/netty.html)


```java
public abstract class ByteToMessageDecoder extends ChannelInboundHandlerAdapter {}
```

```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;

import java.util.List;

public class ToIntegerDecoder extends ByteToMessageDecoder {
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        if (in.readableBytes() >= 4) {
            int value = in.readInt();
            out.add(value);
        }
    }
}
```

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.embedded.EmbeddedChannel;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EmbeddedChannelInboundUnitTest {
    @Test
    void testFramesDecoded() {
        ByteBuf buf = Unpooled.buffer();
        for (int i = 0; i < 9; i++) {
            buf.writeInt(i);
        }

        EmbeddedChannel channel = new EmbeddedChannel();
        channel.pipeline().addLast(new ToIntegerDecoder());


        channel.writeInbound(buf);
        channel.finish();

        for (int i = 0; i < 9; i++) {
            int value = channel.readInbound();
            assertEquals(i, value);
        }
    }
}
```

## 注意事项

Be aware that sub-classes of `ByteToMessageDecoder` MUST NOT annotated with `@Sharable`.
