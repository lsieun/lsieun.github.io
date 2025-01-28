---
title: "Redis Cluster"
sequence: "101"
---

![](/assets/images/redis/ha/redis-cluster.jpg)

## 端口

- data port: 6379
- cluster port: 16379

[The cluster bus](https://redis.io/docs/reference/cluster-spec/#the-cluster-bus)

```text
Every Redis Cluster node has an additional TCP port
for receiving incoming connections from other Redis Cluster nodes.
This port will be derived by adding 10000 to the data port or
it can be specified with the cluster-port config.
```

## 集群与哨兵的区别

- Sentinel 哨兵
    - 主要目的：为系统提供“高可用”特性，每一个 Redis 节点数据是同步的；
    - 数据存储：每一个 Redis 节点保存的都是全量数据。
- Cluster 集群
    - 主要目的：为系统提供“高可用 + 大存储”特性，是将超大数据集打散到多台 Redis 服务器，可对存储规模进行水平扩容；
    - 数据存储：每一个 Redis 节点存储的都是完整数据的子集。

## Redis 集群模式介绍

- 出现时间：Cluster 模式是 Redis 3.0 开始推出
- 架构设计：采用无中心结构，每个节点保存数据和整个集群状态，每个节点都和其它所有节点连接
    - 通信方式：各个节点会互相通信，采用 gossip 协议交换节点元数据信息
    - 数据存储：数据分散存储到各个节点上
- 部署方式
    - 官方要求：至少 6 个节点才可以保证高可用，即 3 主 3 从；扩展性强、更好做到高可用

## 哈希槽

Redis 集群预分好 16384 个槽(hash slot)。
当需要在 Redis 集群中放置一个 key-value 时，根据 `CRC16(key) mod 16384` 的值，决定将一个 key 放到哪个桶中。

使用哈希槽的好处就在于可以方便的添加或移除节点：

- 当需要增加节点时，只需要把其他节点的某些哈希槽挪到新节点就可以了；
- 当需要移除节点时，只需要把移除节点上的哈希槽挪到其他节点就行了 ;

### 为什么是 16384 个？

在 Redis 节点发送心跳包时需要把所有的槽放到这个心跳包里，以便让节点知道当前集群信息，16384=16k，
在发送心跳包时使用 char 进行 bitmap 压缩后是 2k（`2 * 8 (8 bit) * 1024(1k) = 16K`），
也就是说使用 2k 的空间创建了 16k 的槽数。

虽然使用 CRC16 算法最多可以分配 65535（2^16-1）个槽位，65535=65k，压缩后就是
8k（`8 * 8 (8 bit) * 1024(1k) =65K`），
也就是说需要需要 8k 的心跳包，作者认为这样做不太值得；
并且一般情况下一个 redis 集群不会有超过 1000 个 master 节点，所以 16k 的槽位是个比较合适的选择。

## 实践

### 编译 Redis

```text
cd /opt/redis-stable/src
./redis-cli -a str0ng_passw0rd shutdown
rm -rf /opt/redis-stable
```

```text
sudo yum -y install gcc-c++ autoconf automake wget
wget https://download.redis.io/redis-stable.tar.gz
tar -zxvf redis-stable.tar.gz
cd redis-stable
make
sudo firewall-cmd --zone=public --add-port=6379/tcp --permanent
sudo firewall-cmd --zone=public --add-port=16379/tcp --permanent
sudo firewall-cmd --zone=public --add-port=26379/tcp --permanent
sudo firewall-cmd --reload
echo "Redis Installed Success"
```

注意：在默认情况下，Redis Cluster 使用 6379 和 16379 端口。在 Redis Cluster 中的每个节点使用 16379 进行彼此之间的通信。

### 添加 Redis 节点配置

在 6 台机器上，添加 `redis-cluster.conf` 文件：

```text
bind 0.0.0.0
port 6379
daemonize yes
dir "./"
dbfilename "cluster.rdb"
logfile "./cluster.log"
requirepass "str0ng_passw0rd"
masterauth "str0ng_passw0rd"

# 是否开启集群
cluster-enabled yes
# 生成的 node 文件，记录集群节点信息，默认为 nodes.conf
cluster-config-file nodes.conf
# 节点连接超时时间
cluster-node-timeout 20000
# 集群节点映射端口
cluster-announce-port 6379
# 集群节点总线端口,节点之间互相通信，常规端口 +1 万
cluster-announce-bus-port 16379
```

### 启动多个 Redis 节点

启动 6 个 Redis 实例：

```text
$ ./src/redis-server ./redis-cluster.conf
```

### 用多个 Redis 节点创建集群

在其中一个 Redis 服务器上输入：

```text
./src/redis-cli -a str0ng_passw0rd \
--cluster create 192.168.80.131:6379 192.168.80.132:6379 192.168.80.133:6379 192.168.80.231:6379 192.168.80.232:6379 192.168.80.233:6379 \
--cluster-replicas 1
```

```text
$ ./src/redis-cli -a str0ng_passw0rd \
> --cluster create 192.168.80.131:6379 192.168.80.132:6379 192.168.80.133:6379 192.168.80.231:6379 192.168.80.232:6379 192.168.80.233:6379 \
> --cluster-replicas 1
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
>>> Performing hash slots allocation on 6 nodes...
Master[0] -> Slots 0 - 5460
Master[1] -> Slots 5461 - 10922
Master[2] -> Slots 10923 - 16383
Adding replica 192.168.80.232:6379 to 192.168.80.131:6379
Adding replica 192.168.80.233:6379 to 192.168.80.132:6379
Adding replica 192.168.80.231:6379 to 192.168.80.133:6379
M: a1a2f18942e54f8af53a065685eac2b65b24d485 192.168.80.131:6379
   slots:[0-5460] (5461 slots) master
M: 559b9b40ddbd838c460d22348dcc5ba637b20a9a 192.168.80.132:6379
   slots:[5461-10922] (5462 slots) master
M: 0841f38158554e45d9dad21fbedc7fbd45c905bf 192.168.80.133:6379
   slots:[10923-16383] (5461 slots) master
S: b6f457f36b91ad6c3a9b826cec0de7d85f23d6b8 192.168.80.231:6379
   replicates 0841f38158554e45d9dad21fbedc7fbd45c905bf
S: 32861fd607d28e362c5b0449560ecacd5547aeb4 192.168.80.232:6379
   replicates a1a2f18942e54f8af53a065685eac2b65b24d485
S: f8e79977572682d9f40a41a5691809ebe2bb1268 192.168.80.233:6379
   replicates 559b9b40ddbd838c460d22348dcc5ba637b20a9a
Can I set the above configuration? (type 'yes' to accept): yes
>>> Nodes configuration updated
>>> Assign a different config epoch to each node
>>> Sending CLUSTER MEET messages to join the cluster
Waiting for the cluster to join

>>> Performing Cluster Check (using node 192.168.80.131:6379)
M: a1a2f18942e54f8af53a065685eac2b65b24d485 192.168.80.131:6379
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
S: 32861fd607d28e362c5b0449560ecacd5547aeb4 192.168.80.232:6379
   slots: (0 slots) slave
   replicates a1a2f18942e54f8af53a065685eac2b65b24d485
S: f8e79977572682d9f40a41a5691809ebe2bb1268 192.168.80.233:6379
   slots: (0 slots) slave
   replicates 559b9b40ddbd838c460d22348dcc5ba637b20a9a
M: 559b9b40ddbd838c460d22348dcc5ba637b20a9a 192.168.80.132:6379
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: b6f457f36b91ad6c3a9b826cec0de7d85f23d6b8 192.168.80.231:6379
   slots: (0 slots) slave
   replicates 0841f38158554e45d9dad21fbedc7fbd45c905bf
M: 0841f38158554e45d9dad21fbedc7fbd45c905bf 192.168.80.133:6379
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.    # 这里表示成功，覆盖了 16384 个 slot
```

### 连接 Redis 集群

客户端连接集群需要增加 `-c` 参数：

```text
./src/redis-cli -c -a str0ng_passw0rd
```

```text
127.0.0.1:6379> cluster info
cluster_state:ok                # 集群状态
cluster_slots_assigned:16384    # 一共 16384 个槽
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6           # 一共 6 个节点
cluster_size:3                  # 一共 3 组
cluster_current_epoch:6
cluster_my_epoch:1
cluster_stats_messages_ping_sent:222
cluster_stats_messages_pong_sent:232
cluster_stats_messages_sent:454
cluster_stats_messages_ping_received:227
cluster_stats_messages_pong_received:222
cluster_stats_messages_meet_received:5
cluster_stats_messages_received:454
total_cluster_links_buffer_limit_exceeded:0
```

```text
127.0.0.1:6379> cluster nodes
6d8...09a 192.168.80.133:6379@16379 master - 0 1702278868000 3 connected 10923-16383
af1...678 192.168.80.132:6379@16379 master - 0 1702278869148 2 connected 5461-10922
faa...fd1 192.168.80.131:6379@16379 myself,master - 0 1702278867000 1 connected 0-5460
f14...b17 192.168.80.233:6379@16379 slave af1...678 0 1702278868140 2 connected
526...352 192.168.80.232:6379@16379 slave faa...fd1 0 1702278867000 1 connected
72f...25f 192.168.80.231:6379@16379 slave 6d8...09a 0 1702278866000 3 connected
```

```text
127.0.0.1:6379> set a b
-> Redirected to slot [15495] located at 192.168.80.133:6379
OK
192.168.80.133:6379> set c d
-> Redirected to slot [7365] located at 192.168.80.132:6379
OK
192.168.80.132:6379> set e f
-> Redirected to slot [15363] located at 192.168.80.133:6379
OK
192.168.80.133:6379> get a
"b"
192.168.80.133:6379> get c
-> Redirected to slot [7365] located at 192.168.80.132:6379
"d"
192.168.80.132:6379>
```

## 集群处理过程

任何一个集群节点的 `nodes.conf` 保存了当前集群节点状态：

```text
[devops@server1 redis-stable]$ cat nodes.conf 
6d8...09a 192.168.80.133:6379@16379,,tls-port=0,shard-id=181...6fd master - 0 1702278586215 3 connected 10923-16383
af1...678 192.168.80.132:6379@16379,,tls-port=0,shard-id=742...b33 master - 0 1702278585206 2 connected 5461-10922
faa...fd1 192.168.80.131:6379@16379,,tls-port=0,shard-id=807...96e myself,master - 0 1702278586000 1 connected 0-5460
f14...b17 192.168.80.233:6379@16379,,tls-port=0,shard-id=742...b33 slave af1...678 0 1702278587221 2 connected
526...352 192.168.80.232:6379@16379,,tls-port=0,shard-id=807...96e slave faa...fd1 0 1702278585000 1 connected
72f...25f 192.168.80.231:6379@16379,,tls-port=0,shard-id=181...6fd slave 6d8...09a 0 1702278586000 3 connected
vars currentEpoch 6 lastVoteEpoch 0
```

```text
[devops@server1 redis-stable]$ cat cluster.log 
# WARNING: Changing databases number from 16 to 1 since we are in cluster mode    # 16 个数据库变成 1 个
* oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
* Redis version=7.2.3, bits=64, commit=00000000, modified=0, pid=1549, just started    # Redis 的版本
* Configuration loaded
* Running mode=cluster, port=6379.    # 运行模式：cluster
* No cluster configuration found, I'm faa...fd1
* Server initialized
* Ready to accept connections tcp
# Missing implement of connection type tls
* configEpoch set to 1 via CLUSTER SET-CONFIG-EPOCH
* IP address for this node updated to 192.168.80.131
# Slave1 请求同步
* Replica 192.168.80.232:6379 asks for synchronization
# 拒绝增量同步请求（第一次必须进行全量同步）
* Partial resynchronization not accepted: Replication ID mismatch (Replica asked for '67f...7d3', my replication IDs are '2a9...2a9' and '0000000000000000000000000000000000000000')
# 创建副本重放 backlog
* Replication backlog created, my new replication IDs are 'a95...fbe' and '0000000000000000000000000000000000000000'
* Delay next BGSAVE for diskless SYNC
* Cluster state changed: ok
# Master 执行 BGSAVE，将数据落盘
* Starting BGSAVE for SYNC with target: replicas sockets
# Master 后台开启新进程传输 RDB 文件
* Background RDB transfer started by pid 1561
* Fork CoW for RDB: current 4 MB, peak 4 MB, average 4 MB
* Diskless rdb transfer, done reading from pipe, 1 replicas still up.
* Background RDB transfer terminated with success
* Streamed RDB transfer with replica 192.168.80.232:6379 succeeded (socket). Waiting for REPLCONF ACK from replica to enable streaming
# Master 和 Slave 全量同步完成
* Synchronization with replica 192.168.80.232:6379 succeeded
```

在 Slave 服务器上查看：

```text
[devops@server232 redis-stable]$ cat cluster.log 
# WARNING: Changing databases number from 16 to 1 since we are in cluster mode
* oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
* Redis version=7.2.3, bits=64, commit=00000000, modified=0, pid=16355, just started
* Configuration loaded
* Running mode=cluster, port=6379.
* No cluster configuration found, I'm 526...352
* Server initialized
* Ready to accept connections tcp
# Missing implement of connection type tls
* configEpoch set to 5 via CLUSTER SET-CONFIG-EPOCH
* IP address for this node updated to 192.168.80.232
* Before turning into a replica, using my own master parameters to synthesize a cached master:
 I may be able to synchronize with the new master with just a partial transfer.
# 连接到 Master
* Connecting to MASTER 192.168.80.131:6379
# 开启主从同步
* MASTER <-> REPLICA sync started
* Cluster state changed: ok
# 主从同步采用非阻塞连接
* Non blocking connect for SYNC fired the event.
# Slave 向 Master 发送 Ping 得到响应，可以进行同步
* Master replied to PING, replication can continue...
# 尝试进行增量同步，Master 服务器拒绝
* Trying a partial resynchronization (request 67f1b2854c4250f9e3e969808f5eccaff21b57d3:1).
# 向 Master 申请进行全量同步
* Full resync from master: a95f32bdb7354e38b0824bdc6873e6e5d13e7fbe:14
# 接收到 Master 服务器的字节数据
* MASTER <-> REPLICA sync: receiving streamed RDB from master with EOF to disk
# 删除 Slave 旧数据
* Discarding previously cached master state.
* MASTER <-> REPLICA sync: Flushing old data
# 加载 RDB 数据到内存
* MASTER <-> REPLICA sync: Loading DB in memory
* Loading RDB produced by version 7.2.3
# 统计信息
* RDB age 0 seconds
* RDB memory usage when created 1.48 Mb
* Done loading RDB, keys loaded: 0, keys expired: 0.
# 完成 Master 和 Slave 同步
* MASTER <-> REPLICA sync: Finished with success
```

## Reference

- [Redis cluster specification](https://redis.io/docs/reference/cluster-spec/)
