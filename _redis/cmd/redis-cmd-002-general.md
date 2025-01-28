---
title: "Redis 通用命令"
sequence: "102"
---

## 查看帮助

```text
# 查看 SET 命令的帮助
> help SET

# 查看某种数据类型的所有相关命令的使用
> help @string/list/set/zset/hash
```

## 具体命令

### DB

#### SELECT

在默认情况下，Redis 有 16 个数据库，索引号为 `0` ~ `15`。
不同数据库，在内存存储上是隔离的，不同数据库允许持有相同的 key-value pair。

`SELECT` 命令，用于切换数据库。

```text
192.168.80.130:6379> SELECT 0
OK
192.168.80.130:6379> SELECT 10
OK
192.168.80.130:6379[10]> SELECT 15
OK
192.168.80.130:6379[15]> SELECT 20
(error) ERR DB index is out of range
```

#### FLUSHDB

`FLUSHDB` 命令，用于清空当前数据库，慎用

```text
192.168.80.130:6379> FLUSHDB
OK
192.168.80.130:6379> KEYS *
(empty array)
```

#### FLUSHALL

`FLUSHALL` 清空所有数据库，慎用

```text
192.168.80.130:6379> FLUSHALL
OK
```

### Key

#### KEYS

`KEYS` 用于查询符合要求的 Redis Key，它的时间复杂度是 `O(N)`，
会进行“全库扫描”，执行效率差，不建议使用。

```text
192.168.80.130:6379> SET hello world
OK
192.168.80.130:6379> SET foo bar
OK
192.168.80.130:6379> KEYS he[h-l]*
1) "hello"
```

#### TYPE

- `TYPE key`: 获取键的类型(string，hash，list，set，zset)

```text
> TYPE hello
string
```

#### EXISTS

`EXISTS` 命令用于判断 key 是否存在

```text
192.168.80.130:6379> EXISTS hello
(integer) 1
192.168.80.130:6379> EXISTS nonExistentKey
(integer) 0
```

#### EXPIRE

`EXPIRE` 用于设置 key 过期时长（秒）；
key 过期后，会自动删除。

```text
192.168.80.130:6379> SET mykey "Hello Redis"
OK
192.168.80.130:6379> EXPIRE mykey 3600
(integer) 1
```

#### TTL

`TTL` 命令，用于查询 key 剩余有效期

```text
192.168.80.130:6379> TTL mykey
(integer) 3596
192.168.80.130:6379> TTL mykey
(integer) 3592
192.168.80.130:6379> TTL mykey
(integer) 3589
```

#### DEL

`DEL` 命令用于删除指定 key

```text
192.168.80.130:6379> keys *
1) "foo"
2) "hello"
3) "mykey"
192.168.80.130:6379> DEL hello
(integer) 1
192.168.80.130:6379> KEYS *
1) "foo"
2) "mykey"
```

