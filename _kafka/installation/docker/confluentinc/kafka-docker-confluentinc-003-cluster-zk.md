---
title: "集群版（ZooKeeper）"
sequence: "103"
---

## Docker Compose

### 1 Zookeeper — 3 Kafka

注意：检查 `KAFKA_ADVERTISED_LISTENERS` 的 IP 地址是否正确

```yaml
services:
  zookeeper:
    container_name: zookeeper
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_SERVER_ID: 1
      ZOOKEEPER_CLIENT_PORT: 2181
    networks:
      macvlan80:
        ipv4_address: 192.168.80.200
    ports:
      - "2181:2181"


  kafka-1:
    container_name: kafka-1
    image: confluentinc/cp-kafka:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181/kafka"
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka-1:9091,EXTERNAL://192.168.80.131:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
    depends_on:
      - zookeeper

  kafka-2:
    container_name: kafka-2
    image: confluentinc/cp-kafka:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka-2:9091,EXTERNAL://192.168.80.132:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
    depends_on:
      - zookeeper

  kafka-3:
    container_name: kafka-3
    image: confluentinc/cp-kafka:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka-3:9091,EXTERNAL://192.168.80.133:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
    depends_on:
      - zookeeper

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

## 3 Zookeeper — 3 Kafka

### compose.yaml

```yaml
services:
  zookeeper-1:
    container_name: zookeeper-1
    image: confluentinc/cp-zookeeper:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.231
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_SERVER_ID: 1
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_SERVERS: zookeeper-1:2888:3888;zookeeper-2:2888:3888;zookeeper-3:2888:3888

  zookeeper-2:
    container_name: zookeeper-2
    image: confluentinc/cp-zookeeper:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.232
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_SERVER_ID: 2
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_SERVERS: zookeeper-1:2888:3888;zookeeper-2:2888:3888;zookeeper-3:2888:3888

  zookeeper-3:
    container_name: zookeeper-3
    image: confluentinc/cp-zookeeper:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.233
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_SERVER_ID: 3
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_SERVERS: zookeeper-1:2888:3888;zookeeper-2:2888:3888;zookeeper-3:2888:3888

  kafka-1:
    container_name: kafka-1
    image: confluentinc/cp-kafka:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper-1:2181,zookeeper-2:2181,zookeeper-3:2181/kafka"
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka-1:9091,EXTERNAL://192.168.80.131:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
    depends_on:
      - zookeeper-1
      - zookeeper-2
      - zookeeper-3

  kafka-2:
    container_name: kafka-2
    image: confluentinc/cp-kafka:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 2
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper-1:2181,zookeeper-2:2181,zookeeper-3:2181/kafka"
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka-2:9091,EXTERNAL://192.168.80.132:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
    depends_on:
      - zookeeper-1
      - zookeeper-2
      - zookeeper-3

  kafka-3:
    container_name: kafka-3
    image: confluentinc/cp-kafka:latest
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 3
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper-1:2181,zookeeper-2:2181,zookeeper-3:2181/kafka"
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka-3:9091,EXTERNAL://192.168.80.133:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
    depends_on:
      - zookeeper-1
      - zookeeper-2
      - zookeeper-3

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

### 添加一台服务器

```text
$ docker run --name=kafka-4 -it --rm \
  --network=kafka_macvlan80 \
  --ip=192.168.80.134 \
  -e KAFKA_BROKER_ID=4 \
  -e KAFKA_ZOOKEEPER_CONNECT="zookeeper-1:2181,zookeeper-2:2181,zookeeper-3:2181/kafka" \
  -e KAFKA_ADVERTISED_LISTENERS=INTERNAL://kafka-4:9091,EXTERNAL://192.168.80.134:9092 \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=INTERNAL \
  confluentinc/cp-kafka:latest
```

