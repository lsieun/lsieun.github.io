---
title: "Kafka 压测"
sequence: "103"
---

## Kafka 的自带压测命令

### 压测的意义

验证每台服务器上 Kafka 写入消息和消费消息的能力，根据测试结果，评估当前 Kafka 集群模式是否满足上亿级的消息处理能力。

### 测试的方法

在服务器上使用 Kafka 自带的测试脚本，分别模拟 10W、100W 和 1000W 的消息写入请求，
查看 Kafka 处理不同数量级的消息时的处理能力，包括每秒生成消息数、吞吐量、消息延迟时间。

### 测试命令

```text
$ kafka-producer-perf-test.sh --help
$ kafka-consumer-perf-test.sh --help
```

写入消息测试：

```text
$ kafka-producer-perf-test.sh \
--topic my-favorite-topic \
--num-records 100000 \
--record-size 1000 \
--throughput 2000 \
--producer-props bootstrap.servers=server1:9092,server2:9092,server3:9092
```

- `--topic`: produce messages to this topic
- `--num-records`: number of messages to produce
- `--record-size`: message size in bytes.
- `--throughput`: 每秒钟发送的消息数量。如果为 `-1`，则表示不限制。
- `--producer-props`: kafka producer related configuration properties like `bootstrap.servers`, `client.id` etc.

消费消息测试：

```text
$ kafka-consumer-perf-test.sh \
--bootstrap-server server1:9092,server2:9092,server3:9092 \
--topic my-favorite-topic \
--fetch-size 1048576 \
--messages 100000 \
--threads 1
```

- `--bootstrap-server`: The server(s) to connect to.
- `--topic`: The topic to consume from.
- `--fetch-size`: The amount of data to fetch in a single request. (default: 1048576)
- `--messages`: The number of messages to send or consume

