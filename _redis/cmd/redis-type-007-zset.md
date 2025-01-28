---
title: "ZSet"
sequence: "107"
---

```text
zadd key score value [score1 value1]: 添加(每个value添加的时候需要给出一个对应的分数score,zset是依据这个分数对value进行排序的)
zscore key value: 获取分数
zrange key start end: 获取索引从start开始，到end结束的所有的元素
zrange key start end withscores: 查询索引从start开始，到end结束的所有元素名和分数
zrange key 0 100 byscore withscores limit 0 2:  查询分数在 [0,100] 之间所有的元素，然后分页（背）
zcard key: 获取元素的个数
zcount key min max: 获取在指定分数范围内的元素的个数。闭区间[min, max]
zrem key value1 [value2]: 删除元素
zrank key value: 返回value在key中的下标
zincrby key num value: 给value对应的score的原有值的基础上增长num[新的score=原有的score+num]
zrevrange key 2 3: 倒序排列，然后去取下标在[2, 3]区间的元素
zrangebyscore key min max limit index length; 分页,min是最低分，max最高分，index是索引，length是长度。 (了解)
zrangebyscore key begin end: 查询分数在[begin,end]区间的所有值，根据分数排序。(了解)
zremrangebyscore key min max:  移除分数在[min,max]之间的数据，返回移除的个数。(了解)
zremrangebyrank key begin end: 移除索引在[begin,end]之间的数据。(了解)
```

## CRUD

### ZADD（增）

```text
127.0.0.1:6379> ZADD player:rank 1000 tom 900 jerry 800 spike
(integer) 3
```

### ZREM（删）

```text
127.0.0.1:6379> ZREM player:rank jerry
(integer) 1
```

### ZRANK（查）

`ZRANK` 查看排名，从小到大，从 0 开始

```text
127.0.0.1:6379> ZRANK player:rank tom
(integer) 2
127.0.0.1:6379> ZRANK player:rank jerry
(integer) 1
127.0.0.1:6379> ZRANK player:rank spike
(integer) 0
```

### ZSCORE（查）

```text
127.0.0.1:6379> ZSCORE player:rank jerry
"900"
```

## Range

### ZRANGE

```text
127.0.0.1:6379> ZRANGE player:rank 0 -1
1) "spike"
2) "tom"
```

```text
127.0.0.1:6379> ZRANGE player:rank 0 -1 withscores
1) "spike"
2) "800"
3) "tom"
4) "1000"
```

### ZREVRANGE

```text
127.0.0.1:6379> ZREVRANGE player:rank 0 -1
1) "tom"
2) "spike"
127.0.0.1:6379> ZREVRANGE player:rank 0 -1 withscores
1) "tom"
2) "1000"
3) "spike"
4) "800"
```

### ZRANGEBYSCORE

```text
127.0.0.1:6379> ZRANGEBYSCORE player:rank 700 1000
1) "spike"
2) "tom"
127.0.0.1:6379> ZRANGEBYSCORE player:rank 700 1000 withscores
1) "spike"
2) "800"
3) "tom"
4) "1000"
```

## Count

### ZCOUNT

```text
127.0.0.1:6379> ZCOUNT player:rank 800 1000
(integer) 2
```

### ZCARD

`ZCARD` 获取 ZSet 总量

```text
127.0.0.1:6379> ZCARD player:rank
(integer) 3
```
