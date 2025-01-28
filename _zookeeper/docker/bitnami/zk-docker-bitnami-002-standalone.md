---
title: "单机版"
sequence: "102"
---

## Docker Run

ZooKeeper

```text
docker run -d --name zookeeper -p 2181:2181 \
-e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:latest
```

## Docker Compose

```yaml
services:
  zookeeper:
    image: 'bitnami/zookeeper:latest'
    container_name: myzookeeper
    restart: always
    ports:
      - '2181:2181'
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
```
