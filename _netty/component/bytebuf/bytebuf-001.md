---
title: "ByteBuf Intro"
sequence: "101"
---

[UP](/netty.html)

```text
channel.alloc().buffer();
ByteBufAllocator.DEFAULT.buffer();
Unpooled.copiedBuffer("Hello World", CharsetUtil.UTF_8);
Unpooled.EMPTY_BUFFER;
```

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        ByteBuf buf = ByteBufAllocator.DEFAULT.buffer();
        log.info("buf = {}", buf);

        byte[] bytes = getBytes(300);
        buf.writeBytes(bytes);
        log.info("buf = {}", buf);
    }

    private static byte[] getBytes(int num) {
        return "a".repeat(Math.max(0, num)).getBytes();
    }
}
```

```text
buf = PooledUnsafeDirectByteBuf(ridx: 0, widx: 0, cap: 256)
buf = PooledUnsafeDirectByteBuf(ridx: 0, widx: 300, cap: 512)
```

- `ridx` = read index
- `widx` = write index


```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufAllocator;
import io.netty.buffer.ByteBufUtil;

import static io.netty.util.internal.StringUtil.NEWLINE;

public class HelloWorld {
    public static void main(String[] args) {
        ByteBuf buf = ByteBufAllocator.DEFAULT.buffer();
        log(buf);

        byte[] bytes = getBytes(32);
        buf.writeBytes(bytes);
        log(buf);
    }

    private static byte[] getBytes(int num) {
        return "a".repeat(Math.max(0, num)).getBytes();
    }

    private static void log(ByteBuf buffer) {
        int length = buffer.readableBytes();
        int rows = length / 16 + (length % 15 == 0 ? 0 : 1) + 4;
        StringBuilder buf = new StringBuilder(rows * 80 * 2)
                .append("read index:").append(buffer.readerIndex())
                .append(" write index:").append(buffer.writerIndex())
                .append(" capacity:").append(buffer.capacity())
                .append(NEWLINE);
        ByteBufUtil.appendPrettyHexDump(buf, buffer);
        System.out.println(buf.toString());
    }
}
```

```text
read index:0 write index:0 capacity:256

read index:0 write index:32 capacity:256
         +-------------------------------------------------+
         |  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f |
+--------+-------------------------------------------------+----------------+
|00000000| 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 |aaaaaaaaaaaaaaaa|
|00000010| 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 61 |aaaaaaaaaaaaaaaa|
+--------+-------------------------------------------------+----------------+
```

## 扩容

再写入一个 int 整数时，容量不够了（初始容量是 10），这时会引发扩容

```text
buffer.writeInt(6);
log(buffer);
```

扩容规则是

- 如何写入后数据大小未超过 512，则选择下一个 16 的整数倍，例如写入后大小为 12 ，则扩容后 capacity 是 16
- 如果写入后数据大小超过 512，则选择下一个 2^n，例如写入后大小为 513，则扩容后 capacity 是 2^10=1024（2^9=512 已经不够了）
- 扩容不能超过 max capacity 会报错

结果是

```
read index:0 write index:12 capacity:16
         +-------------------------------------------------+
         |  0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f |
+--------+-------------------------------------------------+----------------+
|00000000| 01 02 03 04 00 00 00 05 00 00 00 06             |............    |
+--------+-------------------------------------------------+----------------+
