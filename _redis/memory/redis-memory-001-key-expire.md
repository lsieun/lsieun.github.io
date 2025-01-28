---
title: "Redis 过期策略"
sequence: "101"
---



## 设置过期时间

Redis 对存储值的过期处理实际上是针对该值的键（key）处理的，即时间的设置也是设置 key 的有效时间。
Expires 字典保存了所有键的过期时间，Expires 也被称为过期字段。

- 第 1 种方式，`expire key time`(以秒为单位)，这是最常用的方式
- 第 2 种方式，`setex(String key, int seconds, String value)`，这是字符串独有的方式

注：

- 除了字符串自己独有设置过期时间的方法外，其他方法都需要依靠 expire 方法来设置时间
- 如果没有设置时间，那缓存就是永不过期
- 如果设置了过期时间，之后又想让缓存永不过期，使用 persist key

### 常用方式

一般主要包括 4 种处理过期方，其中 expire 都是以秒为单位，pexpire 都是以毫秒为单位的。

```text
EXPIRE key seconds 　　//将 key 的生存时间设置为 ttl 秒
PEXPIRE key milliseconds 　　//将 key 的生成时间设置为 ttl 毫秒
EXPIREAT key timestamp 　　//将 key 的过期时间设置为 timestamp 所代表的的秒数的时间戳
PEXPIREAT key milliseconds-timestamp 　　//将 key 的过期时间设置为 timestamp 所代表的的毫秒数的时间戳
```

备注：timestamp 为 unix 时间戳（例如：timestamp=1499788800 表示将在 2017.07.12 过期）
1、2 两种方式是设置一个过期的时间段，就是咱们处理验证码最常用的策略，设置三分钟或五分钟后失效，把分钟数转换成秒或毫秒存储到 Redis 中。
3、4 两种方式是指定一个过期的时间 ，比如优惠券的过期时间是某年某月某日，只是单位不一样。

```text
# 时间复杂度：O（1），最常用方式
expire key seconds

# 字符串独有方式
setex(String key, int seconds, String value)
```

```text
127.0.0.1:6379> set mykey "Hello"
OK
127.0.0.1:6379> expire mykey 10
(integer) 1
127.0.0.1:6379> ttl mykey
(integer) 7
127.0.0.1:6379> exists mykey
(integer) 1
127.0.0.1:6379> set mykey "World"
OK
127.0.0.1:6379> ttl mykey
(integer) -1
```

除了 string 独有设置过期时间的方法，其他类型都需依靠 `expire` 方法设置时间，若：

- 未设置时间，则缓存永不过期
- 设置过期时间，但之后又想让缓存永不过期，使用 persist

设置 key 的过期时间。超时后，将会自动删除该 key。在 Redis 的术语中，一个 key 的相关超时是 volatile 的。

### 字符串独有方式

对字符串特殊处理的方式为 SETEX 命令，SETEX 命令为指定的 key 设置值及其过期时间。
如果 key 已经存在， SETEX 命令将会替换旧的值。

```text
SETEX KEY_NAME TIMEOUT VALUE
```

```text
127.0.0.1:6379> SETEX mykey 60 "Hello"
OK
127.0.0.1:6379> TTL mykey
(integer) 56
127.0.0.1:6379> GET mykey
"Hello"
```




## Reference

- [EXPIRE](https://redis.io/commands/expire/)
