---
title: "Sentinel"
sequence: "104"
---

## 环境准备

### M1S0S1

- Master: 1
- Slave: 0
- Sentinel: 1

使用两条命令：

```text
$ docker run --name redis --rm -e REDIS_PASSWORD=str0ng_passw0rd -p 6379:6379 bitnami/redis:latest
$ docker run --name redis-sentinel --rm -e REDIS_MASTER_HOST=localhost -p 26379:26379 bitnami/redis-sentinel:latest
```

使用一条命令：

```text
(docker rm redis --force || true) && \
(docker rm redis-sentinel --force || true) && \
docker run --name redis --rm -e REDIS_PASSWORD=str0ng_passw0rd -p 6379:6379 -d bitnami/redis:latest && \
docker run --name redis-sentinel --rm -e REDIS_MASTER_HOST=localhost -p 26379:26379 bitnami/redis-sentinel:latest
```

### M1S1S3

```yaml
services:
  redis-master:
    container_name: redis-master
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=master
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - "6379:6379"
  redis-slave:
    container_name: redis-slave
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - "6380:6379"
    depends_on:
      - redis-master
  redis-sentinel-1:
    image: 'bitnami/redis-sentinel:latest'
    container_name: sentinel-1
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    depends_on:
      - redis-master
      - redis-slave
    ports:
      - "26379:26379"
  redis-sentinel-2:
    image: 'bitnami/redis-sentinel:latest'
    container_name: sentinel-2
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    depends_on:
      - redis-master
      - redis-slave
      - redis-sentinel-1
    ports:
      - "26380:26379"
  redis-sentinel-3:
    image: 'bitnami/redis-sentinel:latest'
    container_name: sentinel-3
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    depends_on:
      - redis-master
      - redis-slave
      - redis-sentinel-1
      - redis-sentinel-2
    ports:
      - "26381:26379"
```

### M1S2S3

```yaml
services:
  redis-master:
    container_name: redis-master
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=master
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - "6379:6379"
  redis-slave-1:
    container_name: redis-slave-1
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - "6380:6379"
    depends_on:
      - redis-master
  redis-slave-2:
    container_name: redis-slave-2
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - "6381:6379"
    depends_on:
      - redis-master
      - redis-slave-1
  redis-sentinel-1:
    image: 'bitnami/redis-sentinel:latest'
    container_name: sentinel-1
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2
    ports:
      - "26379:26379"
  redis-sentinel-2:
    image: 'bitnami/redis-sentinel:latest'
    container_name: sentinel-2
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2
      - redis-sentinel-1
    ports:
      - "26380:26379"
  redis-sentinel-3:
    image: 'bitnami/redis-sentinel:latest'
    container_name: sentinel-3
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2
      - redis-sentinel-1
      - redis-sentinel-2
    ports:
      - "26381:26379"
```

### M1S2S3-MacVlan

```yaml
services:
  redis-master:
    container_name: redis-master
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=master
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - "6379:6379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131
  redis-slave-1:
    container_name: redis-slave-1
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=192.168.80.131
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - "6379:6379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132
    depends_on:
      - redis-master
  redis-slave-2:
    container_name: redis-slave-2
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=192.168.80.131
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - "6379:6379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133
    depends_on:
      - redis-master
      - redis-slave-1
  redis-sentinel-1:
    image: 'bitnami/redis-sentinel:latest'
    container_name: redis-sentinel-1
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=192.168.80.131
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    ports:
      - "26379:26379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2
  redis-sentinel-2:
    image: 'bitnami/redis-sentinel:latest'
    container_name: redis-sentinel-2
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=192.168.80.131
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    ports:
      - "26379:26379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2
      - redis-sentinel-1
  redis-sentinel-3:
    image: 'bitnami/redis-sentinel:latest'
    container_name: redis-sentinel-3
    environment:
      - REDIS_MASTER_SET=mymaster
      - REDIS_MASTER_HOST=192.168.80.131
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=10000
    ports:
      - "26379:26379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233
    depends_on:
      - redis-master
      - redis-slave-1
      - redis-slave-2
      - redis-sentinel-1
      - redis-sentinel-2
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

## 连接

连接 Sentinel：

```text
$ redis-cli -h 192.168.80.130 -p 26379
> INFO SENTINEL
```

连接 Master：

```text
$ redis-cli -h 192.168.80.130 -p 6379 -a str0ng_passw0rd
> INFO REPLICATION
```

