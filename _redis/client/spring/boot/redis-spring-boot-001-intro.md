---
title: "Spring Boot + Redis"
sequence: "101"
---

```text
                                                        ┌─── JedisConnectionFactory
spring-data-redis.jar ───┼─── RedisConnectionFactory ───┤
                                                        └─── LettuceConnectionFactory
```

- `RedisTemplate` is the central class of the Redis module, due to its rich feature set.
  The template offers a **high-level abstraction for Redis interactions**.
- `RedisConnection` offers **low-level methods** that accept and return binary values (byte arrays),
  the template takes care of serialization and connection management, freeing the user from dealing with such details.

<table>
    <thead>
    <tr>
        <th></th>
        <th>RedisTemplate</th>
        <th>RedisConnection</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td></td>
        <td>high-level</td>
        <td>low-level</td>
    </tr>
    <tr>
        <td></td>
        <td>serialization and connection management</td>
        <td>low-level methods that accept and return binary values (byte arrays)</td>
    </tr>
    </tbody>
</table>

## Reference

- [Working with Objects through RedisTemplate](https://docs.spring.io/spring-data/redis/reference/redis/template.html)
