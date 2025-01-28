---
title: "String"
sequence: "103"
---

```text
set key value: 设置或者覆盖值
get key:  根据键取值
del key [key1, key2,key3,...]: 删除某个键                                          
incr key : 将对应的键的值，递增1，前提是该value必须是个整数
decr key : 将对应的键的值，递减1，前提是该value必须是个整数     
expire key 时间(秒)：设置key的存活时间，单位为秒
set key value EX 60: 表示给key设置value，然后指定过期时间是60S
ttl code: 查看存活时间。 (TTL  Time To Live)
setnx key value: 如果不存在就设置。(redis设置分布式锁)
set key value EX 秒 NX: 如果不存在就设置值，并且指定过期时间
```

## GET/SET

### SET

```text
> SET key "value"
OK
```

### GET

```text
> GET key
value
```

### GETSET

`GETSET` 命令用于设置指定 key 的值，并返回 key 的旧值。

```text
> GETSET db mongodb
null
> GET db
mongodb
> GETSET db redis
mongodb
> GET db
redis
```

### MGET/MSET

`MGET` 命令返回所有给定的 key 的值。
如果给定的 key 里面，有某个 key 不存在，那么这个 key 返回特殊值 nil。

```text
> SET key1 "hello"
OK
> SET key2 "world"
OK
> MGET key1 key2 someOtherKey
hello
world
null
```

`MSET` 命令用于同时设置一个或多个 key-value 对。

```text
> MSET key1 "abc" key2 "def"
OK
> GET key1
abc
> GET key2
def
```

## SETNX

SETNX (SET if Not eXists) 命令在指定的 key 不存在时，为 key 设置指定的值。

```text
> EXISTS job
0
> SETNX job "programmer"
1
> SETNX job "hr"
0
> GET job
programmer
```

```text
> SET lock value NX EX 10
OK
> ttl lock
(integer) 6
```

## INCR

`INCR` 命令将 key 中储存的数字值增一。
如果 key 不存在，那么 key 的值会先被初始化为 0，然后再执行 INCR 操作。
如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。
本操作的值限制在 64 位(bit)有符号数字表示之内。

```text
> SET page_view 20
OK
> INCR page_view
21
> GET page_view
21
```

