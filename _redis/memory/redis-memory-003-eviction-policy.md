---
title: "Redis 内存淘汰机制"
sequence: "103"
---

## 内存淘汰机制

以下是 Redis 支持的数据淘汰策略：

- noeviction（不删除）：这种策略下，当内存不足时，Redis 不会删除任何数据。
  如果达到最大内存限制，任何写入数据的操作将会返回一个错误。这种策略适用于那些希望确保数据持久性并手动管理内存的场景。
- allkeys-lru（Least Recently Used，最近最少使用）：在这种策略下，Redis 会根据最近的访问频率删除数据。
  在需要释放内存时，Redis 会从所有键中选择最近最少使用的键进行淘汰。
  这种策略适用于大多数场景，尤其是那些需要缓存数据并根据数据访问频率来决定淘汰顺序的应用。
- volatile-lru（最近最少使用，只针对设置了过期时间的键）：与 allkeys-lru 类似，但仅针对设置了过期时间的键进行淘汰。
  这种策略适用于那些希望保留永久数据并仅根据访问频率淘汰具有过期时间的数据的场景。
- allkeys-random（随机删除）：在这种策略下，Redis 会在需要释放内存时从所有键中随机选择一个进行淘汰。
  这种策略可能导致一些重要但访问频率较低的数据被删除，因此在选择时需要谨慎。
- volatile-random（随机删除，只针对设置了过期时间的键）：与 allkeys-random 类似，但仅针对设置了过期时间的键进行淘汰。
  这种策略适用于那些希望保留永久数据并随机淘汰具有过期时间的数据的场景。
- volatile-ttl（根据 TTL 值淘汰，只针对设置了过期时间的键）：在这种策略下，Redis 会根据键的剩余生存时间（TTL）进行淘汰。
  具有较短剩余生存时间的键将优先被淘汰。这种策略适用于那些希望基于数据的剩余生存时间来决定淘汰顺序的场景。

- `volatile-lru`: Evict using approximated LRU, only keys with an expire set.
- `allkeys-lru`: Evict any key using approximated LRU.
- `volatile-lfu`: Evict using approximated LFU, only keys with an expire set.
- `allkeys-lfu`: Evict any key using approximated LFU.
- `volatile-random`: Remove a random key having an expire set.
- `allkeys-random`: Remove a random key, any key.
- `volatile-ttl`: Remove the key with the nearest expire time (minor TTL)
- `noeviction`: Don't evict anything, just return an error on write operations.

```text
LRU means Least Recently Used
LFU means Least Frequently Used

Both LRU, LFU and volatile-ttl are implemented using approximated
randomized algorithms.

maxmemory-policy noeviction
```

记忆方式：

- 不清除
    - noeviction
- 清除
    - 无规律
        - random
    - 有规律
        - lru
        - lfu
