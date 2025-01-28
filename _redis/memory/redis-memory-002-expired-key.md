---
title: "过期策略：如何处理过期的 key"
sequence: "102"
---

Redis 是一种常用的内存数据库，它可以为存储的 key 设置过期时间。
那么，Redis 是如何处理过期的 key 的呢？
它会不会影响 Redis 的单线程性能呢？
要回答这些问题，我们需要先了解 Redis 的过期策略和内存淘汰机制。

Redis 的 key 的过期策略：

- 被动方式 - **惰性删除**
- 主动方式 - **定期删除**

A key with an associated timeout is often said to be `volatile` in Redis terminology.

## How Redis expires keys

Redis keys are expired in two ways: **a passive way**, and **an active way**.

A key is **passively** expired simply
when some client tries to access it, and the key is found to be timed out.

Of course this is not enough as there are expired keys that will never be accessed again.
These keys should be expired anyway,
so **periodically** Redis tests a few keys at random among keys with an `expire` set.
All the keys that are already expired are deleted from the keyspace.

Specifically this is what Redis does 10 times per second:

- step 1. Test 20 random keys from the set of keys with an associated expire.
- step 2. Delete all the keys found expired.
- step 3. If more than 25% of keys were expired, start again from step 1.

This is a trivial probabilistic algorithm,
basically the assumption is that our sample is representative of the whole key space,
and we continue to expire until the percentage of keys that are likely to be expired is under 25%.

This means that at any given moment the maximum amount of keys already expired
that are using memory is at max equal to max amount of write operations per second divided by 4.




## 定期删除策略

Redis 的定期删除策略是一种平衡的方法，它定时地检查 Redis 库中的过期数据，采用随机抽样的方法，根据**过期数据的比例**
来调整删除的速度。

**过期数据的比例**是指 Redis 在定期删除策略中，根据每次随机抽样的键中有多少是过期的来决定是否继续删除。
如果过期的键比例超过 1/4，就继续抽样和删除。
这样可以根据过期数据的密集程度来控制删除的频率，避免过多占用 CPU 资源或内存空间。

例如：

Redis 会将每个设置了过期时间的 key 存入到一个单独的字典中，默认每 100ms 执行一次过期扫描：

- 随机抽取 20 个 key
- 删除这 20 个 key 中已经过期的 key
- 如果过期的 key 比例超过 1/4，就重复步骤 1，继续删除。

### 为什不扫描所有的 key？

Redis，作为一个单线程系统，全面扫描所有键值对可能会大幅度地影响性能。
因此，Redis 限制每次过期扫描的最大耗时，这个限制默认是 25ms。

如果用户将操作超时设置得太短，比如 10ms，那么许多连接可能会由于超时而关闭，导致应用出现许多异常。
此时，Redis 的慢查询日志可能并没有任何记录，因为慢查询记录的只是命令的处理时间，而不包括等待时间。

当大量键值对在同一时刻过期时，Redis 会多次扫描过期字典，直到过期键的比例低于四分之一。
这可能会导致短暂的系统卡顿，尤其在并发请求高的情况下，这可能引发所谓的缓存雪崩。

### 设置 25ms 为什么还会出现缓存雪崩

因为 Redis 运行在单线程模式中，所有的请求处理都必须按照顺序进行。
为了平衡过期键的删除和服务的响应性，Redis 限制了每次过期扫描的时间，上限是 25 毫秒。
因此，每个请求的处理时间最多为 25 毫秒。
假设有 100 个请求等待处理，那么总的处理时间就可能高达 2500 毫秒。

然而，如果同时有大量的键过期，这就可能导致 Redis 需要花费更多的时间来进行扫描和删除操作。
因此，为了避免这种情况，建议将键的过期时间设置为一个随机范围，这样就可以让过期的键在不同的时间点进行过期，
从而降低单次扫描的压力，提高 Redis 的处理效率。

### 从库的过期策略

Redis 的从库采取被动方式处理键值过期，即它不会主动去扫描和删除过期的键。
当从库收到读取请求时，它会将请求发送到主库处理。在主库端，会检查相关键是否已过期；
如果是，那么主库会删除这个键，并把删除操作同步给所有从库。
这样的处理方式意味着从库可以避免进行过期扫描，进一步减轻了从库的处理负荷。

## 惰性删除策略

与定期删除不同，懒惰删除策略并不会定时地去扫描和删除过期的键，而是在每次访问键时，检查该键是否已经过期，如果已经过期，那么就删除它。

### 它对比定期删除策略的优点？

可以节省处理器时间，因为只有在键被访问时，Redis 才会去检查并删除过期的键。
这种策略在很多情况下都能有效地处理过期的键，因为很多过期的键可能永远都不会被访问，因此没有必要花费时间去删除它们。

然而，懒惰删除策略的缺点在于可能会导致过期的键占用内存空间。
因为只有在键被访问时，Redis 才会删除它，如果一个过期的键一直没有被访问，那么它就会一直占用内存空间，这在内存紧张的环境下可能会成为一个问题。
为了解决这个问题，Redis 通常会结合**定期删除策略**，以确保及时地删除过期的键。

### 异步删除

在绝大多数场景下，Redis 的 del 命令可以快速地执行并且不会产生明显的延迟，因为它能直接回收目标对象的内存。
但是，当我们需要删除一个非常大的对象，例如，一个拥有数百万元素的哈希表，
或者在使用 `FLUSHDB` 和 `FLUSHALL` 命令来删除一个包含大量键值对的数据库时，这个删除操作就可能引起单线程的阻塞。

为了解决这个问题，从 Redis 4.0 开始，引入了一个名为 lazyfree 的机制。
这个机制能将删除键值对或整个数据库的操作交给后台线程处理，以此最大程度地避免对 Redis 主线程的阻塞。

## 一些问题

### 过期对持久化的影响

第 1 个问题，RDB 对过期 key 的处理有什么影响吗？

回答：过期 key 对 RDB 没有影响。

从内存数据库持久化数据到 RDB 文件（Memory --> RDB）：

- 持久化 key 之前，会检查是否过期，过期的 key 不进入 RDB 文件

从 RDB 文件恢复数据到内存数据库（RDB --> Memory）：

- 数据载入数据库之前，会对 key 先进行过期检查，如果过期，不导入数据库（主库情况）

第 2 个问题，AOF 对过期 key 的处理有什么影响吗？

回答：过期 key 对 AOF 没有影响。

- 从内存数据库持久化数据到 AOF 文件（Memory --> AOF）：
    - 当 key 过期后，还没有被删除，此时进行执行持久化操作（该 key 是不会进入 aof 文件的，因为没有发生修改命令）
    - 当 key 过期后，在发生删除操作时，程序会向 AOF 文件追加一条 DEL 命令（在将来的以 aof 文件恢复数据的时候该过期的键就会被删掉）
- AOF 重写
    - 重写时，会先判断 key 是否过期，已过期的 key 不会重写到 aof 文件
