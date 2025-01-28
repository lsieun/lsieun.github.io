---
title: "Subpage：（1）概览"
sequence: "106-01"
---

[UP](/netty.html)

## 概念

在 Netty 当中，PoolSubpage 的作用是对 Small 内存块的管理；Small 的空间范围是 `0~28KB`。

![](/assets/images/netty/buf/netty-buffer-pool-size-class-capacity.svg)

```text
PoolSubpage helps manage a subset of a chunk of memory in Netty's arena-based memory allocation system.
This helps in minimizing memory wastage and improving locality.
```

### 从 ByteBuf 到 Subpage

```text
reqCapacity --> normCapacity = elemSize --> runSize --> maxNumElems --> bitmapLength --> bitmap
```

![](/assets/images/netty/buf/netty-buffer-pool-subpage-concept.svg)

### 从 PoolArena 到 Subpage

![](/assets/images/netty/buf/netty-buffer-pool-subpage-relation-to-arena.svg)

### handle

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    private long toHandle(int bitmapIdx) {
        int pages = runSize >> pageShifts;
        return (long) runOffset << RUN_OFFSET_SHIFT // runOffset << 49
                | (long) pages << SIZE_SHIFT        // pages << 34
                | 1L << IS_USED_SHIFT               // 1 << 33
                | 1L << IS_SUBPAGE_SHIFT            // 1 << 32
                | bitmapIdx;                        // bitmapIdx
    }
}
```

## 数据结构

PoolSubpage的数据结构：

- 解释PoolSubpage的数据结构，包括其字段的含义和作用。
- 分析PoolSubpage是如何组织的，包括大小、状态、内存分配情况等信息。

深入 PoolSubpage 的内部数据结构，包括：

- 内存块大小：每个内存块的大小。
- 内存块数组：存储可用内存块的数组。
- 使用位图：记录哪些内存块已被分配。

### Arena



```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    // region Field - Arena

    // head index
    final int headIndex;

    // head lock - 只有 head 节点拥有『锁』
    final ReentrantLock lock;

    // doubly-linked list
    PoolSubpage<T> prev;
    PoolSubpage<T> next;

    // endregion
}
```



### Chunk

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    // region Field - Chunk
    final PoolChunk<T> chunk;
    private final int pageShifts;
    // endregion


    // region Field - PageRun
    private final int runOffset;
    private final int runSize;
    // endregion
}
```

### Subpage

```java
final class PoolSubpage<T> implements PoolSubpageMetric {

    // region Field - SubPage - structure 『基本结构』
    final int elemSize;
    private final int maxNumElems;
    private final int bitmapLength;
    private final long[] bitmap;
    // endregion


    // region Field - SubPage - avail 『可用空间』
    private int nextAvail;
    private int numAvail;
    // endregion


    // region Field - SubPage - destroy
    boolean doNotDestroy;
    // endregion
}
```


## 算法

### 位图算法

```java
import java.util.HashMap;
import java.util.Map;

public class BitMapNum {
    static final long BIT_00000000 = 0b00L;
    static final long BIT_00000011 = 0b11L;
    static final long BIT_00001100 = BIT_00000011 << 2;
    static final long BIT_00110000 = BIT_00001100 << 2;
    static final long BIT_11000000 = BIT_00110000 << 2;

    static final long BIT_11000011 = BIT_11000000 | BIT_00000011;
    static final long BIT_11111111 = BIT_11000000 | BIT_00110000 | BIT_00001100 | BIT_00000011;


    private static boolean hasBit(long val, int indexFromLeft) {
        int rightShift = 63 - indexFromLeft;
        return ((val >> rightShift) & 1L) == 1L;
    }

    private static long getNum0() {
        return getLong(
                BIT_11111111,
                BIT_11000011,
                BIT_11000011,
                BIT_11000011,
                BIT_11000011,
                BIT_11000011,
                BIT_11111111,
                BIT_00000000
        );
    }

    private static long getNum1() {
        return getLong(
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000000
        );
    }

    private static long getNum2() {
        return getLong(
                BIT_11111111,
                BIT_00000011,
                BIT_00000011,
                BIT_11111111,
                BIT_11000000,
                BIT_11000000,
                BIT_11111111,
                BIT_00000000
        );
    }

    private static long getNum3() {
        return getLong(
                BIT_11111111,
                BIT_00000011,
                BIT_00000011,
                BIT_11111111,
                BIT_00000011,
                BIT_00000011,
                BIT_11111111,
                BIT_00000000
        );
    }

    private static long getNum4() {
        return getLong(
                BIT_11000011,
                BIT_11000011,
                BIT_11000011,
                BIT_11111111,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000000
        );
    }

    private static long getNum5() {
        return getLong(
                BIT_11111111,
                BIT_11000000,
                BIT_11000000,
                BIT_11111111,
                BIT_00000011,
                BIT_00000011,
                BIT_11111111,
                BIT_00000000
        );
    }

    private static long getNum6() {
        return getLong(
                BIT_11111111,
                BIT_11000000,
                BIT_11000000,
                BIT_11111111,
                BIT_11000011,
                BIT_11000011,
                BIT_11111111,
                BIT_00000000
        );
    }

    private static long getNum7() {
        return getLong(
                BIT_11111111,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000011,
                BIT_00000000
        );
    }

    private static long getNum8() {
        return getLong(
                BIT_11111111,
                BIT_11000011,
                BIT_11000011,
                BIT_11111111,
                BIT_11000011,
                BIT_11000011,
                BIT_11111111,
                BIT_00000000
        );
    }

    private static long getNum9() {
        return getLong(
                BIT_11111111,
                BIT_11000011,
                BIT_11000011,
                BIT_11111111,
                BIT_00000011,
                BIT_00000011,
                BIT_11111111,
                BIT_00000000
        );
    }

    private static long getLong(long... array) {
        if (array.length != 8) {
            throw new RuntimeException("array.length != 8");
        }

        return array[0] << 56 |
                array[1] << 48 |
                array[2] << 40 |
                array[3] << 32 |
                array[4] << 24 |
                array[5] << 16 |
                array[6] << 8 |
                array[7];
    }

    private static final Map<String, Long> NUM_MAP = new HashMap<>();

    static {
        NUM_MAP.put("0", getNum0());
        NUM_MAP.put("1", getNum1());
        NUM_MAP.put("2", getNum2());
        NUM_MAP.put("3", getNum3());
        NUM_MAP.put("4", getNum4());
        NUM_MAP.put("5", getNum5());
        NUM_MAP.put("6", getNum6());
        NUM_MAP.put("7", getNum7());
        NUM_MAP.put("8", getNum8());
        NUM_MAP.put("9", getNum9());
    }

    public static void main(String[] args) {
        String numStr = "0123456789";
        System.out.println("numStr = " + numStr);

        String[] array = numStr.split("");
        for (int i = 0; i < 8; i++) {
            StringBuilder sb = new StringBuilder();
            for (String key : array) {
                long val = NUM_MAP.get(key);

                for (int j = 0; j < 8; j++) {
                    int index = i * 8 + j;
                    boolean hasBit = hasBit(val, index);
                    sb.append(hasBit ? "■" : " ");
                }
                sb.append("  ");
            }
            System.out.println(sb);
        }
    }
}
```

```text
■■■■■■■■        ■■  ■■■■■■■■  ■■■■■■■■  ■■    ■■  ■■■■■■■■  ■■■■■■■■  ■■■■■■■■  ■■■■■■■■  ■■■■■■■■  
■■    ■■        ■■        ■■        ■■  ■■    ■■  ■■        ■■              ■■  ■■    ■■  ■■    ■■  
■■    ■■        ■■        ■■        ■■  ■■    ■■  ■■        ■■              ■■  ■■    ■■  ■■    ■■  
■■    ■■        ■■  ■■■■■■■■  ■■■■■■■■  ■■■■■■■■  ■■■■■■■■  ■■■■■■■■        ■■  ■■■■■■■■  ■■■■■■■■  
■■    ■■        ■■  ■■              ■■        ■■        ■■  ■■    ■■        ■■  ■■    ■■        ■■  
■■    ■■        ■■  ■■              ■■        ■■        ■■  ■■    ■■        ■■  ■■    ■■        ■■  
■■■■■■■■        ■■  ■■■■■■■■  ■■■■■■■■        ■■  ■■■■■■■■  ■■■■■■■■        ■■  ■■■■■■■■  ■■■■■■■■  
```

## 示例

### 示例一：分配3000字节

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.PoolSubpage;
import io.netty.buffer.PooledByteBufAllocator;
import lsieun.utils.BufUtils;
import lsieun.utils.ChunkUtils;

public class HelloWorld {
    public static void main(String[] args) {
        // buf
        int requestCapacity = 3000;
        PooledByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
        ByteBuf buf = allocator.heapBuffer(requestCapacity);

        // handle
        long handle = BufUtils.getHandle(buf);
        ChunkUtils.printHandle(handle);

        // subpage
        PoolSubpage<?> subpage = BufUtils.getSubpage(buf);
        ChunkUtils.printSubpage(subpage);
    }
}
```

```text
handle = 64424509440

Binary:
+---------------+---------------+-+-+--------------------------------+
│000000000000000│000000000000011│1│1│00000000000000000000000000000000│
+---------------+---------------+-+-+--------------------------------+

Table:
┌───────────┬───────┬─────────┬───────────┬───────────┐
│ runOffset │ pages │ isUsed  │ isSubpage │ bitmapIdx │
├───────────┼───────┼─────────┼───────────┼───────────┤
│     0     │   3   │  true   │   true    │     0     │
└───────────┴───────┴─────────┴───────────┴───────────┘

Subpage:
┌─────────┬─────────────┬─────────┬─────────────────┬───────┬───────────────┬─────┐
│  Chunk  │  chunkSize  │ 4194304 │    pageSize     │ 8192  │  totalPages   │ 512 │
├─────────┼─────────────┼─────────┼─────────────────┼───────┼───────────────┼─────┤
│ PageRun │  runOffset  │    0    │     runSize     │ 24576 │     pages     │  3  │
├─────────┼─────────────┼─────────┼─────────────────┼───────┼───────────────┼─────┤
│ Subpage │ elementSize │  3072   │ maxNumElements  │   8   │ bitmapLength  │  1  │
├─────────┼─────────────┼─────────┼─────────────────┼───────┼───────────────┼─────┤
│ Bitmap  │  totalBits  │   64    │   invalidBits   │  56   │ numAvailable  │  7  │
└─────────┴─────────────┴─────────┴─────────────────┴───────┴───────────────┴─────┘

Bitmap:
┌───────────┬───────────────────────────────────────────────────────────────────┐
│ bitmap[0] │ XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX00000001  │
└───────────┴───────────────────────────────────────────────────────────────────┘
```

### 示例二：3次分配200字节

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.PoolSubpage;
import io.netty.buffer.PooledByteBufAllocator;
import lsieun.cst.MyConst;
import lsieun.utils.BufUtils;
import lsieun.utils.ChunkUtils;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        int requestCapacity = 200;
        PooledByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;

        List<ByteBuf> bufList = new ArrayList<>();
        // 分配 3 个，进行比对
        for (int i = 0; i < 3; i++) {
            // buf
            ByteBuf buf = allocator.heapBuffer(requestCapacity);
            bufList.add(buf);

            // handle
            long handle = BufUtils.getHandle(buf);
            ChunkUtils.printHandle(handle);

            // subpage
            PoolSubpage<?> subpage = BufUtils.getSubpage(buf);
            ChunkUtils.printSubpage(subpage);

            System.out.println(MyConst.SEPARATION_LINE);
            System.out.println();
        }



        for (ByteBuf buf : bufList) {
            buf.release();
        }
    }
}
```

### 示例三：从配置文件读取

```text
# name,operation,bytes,show
buf1,allocate,500,true
buf2,allocate,500,true
buf3,allocate,500,true
buf2,free,500,true
buf1,free,500,true
buf3,free,500,true
```

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.PoolSubpage;
import lsieun.utils.BufUtils;
import lsieun.utils.ChunkUtils;

import java.io.IOException;
import java.util.function.Consumer;
import java.util.function.Function;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        Function<ByteBuf, PoolSubpage<?>> func = BufUtils::getSubpage;
        Consumer<PoolSubpage<?>> consumer = ChunkUtils::printSubpage;
        BufUtils.processBytes(true, func, consumer);
    }
}
```

### 示例四：PageRun 和 Subpage

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.PoolChunk;
import io.netty.buffer.PooledByteBufAllocator;
import io.netty.buffer.SizeClasses;
import lsieun.cst.MyConst;
import lsieun.drawing.theme.table.TableType;
import lsieun.drawing.utils.TableUtils;
import lsieun.utils.BufUtils;

public class HelloWorld {
    public static void main(String[] args) {
        PooledByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
        ByteBuf buf = allocator.heapBuffer(64 * MyConst.PAGE);

        PoolChunk<?> chunk = BufUtils.getChunk(buf);
        SizeClasses sizeClass = BufUtils.getSizeClass(buf);
        int pageSize = sizeClass.pageSize;
        int nSubpages = sizeClass.nSubpages;

        String[][] matrix = new String[nSubpages + 1][4];
        matrix[0][0] = "elemSize";
        matrix[0][1] = "runSize";
        matrix[0][2] = "pages";
        matrix[0][3] = "maxNumElems";
        for (int i = 0; i < nSubpages; i++) {
            int elemSize = sizeClass.sizeIdx2size(i);
            int runSize = chunk.calculateRunSize(i);
            int pages = runSize / pageSize;
            int maxNumElems = pages * pageSize / elemSize;

            matrix[i + 1][0] = String.valueOf(elemSize);
            matrix[i + 1][1] = String.valueOf(runSize);
            matrix[i + 1][2] = String.valueOf(pages);
            matrix[i + 1][3] = String.valueOf(maxNumElems);
        }

        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌───────────┬─────────┬───────┬─────────────┐
│ elemSize  │ runSize │ pages │ maxNumElems │
├───────────┼─────────┼───────┼─────────────┤
│    16     │  8192   │   1   │     512     │
├───────────┼─────────┼───────┼─────────────┤
│    32     │  8192   │   1   │     256     │
├───────────┼─────────┼───────┼─────────────┤
│    48     │  24576  │   3   │     512     │
├───────────┼─────────┼───────┼─────────────┤
│    64     │  8192   │   1   │     128     │
├───────────┼─────────┼───────┼─────────────┤
│    80     │  40960  │   5   │     512     │
├───────────┼─────────┼───────┼─────────────┤
│    96     │  24576  │   3   │     256     │
├───────────┼─────────┼───────┼─────────────┤
│    112    │  57344  │   7   │     512     │
├───────────┼─────────┼───────┼─────────────┤
│    128    │  8192   │   1   │     64      │
├───────────┼─────────┼───────┼─────────────┤
│    160    │  40960  │   5   │     256     │
├───────────┼─────────┼───────┼─────────────┤
│    192    │  24576  │   3   │     128     │
├───────────┼─────────┼───────┼─────────────┤
│    224    │  57344  │   7   │     256     │
├───────────┼─────────┼───────┼─────────────┤
│    256    │  8192   │   1   │     32      │
├───────────┼─────────┼───────┼─────────────┤
│    320    │  40960  │   5   │     128     │
├───────────┼─────────┼───────┼─────────────┤
│    384    │  24576  │   3   │     64      │
├───────────┼─────────┼───────┼─────────────┤
│    448    │  57344  │   7   │     128     │
├───────────┼─────────┼───────┼─────────────┤
│    512    │  8192   │   1   │     16      │
├───────────┼─────────┼───────┼─────────────┤
│    640    │  40960  │   5   │     64      │
├───────────┼─────────┼───────┼─────────────┤
│    768    │  24576  │   3   │     32      │
├───────────┼─────────┼───────┼─────────────┤
│    896    │  57344  │   7   │     64      │
├───────────┼─────────┼───────┼─────────────┤
│   1024    │  8192   │   1   │      8      │
├───────────┼─────────┼───────┼─────────────┤
│   1280    │  40960  │   5   │     32      │
├───────────┼─────────┼───────┼─────────────┤
│   1536    │  24576  │   3   │     16      │
├───────────┼─────────┼───────┼─────────────┤
│   1792    │  57344  │   7   │     32      │
├───────────┼─────────┼───────┼─────────────┤
│   2048    │  8192   │   1   │      4      │
├───────────┼─────────┼───────┼─────────────┤
│   2560    │  40960  │   5   │     16      │
├───────────┼─────────┼───────┼─────────────┤
│   3072    │  24576  │   3   │      8      │
├───────────┼─────────┼───────┼─────────────┤
│   3584    │  57344  │   7   │     16      │
├───────────┼─────────┼───────┼─────────────┤
│   4096    │  8192   │   1   │      2      │
├───────────┼─────────┼───────┼─────────────┤
│   5120    │  40960  │   5   │      8      │
├───────────┼─────────┼───────┼─────────────┤
│   6144    │  24576  │   3   │      4      │
├───────────┼─────────┼───────┼─────────────┤
│   7168    │  57344  │   7   │      8      │
├───────────┼─────────┼───────┼─────────────┤
│   8192    │  8192   │   1   │      1      │
├───────────┼─────────┼───────┼─────────────┤
│   10240   │  40960  │   5   │      4      │
├───────────┼─────────┼───────┼─────────────┤
│   12288   │  24576  │   3   │      2      │
├───────────┼─────────┼───────┼─────────────┤
│   14336   │  57344  │   7   │      4      │
├───────────┼─────────┼───────┼─────────────┤
│   16384   │  16384  │   2   │      1      │
├───────────┼─────────┼───────┼─────────────┤
│   20480   │  40960  │   5   │      2      │
├───────────┼─────────┼───────┼─────────────┤
│   24576   │  24576  │   3   │      1      │
├───────────┼─────────┼───────┼─────────────┤
│   28672   │  57344  │   7   │      2      │
└───────────┴─────────┴───────┴─────────────┘
```

