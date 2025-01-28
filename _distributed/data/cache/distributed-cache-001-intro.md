---
title: "分布式缓存"
sequence: "101"
---

```text
要不要使用缓存（为什么使用缓存） --> 怎样使用缓存（使用缓存的方式或策略是什么？）
```

## 为什么要使用缓存

Caching is one of the easiest ways to increase system performance.
If done right, caches can reduce response times, decrease load on database, and save costs.

## 不同的缓存策略

第 1 步，三个主体：

- Application
- Cache
- DB

缓存的策略，就是如何使用 Cache 的方式

使用 Cache，有 3 种常用的策略：

- Cache-Aside:
- Read-Through Cache:
- Write-Through Cache:



There are several strategies and choosing the right one can make a big difference.
Your caching strategy depends on the data and data access patterns.
In other words, how the data is written and read. For example:
