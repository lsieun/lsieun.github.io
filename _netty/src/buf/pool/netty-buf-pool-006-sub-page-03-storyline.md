---
title: "Subpage：（3）故事线"
sequence: "106-03"
---

[UP](/netty.html)

## Arena 中的 Subpage

### Arena

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    final PoolSubpage<T>[] smallSubpagePools;

    protected PoolArena(PooledByteBufAllocator parent, SizeClasses sizeClass) {
        smallSubpagePools = newSubpagePoolArray(sizeClass.nSubpages);
        for (int i = 0; i < smallSubpagePools.length; i++) {
            smallSubpagePools[i] = newSubpagePoolHead(i);
        }
    }

    private PoolSubpage<T>[] newSubpagePoolArray(int size) {
        return new PoolSubpage[size];
    }

    private PoolSubpage<T> newSubpagePoolHead(int index) {
        PoolSubpage<T> head = new PoolSubpage<T>(index);
        head.prev = head;
        head.next = head;
        return head;
    }
}
```

### Subpage

`PoolSubpage` 与 `PoolArena.smallSubpagePools` 进行关联是通过 `PoolSubpage` 的 `addToPool()` 和 `removeFromPool()` 方法。

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    private void addToPool(PoolSubpage<T> head) {
        assert prev == null && next == null;
        prev = head;
        next = head.next;
        next.prev = this;
        head.next = this;
    }

    private void removeFromPool() {
        assert prev != null && next != null;
        prev.next = next;
        next.prev = prev;
        next = null;
        prev = null;
    }
}
```

#### 加入 Pool

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    PoolSubpage(PoolSubpage<T> head, PoolChunk<T> chunk, int pageShifts, int runOffset, int runSize, int elemSize) {
        // 添加到 Pool
        addToPool(head);
    }
}
```

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    boolean free(PoolSubpage<T> head, int bitmapIdx) {
        if (numAvail++ == 0) {
            // 添加到 Pool
            addToPool(head);
        }
    }
}
```

#### 从 Pool 中移除

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    long allocate() {
        if (--numAvail == 0) {
            removeFromPool();
        }
    }
}
```

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    boolean free(PoolSubpage<T> head, int bitmapIdx) {
        // 『可用空间』等于『总空间』，表示不再使用
        if (numAvail == maxNumElems) {
            // prev != next 表示『当前 subpage』不是剩下的最后一个 subpage
            if (prev != next) {
                doNotDestroy = false;
                removeFromPool();
            }
        }
    }
}
```

## Chunk 中的 Subpage

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private final PoolSubpage<T>[] subpages;

    PoolChunk(PoolArena<T> arena, Object base, T memory, int pageSize, int pageShifts, int chunkSize, int maxPageIdx) {
        subpages = new PoolSubpage[chunkSize >> pageShifts];
    }
}
```

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private long allocateSubpage(int sizeIdx, PoolSubpage<T> head) {
        PoolSubpage<T> subpage = new PoolSubpage<T>();

        subpages[runOffset] = subpage;
    }
}
```

```java
final class PoolChunk<T> implements PoolChunkMetric {
    void free(long handle, int normCapacity, ByteBuffer nioBuffer) {
        if (isSubpage(handle)) {
            if (subpage.free(head, bitmapIdx(handle))) {
                // the subpage is still used, do not free it
                return;
            }

            subpages[sIdx] = null;
        }
    }
}
```

## 性能考量

性能考虑：讨论PoolSubpage设计的性能考量，如何提高内存分配效率、避免碎片化等方面的考虑

- 讨论一些关于如何优化PoolSubpage的性能和内存利用率的方法。
- 探讨在实际应用中如何更好地使用PoolSubpage等内容。

### 空间碎片化

minimizing memory wastage and improving locality

### 锁

head 作用：『一夫当关，万夫莫开』。

在 `PoolSubpage` 类中，定义了 `lock` 字段。由 `lock` 字段保护的主要对象：

- subpage 链表：`prev`、`next`
- subpage 自身：
    - 空间：`bitmap`、`numAvail`、`nextAvail`
    - 销毁：`doNotDestroy`

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    final ReentrantLock lock;

    // Arena: doubly-linked list
    PoolSubpage<T> prev;
    PoolSubpage<T> next;

    // Subpage: bitmap
    private final long[] bitmap;
    private int nextAvail;
    private int numAvail;

    // Subpage: destroy
    boolean doNotDestroy;

    PoolSubpage(int headIndex) {
        lock = new ReentrantLock();
    }

    void lock() {
        lock.lock();
    }

    void unlock() {
        lock.unlock();
    }
}
```

#### Arena

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    private void tcacheAllocateSmall(PoolThreadCache cache,
                                     PooledByteBuf<T> buf,
                                     final int reqCapacity, final int sizeIdx) {
        head.lock();
        try {
            final PoolSubpage<T> s = head.next;
            needsNormalAllocation = s == head;
            if (!needsNormalAllocation) {
                assert s.doNotDestroy && s.elemSize == sizeClass.sizeIdx2size(sizeIdx) : "doNotDestroy=" +
                        s.doNotDestroy + ", elemSize=" + s.elemSize + ", sizeIdx=" + sizeIdx;

                // NOTE: 进行空间分配
                long handle = s.allocate();
                assert handle >= 0;
                s.chunk.initBufWithSubpage(buf, null, handle, reqCapacity, cache);
            }
        }
        finally {
            head.unlock();
        }
    }
}
```

#### Chunk

```java
final class PoolChunk<T> implements PoolChunkMetric {
    boolean allocate(PooledByteBuf<T> buf, int reqCapacity, int sizeIdx, PoolThreadCache cache) {
        // NOTE: 第 1 步，获取『可用空间』（handle）
        final long handle;
        if (sizeIdx <= arena.sizeClass.smallMaxSizeIdx) {
            final PoolSubpage<T> nextSub;
            // small
            // Obtain the head of the PoolSubPage pool that is owned by the PoolArena and synchronize on it.
            // This is need as we may add it back and so alter the linked-list structure.
            PoolSubpage<T> head = arena.smallSubpagePools[sizeIdx];
            head.lock();
            try {
                nextSub = head.next;
                if (nextSub != head) {
                    assert nextSub.doNotDestroy && nextSub.elemSize == arena.sizeClass.sizeIdx2size(sizeIdx) :
                            "doNotDestroy=" + nextSub.doNotDestroy + ", elemSize=" + nextSub.elemSize + ", sizeIdx=" +
                                    sizeIdx;
                    // NOTE: 第 1.1.1 步，分配空间
                    handle = nextSub.allocate();
                    assert handle >= 0;
                    assert isSubpage(handle);

                    // NOTE: 第 1.1.2 步，将 handle 与 buf 绑定
                    nextSub.chunk.initBufWithSubpage(buf, null, handle, reqCapacity, cache);
                    return true;
                }

                // NOTE: 第 1.2 步，分配空间
                handle = allocateSubpage(sizeIdx, head);
                if (handle < 0) {
                    return false;
                }
                assert isSubpage(handle);
            }
            finally {
                head.unlock();
            }
        }
    }

    private long allocateSubpage(int sizeIdx, PoolSubpage<T> head) {
        // NOTE: 第 1 步，计算 runSize，即 elemSize 和 pageSize 的最小公倍数
        // allocate a new run
        int runSize = calculateRunSize(sizeIdx);

        // NOTE: 第 2 步，根据 runSize 分配 PageRun 空间
        // runSize must be multiples of pageSize
        long runHandle = allocateRun(runSize);
        if (runHandle < 0) {
            return -1;
        }

        // NOTE: 第 3 步，将 PageRun 封装成 PoolSubpage
        int runOffset = runOffset(runHandle);
        assert subpages[runOffset] == null;
        int elemSize = arena.sizeClass.sizeIdx2size(sizeIdx);

        PoolSubpage<T> subpage = new PoolSubpage<T>(
                head,                                      // Arena
                this, pageShifts,                          // Chunk
                runOffset, runSize(pageShifts, runHandle), // PageRun
                elemSize                                   // Subpage
        );

        // NOTE: 第 4 步，将 subpage 记录到 subpages[runOffset] 中
        subpages[runOffset] = subpage;

        // NOTE: 第 5 步，使用 subpage 分配一部分空间
        return subpage.allocate();
    }
}
```

```java
final class PoolChunk<T> implements PoolChunkMetric {
    void free(long handle, int normCapacity, ByteBuffer nioBuffer) {
        // NOTE: 第 1 阶段，释放 subpage 空间
        if (isSubpage(handle)) {
            // NOTE: 从 Chunk 中获取 subpage
            int sIdx = runOffset(handle);
            PoolSubpage<T> subpage = subpages[sIdx];
            assert subpage != null;

            // NOTE: 从 Arena 中获取 subpage
            PoolSubpage<T> head = subpage.chunk.arena.smallSubpagePools[subpage.headIndex];
            // Obtain the head of the PoolSubPage pool that is owned by the PoolArena and synchronize on it.
            // This is need as we may add it back and so alter the linked-list structure.
            head.lock();
            try {
                // NOTE: 只释放 subpage 中的 handle 空间
                assert subpage.doNotDestroy;
                if (subpage.free(head, bitmapIdx(handle))) {
                    // the subpage is still used, do not free it
                    return;
                }

                // NOTE: 释放整个 subpage 空间
                assert !subpage.doNotDestroy;
                // Null out slot in the array as it was freed, and we should not use it anymore.
                subpages[sIdx] = null;
            }
            finally {
                head.unlock();
            }
        }
    }
}
```

#### Subpage

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    @Override
    public int numAvailable() {
        if (chunk == null) {
            // It's the head.
            return 0;
        }
        PoolSubpage<T> head = chunk.arena.smallSubpagePools[headIndex];
        head.lock();
        try {
            return numAvail;
        }
        finally {
            head.unlock();
        }
    }
}
```

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    boolean isDoNotDestroy() {
        if (chunk == null) {
            // It's the head.
            return true;
        }
        PoolSubpage<T> head = chunk.arena.smallSubpagePools[headIndex];
        head.lock();
        try {
            return doNotDestroy;
        }
        finally {
            head.unlock();
        }
    }
}
```

## 实际应用

展示如何在 Netty 应用程序中使用内存池和 PoolSubpage



