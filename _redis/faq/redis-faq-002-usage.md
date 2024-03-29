---
title: "Redis 的应用场景"
sequence: "102"
---

- 缓存
- 计数器
- 分布式会话
- 排行榜
- 最新列表
- 分布式锁
- 消息队列

Redis 的应用场景，需要结合它的“具体数据类型”来讲：

## 字符串

命令的时间复杂度：除了 `del`、`mset`、`mget` 支持多个键的批量操作，时间复杂度和键的个数相关，为 `O(n)`；
`getrange` 和 字符串长度相关，也是 `O(n)`，其余的命令基本上都是 `O(1)` 的时间复杂度，在速度上还是非常快的。

字符串的使用场景很广泛

### 缓存功能

Redis 作为缓存层，MySQL 作为存储层，绝大部分请求的数据都是从 Redis 中获取。
由于 Redis 具有支撑高并发的特性，所以缓存通常能够起到加速读写和降低后端压力的作用。

### 计数

使用 Redis 作为计数的基础工具，它可以实现快速计数、查询缓存的功能，同时数据可以异步落地到其他数据源。

### 共享 Session

一个分布式 Web 服务，将用户的 Session 信息（例如，用户登录信息）保存在各自的服务器中，这样会造成一个问题，
出于负载均衡的考虑，分布式服务会将用户的访问均衡到不同服务器上，用户刷新一次访问可能会发现需要重新登录，
这个问题是用户无法容忍的。

为了解决这个问题，可以使用 Redis 将用户的 Session 进行集中管理，
在这种模式下，只要保证 Redis 是高可用和扩展性的，每次用户更新或者查询登录信息，都直接从 Redis 中集中获取。

### 限速

## 列表 list

### 消息队列

消息队列，Redis 的 lpush + brpop 命令组合即可实现阻塞队列。

- **生产者**客户端，使用 `lpush` 从列表左侧插入元素
- 多个**消费者**客户端使用 `brpop` 命令阻塞式的“抢”列表尾部的的元素；多个客户端保证了消费的负载均衡和高可用性。

> lpush 向左插入；brpop 阻塞式弹出元素

### 文章列表

每个用户有属于自己的文章列表，现需要分页展示文章列表。
此时，可以考虑使用列表，因为列表不但是有序的，同时支持按照索引范围获取元素。

实现其它数据结构：

- `lpush` + `lpop` = Stack （栈）
- `lpush` + `rpop` = Queue （队列）
- `lpush` + `ltrim` = Capped Collection （有限集合）
- `lpush` + `brpop` = Message Queue （消息队列）

## 集合 Set

集合类型，比较典型的场景是标签（tag）。
例如，一个用户可能对娱乐、体育比较感兴趣，
另一个用户可能对历史新闻比较感兴趣，这些兴趣就是标签。
有了这些数据就可以得到喜欢同一标签的人，以及用户的共同喜好的标签，这些数据对于用户体验以及增强用户黏度比较重要。

例如，一个电子商务的网站，会对不同标签的用户做不同类型的推荐；
比如，对数码产品比较感兴趣的人，在各个页面或者通过邮件的形式给他们推荐最新的数码产品，通常会为网站带来更多的利益。

除此之外，集合还可以通过生成随机数，比如抽奖活动，以及社交图谱等等。

## 有序集合 ZSet

有序集合，比较典型的使用场景就是排行榜系统。
例如，视频网站需要对用户上传的视频做排行榜，榜单的维度可能是多个方面的：按照时间、按照播放数量、按照获得的赞数。

## Redis 高级数据结构

### Bitmaps

Bitmaps 可以做布隆过滤器。

### HyperLogLog




