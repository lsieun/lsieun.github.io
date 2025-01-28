---
title: "Kafka 单机版（Kraft）"
sequence: "102"
---

## Docker Run

第 1 步，创建网络

```text
$ docker network create app-tier --driver bridge
```

第 2 步，创建 Kafka 实例

```text
docker run -d --name kafka-server --hostname kafka-server \
    --network app-tier \
    -e KAFKA_CFG_NODE_ID=0 \
    -e KAFKA_CFG_PROCESS_ROLES=controller,broker \
    -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
    -e KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
    -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka-server:9093 \
    -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
    bitnami/kafka:latest
```

第 3 步，使用（Client端）：

```text
docker run -it --rm \
    --network app-tier \
    bitnami/kafka:latest kafka-topics.sh --list --bootstrap-server kafka-server:9092
```

## Docker Compose

### Bridge

注意：检查 `KAFKA_CFG_ADVERTISED_LISTENERS` 的 IP 地址是否正确

```yaml
services:
  kafka:
    container_name: "kafka"
    image: bitnami/kafka
    ports:
      - "9092:9092"
    volumes:
      - "kafka_data:/bitnami"
    environment:
      # KRaft settings
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      # Listeners
      - KAFKA_CFG_LISTENERS=INTERNAL://:9091,EXTERNAL://:9092,CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka:9091,EXTERNAL://192.168.80.130:9092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,INTERNAL:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
volumes:
  kafka_data:
    driver: local
```

```text
docker run -it --rm -p 8080:8080 -e DYNAMIC_CONFIG_ENABLED=true provectuslabs/kafka-ui
```

## Reference

- [bitnami/kafka/docker-compose.yml](https://github.com/bitnami/containers/blob/main/bitnami/kafka/docker-compose.yml)
