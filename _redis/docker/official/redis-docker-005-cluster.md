---
title: "Redis Cluster"
sequence: "105"
---

## Bridge

第 1 步，编写 `redis-cluster.tmpl` 文件：

```text
port ${PORT} 
protected-mode no 
cluster-enabled yes 
cluster-config-file nodes.conf 
cluster-node-timeout 5000 
cluster-announce-ip ${IP}
cluster-announce-port ${PORT} 
cluster-announce-bus-port 1${PORT} 
appendonly yes
```

第 2 步，编写 `needToRun.sh` 文件：

```text
ip=192.168.80.130
for port in {7001..7006}; 
do 
mkdir -p ./${port}/conf && PORT=${port} IP=${ip} envsubst < ./redis-cluster.tmpl > ./${port}/conf/redis.conf; 
done
```

第 3 步，执行脚本：

```text
$ chmod u+x needToRun.sh
$ bash needToRun.sh
```

第 4 步，编写 `compose.yaml` 文件：

```yaml
services:
  redis-node-1:
    container_name: "redis-node-1"
    image: redis:latest
    ports:
      - 7001:7001
      - 17001:17001
    volumes:
      - "./7001/conf/redis.conf:/etc/redis.conf"
    command:
      - sh
      - -c
      - redis-server /etc/redis.conf --daemonize yes &
        echo "yes" |
        redis-cli -h ${IP} -p 7001
        --cluster create ${IP}:7001 ${IP}:7002 ${IP}:7003 ${IP}:7004 ${IP}:7005 ${IP}:7006
        --cluster-replicas 1 & tail -f
    depends_on:
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5
      - redis-node-6

  redis-node-2:
    container_name: "redis-node-2"
    image: redis:latest
    ports:
      - 7002:7002
      - 17002:17002
    volumes:
      - "./7002/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf

  redis-node-3:
    container_name: "redis-node-3"
    image: redis:latest
    ports:
      - 7003:7003
      - 17003:17003
    volumes:
      - "./7003/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf

  redis-node-4:
    container_name: "redis-node-4"
    image: redis:latest
    ports:
      - 7004:7004
      - 17004:17004
    volumes:
      - "./7004/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf

  redis-node-5:
    container_name: "redis-node-5"
    image: redis:latest
    ports:
      - 7005:7005
      - 17005:17005
    volumes:
      - "./7005/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf

  redis-node-6:
    container_name: "redis-node-6"
    image: redis:latest
    ports:
      - 7006:7006
      - 17006:17006
    volumes:
      - "./7006/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf
```

## Macvlan

第 1 步，准备目录：

```text
$ sudo mkdir -p /opt/redis
$ sudo chown $USER: /opt/redis/
```

第 2 步，编写 `redis-cluster.tmpl` 文件：

```text
$ cd /opt/redis/
$ vi redis-cluster.tmpl
```

```text
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode yes
requirepass "str0ng_passw0rd"

# Process
pidfile /var/run/redis_6379.pid

# Replication
masterauth "str0ng_passw0rd"

# Cluster
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-ip ${IP}
cluster-announce-port 6379
cluster-announce-bus-port 16379
```

第 3 步，编写 `needToRun.sh` 文件：

```bash
#!/bin/bash

ips+=("192.168.80.131")
ips+=("192.168.80.132")
ips+=("192.168.80.133")
ips+=("192.168.80.231")
ips+=("192.168.80.232")
ips+=("192.168.80.233")
for ip in "${ips[@]}"
do
    # 使用IFS按照.分隔IP地址
    IFS='.' read -r -a ip_parts <<< "$ip"
    num=("${ip_parts[3]}")
    mkdir -p ./${num}/conf && IP=${ip} envsubst < ./redis-cluster.tmpl > ./${num}/conf/redis.conf; 
done
```

第 3 步，执行脚本：

```text
$ chmod u+x needToRun.sh
$ bash needToRun.sh
```

第 4 步，编写 `compose.yaml` 文件：

```yaml
services:
  redis-node-1:
    container_name: "redis-node-1"
    image: redis:latest
    ports:
      - 6379:6379
      - 16379:16379
    volumes:
      - "./131/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131

  redis-node-2:
    container_name: "redis-node-2"
    image: redis:latest
    ports:
      - 6379:6379
      - 16379:16379
    volumes:
      - "./132/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132

  redis-node-3:
    container_name: "redis-node-3"
    image: redis:latest
    ports:
      - 6379:6379
      - 16379:16379
    volumes:
      - "./133/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133

  redis-node-4:
    container_name: "redis-node-4"
    image: redis:latest
    ports:
      - 6379:6379
      - 16379:16379
    volumes:
      - "./231/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231

  redis-node-5:
    container_name: "redis-node-5"
    image: redis:latest
    ports:
      - 6379:6379
      - 16379:16379
    volumes:
      - "./232/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232

  redis-node-6:
    container_name: "redis-node-6"
    image: redis:latest
    ports:
      - 6379:6379
      - 16379:16379
    volumes:
      - "./233/conf/redis.conf:/etc/redis.conf"
    command: redis-server /etc/redis.conf
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233

networks:
  macvlan80:
    driver: macvlan
    driver_opts:
      parent: ens32
    ipam:
      config:
        - subnet: 192.168.80.0/24
          ip_range: 192.168.80.0/24
          gateway: 192.168.80.2
```

```text
$ docker exec -it redis-node-1 /bin/bash
```

```text
redis-cli -a str0ng_passw0rd \
--cluster create 192.168.80.131:6379 192.168.80.132:6379 192.168.80.133:6379 192.168.80.231:6379 192.168.80.232:6379 192.168.80.233:6379 \
--cluster-replicas 1 \
--cluster-yes
```

```text
redis-cli -c -a str0ng_passw0rd -h 192.168.80.131 -p 6379
```

```text
> CLUSTER INFO
> CLUSTER NODES
```
