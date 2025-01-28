---
title: "Redis 集群扩容缩容"
sequence: "102"
---

## 连接集群

第 1 步，查看每个集群节点的 Node ID 和身份：

```text
./src/redis-cli -a str0ng_passw0rd -c
```

查看节点 ID：

```text
> cluster nodes
```

## 扩容

### 添加 Master 节点

新配置一个 `192.168.80.134` 新节点作为 Master 节点。
这里是将节点加入了集群中，但是，并没有分配 slot，所以这个节点并没有真正的开始分担集群工作。

```text
./src/redis-cli --cluster add-node 192.168.80.134:6379 192.168.80.131:6379 -a str0ng_passw0rd
```

```text
$ ./src/redis-cli --cluster add-node 192.168.80.134:6379 192.168.80.131:6379 -a str0ng_passw0rd
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
>>> Adding node 192.168.80.134:6379 to cluster 192.168.80.131:6379
>>> Performing Cluster Check (using node 192.168.80.131:6379)
M: bcbe492f34051c1ee2ebf2d537759e1a6980e42c 192.168.80.131:6379
   slots:[0-5460] (5461 slots) master
   1 additional replica(s)
M: aed3cad687abfaf7a58ed5674e3c9812d7113fe7 192.168.80.132:6379
   slots:[5461-10922] (5462 slots) master
   1 additional replica(s)
S: 4beae4333d1dc10eda208e2b9df6a620785a8a1f 192.168.80.233:6379
   slots: (0 slots) slave
   replicates aed3cad687abfaf7a58ed5674e3c9812d7113fe7
S: d949d0e6210baf51a12f3eb38f7be8aae1694925 192.168.80.232:6379
   slots: (0 slots) slave
   replicates bcbe492f34051c1ee2ebf2d537759e1a6980e42c
S: 5105f5add9e10e6d3d1fc90fc5b2732d4cbd1578 192.168.80.231:6379
   slots: (0 slots) slave
   replicates a6c61eaffb33e803595c9f6fa2f936aa01fde7ff
M: a6c61eaffb33e803595c9f6fa2f936aa01fde7ff 192.168.80.133:6379
   slots:[10923-16383] (5461 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
>>> Getting functions from cluster
>>> Send FUNCTION LIST to 192.168.80.134:6379 to verify there is no functions in it
>>> Send FUNCTION RESTORE to 192.168.80.134:6379
>>> Send CLUSTER MEET to node 192.168.80.134:6379 to make it join the cluster.
[OK] New node added correctly.
```

```text
> cluster nodes
```

```text
127.0.0.1:6379> cluster nodes
bcb...42c 192.168.80.131:6379@16379 myself,master - 0 1702342264000 1 connected 0-5460
aed...fe7 192.168.80.132:6379@16379 master - 0 1702342263000 2 connected 5461-10922
a6c...7ff 192.168.80.133:6379@16379 master - 0 1702342264866 3 connected 10923-16383
8d4...a59 192.168.80.134:6379@16379 master - 0 1702342265873 0 connected
510...578 192.168.80.231:6379@16379 slave a6c...7ff 0 1702342262000 3 connected
d94...925 192.168.80.232:6379@16379 slave bcb...42c 0 1702342263861 1 connected
4be...a1f 192.168.80.233:6379@16379 slave aed...fe7 0 1702342265000 2 connected
```

### 分配 slot 给 Master

```text
./src/redis-cli -a str0ng_passw0rd --cluster reshard 192.168.80.134:6379 --cluster-from sha1,sha2,sha3 --cluster-to sha4 --cluster-slots 1024
```

- `--cluster-from`：表示 slot 目前所在的节点的 node ID，多个 ID 用逗号分隔
- `--cluster-to`：表示需要新分配节点的 node ID（貌似每次只能分配一个）
- `--cluster-slots`：分配的 slot 数量

```text
./src/redis-cli -a str0ng_passw0rd --cluster reshard 192.168.80.134:6379 \
--cluster-from bcbe492f34051c1ee2ebf2d537759e1a6980e42c,aed3cad687abfaf7a58ed5674e3c9812d7113fe7,a6c61eaffb33e803595c9f6fa2f936aa01fde7ff \
--cluster-to 8d46928a0a5b0df98ffc799cf2f70b15f32dea59 \
--cluster-slots 1024
```

```text
./src/redis-cli -a str0ng_passw0rd -c
```

```text
> cluster nodes
```

```text
127.0.0.1:6379> cluster nodes
bcb...42c 192.168.80.131:6379@16379 myself,master - 0 1702345439000 1 connected 341-5460
aed...fe7 192.168.80.132:6379@16379 master - 0 1702345441000 2 connected 5803-10922
a6c...7ff 192.168.80.133:6379@16379 master - 0 1702345440000 3 connected 11264-16383
8d4...a59 192.168.80.134:6379@16379 master - 0 1702345441130 7 connected 0-340 5461-5802 10923-11263
510...578 192.168.80.231:6379@16379 slave a6c...7ff 0 1702345438000 3 connected
d94...925 192.168.80.232:6379@16379 slave bcb...42c 0 1702345442140 1 connected
4be...a1f 192.168.80.233:6379@16379 slave aed...fe7 0 1702345440000 2 connected
```

### 添加 Slave 节点

```text
./src/redis-cli --cluster add-node 192.168.80.234:6379 192.168.80.134:6379 \
--cluster-slave --cluster-master-id sha_of_master_id -a str0ng_passw0rd
```

- `add-node`: 后面的分别跟着新加入的 slave 和 slave 对应的 master
- `cluster-slave`：表示加入的是 slave 节点
- `--cluster-master-id`：表示 slave 对应的 master 的 node ID

```text
./src/redis-cli --cluster add-node 192.168.80.234:6379 192.168.80.134:6379 \
--cluster-slave --cluster-master-id 8d46928a0a5b0df98ffc799cf2f70b15f32dea59 -a str0ng_passw0rd
```

```text
$ ./src/redis-cli --cluster add-node 192.168.80.234:6379 192.168.80.134:6379 \
> --cluster-slave --cluster-master-id 8d46928a0a5b0df98ffc799cf2f70b15f32dea59 -a str0ng_passw0rd
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
>>> Adding node 192.168.80.234:6379 to cluster 192.168.80.134:6379
>>> Performing Cluster Check (using node 192.168.80.134:6379)
M: 8d46928a0a5b0df98ffc799cf2f70b15f32dea59 192.168.80.134:6379
   slots:[0-340],[5461-5802],[10923-11263] (1024 slots) master
M: bcbe492f34051c1ee2ebf2d537759e1a6980e42c 192.168.80.131:6379
   slots:[341-5460] (5120 slots) master
   1 additional replica(s)
M: a6c61eaffb33e803595c9f6fa2f936aa01fde7ff 192.168.80.133:6379
   slots:[11264-16383] (5120 slots) master
   1 additional replica(s)
S: 5105f5add9e10e6d3d1fc90fc5b2732d4cbd1578 192.168.80.231:6379
   slots: (0 slots) slave
   replicates a6c61eaffb33e803595c9f6fa2f936aa01fde7ff
M: aed3cad687abfaf7a58ed5674e3c9812d7113fe7 192.168.80.132:6379
   slots:[5803-10922] (5120 slots) master
   1 additional replica(s)
S: 4beae4333d1dc10eda208e2b9df6a620785a8a1f 192.168.80.233:6379
   slots: (0 slots) slave
   replicates aed3cad687abfaf7a58ed5674e3c9812d7113fe7
S: d949d0e6210baf51a12f3eb38f7be8aae1694925 192.168.80.232:6379
   slots: (0 slots) slave
   replicates bcbe492f34051c1ee2ebf2d537759e1a6980e42c
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
>>> Send CLUSTER MEET to node 192.168.80.234:6379 to make it join the cluster.
Waiting for the cluster to join

>>> Configure node as replica of 192.168.80.134:6379.
[OK] New node added correctly.
```

```text
./src/redis-cli -a str0ng_passw0rd -c
```

```text
> cluster nodes
```

```text
127.0.0.1:6379> cluster nodes
bcb...42c 192.168.80.131:6379@16379 myself,master - 0 1702345767000 1 connected 341-5460
aed...fe7 192.168.80.132:6379@16379 master - 0 1702345771328 2 connected 5803-10922
a6c...7ff 192.168.80.133:6379@16379 master - 0 1702345769316 3 connected 11264-16383
8d4...a59 192.168.80.134:6379@16379 master - 0 1702345769000 7 connected 0-340 5461-5802 10923-11263
510...578 192.168.80.231:6379@16379 slave a6c...7ff 0 1702345768312 3 connected
d94...925 192.168.80.232:6379@16379 slave bcb...42c 0 1702345769000 1 connected
4be...a1f 192.168.80.233:6379@16379 slave aed...fe7 0 1702345767000 2 connected
dd7...3d6 192.168.80.234:6379@16379 slave 8d4...a59 0 1702345771000 7 connected
```

```text
./src/redis-cli --cluster check 192.168.80.131:6379 -a str0ng_passw0rd
```

```text
$ ./src/redis-cli --cluster check 192.168.80.131:6379 -a str0ng_passw0rd
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
192.168.80.131:6379 (bcbe492f...) -> 2 keys | 5120 slots | 1 slaves.
192.168.80.132:6379 (aed3cad6...) -> 1 keys | 5120 slots | 1 slaves.
192.168.80.134:6379 (8d46928a...) -> 0 keys | 1024 slots | 1 slaves.
192.168.80.133:6379 (a6c61eaf...) -> 3 keys | 5120 slots | 1 slaves.
[OK] 6 keys in 4 masters.
0.00 keys per slot on average.
>>> Performing Cluster Check (using node 192.168.80.131:6379)
M: bcbe492f34051c1ee2ebf2d537759e1a6980e42c 192.168.80.131:6379
   slots:[341-5460] (5120 slots) master
   1 additional replica(s)
M: aed3cad687abfaf7a58ed5674e3c9812d7113fe7 192.168.80.132:6379
   slots:[5803-10922] (5120 slots) master
   1 additional replica(s)
M: 8d46928a0a5b0df98ffc799cf2f70b15f32dea59 192.168.80.134:6379
   slots:[0-340],[5461-5802],[10923-11263] (1024 slots) master
   1 additional replica(s)
S: dd70244fd8349513fc0fb80f87a708225c9463d6 192.168.80.234:6379
   slots: (0 slots) slave
   replicates 8d46928a0a5b0df98ffc799cf2f70b15f32dea59
S: 4beae4333d1dc10eda208e2b9df6a620785a8a1f 192.168.80.233:6379
   slots: (0 slots) slave
   replicates aed3cad687abfaf7a58ed5674e3c9812d7113fe7
S: d949d0e6210baf51a12f3eb38f7be8aae1694925 192.168.80.232:6379
   slots: (0 slots) slave
   replicates bcbe492f34051c1ee2ebf2d537759e1a6980e42c
S: 5105f5add9e10e6d3d1fc90fc5b2732d4cbd1578 192.168.80.231:6379
   slots: (0 slots) slave
   replicates a6c61eaffb33e803595c9f6fa2f936aa01fde7ff
M: a6c61eaffb33e803595c9f6fa2f936aa01fde7ff 192.168.80.133:6379
   slots:[11264-16383] (5120 slots) master
   1 additional replica(s)
[OK] All nodes agree about slots configuration.
>>> Check for open slots...
>>> Check slots coverage...
[OK] All 16384 slots covered.
```

## 收缩集群

### 删除 Slave

第 1 步，删除 Master 对应的 Slave：

```text
./src/redis-cli -a str0ng_passw0rd --cluster del-node 192.168.80.234:6379 dd70244fd8349513fc0fb80f87a708225c9463d6
```

- `del-node` 后面跟着 Slave 节点的 ip:port 和 node ID

```text
$ ./src/redis-cli -a str0ng_passw0rd --cluster del-node 192.168.80.234:6379 dd70244fd8349513fc0fb80f87a708225c9463d6
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
>>> Removing node dd70244fd8349513fc0fb80f87a708225c9463d6 from cluster 192.168.80.234:6379
>>> Sending CLUSTER FORGET messages to the cluster...
>>> Sending CLUSTER RESET SOFT to the deleted node.
```

第 2 步，查看 `nodes.conf` 文件，`192.168.80.234` 消失：

```text
[devops@server1 redis-stable]$ cat nodes.conf
bcb...42c 192.168.80.131:6379@16379,,tls-port=0,shard-id=a3b...a6b myself,master - 0 1702346145000 1 connected 341-5460
aed...fe7 192.168.80.132:6379@16379,,tls-port=0,shard-id=dc3...8cb master - 0 1702346147000 2 connected 5803-10922
a6c...7ff 192.168.80.133:6379@16379,,tls-port=0,shard-id=e0c...472 master - 0 1702346143000 3 connected 11264-16383
8d4...a59 192.168.80.134:6379@16379,,tls-port=0,shard-id=435...9c4 master - 0 1702346144887 7 connected 0-340 5461-5802 10923-11263
510...578 192.168.80.231:6379@16379,,tls-port=0,shard-id=e0c...472 slave a6c...7ff 0 1702346146904 3 connected
d94...925 192.168.80.232:6379@16379,,tls-port=0,shard-id=a3b...a6b slave bcb...42c 0 1702346147911 1 connected
4be...a1f 192.168.80.233:6379@16379,,tls-port=0,shard-id=dc3...8cb slave aed...fe7 0 1702346146000 2 connected
vars currentEpoch 7 lastVoteEpoch 0
```

### 重新分配 Slot

第 1 步，将 `192.168.80.134` 的 Slot 分配到 `192.168.80.131` 节点上：

```text
./src/redis-cli -a str0ng_passw0rd --cluster reshard 192.168.80.134:6379 \
--cluster-from 8d46928a0a5b0df98ffc799cf2f70b15f32dea59 \
--cluster-to bcbe492f34051c1ee2ebf2d537759e1a6980e42c \
--cluster-slots 1024
```

第 2 步，查看 `nodes.conf` 文件，`192.168.80.134` 还在，但是 slot 没有了：

```text
$ cat nodes.conf 
bcb...42c 192.168.80.131:6379@16379,,tls-port=0,shard-id=a3b...a6b myself,master - 0 1702346502000 8 connected 0-5802 10923-11263
aed...fe7 192.168.80.132:6379@16379,,tls-port=0,shard-id=dc3...8cb master - 0 1702346505000 2 connected 5803-10922
a6c...7ff 192.168.80.133:6379@16379,,tls-port=0,shard-id=e0c...472 master - 0 1702346503508 3 connected 11264-16383
8d4...a59 192.168.80.134:6379@16379,,tls-port=0,shard-id=a3b...a6b slave bcb...42c 0 1702346503000 8 connected
510...578 192.168.80.231:6379@16379,,tls-port=0,shard-id=e0c...472 slave a6c...7ff 0 1702346504000 3 connected
d94...925 192.168.80.232:6379@16379,,tls-port=0,shard-id=a3b...a6b slave bcb...42c 0 1702346505522 8 connected
4be...a1f 192.168.80.233:6379@16379,,tls-port=0,shard-id=dc3...8cb slave aed...fe7 0 1702346503000 2 connected
vars currentEpoch 8 lastVoteEpoch 0
```

### 删除 Master

第 1 步，删除 Master 节点：

```text
./src/redis-cli -a str0ng_passw0rd --cluster del-node 192.168.80.134:6379 8d46928a0a5b0df98ffc799cf2f70b15f32dea59
```

```text
$ ./src/redis-cli -a str0ng_passw0rd --cluster del-node 192.168.80.134:6379 8d46928a0a5b0df98ffc799cf2f70b15f32dea59
>>> Removing node 8d46928a0a5b0df98ffc799cf2f70b15f32dea59 from cluster 192.168.80.134:6379
>>> Sending CLUSTER FORGET messages to the cluster...
>>> Sending CLUSTER RESET SOFT to the deleted node.
```

第 2 步，查看 `nodes.conf` 文件，`192.168.80.134` 消失：

```text
$ cat nodes.conf 
bcb...42c 192.168.80.131:6379@16379,,tls-port=0,shard-id=a3b...a6b myself,master - 0 1702346674000 8 connected 0-5802 10923-11263
aed...fe7 192.168.80.132:6379@16379,,tls-port=0,shard-id=dc3...8cb master - 0 1702346674827 2 connected 5803-10922
a6c...7ff 192.168.80.133:6379@16379,,tls-port=0,shard-id=e0c...472 master - 0 1702346674000 3 connected 11264-16383
510...578 192.168.80.231:6379@16379,,tls-port=0,shard-id=e0c...472 slave a6c...7ff 0 1702346674000 3 connected
d94...925 192.168.80.232:6379@16379,,tls-port=0,shard-id=a3b...a6b slave bcb...42c 0 1702346675836 8 connected
4be...a1f 192.168.80.233:6379@16379,,tls-port=0,shard-id=dc3...8cb slave aed...fe7 0 1702346674000 2 connected
vars currentEpoch 8 lastVoteEpoch 0
```
