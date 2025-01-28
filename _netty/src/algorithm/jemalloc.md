---
title: "jemalloc 算法介绍"
sequence: "jemalloc"
---

[UP](/netty.html)

## 算法

- Buddy 伙伴算法：外部碎片
- Slab 算法：内部碎片

单独一个文档来记录这两个算法



## 名称由来

jemalloc 是一种用于内存分配和管理的开源库，它专门针对多线程应用程序进行了优化。其名称来源于其作者 Jason Evans 的姓名和 "malloc"，即动态内存分配函数的名称。

Each application is configured at run-time to have a fixed number of arenas.
By default, the number of arenas depends on the number of processors.

```text
the number of processors --> the number of arenas
```

**Chunks** are usually managed by particular **arenas**,
and observing those associations is critical to correct function of the allocator.
The chunk size is 2 MB by default.

```text
arena --> chunk
```

**Chunks** are always the same size, and start at chunk-aligned addresses.
**Arenas** carve **chunks** into smaller allocations,
but **huge allocations** are directly backed by one or more contiguous chunks.

Allocation size classes fall into three major categories: **small**, **large**, and **huge**.
All allocation requests are rounded up to the nearest size class boundary.

**Huge** allocations are larger than **half of a chunk**, and are directly backed by dedicated chunks.
Metadata about huge allocations are stored in a single red-black tree.
Since most applications create few if any huge allocations, using a single tree is
not a scalability issue.

For **small and large allocations**, **chunks** are carved into **page runs** using the binary buddy algorithm.
Runs can be repeatedly split in half to as small as one page,
but can only be coalesced in ways that reverse the splitting process.
Information about **the states of the runs** is stored as **a page map** at the beginning of each chunk.
By storing this information separately from the runs,
pages are only ever touched if they are used.
This also enables the dedication of runs to large allocations,
which are larger than half of a page, but no larger than half of a chunk.

**Small allocations** fall into **three subcategories**: tiny, quantum-spaced, and sub-page.
Modern architectures impose alignment constraints on pointers, depending on data type.
malloc(3) is required to return memory that is suitably aligned for any purpose.
This worst case alignment requirement is referred to as the quantum size here (typically 16 bytes).
In practice, power-of-two alignment works for tiny allocations
since they are incapable of containing objects that are large enough to require quantum alignment.

## 参考

- [what does PageRun/PoolSubpage mean？](https://github.com/netty/netty/issues/7924)
    - [jemalloc white paper](https://www.bsdcan.org/2006/papers/jemalloc.pdf)
