---
title: "MyBatis 两级缓存"
sequence: "102"
---


MyBatis 里面设计了**两级缓存**来提升数据的检索效率，避免每次数据的访问都需要去查询数据库。

## 两级缓存

一级缓存，是 SqlSession 级别的缓存，也叫**本地缓存**。
因为每个用户在执行查询的时候，需要使用 SqlSession 来执行，
为了避免每一次查询都去查询数据库，MyBatis 就把查询出来的数据保存到一个叫做 SqlSession 的一个本地缓存中；
那么，后续的 SQL 语句再执行的话，如果命中了缓存，就可以直接从本地缓存中去读取。

如果要实现跨 SqlSession 级别的一个缓存，那么一级缓存就无法实现了。
因此，MyBatis 就引入了二级缓存。
当我们有多个用户在查询数据的时候，只要有任何一个 SqlSession 拿到了数据，就会放入到二级缓存里面；
其它的 SqlSession 就可以从二级缓存去加载数据。

## 一级缓存的实现原理

在 SqlSession 里面，有一个 Executor 对象，每一个 Executor 里都有一个 LocalCache 对象，

![](/assets/images/db/mybatis/first-cache.png)

当用户发起查询的时候，MyBatis 就会根据查询语句，在 Local Cache 里面去查询；
如果没有命中的话，再去查询数据库，并写入到 Local Cache 中。

一级缓存的生命周期，只在 SqlSession 级别。

而多个 SqlSession 或者是分布式环境下，就可能会导致数据库的写操作出现脏数据，
那么，这个时候，就要用到二级缓存。

## 二级缓存的实现原理

在二级缓存中，使用了一个 CachingExecutor 对象，它是对 Executor 进行了封装，也就是用了装饰器模式。
在进入一级缓存的数据查询流程之前，会先通过 CacheExecutor 进行二级缓存的查询。

![](/assets/images/db/mybatis/second-cache.png)

开启二级缓存之后，会被多个 SqlSession 共享，所以它是一个全局缓存。
因此它的查询流程是先查二级缓存，然后再查一级缓存，最后再查数据库。

MyBatis 的二级缓存相对于一级缓存来说，实现了 SqlSession 之间缓存数据的共享，
缓存粒度也能够控制到 Name Space 级别。

可以通过 `Cache` 接口实现类不同的组合，对 Cache 的可控性也更强。



