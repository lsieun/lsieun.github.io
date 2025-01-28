---
title: "Redisson Intro"
sequence: "101"
---

Redisson is a Redis client for Java.

## Redisson 与 Jedis 的区别

- 功能：Redisson 不仅封装了 Redis，还封装了对更多数据结构的支持，以及锁等功能，相比于 Jedis 更加全面。
  而 Jedis 只是简单的封装了 Redis 的 API 库，可以看作是 Redis 客户端，它的方法和 Redis 的命令很类似。
- 灵活性：Jedis 相比于 Redisson 更原生一些，更灵活。
- 适用场景：Redisson 的宗旨是促进使用者对 Redis 的关注分离，从而让使用者能够将精力更集中的放在处理业务逻辑上。

总的来说，Redisson 与 Jedis 各有优势，选择哪个取决于具体需求。

## Reference

- [Redisson - Easy Redis Java Client](https://redisson.org/)
    - [GitHub: redisson/redisson](https://github.com/redisson/redisson)
    - [GitHub: redisson/redisson-examples](https://github.com/redisson/redisson-examples/tree/master)
        - [objects-examples](https://github.com/redisson/redisson-examples/tree/master/objects-examples/src/main/java/org/redisson/example/objects)
- [A Guide to Redis with Redisson](https://www.baeldung.com/redis-redisson)
