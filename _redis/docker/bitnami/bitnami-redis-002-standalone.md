---
title: "Standalone"
sequence: "102"
---

## 快速开始

第 1 步，创建网络：

```text
$ docker network create app-tier --driver bridge
```

```text
$ docker network ls
NETWORK ID     NAME       DRIVER    SCOPE
1605e4327238   app-tier   bridge    local
8412f57ef132   bridge     bridge    local
96342d7006e9   host       host      local
2854c578bf00   none       null      local
```

第 2 步，启动 Redis 服务器：

```text
$ docker run --name redis-server \
    -d --rm \
    -e ALLOW_EMPTY_PASSWORD=yes \
    --network app-tier \
    bitnami/redis:latest
```

第 3 步，使用 Redis 客户端进行连接：

```text
$ docker run -it --rm \
    --network app-tier \
    bitnami/redis:latest redis-cli -h redis-server
```

第 4 步，关闭 Redis 服务器、删除网络：

```text
$ docker stop redis-server
$ docker network rm app-tier
```

## Docker Compose

File: `compose.yaml`

```yaml
services:
  redis-server:
    container_name: redis-server
    image: 'bitnami/redis:latest'
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
    networks:
      - app-tier

networks:
  app-tier:
    driver: bridge
```

```yaml
services:
  redis:
    container_name: redis-server
    image: bitnami/redis
    environment:
      # ALLOW_EMPTY_PASSWORD is recommended only for development.
      - ALLOW_EMPTY_PASSWORD=yes
      - REDIS_DISABLE_COMMANDS=FLUSHDB,FLUSHALL
    ports:
      - '6379:6379'
```

```yaml
services:
  redis:
    container_name: redis-server
    image: bitnami/redis
    environment:
      # ALLOW_EMPTY_PASSWORD is recommended only for development.
      - ALLOW_EMPTY_PASSWORD=yes
      - REDIS_DISABLE_COMMANDS=FLUSHDB,FLUSHALL
    ports:
      - '6379:6379'
    volumes:
      - 'redis_data:/bitnami/redis/data'

volumes:
  redis_data:
    driver: local
```

```text
$ docker run -it --rm \
    bitnami/redis:latest \
    redis-cli -h redis-server
```

```yaml
services:
  redis:
    image: 'bitnami/redis:latest'
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
    networks:
      - app-tier
  myapp:
    image: 'YOUR_APPLICATION_IMAGE'
    networks:
      - app-tier

networks:
  app-tier:
    driver: bridge
```

## 安全

### 密码

```text
docker run --name redis-server \
-d --rm \
--network app-tier \
-p 6379:6379 \
-e REDIS_PASSWORD=str0ng_passw0rd \
bitnami/redis:latest
```

```text
$ docker run -it --rm \
    --network app-tier \
    bitnami/redis:latest \
    redis-cli -h redis-server -p 6379 -a str0ng_passw0rd --no-auth-warning
```

```text
redis-cli -h 192.168.80.130 -p 6379 -a str0ng_passw0rd
```

```yaml
services:
  redis-server:
    container_name: redis-server
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - '6379:6379'
```

### 禁用命令

```text
docker run --name redis-server \
-d --rm \
--network app-tier \
-p 6379:6379 \
-e REDIS_PASSWORD=str0ng_passw0rd \
-e REDIS_DISABLE_COMMANDS=FLUSHDB,FLUSHALL,CONFIG \
bitnami/redis:latest
```

```text
$ docker run -it --rm \
    --network app-tier \
    bitnami/redis:latest \
    redis-cli -h redis-server -p 6379 -a str0ng_passw0rd --no-auth-warning
```

```text
services:
  redis:
  ...
    environment:
      - REDIS_DISABLE_COMMANDS=FLUSHDB,FLUSHALL,CONFIG
  ...
```
