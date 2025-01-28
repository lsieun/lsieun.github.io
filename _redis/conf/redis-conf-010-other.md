---
title: "其它"
sequence: "110"
---

## SECURITY

requirepass foobared 有 slave 端连接时是否需要密码验证



## LUA SCRIPTING

lua-time-limit 5000 设置 lua 脚本的最大运行时间，单位为毫秒

## EVENT NOTIFICATION

notify-keyspace-events “” 事件通知，默认不启用，具体参数查看配置文件

## SLOW LOG

redis 的 slow log 是一个系统 OS 进行的记录查询，它是超过了指定的执行时间的。执行时间不包括类似与 client 进行交互或发送回复等 I/O 操作，它只是实际执行指令的时间。
有 2 个参数可以配置，一个用来告诉 redis 执行时间，这个时间是微秒级的（1 秒 =1000000 微秒），这是为了不遗漏命令。另一个参数是设置 slowlog 的长度，当一个新的命令被记录时，最旧的命令将会从命令记录队列中移除。
slowlog-log-slower-than 10000
slowlog-max-len 128
可以使用“slowlog reset”命令来释放 slowlog 占用的内存。

## LATENCY MONITOR
latency-monitor-threshold 0 延迟监控，用于记录等于或超过了指定时间的操作，默认是关闭状态，即值为 0。

## ADVANCED CONFIG
当条目数量较少且最大不会超过给定阀值时，哈希编码将使用一个很高效的内存数据结构，阀值由以下参数来进行配置。
hash-max-ziplist-entries 512
hash-max-ziplist-value 64

与哈希类似，少量的 lists 也会通过一个指定的方式去编码从而节省更多的空间，它的阀值通过以下参数来进行配置。
list-max-ziplist-entries 512
list-max-ziplist-value 64

集合 sets 在一种特殊的情况时有指定的编码方式，这种情况是集合由一组 10 进制的 64 位有符号整数范围内的数字组成的情况。以下选项可以设置集合使用这种特殊编码方式的 size 限制。
set-max-intset-entries 512

与哈希和列表类似，有序集合也会使用一种特殊的编码方式来节省空间，这种特殊的编码方式只用于这个有序集合的长度和元素均低于以下参数设置的值时。
zset-max-ziplist-entries 128
zset-max-ziplist-value 64

hll-sparse-max-bytes 3000 设置 HyeperLogLog 的字节数限制，这个值通常在 0~15000 之间，默认为 3000，基本不超过 16000
activerehashing yes redis 将会在每秒中抽出 10 毫秒来对主字典进行重新散列化处理，这有助于尽可能的释放内存

因为某些原因，client 不能足够快的从 server 读取数据，那 client 的输出缓存限制可能会使 client 失连，这个限制可用于 3 种不同的 client 种类，分别是：normal、slave 和 pubsub。
进行设置的格式如下：

```text
client-output-buffer-limit <class><hard limit><soft limit><soft seconds>
```

如果达到 hard limit 那 client 将会立即失连。
如果达到 soft limit 那 client 将会在 soft seconds 秒之后失连。
参数 soft limit < hard limit。
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit slave 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60

redis 使用一个内部程序来处理后台任务，例如关闭超时的 client 连接，清除过期的 key 等等。它并不会同时处理所有的任务，redis 通过指定的 hz 参数去检查和执行任务。
hz 默认设为 10，提高它的值将会占用更多的 cpu，当然相应的 redis 将会更快的处理同时到期的许多 key，以及更精确的去处理超时。
hz 的取值范围是 1~500，通常不建议超过 100，只有在请求延时非常低的情况下可以将值提升到 100。
hz 10

当一个子进程要改写 AOF 文件，如果以下选项启用，那文件将会在每产生 32MB 数据时进行同步，这样提交增量文件到磁盘时可以避免出现比较大的延迟。
aof-rewrite-incremental-fsync yes

