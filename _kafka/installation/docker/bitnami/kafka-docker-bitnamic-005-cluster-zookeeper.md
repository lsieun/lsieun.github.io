---
title: "Kafka 集群版（ZooKeeper）"
sequence: "105"
---

```text
With the upcoming Kafka 4.0, Zookeeper will be entirely phased out, and only KRaft mode will be supported.

Starting from 3.3.1 version released on October 3, 2022, KRaft is completely production ready.

According to the current release plan, Kafka 3.7 (due January 2024) will be the last release to support Zookeeper.
```

## Z1K3

### 无存储

```yaml
services:
  zookeeper:
    image: bitnami/zookeeper
    container_name: zookeeper
    ports:
      - "2181"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.230
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes

  kafka-0:
    image: bitnami/kafka
    container_name: kafka-0
    ports:
      - "9092:9092"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131
    environment:
      - KAFKA_CFG_BROKER_ID=0
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=INTERNAL://:9091,EXTERNAL://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-0:9091,EXTERNAL://192.168.80.131:9092
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    depends_on:
      - zookeeper

  kafka-1:
    image: bitnami/kafka
    container_name: kafka-1
    ports:
      - "9092:9092"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132
    environment:
      - KAFKA_CFG_BROKER_ID=1
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=INTERNAL://:9091,EXTERNAL://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-1:9091,EXTERNAL://192.168.80.132:9092
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    depends_on:
      - zookeeper

  kafka-2:
    image: bitnami/kafka
    container_name: kafka-2
    ports:
      - "9092:9092"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133
    environment:
      - KAFKA_CFG_BROKER_ID=2
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=INTERNAL://:9091,EXTERNAL://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-2:9091,EXTERNAL://192.168.80.133:9092
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
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

### 有存储

```yaml
services:
  zookeeper:
    image: bitnami/zookeeper
    container_name: zookeeper
    ports:
      - "2181"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.230
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
    volumes:
      - zookeeper_data:/bitnami/zookeeper

  kafka-0:
    image: bitnami/kafka
    container_name: kafka-0
    ports:
      - "9092:9092"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.131
    environment:
      - KAFKA_CFG_BROKER_ID=0
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=INTERNAL://:9091,EXTERNAL://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-0:9091,EXTERNAL://192.168.80.131:9092
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    volumes:
      - kafka_0_data:/bitnami/kafka
    depends_on:
      - zookeeper

  kafka-1:
    image: bitnami/kafka
    container_name: kafka-1
    ports:
      - "9092:9092"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.132
    environment:
      - KAFKA_CFG_BROKER_ID=1
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=INTERNAL://:9091,EXTERNAL://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-1:9091,EXTERNAL://192.168.80.132:9092
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    volumes:
      - kafka_1_data:/bitnami/kafka
    depends_on:
      - zookeeper

  kafka-2:
    image: bitnami/kafka
    container_name: kafka-2
    ports:
      - "9092:9092"
    networks:
      macvlan80:
        ipv4_address: 192.168.80.133
    environment:
      - KAFKA_CFG_BROKER_ID=2
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      # Listeners
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=INTERNAL://:9091,EXTERNAL://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=INTERNAL://kafka-2:9091,EXTERNAL://192.168.80.133:9092
      - KAFKA_CFG_INTER_BROKER_LISTENER_NAME=INTERNAL
    volumes:
      - kafka_2_data:/bitnami/kafka
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

volumes:
  zookeeper_data:
    driver: local
    name: zookeeper_data
  kafka_0_data:
    driver: local
    name: kafka_0_data
  kafka_1_data:
    driver: local
    name: kafka_1_data
  kafka_2_data:
    driver: local
    name: kafka_2_data
```

