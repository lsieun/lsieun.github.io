---
title: "Redis Standalone"
sequence: "102"
---

## 命令行

```text
$ docker run --name some-redis -p 6379:6379 redis:7.2.3
$ docker run --name some-redis -p 6379:6379 -d redis:7.2.3
```

## Docker Compose

### Simple

File: `compose.yaml`

```yaml
services:
  redis-server:
    container_name: "redis-server"
    image: redis:latest
    ports:
      - "6379:6379"
```

### 配置文件

File: `redis.conf`

```yaml
# Network
port 6379
bind 0.0.0.0

# Security
protected-mode yes
requirepass "str0ng_passw0rd"
```

File: `compose.yaml`

```yaml
services:
  redis-server:
    container_name: "redis-server"
    image: redis:latest
    ports:
      - "6379:6379"
    volumes:
      - /opt/redis/conf/redis.conf:/etc/redis.conf
    command: redis-server /etc/redis.conf
```

