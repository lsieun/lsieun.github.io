---
title: "List"
sequence: "105"
---

```text
lpush key value: 往左侧中设置值
rpush key value: 往右侧插入值
lrange key start end: 取集合中索引在[start, end]之间的值
例：lrange aa 0 2   lrange aa 0 -1
llen key: 获取集合的长度
lpop key: 移除并返回首元素
rpop key: 移除并返回尾元素
lrem key count value: 移除列表中count个值为value的数据。当count为0，移除所有。（了解）
ltrim key start end: 保留指定区域的元素，其他全部删除。  （了解）
lset key index value: 设置索引为index的值为value. (了解)
lindex key index: 获取索引为index的元素。(了解)
```

## PUSH

```text
127.0.0.1:6379> RPUSH mylist 4 5 6
(integer) 3
127.0.0.1:6379> LRANGE mylist 0 -1
1) "4"
2) "5"
3) "6"
127.0.0.1:6379> LPUSH mylist 3 2 1
(integer) 6
127.0.0.1:6379> LRANGE mylist 0 -1
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
6) "6"
```

## POP

```text
127.0.0.1:6379> RPOP mylist
"6"
127.0.0.1:6379> LRANGE mylist 0 -1
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
127.0.0.1:6379> LPOP mylist
"1"
127.0.0.1:6379> LRANGE mylist 0 -1
1) "2"
2) "3"
3) "4"
4) "5"
```
