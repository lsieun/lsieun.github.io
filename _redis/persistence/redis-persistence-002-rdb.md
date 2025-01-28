---
title: "Redis RDB"
sequence: "102"
---

RDB 是 Redis 默认的持久化方案。
在指定的时间间隔内，执行指定次数的写操作，则会将内存中的数据写入到磁盘中。
即在指定目录下生成一个 `dump.rdb` 文件。
Redis 重启后会通过加载 `dump.rdb` 文件来恢复数据。

在指定的时间间隔内将内存中的数据集快照写入磁盘

默认的文件名为 dump.rdb

## RDB 持久化的命令

Redis 进行 RDB 持久化的命令有两种：

- save
- bgsave

### save

执行 `save` 命令期间，会阻塞当前 Redis 服务器，Redis 不能处理其他命令，直到 RDB 过程完成为止

`save` 命令对于内存比较大的实例会造成长时间阻塞，这是致命的缺陷。
为了解决此问题，Redis 提供了第二种方式。

### bgsave

执行 `bgsave` 命令时，Redis 会在后台异步进行快照操作，快照同时还可以响应客户端请求。
具体操作是 Redis 进程执行 fork 操作创建子进程，RDB 持久化过程由子进程负责，完成后自动结束。
阻塞只发生在 fork 阶段，一般时间很短。
fork 会消耗一定时间，并且父子进程所占据的内存是相同的，
当 Redis 键值较大时，fork 的时间会很长，这段时间内 Redis 是无法响应其他命令的。

```text
fork 创建子进程，RDB 持久化过程由子进程负责，会在后台异步进行快照操作，快照同时还可以响应客户端请求
```

基本上 Redis 内部所有的 RDB 操作都是采用 bgsave 命令。
Redis 会单独创建（fork）一个子进程进行持久化，会先将数据写入一个临时文件中，待持久化过程结束了，
再用这个临时文件替换上次持久化好的文件。
整个过程中，主进程不进行任何 IO 操作，这就确保的极高的性能。
如果需要大规模的数据的恢复，且对数据恢复的完整性不是非常敏感，那 RDB 方式要比 AOF 方式更加高效。
RDB 唯一的缺点是最后一次持久化的数据可能会丢失。

## 配置

### 修改RDB数据持久化位置

```text
# The working directory.
dir /opt/redis/data/

# The filename where to dump the DB
dbfilename dump.rdb
```




### 修改数据持久化方案

自动化触发
配置文件来完成，配置触发 Redis 的 RDB 持久化条件
比如 "save m n"。表示 m 秒内数据集存在 n 次修改时，自动触发 bgsave

```text
save 60 5
```

在60秒内如果有5条数据发生改变就进行一次持久化(将数据写入到磁盘中)

主从架构
从服务器同步数据的时候，会发送 sync 执行同步操作，master 主服务器就会执行 bgsave

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

# RDB
dir /opt/redis/data/
dbfilename for-test-dump.rdb
save 60 1
save 30 2
save 20 5
```

```text
$ redis-server ./redis.conf
```

## 优缺点

### 优点

RDB 文件紧凑，全量备份，适合用于进行备份和灾难恢复
在恢复大数据集时的速度比 AOF 的恢复速度要快
生成的是一个紧凑压缩的二进制文件

### 缺点

每次快照是一次全量备份，fork 子进程进行后台操作，子进程存在开销
在快照持久化期间修改的数据不会被保存，可能丢失数据

关于 RDB 的关键配置
Redis.conf

```text
dbfilename itlaoqi.rdb     # 持久化文件名称 
dir /usr/local/redis/data  # 持久化文件存储路径

# 持久化策略，M 秒内有 n 个 key 改动，执行快照 
save 3600 1
save 300 100
save 60 10000

# 导出 rdb 数据库文件压缩字符串和对象，默认是 yes。优点：节省空间；缺点：消耗 CPU，影响性能。 
rdbcompression yes 

# 导入时是否检查 
rdbchecksum yes 
```
