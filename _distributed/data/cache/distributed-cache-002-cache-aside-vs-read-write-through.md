---
title: "Cache Aside + Read/Write Through"
sequence: "102"
---

```text
Application --> Cache --> DB
```

## Cache-Aside

Request data from the cache using a key.
If cache has the data, return it to the caller immediately.
If there is no data, we request the persistent storage (DB) for data.
After getting the data from the DB, we put it back in the cache with the key.
And return the data.
We call this **Cache Aside** model.
It is the default way of working with cache for most applications.

![](/assets/images/distributed/cache/cache-aside.png)

## Read-Through Cache

In **Read Through Cache**, the application always requests data from the cache.
If cache has no data, it is responsible for retrieving the data from the DB using an underlying provider plugin.
After retrieving the data, the cache updates itself and returns the data to the calling application.

![](/assets/images/distributed/cache/read-through.png)

## Write-Through Cache

In this write strategy, data is first written to the cache and then to the database.
The cache sits in-line with the database and writes always go through the cache to the main database.
This helps cache maintain consistency with the main database.

![](/assets/images/distributed/cache/write-through.png)

## Cache Aside vs Read Through Cache

Using the Read Through Cache has an important benefit.
We always retrieve data from the cache using a key.
The calling application is not aware of the database.
This makes the code more readable. The code is cleaner.

So, why don't we have only the Read Through Cache?
There is a drawback.
It requires writing a provider plugin for database fetch.
And it is not a trivial task.
The **Cache aside** strategy is much simpler to implement.
Most developers are familiar with writing code that way.

## Reference

- [Cache Aside vs Read Through Cache](https://vijayt.com/post/cache-aside-vs-read-through-cache/)
- [Introduction to database caching](https://www.prisma.io/dataguide/managing-databases/introduction-database-caching)
- [Caching Strategies and How to Choose the Right One](https://codeahoy.com/2017/08/11/caching-strategies-and-how-to-choose-the-right-one/)
- [Brief Overview of Caching and Cache Invalidation](https://codeahoy.com/2022/04/03/cache-invalidation/)
