---
title: "Master + Slave"
sequence: "103"
---

## Docker Compose

### Single

```yaml
services:
  redis-master:
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=master
      - REDIS_PASSWORD=str0ng_passw0rd
    networks:
      - app-tier
    ports:
      - '6379'
  redis-slave:
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    ports:
      - '6379'
    depends_on:
      - redis-master
    networks:
      - app-tier
  redis-sentinel:
    image: 'bitnami/redis-sentinel:latest'
    environment:
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_MASTER_HOST=redis-master
    depends_on:
      - redis-master
      - redis-slave
    ports:
      - '26379-26381:26379'
    networks:
      - app-tier

networks:
  app-tier:
    driver: bridge
```

```text
docker compose up --scale redis-sentinel=3 -d
26 -d
```

### Macvlan

```yaml
services:
  redis-master:
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=master
      - REDIS_PASSWORD=str0ng_passw0rd
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131
    ports:
      - '6379'

  redis-slave-1:
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231
    ports:
      - '6379'
    depends_on:
      - redis-master

  redis-slave-2:
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232
    ports:
      - '6379'
    depends_on:
      - redis-master

  redis-slave-3:
    image: 'bitnami/redis:latest'
    environment:
      - REDIS_REPLICATION_MODE=slave
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PASSWORD=str0ng_passw0rd
      - REDIS_PASSWORD=str0ng_passw0rd
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233
    ports:
      - '6379'
    depends_on:
      - redis-master

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
