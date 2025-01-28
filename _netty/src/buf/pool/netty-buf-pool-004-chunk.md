---
title: "Chunk"
sequence: "104"
---

[UP](/netty.html)

## PoolChunk 介绍

### 基本概念

| Concept | Netty Class |
|---------|-------------|
| Chunk   | PoolChunk   |
| Page    |             |
| PageRun |             |
| Subpage | PoolSubpage |


![](/assets/images/netty/buf/netty-buffer-pool-chunk-concept-illustrated.svg)

### Chunk 结构

![](/assets/images/netty/buf/netty-buffer-pool-chunk-structure.svg)

## Handle

在 `PoolChunk` 当中，**handle** 是进行『内存空间分配』的一种表达方式。

### 格式

**handle** 是一个 `long` 类型的数值，由 64 bit 组成，其含义如下：

```text
oooooooo ooooooos ssssssss ssssssue bbbbbbbb bbbbbbbb bbbbbbbb bbbbbbbb
```

- `o`: `runOffset` (page offset in the chunk), 15bit
- `s`: `size` (number of pages) of this run, 15bit
- `u`: `isUsed`?, 1bit
- `e`: `isSubpage`?, 1bit
- `b`: `bitmapIdx` of subpage, zero if it's not subpage, 32bit

它包含了 PageRun 和 Subpage 的信息：

```text
+------------------+---------------------+--------------+-----------------+--------------------------------+
│             PageRun (30 bit)           │            Mark (2 bit)        │       Subpage   (32 bit)       │
+------------------+---------------------+--------------+-----------------+--------------------------------+
│runOffset (15 bit)│num of pages (15 bit)│isUsed (1 bit)│isSubpage (1 bit)│       bitmapIdx (32 bit)       │
+------------------+---------------------+--------------+-----------------+--------------------------------+
```

### 代码

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private static final int SIZE_BIT_LENGTH = 15;
    private static final int INUSED_BIT_LENGTH = 1;
    private static final int SUBPAGE_BIT_LENGTH = 1;
    private static final int BITMAP_IDX_BIT_LENGTH = 32;

    static final int IS_SUBPAGE_SHIFT = BITMAP_IDX_BIT_LENGTH;              // 32
    static final int IS_USED_SHIFT = SUBPAGE_BIT_LENGTH + IS_SUBPAGE_SHIFT; // 33
    static final int SIZE_SHIFT = INUSED_BIT_LENGTH + IS_USED_SHIFT;        // 34
    static final int RUN_OFFSET_SHIFT = SIZE_BIT_LENGTH + SIZE_SHIFT;       // 49

    private static long toRunHandle(int runOffset, int runPages, int inUsed) {
        return (long) runOffset << RUN_OFFSET_SHIFT // runOffset << 49
                | (long) runPages << SIZE_SHIFT     // runPages << 34
                | (long) inUsed << IS_USED_SHIFT;   // inUsed << 33
    }

    static int runOffset(long handle) {
        return (int) (handle >> RUN_OFFSET_SHIFT);  // (handle >> 49)
    }

    static int runSize(int pageShifts, long handle) {
        return runPages(handle) << pageShifts;
    }

    static int runPages(long handle) {
        return (int) (handle >> SIZE_SHIFT & 0x7fff);  // (handle >> 34) & 0x7fff
    }

    static boolean isUsed(long handle) {
        return (handle >> IS_USED_SHIFT & 1) == 1L; // (handle >> 33) & 1
    }

    static boolean isRun(long handle) {
        return !isSubpage(handle);
    }

    static boolean isSubpage(long handle) {
        return (handle >> IS_SUBPAGE_SHIFT & 1) == 1L; // (handle >> 32) & 1
    }

    static int bitmapIdx(long handle) {
        return (int) handle;
    }
}
```

### 示例

```java
public class HelloWorld {
    public static void main(String[] args) {
        long handle = PoolChunk.toRunHandle(50, 250, 1);
        ChunkUtils.printHandle(handle);
        ChunkUtils.printHandleInChunk(handle);
    }
}
```

```text
handle = 28151801228296192

Binary:
+---------------+---------------+-+-+--------------------------------+
│000000000110010│000000011111010│1│0│00000000000000000000000000000000│
+---------------+---------------+-+-+--------------------------------+

Table:
┌───────────┬───────┬─────────┬───────────┬───────────┐
│ runOffset │ pages │ isUsed  │ isSubpage │ bitmapIdx │
├───────────┼───────┼─────────┼───────────┼───────────┤
│    50     │  250  │  true   │   false   │     0     │
└───────────┴───────┴─────────┴───────────┴───────────┘

Chunk Size: 4194304, Page Size: 8192, Total Pages: 512, isChunkInitFull: false, Handles: [28151801228296192]
    - handle:28151801228296192 (runOffset:50, pages:250, isUsed:true, isSubpage:false, bitmapIdx:0)
┌─────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐
│     │     0      │     10     │     20     │     30     │     40     │     50     │     60     │     70     │     80     │     90     │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│     │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 000 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 100 │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 200 │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 300 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 400 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 500 │ □□□□□□□□□□ │ □□         │            │            │            │            │            │            │            │            │
└─────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
```

## PageRun

### 初始状态

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private final IntPriorityQueue[] runsAvail;
    private final LongLongHashMap runsAvailMap;
    private final ReentrantLock runsAvailLock;
    
    PoolChunk(PoolArena<T> arena, Object base, T memory, int pageSize, int pageShifts, int chunkSize, int maxPageIdx) {
        runsAvail = newRunsAvailqueueArray(maxPageIdx);
        runsAvailMap = new LongLongHashMap(-1);
        runsAvailLock = new ReentrantLock();
        
        // insert initial run, offset = 0, pages = chunkSize / pageSize
        int pages = chunkSize >> pageShifts;
        long initHandle = (long) pages << SIZE_SHIFT;
        insertAvailRun(0, pages, initHandle);
    }
}
```

```text
┌─────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐
│     │     0      │     10     │     20     │     30     │     40     │     50     │     60     │     70     │     80     │     90     │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│     │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 000 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 100 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 200 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 300 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 400 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 500 │ □□□□□□□□□□ │ □□         │            │            │            │            │            │            │            │            │
└─────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
```

```text
runsAvail.length = 32
runsAvail[31]: 1
    - handle:8796093022208 (runOffset:0, pages:512, isUsed:false, isSubpage:false, bitmapIdx:0)
runsAvailMap
    - [0, 511]: 8796093022208
```

![](/assets/images/netty/buf/netty-buffer-pool-chunk-runs-avail.svg)


### 添加和移除

#### 添加

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private void insertAvailRun(int runOffset, int pages, long handle) {
        // NOTE: 第 1 步，更新 runsAvail，记录『可用 page 空间』
        // NOTE: 第 1.1 步，根据 pages 大小，找到 pageIdxFloor
        int pageIdxFloor = arena.sizeClass.pages2pageIdxFloor(pages);
        // NOTE: 第 1.2 步，根据 pageIdxFloor，找到 queue
        IntPriorityQueue queue = runsAvail[pageIdxFloor];
        assert isRun(handle);
        // NOTE: 第 1.3 步，将『可用空间』记录到 queue
        queue.offer((int) (handle >> BITMAP_IDX_BIT_LENGTH));

        // NOTE: 第 2 步，更新 runsAvailMap
        // insert first page of run
        insertAvailRun0(runOffset, handle);
        if (pages > 1) {
            //insert last page of run
            insertAvailRun0(lastPage(runOffset, pages), handle);
        }
    }

    private void insertAvailRun0(int runOffset, long handle) {
        long pre = runsAvailMap.put(runOffset, handle);
        assert pre == -1;
    }
}
```

#### 移除

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private void removeAvailRun(long handle) {
        // NOTE: 第 1 步，更新 runsAvail，移除『可用 page 空间』
        // NOTE: 第 1.1 步，从 handle 中提取出 pages
        int pages = runPages(handle);
        // NOTE: 第 1.2 步，将 pages 转换成 pageIdxFloor
        int pageIdxFloor = arena.sizeClass.pages2pageIdxFloor(pages);
        // NOTE: 第 1.3 步，根据 pageIdxFloor 获取 queue
        IntPriorityQueue queue = runsAvail[pageIdxFloor];
        // NOTE: 第 1.4 步，从 queue 中移除『可用空间』
        queue.remove((int) (handle >> BITMAP_IDX_BIT_LENGTH));

        // NOTE: 第 2 步，更新 runsAvailMap
        removeAvailRun0(handle);
    }

    private void removeAvailRun0(long handle) {
        // NOTE: 第 1 步，从 handle 中提取 runOffset 和 pages
        int runOffset = runOffset(handle);
        int pages = runPages(handle);

        // NOTE: 第 2 步，从 runsAvailMap 中移除 run 的 firstPage 和 lastPage 记录
        // remove first page of run
        runsAvailMap.remove(runOffset);
        if (pages > 1) {
            //remove last page of run
            runsAvailMap.remove(lastPage(runOffset, pages));
        }
    }
}
```

### 分割和合并

#### 分割

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private long splitLargeRun(long handle, int needPages) {
        assert needPages > 0;

        // NOTE: 第 1 步，从 handle 中获取所有的 page，即 totalPages
        int totalPages = runPages(handle);
        assert needPages <= totalPages;

        // NOTE: 第 2 步，获取剩余的 page，即 remPages
        int remPages = totalPages - needPages;

        // NOTE: 第 3 步，如果有剩余，则记录『剩余空间』
        if (remPages > 0) {
            // NOTE: 第 3.1 步，旧的 offset
            int runOffset = runOffset(handle);

            // NOTE: 第 3.2 步，新的 offset
            // keep track of trailing unused pages for later use
            int availOffset = runOffset + needPages;

            // NOTE: 第 3.3 步，『剩余空间』的 handle
            long availRun = toRunHandle(availOffset, remPages, 0);

            // NOTE: 第 3.4 步，将『剩余空间』记录下来
            insertAvailRun(availOffset, remPages, availRun);

            // NOTE: 第 3.5 步，将『使用的空间』进行返回
            // not avail
            return toRunHandle(runOffset, needPages, 1);
        }

        // NOTE: 第 4 步，如果没有剩余，则将整个 handle 转换为『使用空间』
        // mark it as used
        handle |= 1L << IS_USED_SHIFT;
        return handle;
    }
}
```

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.PoolChunk;
import io.netty.buffer.PooledByteBufAllocator;
import lsieun.cst.MyConst;
import lsieun.utils.ChunkUtils;

public class HelloWorld {
    public static void main(String[] args) {
        PooledByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
        PoolChunk<?> chunk = ChunkUtils.getChunk(allocator);

        ByteBuf buf1 = allocator.heapBuffer(64 * MyConst.PAGE);
        print(chunk);

        ByteBuf buf2 = allocator.heapBuffer(128 * MyConst.PAGE);

        buf2.release();
        buf1.release();
    }

    private static void print(PoolChunk<?> chunk) {
        ChunkUtils.printChunk(chunk);
        ChunkUtils.printPageAvail(chunk);
    }
}
```

```text
┌─────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐
│     │     0      │     10     │     20     │     30     │     40     │     50     │     60     │     70     │     80     │     90     │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│     │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 000 │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 100 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 200 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 300 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 400 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 500 │ □□□□□□□□□□ │ □□         │            │            │            │            │            │            │            │            │
└─────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
```

#### 合并

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private long collapseRuns(long handle) {
        return collapseNext(collapsePast(handle));
    }

    private long collapsePast(long handle) {
        for (; ; ) {
            // NOTE: 第 1 步，获取当前 handle 的 offset 和 pages 信息
            int runOffset = runOffset(handle);
            int runPages = runPages(handle);

            // NOTE: 第 2 步，判断当前 handle 的前面是否有『可用空间』
            long pastRun = getAvailRunByOffset(runOffset - 1);
            if (pastRun == -1) {
                return handle;
            }

            // NOTE: 第 3 步，获取前面『可用空间』的 offset 和 pages 信息
            int pastOffset = runOffset(pastRun);
            int pastPages = runPages(pastRun);

            // NOTE: 第 4 步，如果是连续空间，则进行合并；如果不连续，则直接返回
            // is continuous
            if (pastRun != handle && pastOffset + pastPages == runOffset) {
                // NOTE: 第 4.1 步，删除前面的『可用空间』
                // remove past run
                removeAvailRun(pastRun);
                // NOTE: 第 4.2 步，合并
                handle = toRunHandle(pastOffset, pastPages + runPages, 0);
            }
            else {
                return handle;
            }
        }
    }

    private long collapseNext(long handle) {
        for (; ; ) {
            int runOffset = runOffset(handle);
            int runPages = runPages(handle);

            long nextRun = getAvailRunByOffset(runOffset + runPages);
            if (nextRun == -1) {
                return handle;
            }

            int nextOffset = runOffset(nextRun);
            int nextPages = runPages(nextRun);

            // is continuous
            if (nextRun != handle && runOffset + runPages == nextOffset) {
                // remove next run
                removeAvailRun(nextRun);
                handle = toRunHandle(runOffset, runPages + nextPages, 0);
            }
            else {
                return handle;
            }
        }
    }

}
```

```java
import io.netty.buffer.ByteBuf;
import io.netty.buffer.PoolChunk;
import io.netty.buffer.PooledByteBufAllocator;
import lsieun.cst.MyConst;
import lsieun.utils.ChunkUtils;

public class HelloWorld {
    public static void main(String[] args) {
        PooledByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
        PoolChunk<?> chunk = ChunkUtils.getChunk(allocator);

        ByteBuf buf1 = allocator.heapBuffer(64 * MyConst.PAGE);
        ByteBuf buf2 = allocator.heapBuffer(128 * MyConst.PAGE);
        ByteBuf buf3 = allocator.heapBuffer(128 * MyConst.PAGE);

        buf2.release();
        buf1.release();
        print(chunk);
        buf3.release();
    }

    private static void print(PoolChunk<?> chunk) {
        ChunkUtils.printChunk(chunk);
        ChunkUtils.printPageAvail(chunk);
    }
}
```

```text
┌─────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐
│     │     0      │     10     │     20     │     30     │     40     │     50     │     60     │     70     │     80     │     90     │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│     │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │ 0123456789 │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 000 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 100 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□■■■■■■■■ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 200 │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ ■■■■■■■■■■ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 300 │ ■■■■■■■■■■ │ ■■■■■■■■■■ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 400 │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │ □□□□□□□□□□ │
├─────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┼────────────┤
│ 500 │ □□□□□□□□□□ │ □□         │            │            │            │            │            │            │            │            │
└─────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
```

## Chunk 创建和销毁

### 创建

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    protected abstract PoolChunk<T> newChunk(int pageSize, int maxPageIdx, int pageShifts, int chunkSize);

    protected abstract PoolChunk<T> newUnpooledChunk(int capacity);
}
```

![](/assets/images/netty/buf/netty-buffer-pool-chunk-initial-state.svg)

### 销毁

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    protected abstract void destroyChunk(PoolChunk<T> chunk);
}
```

## Chunk 使用

```java
public class PooledByteBufAllocator extends AbstractByteBufAllocator implements ByteBufAllocatorMetricProvider {
    @Override
    protected ByteBuf newHeapBuffer(int initialCapacity, int maxCapacity) {
        PoolThreadCache cache = threadCache.get();
        PoolArena<byte[]> heapArena = cache.heapArena;

        final ByteBuf buf = heapArena.allocate(cache, initialCapacity, maxCapacity);

        return toLeakAwareBuffer(buf);
    }

    @Override
    protected ByteBuf newDirectBuffer(int initialCapacity, int maxCapacity) {
        PoolThreadCache cache = threadCache.get();
        PoolArena<ByteBuffer> directArena = cache.directArena;

        final ByteBuf buf = directArena.allocate(cache, initialCapacity, maxCapacity);

        return toLeakAwareBuffer(buf);
    }
}
```

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    PooledByteBuf<T> allocate(PoolThreadCache cache, int reqCapacity, int maxCapacity) {
        PooledByteBuf<T> buf = newByteBuf(maxCapacity);

        allocate(cache, buf, reqCapacity);
        return buf;
    }

    private void allocate(PoolThreadCache cache, PooledByteBuf<T> buf, final int reqCapacity) {
        final int sizeIdx = sizeClass.size2SizeIdx(reqCapacity);

        if (sizeIdx <= sizeClass.smallMaxSizeIdx) {
            tcacheAllocateSmall(cache, buf, reqCapacity, sizeIdx);
        }
        else if (sizeIdx < sizeClass.nSizes) {
            tcacheAllocateNormal(cache, buf, reqCapacity, sizeIdx);
        }
        else {
            int normCapacity = sizeClass.directMemoryCacheAlignment > 0
                    ? sizeClass.normalizeSize(reqCapacity) : reqCapacity;

            // Huge allocations are never served via the cache so just call allocateHuge
            allocateHuge(buf, normCapacity);
        }
    }
}
```

### 分配空间 Normal

```java
final class PoolChunk<T> implements PoolChunkMetric {
    boolean allocate(PooledByteBuf<T> buf, int reqCapacity, int sizeIdx, PoolThreadCache cache) {
        int runSize = arena.sizeClass.sizeIdx2size(sizeIdx);

        final long handle = allocateRun(runSize);
    }

    private long allocateRun(int runSize) {
        // NOTE: 第 1 步，runSize (bytes) --> pages --> pageIdx
        int pages = runSize >> pageShifts;
        int pageIdx = arena.sizeClass.pages2pageIdx(pages);

        // NOTE: 第 2 步，从 runsAvail 中，获取『可用空间』，即获取 handle
        runsAvailLock.lock();
        try {
            // NOTE: 第 2.1 步，根据 pageIdx 查找 queueIdx
            // find first queue which has at least one big enough run
            int queueIdx = runFirstBestFit(pageIdx);
            if (queueIdx == -1) {
                return -1;
            }

            // NOTE: 第 2.2 步，根据 queueIdx 获取 queue
            // get run with min offset in this queue
            IntPriorityQueue queue = runsAvail[queueIdx];

            // NOTE: 第 2.3 步，从 queue 中获取 handle 的前 32 位
            long handle = queue.poll();
            assert handle != IntPriorityQueue.NO_VALUE;

            // NOTE: 第 2.4 步，转换成完整的 handle
            handle <<= BITMAP_IDX_BIT_LENGTH;
            assert !isUsed(handle) : "invalid handle: " + handle;

            // NOTE: 第 3 步，从 runsAvailMap 移除 handle 相关记录
            removeAvailRun0(handle);

            // NOTE: 第 4 步，将『可用空间』分出一部分空间，记录成『已使用空间』
            handle = splitLargeRun(handle, pages);

            // NOTE: 第 5 步，记录『总剩余空间』
            int pinnedSize = runSize(pageShifts, handle);
            freeBytes -= pinnedSize;

            // 返回
            return handle;
        }
        finally {
            runsAvailLock.unlock();
        }
    }
}
```

### 分配空间 Huge

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    private void allocateHuge(PooledByteBuf<T> buf, int reqCapacity) {
        PoolChunk<T> chunk = newUnpooledChunk(reqCapacity);
        activeBytesHuge.add(chunk.chunkSize());
        buf.initUnpooled(chunk, reqCapacity);
        allocationsHuge.increment();
    }
}
```

### 释放空间

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    void free(PoolChunk<T> chunk, ByteBuffer nioBuffer, long handle, int normCapacity, PoolThreadCache cache) {
        chunk.decrementPinnedMemory(normCapacity);
        if (chunk.unpooled) {
            int size = chunk.chunkSize();
            destroyChunk(chunk);
            activeBytesHuge.add(-size);
            deallocationsHuge.increment();
        }
        else {
            SizeClass sizeClass = sizeClass(handle);
            if (cache != null && cache.add(this, chunk, nioBuffer, handle, normCapacity, sizeClass)) {
                // cached so not free it.
                return;
            }

            freeChunk(chunk, handle, normCapacity, sizeClass, nioBuffer, false);
        }
    }

    void freeChunk(PoolChunk<T> chunk, long handle, int normCapacity, SizeClass sizeClass, ByteBuffer nioBuffer,
                   boolean finalizer) {
        final boolean destroyChunk;
        lock();
        try {
            // We only call this if freeChunk is not called because of the PoolThreadCache finalizer as otherwise this
            // may fail due lazy class-loading in for example tomcat.
            if (!finalizer) {
                switch (sizeClass) {
                    case Normal:
                        ++deallocationsNormal;
                        break;
                    case Small:
                        ++deallocationsSmall;
                        break;
                    default:
                        throw new Error();
                }
            }
            destroyChunk = !chunk.parent.free(chunk, handle, normCapacity, nioBuffer);
        }
        finally {
            unlock();
        }
        if (destroyChunk) {
            // destroyChunk not need to be called while holding the synchronized lock.
            destroyChunk(chunk);
        }
    }
}
```

```java
final class PoolChunkList<T> implements PoolChunkListMetric {
    
}
```
