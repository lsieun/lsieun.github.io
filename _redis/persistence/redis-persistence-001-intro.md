---
title: "Redis 持久化"
sequence: "101"
---

什么是持久化？持久化，是将内存中的数据写入到磁盘中；
对于 Redis 来说，持久化就是在指定目录下生成一个 `dump.rdb` 文件。

如果没有持久化，会发生什么？
Redis 是一个内存数据库，如果没有配置持久化，Redis 重启后数据就全丢失。
开启 Redis 的持久化功能，将数据保存到磁盘上，当 Redis 重启后，可以从磁盘中恢复数据。

Redis 有两种数据持久化策略：RDB(Redis DataBase)和 AOF (Append Only File)。


两种持久化方式：

- RDB (Redis DataBase)：全量二进制备份，是 Redis 默认的持久化方案。
- AOF (Append Only File）：增量日志

## 通用

- `dir ./` 指定工作目录，rdb 文件和 aof 文件都会存放在这个目录中，默认为当前目录

## SNAPSHOTTING

- `dbfilename dump.rdb`：指定存储数据的文件名

数据保存频率：

- `save 900 1`：900 秒后保存，至少有 1 个 key 被更改时才会触发
- `save 300 10`：300 秒后保存，至少有 10 个 key 被更改时才会触发
- `save 60 10000`：60 秒后保存，至少有 10000 个 key 被更改时才会触发


- `rdbcompression yes`：启用压缩
- `rdbchecksum yes`：启用 CRC64 校验码，当然这个会影响一部份性能
- `stop-writes-on-bgsave-error yes`：最近一次 save 操作失败则停止写操作

## APPEND ONLY MODE

- `appendonly yes` 启用 AOF 模式
- `appendfilename "appendonly.aof"` 设置 AOF 记录的文件名

- `appendfsync everysec`，向磁盘进行数据刷写的频率，有 3 个选项：
    - `always` 有新数据则马上刷写，速度慢但可靠性高
    - `everysec` 每秒钟刷写一次，折衷方法，所谓的 redis 可以只丢失 1 秒钟的数据就是源于此处
    - `no` 按照 OS 自身的刷写策略来进行，速度最快

### Rewrite

- `auto-aof-rewrite-percentage 100 aof` 文件触发自动 rewrite 的百分比，值为 0 则表示禁用自动 rewrite
- `auto-aof-rewrite-min-size 64mb aof` 文件触发自动 rewrite 的最小文件 size

`no-appendfsync-on-rewrite no` 当主进程在进行向磁盘的写操作时，将会阻止其它的 fsync 调用
`aof-load-truncated yes` 是否加载不完整的 aof 文件来进行启动
