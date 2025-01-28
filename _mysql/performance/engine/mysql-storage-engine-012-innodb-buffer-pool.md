---
title: "InnoDB: Buffer Pool（缓存池）"
sequence: "112"
---

问题一：Buffer Pool 缓存了哪些数据？

回答：Buffer Pool 缓存了 table 和 index data，它的目标是为了

The buffer pool is an area in main memory
where InnoDB caches table and index data as it is accessed.

The buffer pool permits frequently used data to be accessed directly from memory,
which speeds up processing.

On dedicated servers, up to 80% of physical memory is often assigned to the buffer pool.

For efficiency of high-volume read operations, the buffer pool is divided into pages that can potentially hold multiple rows. For efficiency of cache management, the buffer pool is implemented as a linked list of pages; data that is rarely used is aged out of the cache using a variation of the least recently used (LRU) algorithm.

Knowing how to take advantage of the buffer pool to
keep frequently accessed data in memory is an important aspect of MySQL tuning.

![](/assets/images/db/mysql/architecture/innodb-architecture-8-0.png)

## Reference

- [Buffer Pool](https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool.html)
