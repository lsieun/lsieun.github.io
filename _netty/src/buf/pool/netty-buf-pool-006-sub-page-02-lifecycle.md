---
title: "Subpage：（2）生命周期"
sequence: "106-02"
---

[UP](/netty.html)


PoolSubpage 的生命周期，包括它的创建、使用和销毁。

## 对象创建

PoolSubpage的创建过程：

- 详细讲解PoolSubpage是如何被创建和初始化的。
- 描述在Netty中是如何管理内存池的，以及PoolSubpage是如何被添加到内存池中的过程。

![](/assets/images/netty/buf/netty-buffer-pool-subpage-arena-smallSubpagePools.svg)

### PoolArena

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    final PoolSubpage<T>[] smallSubpagePools;

    protected PoolArena(PooledByteBufAllocator parent, SizeClasses sizeClass) {
        // Subpage
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

### PoolChunk

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private final PoolSubpage<T>[] subpages;

    PoolChunk(PoolArena<T> arena, Object base, T memory, int pageSize, int pageShifts, int chunkSize, int maxPageIdx) {
        subpages = new PoolSubpage[chunkSize >> pageShifts];
    }
}
```

### PoolSubpage

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    // head 节点创建
    PoolSubpage(int headIndex) {
        // Arena
        this.headIndex = headIndex;

        // Chunk
        chunk = null;
        pageShifts = -1;
        runOffset = -1;
        runSize = -1;

        // SubPage
        elemSize = -1;
        bitmap = null;
        bitmapLength = -1;
        maxNumElems = 0;

        // Arena - head 节点
        lock = new ReentrantLock();
    }

    // 非 head 节点创建
    PoolSubpage(PoolSubpage<T> head, PoolChunk<T> chunk, int pageShifts, int runOffset, int runSize, int elemSize) {
        // Arena
        this.headIndex = head.headIndex;

        // Chunk
        this.chunk = chunk;
        this.pageShifts = pageShifts;

        // PageRun
        this.runOffset = runOffset;
        this.runSize = runSize;

        // SubPage - basic
        this.elemSize = elemSize;
        maxNumElems = runSize / elemSize;

        // bitmapLength = maxNumElems / 64 + (maxNumElems % 64 == 0 ? 0 : 1);
        int bitmapLength = maxNumElems >>> 6;
        if ((maxNumElems & 63) != 0) {
            bitmapLength++;
        }
        this.bitmapLength = bitmapLength;
        bitmap = new long[bitmapLength];

        // SubPage - free
        numAvail = maxNumElems;
        nextAvail = 0;

        // SubPage - destroy
        doNotDestroy = true;

        // Arena - 非 head 节点
        lock = null;

        // Arena - 添加到链表
        addToPool(head);
    }

    private void addToPool(PoolSubpage<T> head) {
        assert prev == null && next == null;
        prev = head;
        next = head.next;
        next.prev = this;
        head.next = this;
    }
}
```

## 对象使用：内存分配

![](/assets/images/netty/buf/netty-buffer-pool-subpage-allocation.svg)

内存分配算法：

- 深入讨论PoolSubpage内部的内存分配算法。
- 解释PoolSubpage是如何根据请求的内存大小来分配合适的内存块的。
- 探讨如何有效地利用内存碎片，以及如何提高内存分配的效率。

讲解如何从 PoolSubpage 分配内存：

- 查找空闲内存块：通过位图查找空闲的内存块。
- 分配内存：标记位图为已使用，并返回内存块的引用。

只有两种途径：

- 第一个『正常途径』：从 PoolArena 到 PoolChunk，再从 PoolChunk 中分配 SubPage
- 第二种『快捷途径』：从 PoolArena 直接到 PoolSubpage

### PoolArena

```java
abstract class PoolArena<T> implements PoolArenaMetric {

    private void allocate(PoolThreadCache cache, PooledByteBuf<T> buf, final int reqCapacity) {
        final int sizeIdx = sizeClass.size2SizeIdx(reqCapacity);

        if (sizeIdx <= sizeClass.smallMaxSizeIdx) {
            tcacheAllocateSmall(cache, buf, reqCapacity, sizeIdx);
        }
        // 代码省略
    }

    private void tcacheAllocateSmall(PoolThreadCache cache, PooledByteBuf<T> buf, final int reqCapacity,
                                     final int sizeIdx) {

        if (cache.allocateSmall(this, buf, reqCapacity, sizeIdx)) {
            // was able to allocate out of the cache so move on
            return;
        }

        /*
         * Synchronize on the head.
         * This is needed as {@link PoolChunk#allocateSubpage(int)} and {@link PoolChunk#free(long)}
         * may modify the doubly linked list as well.
         */
        final PoolSubpage<T> head = smallSubpagePools[sizeIdx];
        final boolean needsNormalAllocation;
        head.lock();
        try {
            final PoolSubpage<T> s = head.next;
            needsNormalAllocation = s == head;
            if (!needsNormalAllocation) {
                assert s.doNotDestroy && s.elemSize == sizeClass.sizeIdx2size(sizeIdx) : "doNotDestroy=" +
                        s.doNotDestroy + ", elemSize=" + s.elemSize + ", sizeIdx=" + sizeIdx;
                long handle = s.allocate();
                assert handle >= 0;
                s.chunk.initBufWithSubpage(buf, null, handle, reqCapacity, cache);
            }
        }
        finally {
            head.unlock();
        }

        if (needsNormalAllocation) {
            lock();
            try {
                allocateNormal(buf, reqCapacity, sizeIdx, cache);
            }
            finally {
                unlock();
            }
        }

        incSmallAllocation();
    }

    private void allocateNormal(PooledByteBuf<T> buf, int reqCapacity, int sizeIdx, PoolThreadCache threadCache) {
        assert lock.isHeldByCurrentThread();
        // NOTE: 第 1 步，从现有的 Chunk List 中分配『数据空间』
        if (q050.allocate(buf, reqCapacity, sizeIdx, threadCache) ||
                q025.allocate(buf, reqCapacity, sizeIdx, threadCache) ||
                q000.allocate(buf, reqCapacity, sizeIdx, threadCache) ||
                qInit.allocate(buf, reqCapacity, sizeIdx, threadCache) ||
                q075.allocate(buf, reqCapacity, sizeIdx, threadCache)) {
            return;
        }

        // NOTE: 第 2 步，创建一个新的 Chunk
        // Add a new chunk.
        PoolChunk<T> c = newChunk(sizeClass.pageSize, sizeClass.nPSizes, sizeClass.pageShifts, sizeClass.chunkSize);

        // NOTE: 第 3 步，从新 Chunk 中分配一部分空间到 buf 上
        boolean success = c.allocate(buf, reqCapacity, sizeIdx, threadCache);
        assert success;

        // NOTE: 第 4 步，将 chunk 记录到 qInit 中
        qInit.add(c);
    }
}
```

### PoolChunk

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private final PoolSubpage<T>[] subpages;

    PoolChunk(PoolArena<T> arena, Object base, T memory, int pageSize, int pageShifts, int chunkSize, int maxPageIdx) {
        subpages = new PoolSubpage[chunkSize >> pageShifts];
    }
    
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
        // 代码省略

        ByteBuffer nioBuffer = cachedNioBuffers != null ? cachedNioBuffers.pollLast() : null;

        // NOTE: 第 2 步，将『可用空间』（handle） 与 buf 进行绑定
        initBuf(buf, nioBuffer, handle, reqCapacity, cache);
        return true;
    }

    void initBufWithSubpage(PooledByteBuf<T> buf, ByteBuffer nioBuffer, long handle, int reqCapacity,
                            PoolThreadCache threadCache) {
        int runOffset = runOffset(handle);
        int bitmapIdx = bitmapIdx(handle);

        PoolSubpage<T> s = subpages[runOffset];
        assert s.isDoNotDestroy();
        assert reqCapacity <= s.elemSize : reqCapacity + "<=" + s.elemSize;

        int offset = (runOffset << pageShifts) + bitmapIdx * s.elemSize;

        // TRACE:
        buf.init(this, nioBuffer, handle, offset, reqCapacity, s.elemSize, threadCache);
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

#### runSize 大小

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private int calculateRunSize(int sizeIdx) {
        // pageShifts = 13, pageSize = 2^13 = 8192
        // LOG2_QUANTUM = 4, QUANTUM = 2^4 = 16，这是 SizeClasses 中定义的最小标准规格
        // 一个 page 占用 8192 byte，而最小的标准规格是 16 byte，所以一个 page 最多可以容纳 8192 / 16 = 512 个元素
        int maxElements = 1 << (pageShifts - SizeClasses.LOG2_QUANTUM);
        int runSize = 0;
        int nElements;

        final int elemSize = arena.sizeClass.sizeIdx2size(sizeIdx);

        // find the lowest common multiple of pageSize and elemSize
        do {
            runSize += pageSize;
            nElements = runSize / elemSize;
        } while (nElements < maxElements && runSize != nElements * elemSize);

        while (nElements > maxElements) {
            runSize -= pageSize;
            nElements = runSize / elemSize;
        }

        assert nElements > 0;
        assert runSize <= chunkSize;
        assert runSize >= elemSize;

        return runSize;
    }
}
```

### PoolSubpage

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    long allocate() {
        // NOTE: 第 1 步，参数校验
        if (numAvail == 0 || !doNotDestroy) {
            return -1;
        }

        // NOTE: 第 2 步，查找『可用空间』 - bitmapIdx
        final int bitmapIdx = getNextAvail();
        if (bitmapIdx < 0) {
            removeFromPool(); // Subpage appear to be in an invalid state. Remove to prevent repeated errors.
            throw new AssertionError("No next available bitmap index found (bitmapIdx = " + bitmapIdx + "), " +
                    "even though there are supposed to be (numAvail = " + numAvail + ") " +
                    "out of (maxNumElems = " + maxNumElems + ") available indexes.");
        }

        // NOTE: 第 3 步，bitmap 更新：将 bitmapIdx 代表的『可用空间』标记为『已经占用』
        int q = bitmapIdx >>> 6;
        int r = bitmapIdx & 63;
        assert (bitmap[q] >>> r & 1) == 0;
        bitmap[q] |= 1L << r;

        // NOTE: 第 4 步，更新 Arena 中的 smallSubpagePools
        if (--numAvail == 0) {
            removeFromPool();
        }

        // NOTE: 将 5 步，将 bitmapIdx 转换为 handle
        return toHandle(bitmapIdx);
    }
}
```

#### 位图算法 - 查找可用空间

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    private int getNextAvail() {
        int nextAvail = this.nextAvail;
        if (nextAvail >= 0) {
            this.nextAvail = -1;
            return nextAvail;
        }
        return findNextAvail();
    }

    private int findNextAvail() {
        // 遍历 bitmap
        for (int i = 0; i < bitmapLength; i++) {
            long bits = bitmap[i];
            // 如果 bits 中所有 bit 都是1，则 ~bits == 0，表示没有『可用空间』；
            // 如果 ~bits != 0，则表示有『可用空间』
            if (~bits != 0) {
                return findNextAvail0(i, bits);
            }
        }
        return -1;
    }

    private int findNextAvail0(int i, long bits) {
        // baseVal = i * 64
        final int baseVal = i << 6;

        // 对 bits 中的每个 bit 进行遍历：从右往左遍历
        for (int j = 0; j < 64; j++) {
            if ((bits & 1) == 0) {
                int val = baseVal | j;
                if (val < maxNumElems) {
                    return val;
                }
                else {
                    break;
                }
            }
            bits >>>= 1;
        }
        return -1;
    }
}
```

## 对象使用：内存释放

内存释放过程：

- 解释PoolSubpage的内存释放过程。
- 描述当内存不再被使用时，PoolSubpage是如何将内存块释放并返回给内存池的。

讲解如何释放已分配的内存：

- 回收内存块：将内存块标记为空闲，并可能触发内存池的清理操作。

![](/assets/images/netty/buf/netty-buffer-pool-subpage-free-overview.svg)

![](/assets/images/netty/buf/netty-buffer-pool-subpage-free-detail.svg)

### PoolArena

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    void free(PoolChunk<T> chunk, ByteBuffer nioBuffer, long handle, int normCapacity, PoolThreadCache cache) {
        chunk.decrementPinnedMemory(normCapacity);

        if (chunk.unpooled) {
            // NOTE: Huge
            int size = chunk.chunkSize();
            destroyChunk(chunk);
            activeBytesHuge.add(-size);
            deallocationsHuge.increment();
        }
        else {
            // NOTE: Small + Normal
            SizeClass sizeClass = sizeClass(handle);

            // cache
            if (cache != null && cache.add(this, chunk, nioBuffer, handle, normCapacity, sizeClass)) {
                // cached so not free it.
                return;
            }

            // chunk
            freeChunk(chunk, handle, normCapacity, sizeClass, nioBuffer, false);
        }
    }
    
    void freeChunk(PoolChunk<T> chunk, long handle,
                   int normCapacity, SizeClass sizeClass,
                   ByteBuffer nioBuffer, boolean finalizer) {
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

### PoolChunkList

```java
final class PoolChunkList<T> implements PoolChunkListMetric {
    boolean free(PoolChunk<T> chunk, long handle, int normCapacity, ByteBuffer nioBuffer) {
        // NOTE: 释放空间：将 chunk 中 handle 对应的空间释放
        chunk.free(handle, normCapacity, nioBuffer);

        // NOTE: 移动 Chunk，并进一步决定是否需要『销毁』
        if (chunk.freeBytes > freeMaxThreshold) {
            remove(chunk);
            // Move the PoolChunk down the PoolChunkList linked-list.
            return move0(chunk);
        }

        // NOTE: 不移动，且『不销毁』
        return true;
    }
}
```

### PoolChunk

```java
final class PoolChunk<T> implements PoolChunkMetric {
    private final PoolSubpage<T>[] subpages;

    PoolChunk(PoolArena<T> arena, Object base, T memory, int pageSize, int pageShifts, int chunkSize, int maxPageIdx) {
        subpages = new PoolSubpage[chunkSize >> pageShifts];
    }

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

        // NOTE: 第 2 阶段，释放 Chunk 空间
        int runSize = runSize(pageShifts, handle);
        // start free run
        runsAvailLock.lock();
        try {
            // NOTE: 合并 PageRun
            // collapse continuous runs, successfully collapsed runs
            // will be removed from runsAvail and runsAvailMap
            long finalRun = collapseRuns(handle);

            //set run as not used
            finalRun &= ~(1L << IS_USED_SHIFT);
            //if it is a subpage, set it to run
            finalRun &= ~(1L << IS_SUBPAGE_SHIFT);

            // NOTE: 释放 PageRun
            insertAvailRun(runOffset(finalRun), runPages(finalRun), finalRun);
            freeBytes += runSize;
        }
        finally {
            runsAvailLock.unlock();
        }

        if (nioBuffer != null && cachedNioBuffers != null &&
                cachedNioBuffers.size() < PooledByteBufAllocator.DEFAULT_MAX_CACHED_BYTEBUFFERS_PER_CHUNK) {
            cachedNioBuffers.offer(nioBuffer);
        }
    }
}
```

### PoolSubpage

```java
final class PoolSubpage<T> implements PoolSubpageMetric {

    boolean free(PoolSubpage<T> head, int bitmapIdx) {
        // NOTE: 第 1 步，释放『已占用空间』：根据 bitmapIdx 更新 bitmap
        int q = bitmapIdx >>> 6;
        int r = bitmapIdx & 63;
        assert (bitmap[q] >>> r & 1) != 0;
        // 0 ^ 1 = 1
        // 1 ^ 1 = 0
        bitmap[q] ^= 1L << r;

        // NOTE: 第 2步，将 bitmapIdx 『原来的已占用空间』 转换为 nextAvail 『可用空间』
        setNextAvail(bitmapIdx);

        // NOTE: 第 3 步，更新 Arena 中的 smallSubpagePools
        if (numAvail++ == 0) {
            // NOTE: 如果 numAvail == 0，则表示原来没有『剩余空间』，现在释放了一份『空间』，就将 SubPage 添加回 Arena
            addToPool(head);
            /* When maxNumElems == 1, the maximum numAvail is also 1.
             * Each of these PoolSubpages will go in here when they do free operation.
             * If they return true directly from here, then the rest of the code will be unreachable,
             * and they will not actually be recycled. So return true only on maxNumElems > 1.
             * */
            if (maxNumElems > 1) {
                return true;
            }
        }

        // NOTE: 第 4 步，更新 Arena 中的 smallSubpagePools
        if (numAvail != maxNumElems) {
            return true;
        }
        else {
            // Subpage not in use (numAvail == maxNumElems)
            // NOTE: 如果只剩下一个 SubPage，需要保留它
            if (prev == next) {
                // Do not remove if this subpage is the only one left in the pool.
                return true;
            }

            // NOTE: 如果剩下多个 SubPage，则进行移除操作
            // Remove this subpage from the pool if there are other subpages left in the pool.
            doNotDestroy = false;
            removeFromPool();
            return false;
        }
    }
}
```

## 对象销毁

![](/assets/images/netty/buf/netty-buffer-pool-subpage-destroy.svg)


### PoolArena

```java
abstract class PoolArena<T> implements PoolArenaMetric {
    final PoolSubpage<T>[] smallSubpagePools;

    @Override
    protected final void finalize() throws Throwable {
        try {
            super.finalize();
        }
        finally {
            destroyPoolSubPages(smallSubpagePools);
            destroyPoolChunkLists(qInit, q000, q025, q050, q075, q100);
        }
    }

    private static void destroyPoolSubPages(PoolSubpage<?>[] pages) {
        for (PoolSubpage<?> page : pages) {
            page.destroy();
        }
    }

    static final class HeapArena extends PoolArena<byte[]> {
        @Override
        protected void destroyChunk(PoolChunk<byte[]> chunk) {
            // Rely on GC.
        }
    }

    static final class DirectArena extends PoolArena<ByteBuffer> {
        @Override
        protected void destroyChunk(PoolChunk<ByteBuffer> chunk) {
            if (PlatformDependent.useDirectBufferNoCleaner()) {
                PlatformDependent.freeDirectNoCleaner((ByteBuffer) chunk.base);
            }
            else {
                PlatformDependent.freeDirectBuffer((ByteBuffer) chunk.base);
            }
        }
    }
}
```

### PoolChunk

```java
final class PoolChunk<T> implements PoolChunkMetric {
    void destroy() {
        arena.destroyChunk(this);
    }
}
```

### PoolSubpage

```java
final class PoolSubpage<T> implements PoolSubpageMetric {
    void destroy() {
        if (chunk != null) {
            chunk.destroy();
        }
    }
}
```
