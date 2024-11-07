---
title: "高可用（HA）"
sequence: "101"
---

不同的 Redis 部署方式：

- Single Redis Instance
- Redis HA
    - Redis Sentinel
    - Redis Cluster

## Single Redis Instance

![](/assets/images/redis/ha/redis-standalone.png)

缺点：
if this instance fails or is unavailable,
all client calls to Redis will fail and therefore degrade the system's overall performance and speed.

## Redis HA

![](/assets/images/redis/ha/redis-ha.png)

Another popular setup with Redis is the main deployment with a secondary deployment
that is kept in sync with replication.
As data is written to the main instance it sends copies of those commands,
to a replica client output buffer for secondary instances which facilitates replication.
The secondary instances can be one or more instances in your deployment.

These instances can help scale reads from Redis or provide failover in case the main is lost.

### Redis Sentinel

![](/assets/images/redis/ha/redis-sentinel.png)

### Redis Cluster

![](/assets/images/redis/ha/redis-cluster.jpg)
