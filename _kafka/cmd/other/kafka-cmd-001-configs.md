---
title: "配置"
sequence: "102"
---

## Broker

### 查看

```text
./bin/kafka-configs.sh --bootstrap-server=0.0.0.0:9092 \
--entity-type brokers --entity-default \
--describe
```

### 增加

```text
./bin/kafka-configs.sh --bootstrap-server=0.0.0.0:9092 \
--entity-type brokers --entity-default \
--alter \
--add-config log.message.timestamp.type=LogAppendTime
```

### 删除

```text
./bin/kafka-configs.sh --bootstrap-server 0.0.0.0:9092 \
--entity-type brokers --entity-default \
--alter \
--delete-config log.message.timestamp.type
```

## Topic

### 查看

```text
$ kafka-configs.sh --bootstrap-server localhost:9092 --describe --topic configured-topic --all
```

```text
$ kafka-configs.sh --bootstrap-server localhost:9092 --describe \
--entity-type topics \
--entity-name configured-topic \
--all
```

### 增加

```text
$ ./bin/kafka-configs.sh --bootstrap-server=0.0.0.0:9092 \
--topic purge-scenario \
--alter \
--add-config retention.ms=10000 \
&& sleep 10
```

```text
$ ./bin/kafka-configs.sh --bootstrap-server=0.0.0.0:9092 \
--topic purge-scenario \
--alter \
--add-config retention.ms=604800000
```

### 删除

```text
kafka-configs.sh --bootstrap-server localhost:9092 \
--entity-type topics \
--entity-name configured-topic \
--alter \
--delete-config min.insync.replicas
```





