---
title: "slice"
sequence: "104"
---

[UP](/netty.html)


```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import lsieun.utils.ByteUtils;

public class HelloWorld {
    public static void main(String[] args) {
        ByteBuf buf0 = ByteBufAllocator.DEFAULT.buffer(10);
        buf0.writeBytes(new byte[]{
                'a', 'b', 'c', 'd', 'e',
                'f', 'g', 'h', 'i', 'j'
        });
        ByteUtils.log(buf0);

        // 在切片过程中，没有发生数据复制
        ByteBuf buf1 = buf0.slice(0, 5);
        ByteBuf buf2 = buf0.slice(5, 5);

        ByteUtils.log(buf1);
        ByteUtils.log(buf2);

        buf1.setByte(0, 'A');

        ByteUtils.log(buf0);
        ByteUtils.log(buf1);
    }
}
```
