---
title: "0.0.0.0"
sequence: "106"
---

## 介绍

### 不是真实 IP

`0.0.0.0` 并不是一个真实的 IP 地址

### 不能 Ping 通

`0.0.0.0` 是不能被 Ping 通的。

### 监听

在服务器中，`0.0.0.0` 表示本机中所有的 IPV4 地址。
监听 `0.0.0.0` 的端口，就是监听本机中所有 IPV4 地址的端口。

举例来说明，现在有两台 PC 在同一个局域网内，分别为 PC1 与 PC2。PC1 上有一个网卡，IP 地址为 192.168.10.128

- PC1 中 sever 监听 `127.0.0.1` 时，
    - 则 PC1 中的 client 可以连上 `127.0.0.1`，但是 `192.168.10.128` 连不上；
    - 而 PC2 中 client 都连不上。
- PC1 中 sever 监听 `192.168.10.128` 时，
    - 则 PC1 中的 client 可以连上 `192.168.10.128`，但是 `127.0.0.1` 连不上；
    - 而 PC2 中 client 能连上 `192.168.10.128`。
- PC1 中 sever 监听 `0.0.0.0` 时，
    - 则 PC1 中的 client 可以连上 `127.0.0.1` 和 `192.168.10.128`，
    - 而 PC2 中的 client 能连上 `192.168.10.128`。

## 具体例子

下面是一个 ZooKeeper 的集群，里面使用到了 `0.0.0.0:2888:3888`：

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
