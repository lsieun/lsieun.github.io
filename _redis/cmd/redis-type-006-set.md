---
title: "Set"
sequence: "106"
---

```text
sadd key member [memerb..]: 往集合中添加元素，返回添加成功的个数
smembers key: 返回集合中所有的元素
srem key member: 删除元素
sismember key member: 判断member是否存在, 存在返回1，不存在返回0
scard key: 返回集合中的个数
srandmember key: 从集合中随机返回一个值(了解)
spop key: 移除并返回一个随机的member(了解)
smove src destination member: 将src中member元素移动到destination中(了解)
sinter key key: 对集合求交集(了解)
sunion key key: 对两个集合求并集(了解)
sdiffstore destination key1 key2:  差集运算并存储到集合中(了解)
sinterstore destination key1 key2: 交集存储到集合中(了解)
sunionstore destionation key1 key2: 并集存储到集合中(了解)
```

## SADD

```text
127.0.0.1:6379> SADD user:1:follow it
(integer) 1
```

### SMEMBERS

```text
127.0.0.1:6379> SADD user:1:follow it
(integer) 1
127.0.0.1:6379> SADD user:1:follow music
(integer) 1
127.0.0.1:6379> SADD user:1:follow sports
(integer) 1
127.0.0.1:6379> SMEMBERS user:1:follow
1) "it"
2) "music"
3) "sports"
```

```text
127.0.0.1:6379> SRANDMEMBER user:1:follow 2
1) "it"
2) "sports"
```

## SPOP

```text
127.0.0.1:6379> SPOP user:1:follow
"sports"
127.0.0.1:6379> SMEMBERS user:1:follow
1) "it"
2) "music"
```

## 运算

```text
127.0.0.1:6379> DEL user:1:follow
(integer) 1
127.0.0.1:6379> DEL user:2:follow
(integer) 1
127.0.0.1:6379> SADD user:1:follow english math music
(integer) 3
127.0.0.1:6379> SADD user:2:follow english math sports
(integer) 3
```

```text
127.0.0.1:6379> SDIFF user:1:follow user:2:follow
1) "music"
127.0.0.1:6379> SDIFF user:2:follow user:1:follow
1) "sports"
```

```text
127.0.0.1:6379> SINTER user:1:follow user:2:follow
1) "english"
2) "math"
```

```text
127.0.0.1:6379> SUNION user:1:follow user:2:follow
1) "english"
2) "math"
3) "music"
4) "sports"
```
