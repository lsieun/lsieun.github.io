---
title: "缓存穿透、缓存雪崩、缓存击穿"
sequence: "109"
---

- 缓存穿透（Cache Penetration）
- 缓存雪崩（Cache Avalanche）
- 缓存击穿（Cache Breakdown）

## 布隆过滤器（BloomFilter）

### 减少误判的措施：

- 增加二进制数组位数
- 增加 Hash 次数（消耗更多 CPU 资源，对性能有影响）

### 假如商品被删除了该怎么办？

布隆过滤器，因为某一个二进制可能被多个编号 Hash 引用，因此布隆过滤器无法直接删除数据。

- 解决方案一：定时异步重建布隆过滤器
- 解决方案二：计数 Bloom Filter

## Reference

- [缓存穿透、缓存击穿、缓存雪崩，看这篇就够了](https://xie.infoq.cn/article/a035f12e5590385ac578778b0)
- [What is cache penetration, cache breakdown and cache avalanche?](https://www.pixelstech.net/article/1586522853-What-is-cache-penetration-cache-breakdown-and-cache-avalanche)
- [Redis — Beyond caching](https://blog.devgenius.io/redis-beyond-caching-1237058033d)

