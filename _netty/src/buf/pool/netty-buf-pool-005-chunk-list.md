---
title: "ChunkList"
sequence: "105"
---

[UP](/netty.html)

![](/assets/images/netty/buf/submarine-below-sea-level.png)

核心问题：

- [ ] Chunk 迁移过程

## 存储结构

### PoolChunkList

```java
final class PoolChunkList<T> implements PoolChunkListMetric {
    // Arena
    private final PoolArena<T> arena;

    // ChunkList
    private PoolChunkList<T> prevList;
    private final PoolChunkList<T> nextList;

    // Chunk
    private PoolChunk<T> head;
    private final int minUsage;
    private final int maxUsage;
    private final int freeMinThreshold;
    private final int freeMaxThreshold;
    private final int maxCapacity;
}
```

```text
                 ┌─── arena
                 │
                 │                 ┌─── prevList
PoolChunkList ───┼─── chunkList ───┤
                 │                 └─── nextList
                 │
                 │                 ┌─── head
                 └─── chunk ───────┤
                                   │              ┌─── minUsage/freeMaxThreshold/maxCapacity
                                   └─── metric ───┤
                                                  └─── maxUsage/freeMinThreshold
```

### PoolArena

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    private final PoolChunkList<T> q050;
    private final PoolChunkList<T> q025;
    private final PoolChunkList<T> q000;
    private final PoolChunkList<T> qInit;
    private final PoolChunkList<T> q075;
    private final PoolChunkList<T> q100;

    private final List<PoolChunkListMetric> chunkListMetrics;

    protected PoolArena(PooledByteBufAllocator parent, SizeClasses sizeClass) {
        q100 = new PoolChunkList<T>(this, null, 100, Integer.MAX_VALUE, sizeClass.chunkSize);
        q075 = new PoolChunkList<T>(this, q100, 75, 100, sizeClass.chunkSize);
        q050 = new PoolChunkList<T>(this, q075, 50, 100, sizeClass.chunkSize);
        q025 = new PoolChunkList<T>(this, q050, 25, 75, sizeClass.chunkSize);
        q000 = new PoolChunkList<T>(this, q025, 1, 50, sizeClass.chunkSize);
        qInit = new PoolChunkList<T>(this, q000, Integer.MIN_VALUE, 25, sizeClass.chunkSize);

        q100.prevList(q075);
        q075.prevList(q050);
        q050.prevList(q025);
        q025.prevList(q000);
        q000.prevList(null);
        qInit.prevList(qInit);

        List<PoolChunkListMetric> metrics = new ArrayList<PoolChunkListMetric>(6);
        metrics.add(qInit);
        metrics.add(q000);
        metrics.add(q025);
        metrics.add(q050);
        metrics.add(q075);
        metrics.add(q100);
        chunkListMetrics = Collections.unmodifiableList(metrics);
    }
}
```

![](/assets/images/netty/buf/netty-buffer-pool-arena-chunk-list.svg)

## Chunk 迁移过程


```text
| Field | minUsage          | maxUsage          |
|-------|-------------------|-------------------|
| qInit | Integer.MIN_VALUE | 25                |
| q000  | 1                 | 50                |
| q025  | 25                | 75                |
| q050  | 50                | 100               |
| q075  | 75                | 100               |
| q100  | 100               | Integer.MAX_VALUE |
```

### 示例一

```text
# name,operation,pages,show
buf1,allocate,64,true
buf2,allocate,128,true
buf3,allocate,128,true
buf4,allocate,128,true
buf5,allocate,64,true
buf5,free,64,true
buf4,free,128,true
buf3,free,128,true
buf2,free,128,true
buf1,free,64,true
```

```text
Initial State
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf1,allocate,64,true
┌───────────┐       ┌───────────────────┐
│   Arena   │       │  Chunk@64bf3bbf   │
│   QInit   │───────│  13% <-- 12.50%   │
│           │       │  524288/4194304   │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf2,allocate,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q000    │───────│  38% <-- 37.50%   │
│           │       │  1572864/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf3,allocate,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q025    │───────│  63% <-- 62.50%   │
│           │       │  2621440/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf4,allocate,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q050    │───────│  88% <-- 87.50%   │
│           │       │  3670016/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf5,allocate,64,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q100    │───────│ 100% <-- 100.00%  │
│           │       │  4194304/4194304  │
└───────────┘       └───────────────────┘

buf5,free,64,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q075    │───────│  88% <-- 87.50%   │
│           │       │  3670016/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf4,free,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q050    │───────│  63% <-- 62.50%   │
│           │       │  2621440/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf3,free,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q025    │───────│  38% <-- 37.50%   │
│           │       │  1572864/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf2,free,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q000    │───────│  13% <-- 12.50%   │
│           │       │  524288/4194304   │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘

buf1,free,64,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q100    │───────││
│           │       ││
└───────────┘       └┘
```

### 示例二

```text
# name,operation,pages,show
buf1,allocate,16,true
buf2,allocate,112,true
buf3,allocate,128,true
buf4,allocate,128,true
buf5,allocate,128,true
buf5,free,128,true
buf4,free,128,true
buf3,free,128,true
buf2,free,112,true
buf1,free,16,true
```

```text
Initial State
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf1,allocate,16,true
┌───────────┐       ┌───────────────────┐
│   Arena   │       │  Chunk@64bf3bbf   │
│   qInit   │───────│        4%         │
│           │       │  131072/4194304   │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf2,allocate,112,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   q000    │───────│        25%        │
│           │       │  1048576/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf3,allocate,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   q025    │───────│        50%        │
│           │       │  2097152/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf4,allocate,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   q050    │───────│        75%        │
│           │       │  3145728/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf5,allocate,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   q100    │───────│       100%        │
│           │       │  4194304/4194304  │
└───────────┘       └───────────────────┘

buf5,free,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   q075    │───────│        75%        │
│           │       │  3145728/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf4,free,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   q050    │───────│        50%        │
│           │       │  2097152/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf3,free,128,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   q025    │───────│        25%        │
│           │       │  1048576/4194304  │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf2,free,112,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   q000    │───────│        4%         │
│           │       │  131072/4194304   │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘

buf1,free,16,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   qInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q000    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q025    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q050    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q075    │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   q100    │───────││
│           │       ││
└───────────┘       └┘
```

## qInit 与 q000 区别

- qInit 相当于“新手村”，使用率到达 `0%` 时，不会释放
- q000，则会释放。

画一个图：qInit 是 Chunk 的入口，q000 是 Chunk 的出口。

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    private void allocateNormal(PooledByteBuf<T> buf, int reqCapacity, int sizeIdx, PoolThreadCache threadCache) {
        PoolChunk<T> c = newChunk(sizeClass.pageSize, sizeClass.nPSizes, sizeClass.pageShifts, sizeClass.chunkSize);

        qInit.add(c);
    }
}
```

### qInit

```text
# name,operation,pages,show
buf1,allocate,64,true
buf1,free,64,true
```

```text
Initial State
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
└───────────┘       └┘

buf1,allocate,64,true
┌───────────┐       ┌───────────────────┐
│   Arena   │       │  Chunk@64bf3bbf   │
│   QInit   │───────│        13%        │
│           │       │  524288/4194304   │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
└───────────┘       └┘

buf1,free,64,true
┌───────────┐       ┌───────────────────┐
│   Arena   │       │  Chunk@64bf3bbf   │
│   QInit   │───────│        0%         │
│           │       │     0/4194304     │
│           │       └───────────────────┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
└───────────┘       └┘
```

### q000

```text
# name,operation,pages,show
buf1,allocate,160,true
buf1,free,160,true
```

```text
Initial State
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
└───────────┘       └┘

buf1,allocate,160,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌───────────────────┐
│           │       │  Chunk@64bf3bbf   │
│   Q000    │───────│        32%        │
│           │       │  1310720/4194304  │
└───────────┘       └───────────────────┘

buf1,free,160,true
┌───────────┐       ┌┐
│   Arena   │       ││
│   QInit   │───────││
│           │       ││
│           │       └┘
│           │       ┌┐
│           │       ││
│   Q000    │───────││
│           │       ││
└───────────┘       └┘
```

## 设计意义



