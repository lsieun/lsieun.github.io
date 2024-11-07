---
title: "主从部署"
sequence: "101"
---

## M1S1

| Role   | IP               |
|--------|------------------|
| Master | `192.168.80.131` |
| Slave  | `192.168.80.132` |

### 无密码

```text
sudo mkdir -p /opt/redis/data
sudo chmod 777 /opt/redis/data
```

#### Master

第 1 步，Master 上的 `redis.conf` 文件：

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode no

# Process
daemonize no
pidfile /var/run/redis_6379.pid

# Persistence
dir /opt/redis/data/

# Replication
repl-diskless-sync no
```

#### Slave

第 2 步，Slave 上的 `redis.conf` 文件：

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode no

# Process
daemonize no
pidfile /var/run/redis_6379.pid

# Persistence
dir /opt/redis/data/

# Replication
replicaof 192.168.80.131 6379
replica-read-only yes
```

### 有密码

```text
sudo mkdir -p /opt/redis/data
sudo chmod 777 /opt/redis/data
```

#### Master

第 1 步，Master 上的 `redis.conf` 文件：

```text
# Network
port 6379
bind 0.0.0.0

# Security
# A. 开启保护模式
protected-mode yes
# A. 密码           
requirepass str0ng_passw0rd

# Process
daemonize no
pidfile /var/run/redis_6379.pid

# Persistence
dir /opt/redis/data/

# Replication
repl-diskless-sync no
```

#### Slave

第 2 步，Slave 上的 `redis.conf` 文件：

```text
# Network
port 6379
bind 0.0.0.0

# Security
# A. 开启保护模式
protected-mode yes
# A. 密码
requirepass str0ng_passw0rd

# Process
daemonize no
pidfile /var/run/redis_6379.pid

# Persistence
dir /opt/redis/data/

# Replication
replicaof 192.168.80.131 6379
replica-read-only yes
# B. 从 Master 进行复制的密码
masterauth str0ng_passw0rd
```

## M1S2

![](/assets/images/redis/ha/redis-ha.png)

| Role   | IP               |
|--------|------------------|
| Master | `192.168.80.131` |
| Slave1 | `192.168.80.132` |
| Slave2 | `192.168.80.133` |

### 准备

```text
sudo mkdir -p /opt/redis/data
sudo chmod 777 /opt/redis/data
```

### Master

第 1 步，编辑 `redis.conf` 文件：

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode yes
requirepass "str0ng_passw0rd"

# Process
daemonize yes
pidfile /var/run/redis_6379.pid

# Persistence
dir /opt/redis/data/
dbfilename "master.rdb"
appendonly yes
appendfilename "master.aof"

# Log
logfile /opt/redis/data/master.log

# Replication
repl-diskless-sync no
```

其中，`masterauth` 是指 Slave 连接到 Master 时认证使用的密码

第 2 步，启动 Redis 服务器：

```text
$ redis-server ./redis.conf
```

第 3 步，查看日志：

```text
$ tail -n 50 -f master.log
```

### Slave1

第 1 步，编辑 `redis.conf` 文件：

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode yes
requirepass str0ng_passw0rd

# Process
daemonize yes
pidfile /var/run/redis_6379.pid

# Persistence
dir /opt/redis/data/
dbfilename "slave1.rdb"
appendonly yes
appendfilename "slave1.aof"

# Log
logfile /opt/redis/data/slave1.log

# Replication
replicaof 192.168.80.131 6379
replica-read-only yes
masterauth str0ng_passw0rd
```

其中，

- `replicaof 192.168.80.131 6379`：设置 Master 的 IP 和 Port
- `masterauth "str0ng_passw0rd"`：与 Master 进行通信时的密码
- `replica-read-only yes`：Slave 节点是“只能读，不能写”

第 2 步，启动 Redis 服务器：

```text
$ redis-server ./redis.conf
```

第 3 步，查看日志：

```text
$ tail -n 50 -f slave1.log
```

### Slave2

第 1 步，编辑 `redis.conf` 文件：

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode yes
requirepass str0ng_passw0rd

# Process
daemonize yes
pidfile /var/run/redis_6379.pid

# Persistence
dir /opt/redis/data/
dbfilename "slave2.rdb"
appendonly yes
appendfilename "slave2.aof"

# Log
logfile /opt/redis/data/slave2.log

# Replication
replicaof 192.168.80.131 6379
replica-read-only yes
masterauth str0ng_passw0rd
```

第 2 步，启动 Redis 服务器：

```text
$ redis-server ./redis.conf
```

第 3 步，查看日志：

```text
$ tail -n 50 -f slave2.log
```

### 测试

```text
redis-cli -a str0ng_passw0rd --no-auth-warning -p 6379 -h 192.168.80.131
redis-cli -a str0ng_passw0rd --no-auth-warning -p 6379 -h 192.168.80.132
redis-cli -a str0ng_passw0rd --no-auth-warning -p 6379 -h 192.168.80.133
```

在 Master 服务器上，输入 `INFO REPLICATION` 查看信息：

```text
> INFO REPLICATION
# Replication
role:master           # 当前的服务器是 Master
connected_slaves:2    # 当前有两个 Slave 服务器
slave0:ip=192.168.80.132,port=6379,state=online,offset=98,lag=1
slave1:ip=192.168.80.133,port=6379,state=online,offset=98,lag=0
master_failover_state:no-failover
master_replid:9600a18763f5e2b92d49a77429716634e7a79617
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:98
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:98
```

在 Slave 服务器上，输入 `INFO REPLICATION` 查看信息：

```text
> INFO REPLICATION
# Replication
role:slave                    # 当前服务器为 Slave
master_host:192.168.80.131    # Master 的 IP 地址
master_port:6379              # Master 的端口
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_read_repl_offset:406
slave_repl_offset:406
slave_priority:100
slave_read_only:1
replica_announced:1
connected_slaves:0
master_failover_state:no-failover
master_replid:9600a18763f5e2b92d49a77429716634e7a79617
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:406
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:406
```


