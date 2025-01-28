---
title: "Cluster"
sequence: "105"
---

## M3S3

```yaml
services:
  redis-node-1:
    container_name: redis-node-1
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-1:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=au'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'

  redis-node-2:
    container_name: redis-node-2
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-2:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'

  redis-node-3:
    container_name: redis-node-3
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-3:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'

  redis-node-4:
    container_name: redis-node-4
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-4:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'

  redis-node-5:
    container_name: redis-node-5
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-5:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'

  redis-node-6:
    container_name: redis-node-6
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-6:/bitnami/redis/data
    depends_on:
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDISCLI_AUTH=str0ng_passw0rd'
      - 'REDIS_CLUSTER_REPLICAS=1'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_CLUSTER_CREATOR=yes'

volumes:
  redis-cluster_data-1:
    driver: local
  redis-cluster_data-2:
    driver: local
  redis-cluster_data-3:
    driver: local
  redis-cluster_data-4:
    driver: local
  redis-cluster_data-5:
    driver: local
  redis-cluster_data-6:
    driver: local
```

```text
$ docker exec -it redis-node-1 /bin/bash

$ redis-cli -h 172.29.0.2 -a str0ng_passw0rd

> cluster nodes
```

## M3S3-Macvlan

```yaml
services:
  redis-node-1:
    container_name: redis-node-1
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-1:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131

  redis-node-2:
    container_name: redis-node-2
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-2:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132

  redis-node-3:
    container_name: redis-node-3
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-3:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133

  redis-node-4:
    container_name: redis-node-4
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-4:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231

  redis-node-5:
    container_name: redis-node-5
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-5:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232

  redis-node-6:
    container_name: redis-node-6
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-6:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233

  redis-node-7:
    container_name: redis-node-7
    image: bitnami/redis-cluster
    volumes:
      - redis-cluster_data-7:/bitnami/redis/data
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.234

  redis-cluster-init:
    container_name: redis-cluster-init
    image: redis
    restart: 'no'
    networks:
      macvlan80:
        ipv4_address: 192.168.80.250
    depends_on:
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5
      - redis-node-6
    entrypoint: []
    command:
      - /bin/bash
      - -c
      - redis-cli -a str0ng_passw0rd --cluster create 192.168.80.131:6379 192.168.80.132:6379 192.168.80.133:6379 192.168.80.231:6379 192.168.80.232:6379 192.168.80.233:6379 --cluster-replicas 1 --cluster-yes

volumes:
  redis-cluster_data-1:
    driver: local
  redis-cluster_data-2:
    driver: local
  redis-cluster_data-3:
    driver: local
  redis-cluster_data-4:
    driver: local
  redis-cluster_data-5:
    driver: local
  redis-cluster_data-6:
    driver: local

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

## New （成功）

```yaml
services:
  redis-node-0:
    image: bitnami/redis-cluster
    container_name: redis-node-0
    restart: always
    networks:
      redis:
        ipv4_address: 172.22.0.100
    hostname: redis-node-0
    environment:
      - 'REDIS_PORT_NUMBER=7000'
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-0 redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=7000'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.130'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=17000'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "7000:7000"
      - "17000:17000"

  redis-node-1:
    image: bitnami/redis-cluster
    container_name: redis-node-1
    restart: always
    networks:
      redis:
        ipv4_address: 172.22.0.101
    hostname: redis-node-1
    environment:
      - 'REDIS_PORT_NUMBER=7001'
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-0 redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=7001'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.130'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=17001'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "7001:7001"
      - "17001:17001"

  redis-node-2:
    image: bitnami/redis-cluster
    container_name: redis-node-2
    restart: always
    networks:
      redis:
        ipv4_address: 172.22.0.102
    hostname: redis-node-2
    environment:
      - 'REDIS_PORT_NUMBER=7002'
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-0 redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=7002'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.130'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=17002'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "7002:7002"
      - "17002:17002"

  redis-node-3:
    image: bitnami/redis-cluster
    container_name: redis-node-3
    restart: always
    networks:
      redis:
        ipv4_address: 172.22.0.103
    hostname: redis-node-3
    environment:
      - 'REDIS_PORT_NUMBER=7003'
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-0 redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=7003'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.130'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=17003'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "7003:7003"
      - "17003:17003"

  redis-node-4:
    image: bitnami/redis-cluster
    container_name: redis-node-4
    restart: always
    networks:
      redis:
        ipv4_address: 172.22.0.104
    hostname: redis-node-4
    environment:
      - 'REDIS_PORT_NUMBER=7004'
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-0 redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=7004'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.130'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=17004'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "7004:7004"
      - "17004:17004"

  redis-node-5:
    image: bitnami/redis-cluster
    container_name: redis-node-5
    restart: always
    networks:
      redis:
        ipv4_address: 172.22.0.105
    hostname: redis-node-5
    environment:
      - 'REDIS_PORT_NUMBER=7005'
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-0 redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=7005'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.130'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=17005'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "7005:7005"
      - "17005:17005"

  redis-cluster-init:
    image: redis
    container_name: redis-cluster-init
    restart: 'no'
    networks:
      redis:
        ipv4_address: 172.22.0.106
    depends_on:
      - redis-node-0
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5
    entrypoint: []
    command:
      - /bin/bash
      - -c
      - redis-cli -a str0ng_passw0rd --cluster create 172.22.0.100:7000 172.22.0.101:7001 172.22.0.102:7002 172.22.0.103:7003 172.22.0.104:7004 172.22.0.105:7005 --cluster-replicas 1 --cluster-yes


networks:
  redis:
    driver: bridge
    ipam:
      config:
        - subnet: 172.22.0.0/16
          gateway: 172.22.0.1

```

## New-Macvlan （成功-推荐）

检查的内容：

- 第 1 个，检查 `networks.macvlan80.driver_opts.parent` 的值是否正确
- 第 2 个，检查 `192.168.80.x` 是否为目标 IP 地址

```yaml
services:
  redis-node-1:
    image: bitnami/redis-cluster
    container_name: redis-node-1
    hostname: redis-node-1
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.131'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131

  redis-node-2:
    image: bitnami/redis-cluster
    container_name: redis-node-2
    hostname: redis-node-2
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.132'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132

  redis-node-3:
    image: bitnami/redis-cluster
    container_name: redis-node-3
    hostname: redis-node-3
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.133'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133

  redis-node-4:
    image: bitnami/redis-cluster
    container_name: redis-node-4
    hostname: redis-node-4
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.231'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231

  redis-node-5:
    image: bitnami/redis-cluster
    container_name: redis-node-5
    hostname: redis-node-5
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.232'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232

  redis-node-6:
    image: bitnami/redis-cluster
    container_name: redis-node-6
    hostname: redis-node-6
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.233'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233

  redis-cluster-init:
    image: bitnami/redis-cluster
    container_name: redis-cluster-init
    restart: 'no'
    networks:
      macvlan80:
        ipv4_address: 192.168.80.250
    depends_on:
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5
      - redis-node-6
    entrypoint: []
    command:
      - /bin/bash
      - -c
      - redis-cli --no-auth-warning -a str0ng_passw0rd --cluster create redis-node-1:6379 redis-node-2:6379 redis-node-3:6379 redis-node-4:6379 redis-node-5:6379 redis-node-6:6379 --cluster-replicas 1 --cluster-yes


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
docker run -it --rm \
    bitnami/redis:latest \
    redis-cli -h 192.168.80.131 -p 6379 -a str0ng_passw0rd --no-auth-warning -c
```

## New-Macvlan2 （成功）

```yaml
services:
  redis-node-1:
    image: bitnami/redis-cluster
    container_name: redis-node-1
    hostname: redis-node-1
    restart: always
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.131'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"

  redis-node-2:
    image: bitnami/redis-cluster
    container_name: redis-node-2
    hostname: redis-node-2
    restart: always
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.132'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"

  redis-node-3:
    image: bitnami/redis-cluster
    container_name: redis-node-3
    hostname: redis-node-3
    restart: always
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.133'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"

  redis-node-4:
    image: bitnami/redis-cluster
    container_name: redis-node-4
    hostname: redis-node-4
    restart: always
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.231'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"

  redis-node-5:
    image: bitnami/redis-cluster
    container_name: redis-node-5
    hostname: redis-node-5
    restart: always
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.232'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"

  redis-node-6:
    image: bitnami/redis-cluster
    container_name: redis-node-6
    hostname: redis-node-6
    restart: always
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.233'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
      - 'REDISCLI_AUTH=str0ng_passw0rd'
      - 'REDIS_CLUSTER_REPLICAS=1'
      - 'REDIS_CLUSTER_CREATOR=yes'
    ports:
      - "6379:6379"
      - "16379:16379"
    depends_on:
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5

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

## New-Macvlan3 （成功）

```yaml
services:
  redis-node-1:
    image: bitnami/redis-cluster
    container_name: redis-node-1
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.131'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131

  redis-node-2:
    image: bitnami/redis-cluster
    container_name: redis-node-2
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.132'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132

  redis-node-3:
    image: bitnami/redis-cluster
    container_name: redis-node-3
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.133'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133

  redis-node-4:
    image: bitnami/redis-cluster
    container_name: redis-node-4
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.231'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231

  redis-node-5:
    image: bitnami/redis-cluster
    container_name: redis-node-5
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.232'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232

  redis-node-6:
    image: bitnami/redis-cluster
    container_name: redis-node-6
    restart: always
    environment:
      - 'REDIS_PASSWORD=str0ng_passw0rd'
      - 'REDIS_NODES=redis-node-1 redis-node-2 redis-node-3 redis-node-4 redis-node-5 redis-node-6'
      - 'REDIS_PORT_NUMBER=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_PORT=6379'
      - 'REDIS_CLUSTER_ANNOUNCE_IP=192.168.80.233'
      - 'REDIS_CLUSTER_BUS_ANNOUNCE_PORT=16379'
      - 'REDIS_CLUSTER_DYNAMIC_IPS=no'
      - 'REDISCLI_AUTH=str0ng_passw0rd'
      - 'REDIS_CLUSTER_REPLICAS=1'
      - 'REDIS_CLUSTER_CREATOR=yes'
    ports:
      - "6379:6379"
      - "16379:16379"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233
    depends_on:
      - redis-node-1
      - redis-node-2
      - redis-node-3
      - redis-node-4
      - redis-node-5

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
