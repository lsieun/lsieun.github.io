---
title: "Pool Overview"
sequence: "101"
---

[UP](/netty.html)

```text
reqCapacity --> normCapacity
```

- 减少内存分配次数，提高性能


![](/assets/images/netty/buf/netty-buffer-pool-concept.svg)

形象比喻。

- PoolArena - 饭店
- PoolChunkList - 楼层
- PoolChunk - 某个房间
- PoolSubPage - 餐桌

## 复用

线程内如何利用内存，线程间如何共享内存

PoolArena 可以对应多个线程



## Reference


- [Netty learning journey——source code analysis Netty](https://medium.com/backenders-club/netty-learning-journey-source-code-analysis-netty-94e372d8a87b)
- [Netty Learning Journey — — Source Code](https://medium.com/backenders-club/netty-learning-journey-source-code-cd41de0f137)
- [PoolChunk](https://www.cnblogs.com/GrimReaper/p/10385343.html)
- [PooledByteBufAllocator buffer分配](https://www.code260.com/2020/04/20/netty4-pooled-buffer/)
- [jemalloc.pdf](https://people.freebsd.org/~jasone/jemalloc/bsdcan2006/jemalloc.pdf)
- []()
