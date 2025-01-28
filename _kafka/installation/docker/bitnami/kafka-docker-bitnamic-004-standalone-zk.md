---
title: "Kafka 单机版（ZooKeeper）"
sequence: "104"
---

```text
With the upcoming Kafka 4.0, Zookeeper will be entirely phased out, and only KRaft mode will be supported.

Starting from 3.3.1 version released on October 3, 2022, KRaft is completely production ready.

According to the current release plan, Kafka 3.7 (due January 2024) will be the last release to support Zookeeper.
```

## Docker Run

第 1 步，创建网络：

```text
$ docker network create app-tier --driver bridge
```

第 2 步，启动 ZooKeeper:

```text
$ docker run -d --rm --name zookeeper \
--user root \
--hostname zk \
-p 2181:2181 \
--network app-tier \
-e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:latest
```

第 3 步，启动 Kafka:

```text
$ docker run -d --rm --name kafka-server -p 9092:9092 \
    --user root \
    --hostname ka \
    --network app-tier \
    -e KAFKA_BROKER_ID=1 \
    -e KAFKA_LISTENERS=PLAINTEXT://:9092 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.80.130:9092 \
    -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
    -e ALLOW_PLAINTEXT_LISTENER=yes \
    bitnami/kafka:3.6
```

第 4 步，客户端操作，使用 Kafka：

```text
$ docker run -it --rm \
    --network app-tier \
    bitnami/kafka:3.6 kafka-topics.sh --list --bootstrap-server kafka-server:9092
```

第 5 步，停止

```text
$ docker stop kafka-server zookeeper
$ docker network rm app-tier
```

## Docker Compose

### ZK + Kafka （成功）

#### 配置

注意：检查 `KAFKA_ADVERTISED_LISTENERS` 的 IP 地址是否正确

```yaml
services:
  zookeeper:
    image: bitnami/zookeeper
    container_name: 'zookeeper'
    networks:
      - app-tier
    ports:
      - 2181:2181
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes

  kafka:
    image: bitnami/kafka:3.6
    container_name: 'kafka'
    networks:
      - app-tier
    ports:
      - 9092:9092
    environment:
      # ID
      - KAFKA_BROKER_ID=1
      # ZooKeeper
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
      # Listener
      - KAFKA_LISTENERS=PLAINTEXT://:9092
      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.80.130:9092
      - ALLOW_PLAINTEXT_LISTENER=yes
    depends_on:
      - zookeeper

networks:
  app-tier:
    driver: bridge
```

#### 使用

启动：

```text
$ docker compose -f kafka-zk-docker-compose.yml up -d
```

进入容器：

```text
docker exec -it kafka /bin/bash
```

查看主题：

```text
kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --describe --topic gpsData
```

### ZK + Kafka + UI

```yaml
services:
  zookeeper:
    image: bitnami/zookeeper
    container_name: zookeeper
    networks:
      - app-tier
    ports:
      - "2181:2181"
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes

  kafka:
    image: bitnami/kafka:3.6
    container_name: kafka
    networks:
      - app-tier
    ports:
      - "9092:9092"
    environment:
      - KAFKA_CFG_BROKER_ID=0
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=INTERNAL://:9091,EXTERNAL://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka:9091,EXTERNAL://192.168.80.130:9092
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    depends_on:
      - zookeeper

  kafka-ui:
    image: provectuslabs/kafka-ui
    container_name: kafka-ui
    networks:
      - app-tier
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
      KAFKA_CLUSTERS_0_ZOOKEEPER: zookeeper:2181
    depends_on:
      - zookeeper
      - kafka

networks:
  app-tier:
    driver: bridge
```

## Reference

- [Guide to Setting Up Apache Kafka Using Docker](https://www.baeldung.com/ops/kafka-docker-setup)

- [Kafka（一）使用Docker Compose安装单机Kafka以及Kafka UI](https://blog.csdn.net/dghkgjlh/article/details/133418837)
- [TechBits | Docker 部署（Bitnami镜像） Kafak-Kraft 模式配合Sasl加密认证](https://juejin.cn/post/7294556533932884020)
- [Kafka Cluster with Docker Compose](https://medium.com/@erkndmrl/kafka-cluster-with-docker-compose-5864d50f677e)
- [kafka cluster in docker-compose.](https://gist.github.com/everpeace/7a317860cab6c7fb39d5b0c13ec2543e)
- [Building a Multi-Node Apache Kafka Cluster with Docker Compose and Custom Docker Image](https://medium.com/javarevisited/building-a-multi-node-apache-kafka-cluster-with-docker-compose-and-custom-docker-image-b343df17c028)
