---
title: "内存使用"
sequence: "102"
---

```text
# 最大内存限制（以字节为单位），设置为一个合理的值，例如：
maxmemory 1gb

# 内存使用超过此限制时，Redis 将开始使用 LRU（最近最少使用）算法删除一些数据。
# 设置为 0 表示禁用此功能。
maxmemory-policy allkeys-lru

# 记录 Redis 内存使用情况的日志文件路径。
logfile /var/log/redis/redis.log
```

根据需要调整 maxmemory 参数的值。这个值表示 Redis 可以使用的最大内存量。例如，将其设置为 1gb 表示 Redis 可以使用最多 1GB 的内存。

如果需要启用 LRU 算法来删除数据以释放内存，请将 maxmemory-policy 参数设置为 allkeys-lru。如果不需要启用 LRU 算法，请将其设置为 noeviction 或 volatile-lru。

根据需要调整 logfile 参数的值，指定记录 Redis 内存使用情况的日志文件路径。

- `maxmemory <bytes>` 设置最大内存

- `1k` => `1000` bytes
- `1kb` => `1024` bytes
- `1m` => `1000000` bytes
- `1mb` => `1024*1024` bytes
- `1g` => `1000000000` bytes
- `1gb` => `1024*1024*1024` bytes

units are case-insensitive so `1GB`, `1Gb`, `1gB` are all the same.

如果内存使用量到达了最大内存设置，有 6 种处理方法：

```text
volatile-lru -> remove the key with an expire set using an LRU algorithm
allkeys-lru -> remove any key according to the LRU algorithm
volatile-random -> remove a random key with an expire set
allkeys-random -> remove a random key, any key
volatile-ttl -> remove the key with the nearest expire time (minor TTL)
noeviction -> don't expire at all, just return an error on write operations
```

默认的设置是 maxmemory-policy noeviction
maxmemory-samples 5 LRU 算法检查的 keys 个数
