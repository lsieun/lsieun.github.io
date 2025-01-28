---
title: "Hash"
sequence: "104"
---

```text
hset key field value: 设置值。如果存在相同的Key，对应的值会覆盖之前的
hmset key field value filed value: 设置多个值
hget key field: 取值
hexists key field: 是否存在
hgetall key: 获取集合中所有的元素
hdel key field: 删除字段
hkeys key: 获取所有的key
hvals key: 获取所有的字段值
hlen key: 获取字段的数量
hsetnx key field value: 不存在的时候设置值
```

## SET/GET

### HSET

`HSET` 设置单个 Hash 键值对：

```text
127.0.0.1:6379> HSET website google "www.google.com"
(integer) 1
127.0.0.1:6379> HSET website google "www.google.cn"
(integer) 0
```

返回值：the number of fields that were added.

### HGET

```text
127.0.0.1:6379> HGET website google
"www.google.cn"
```

### HMSET

```text
127.0.0.1:6379> HMSET website baidu "www.baidu.com" redis "www.redis.io"
OK
127.0.0.1:6379> HGET website baidu
"www.baidu.com"
127.0.0.1:6379> HGET website redis
"www.redis.io"
```

### HGETALL

```text
127.0.0.1:6379> HGETALL website
1) "google"
2) "www.google.cn"
3) "baidu"
4) "www.baidu.com"
5) "redis"
6) "www.redis.io"
```

## Field

### HEXISTS

```text
127.0.0.1:6379> HEXISTS website google
(integer) 1
127.0.0.1:6379> HEXISTS website youtube
(integer) 0
```

### HDEL

```text
127.0.0.1:6379> HDEL website redis
(integer) 1
127.0.0.1:6379> HGETALL website
1) "google"
2) "www.google.cn"
3) "baidu"
4) "www.baidu.com"
```

## Value

### HVALS

```text
127.0.0.1:6379> HVALS website
1) "www.google.cn"
2) "www.baidu.com"
```

### HINCRBY

```text
127.0.0.1:6379> HMSET user:xiaoming math 90
OK
127.0.0.1:6379> HMSET user:xiaoming english 90
OK
127.0.0.1:6379> HMSET user:xiaoming chinese 90
OK
127.0.0.1:6379> HINCRBY user:xiaoming chinese 5
(integer) 95
127.0.0.1:6379> HGETALL user:xiaoming
1) "math"
2) "90"
3) "english"
4) "90"
5) "chinese"
6) "95"
```

## Reference

- [Redis Hash Commands](https://redis.io/commands/?group=hash)
