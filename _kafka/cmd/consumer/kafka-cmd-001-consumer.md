---
title: "Kafka 消费者"
sequence: "101"
---

## 消费消息

### 查看帮助

```text
$ kafka-console-consumer.sh --help
```

### 消费消息

```text
$ kafka-console-consumer.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --topic my-favorite-topic
```

```text
$ docker exec -it kafka-0 kafka-console-consumer.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --topic mytopic --from-beginning
```

## 位置和数量

### 分区

```text
$ bin/kafka-console-consumer.sh \
--bootstrap-server=0.0.0.0:9092 \
--topic my-favorite-topic \
--partition=0 \
--from-beginning \
--max-messages 1 --timeout-ms 1000
```

### 从头开始

如果想从 topic 的头开始消费数据，添加 `--from-beginning` 参数：

```text
$ kafka-console-consumer.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --topic my-favorite-topic --from-beginning
```

如果想从指定的位置开始消费数据，添加 `--offset` 选项，
`--offset` 的值，可以是 `earliest`、`latest` 和一个整型的数字

```text
$ kafka-console-consumer.sh --bootstrap-server server1:9092,server2:9092,server3:9092 \
--topic my-favorite-topic \
--offset earliest \
--partition 2
```

offset 是 Kafka 的 topic 中的 partition 中的每一条消息的标识，该消息在 Kafka 对应的 partition 的位置，即偏移量。
offset 的数据类型是 Long，8个字节长度。
offset 在 partition 内是有序的。
多个 partition 不一定有序。
如果想要Kafka 中的数据全局有序，就只能让 partition 个数为 1.

### 最多消费N条

```text
$ bin/kafka-console-consumer.sh \
  --bootstrap-server=0.0.0.0:9092 \
  --topic my-favorite-topic \
  --from-beginning \
  --max-messages 3
```

## 时间

### 超时

```text
$ bin/kafka-console-consumer.sh  \
  --bootstrap-server=0.0.0.0:9092 \
  --topic my-favorite-topic \
  --from-beginning \
  --max-messages 1 \
  --timeout-ms 1000
```
