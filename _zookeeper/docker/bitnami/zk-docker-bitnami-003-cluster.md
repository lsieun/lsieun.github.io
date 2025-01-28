---
title: "集群版"
sequence: "103"
---

## Docker Compose

## Bridge

```yaml
services:
  zk1:
    container_name: zk1
    hostname: zk1
    image: bitnami/zookeeper:latest
    ports:
      - 21811:2181
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
      - ZOO_SERVER_ID=1
      - ZOO_SERVERS=zk1:2888:3888,zk2:2888:3888,zk3:2888:3888
  zk2:
    container_name: zk2
    hostname: zk2
    image: bitnami/zookeeper:latest
    ports:
      - 21812:2181
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
      - ZOO_SERVER_ID=2
      - ZOO_SERVERS=zk1:2888:3888,0.0.0.0:2888:3888,zk3:2888:3888
  zk3:
    container_name: zk3
    hostname: zk3
    image: bitnami/zookeeper:latest
    ports:
      - 21813:2181
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
      - ZOO_SERVER_ID=3
      - ZOO_SERVERS=zk1:2888:3888,zk2:2888:3888,0.0.0.0:2888:3888
  zoonavigator:
    container_name: zoonavigator
    image: elkozmon/zoonavigator
    ports:
      - 9000:9000
```

[ZooNavigator][zoo-navigator-url] is a web-based ZooKeeper UI and editor/browser with many features.

访问地址：

```text
http://192.168.80.130:9000/
```

- Connection String: `zk1:2181`

## Macvlan

```yaml
services:
  zk1:
    container_name: zk1
    hostname: zk1
    image: bitnami/zookeeper:latest
    ports:
      - 2181:2181
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
      - ZOO_SERVER_ID=1
      - ZOO_SERVERS=0.0.0.0:2888:3888,zk2:2888:3888,zk3:2888:3888
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131

  zk2:
    container_name: zk2
    hostname: zk2
    image: bitnami/zookeeper:latest
    ports:
      - 2181:2181
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
      - ZOO_SERVER_ID=2
      - ZOO_SERVERS=zk1:2888:3888,0.0.0.0:2888:3888,zk3:2888:3888
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132

  zk3:
    container_name: zk3
    hostname: zk3
    image: bitnami/zookeeper:latest
    ports:
      - 2181:2181
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
      - ZOO_SERVER_ID=3
      - ZOO_SERVERS=zk1:2888:3888,zk2:2888:3888,0.0.0.0:2888:3888
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133

  zoonavigator:
    container_name: zoonavigator
    image: elkozmon/zoonavigator
    ports:
      - 9000:9000
    networks:
      macvlan80:
        ipv4_address: 192.168.80.200

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

## Reference

- [ZooKeeper cluster with Docker Compose](https://dev.to/jv/zookeeper-cluster-with-docker-compose-jml)
- [elkozmon/zoonavigator][zoo-navigator-url]

[zoo-navigator-url]: https://github.com/elkozmon/zoonavigator
