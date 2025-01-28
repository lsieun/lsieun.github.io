---
title: "Intro"
sequence: "101"
---

## Simple

### 无密码

```text
docker run --name redis --rm -p 6379:6379 -e ALLOW_EMPTY_PASSWORD=yes bitnami/redis:latest
```

```text
> redis-cli -h 192.168.80.130 -p 6379
192.168.80.130:6379> set mykey "Hello Redis"
OK
192.168.80.130:6379> get mykey
"Hello Redis"
```

### 带密码

```text
docker run --name redis --rm -p 6379:6379 -e REDIS_PASSWORD=str0ng_passw0rd bitnami/redis:latest
```

```text
redis-cli -h 192.168.80.130 -p 6379 -a str0ng_passw0rd
```

### 安全

```text
$ mkdir {certs,persistence}
```

```text
docker run --name redis \
    -v ./certs:/opt/bitnami/redis/certs \
    -v ./persistence:/bitnami/redis/data \
    -p 6379:6379 \
    --rm \
    -e ALLOW_EMPTY_PASSWORD=yes \
    -e REDIS_TLS_ENABLED=yes \
    -e REDIS_TLS_AUTH_CLIENTS=yes \
    -e REDIS_TLS_CERT_FILE=/opt/bitnami/redis/certs/redis.crt \
    -e REDIS_TLS_KEY_FILE=/opt/bitnami/redis/certs/redis.key \
    -e REDIS_TLS_CA_FILE=/opt/bitnami/redis/certs/redisCA.crt \
    bitnami/redis:latest
```

```text
docker run --name redis \
    -v ./certs:/opt/bitnami/redis/certs \
    -v ./persistence:/bitnami/redis/data \
    -p 6379:6379 \
    --rm \
    -e ALLOW_EMPTY_PASSWORD=yes \
    -e REDIS_TLS_ENABLED=yes \
    -e REDIS_TLS_CERT_FILE=/opt/bitnami/redis/certs/redis.crt \
    -e REDIS_TLS_KEY_FILE=/opt/bitnami/redis/certs/redis.key \
    -e REDIS_TLS_CA_FILE=/opt/bitnami/redis/certs/redisCA.crt \
    bitnami/redis:latest
```

## Reference

- [Bitnami containers](https://hub.docker.com/u/bitnami)
    - [bitnami/redis](https://hub.docker.com/r/bitnami/redis)
    - [bitnami/redis-sentinel](https://hub.docker.com/r/bitnami/redis-sentinel)
    - [bitnami/redis-exporter](https://hub.docker.com/r/bitnami/redis-exporter)
    - [bitnami/redis-cluster](https://hub.docker.com/r/bitnami/redis-cluster)
