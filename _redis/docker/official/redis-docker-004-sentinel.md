---
title: "Redis Sentinel"
sequence: "104"
---

## Sentinel

### 环境准备

第 1 步，创建目录：

```text
$ sudo mkdir -p /opt/redis/conf/sentinel/{01,02,03}/
```

第 2 步，添加三个配置文件：

```text
sudo vi /opt/redis/conf/sentinel/01/sentinel.conf
sudo vi /opt/redis/conf/sentinel/02/sentinel.conf
sudo vi /opt/redis/conf/sentinel/03/sentinel.conf
```

三者内容相同：

```text
port 26379
sentinel monitor mymaster 192.168.80.130 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
```

第 3 步，更新权限：

```text
$ sudo chmod -R a+rwx /opt/redis/conf/sentinel/
```

### 运行

第 1 步，编写 `compose.yaml` 文件：

```yaml
services:
  redis-master:
    container_name: "redis-master"
    hostname: redis-master
    image: redis:latest
    command: redis-server
    ports:
      - "6379:6379"

  redis-slave-1:
    container_name: "redis-slave-1"
    image: redis:latest
    ports:
      - "6380:6379"
    command: redis-server --slaveof redis-master 6379
    depends_on:
      - redis-master

  redis-slave-2:
    container_name: "redis-slave-2"
    image: redis:latest
    ports:
      - "6381:6379"
    command: redis-server --slaveof redis-master 6379
    depends_on:
      - redis-master

  redis-sentinel-1:
    container_name: "redis-sentinel-1"
    image: redis:latest
    ports:
      - "26379:26379"
    command: redis-server /opt/redis/conf/sentinel.conf --sentinel
    volumes:
      - "/opt/redis/conf/sentinel/01:/opt/redis/conf"
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2

  redis-sentinel-2:
    container_name: "redis-sentinel-2"
    image: redis:latest
    ports:
      - "26380:26379"
    command: redis-server /opt/redis/conf/sentinel.conf --sentinel
    volumes:
      - "/opt/redis/conf/sentinel/02:/opt/redis/conf"
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2

  redis-sentinel-3:
    container_name: "redis-sentinel-3"
    image: redis:latest
    ports:
      - "26381:26379"
    command: redis-server /opt/redis/conf/sentinel.conf --sentinel
    volumes:
      - "/opt/redis/conf/sentinel/03:/opt/redis/conf"
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2
```

第 2 步，运行：

```text
docker compose up
```



