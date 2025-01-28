---
title: "Redis AOF"
sequence: "103"
---

AOF 是 Redis 的另一种数据持久化方案，默认是不开启的。
它的出现是为了弥补 RDB 的不足(数据的不一致性——内存中的数据和磁盘中的数据不一致)，它所采用的是日志的形式来记录每个写操作，并追加到日志文件中。
Redis 重启后，会根据日志文件中的内容将所有的写指令从前往后的执行一次来完成数据的恢复。


追加文件的方式，文件容易被人读懂
以独立日志的方式记录每次写命令，重启时再重新执行 AOF 文件中的命令达到恢复数据的目的
写入过程宕机，也不影响之前的数据，可以通过 redis-check-aof 检查修复问题
 
核心原理
Redis 每次写入命令会追加到 aof_buf（缓冲区）

```text
新增 x1:v1 
新增 x2:v2 
删除 x2
新增 x3:v3 
覆盖 x4:v4
```

AOF 缓冲区根据对应的策略向硬盘做同步操作
高频 AOF 会带来影响，特别是每次刷盘

## 配置

```text
appendonly yes 
appendfilename "appendonly.aof" 
appendfsync everysec 
```

## 开启 AOF 数据持久化策略

```text
appendonly yes
```

### 修改 AOF 数据持久化位置

如果需要修改 AOF 数据化持久化位置

输入 `/appendfilename` 查找 `appendfilename` 字符串,找到后将 `appendfilename "appendonly.aof"`

```text
appendfilename "for-test-appendonly.aof"
```

## 修改 AOF 数据持久化方案

提供了 3 种同步方式，在性能和安全性方面做出平衡：

- `appendfsync always`: 每次有数据修改发生时都会写入 AOF 文件，消耗性能多
- `appendfsync everysec`: 每秒钟同步一次，该策略为 AOF 的缺省策略。
- `appendfsync no` : 不主从同步，由操作系统自动调度刷磁盘，性能是最好的，但是最不安全

### always

每一次的写操作都同步追加到 `.aof` 文件中，即写一个追加一个，每一次的数据变化都会立刻追加到到磁盘文件中。

- 优点：安全，能较好地保证数据的完整性和一致性(内存和磁盘中的数据一致)
- 缺点：性能较差

### everysec

Redis 默认和推荐的方式，每秒追加一次。
即到了一秒就将用户在这一秒内所有的写操作追加到 `.aof` 文件中，没到一秒不会追加。

- 优点：比 `always` 性能好
- 缺点：还是会有数据丢失的风险(如果时间没到一秒，redis发生宕机，那么在这一秒内用户所有的写操作都不会被追加)，
  写操作和追加操作是异步的

### no

不同步，无意义，和不开启 AOF 没啥区别



## 实践

```text
sudo mkdir -p /opt/redis/data
sudo chmod 777 /opt/redis/data
```

```text
# IP + Port
port 6379
bind 0.0.0.0
protected-mode no

# Process
daemonize no
pidfile /opt/redis/data/redis.pid

# AOF
dir /opt/redis/data/
appendonly yes
appendfilename "for-test-appendonly.aof"
appendfsync everysec

auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 10mb
```

```text
$ redis-server ./redis.conf
```

