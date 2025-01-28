---
title: "Redis Replication"
sequence: "103"
---

## Master/Slave

### First

File: `compose.yaml`

```yaml
services:
  redis-master:
    container_name: "redis-master"
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
```

### Macvlan

File: `compose.yaml`

```yaml
services:
  redis-master:
    container_name: "redis-master"
    image: redis:latest
    command: redis-server
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131
    ports:
      - "6379:6379"

  redis-slave-1:
    container_name: "redis-slave-1"
    image: redis:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231
    ports:
      - "6379:6379"
    command: redis-server --slaveof redis-master 6379
    depends_on:
      - redis-master

  redis-slave-2:
    container_name: "redis-slave-2"
    image: redis:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232
    ports:
      - "6379:6379"
    command: redis-server --slaveof redis-master 6379
    depends_on:
      - redis-master

  redis-slave-3:
    container_name: "redis-slave-3"
    image: redis:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233
    ports:
      - "6379:6379"
    command: redis-server --slaveof redis-master 6379
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

