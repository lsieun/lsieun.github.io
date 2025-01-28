---
title: "Broker"
sequence: "103"
---

## Broker 核心参数配置

### ISR

- `replica.lag.time.max.ms`

ISR 中，如果 Follower 长时间未向 Leader 发送通信请求或同步数据，则该 Follower 将被踢出 ISR。该时间阈值默认为 30s。

### Leader Rebalance

- `auto.leader.rebalance.enable`

默认是 true。自动 Leader Partition 平衡，建议关闭。


- `leader.imbalance.per.broker.percentage`

默认是 10%。每个 broker 允许的不平衡的 leader 的比率。如果每个 broker 超过了这个值，控制器会触发 leader 的平衡。

- `leader.imbalance.check.interval.seconds`

默认值 300 秒。检查 leader 负载是否平衡的间隔时间。

### 日志

- `log.segment.bytes`

Kafka 中 log 日志是分成一块块存储的，此配置是指 log 日志划分成块的大小，默认值为 1GB。

- `log.index.interval.bytes`

默认 4KB。Kafka里面每当写入 4KB 大小的日志（`.log`），然后就往 index 文件里面记录一个索引。

- `log.retention.hours`：Kafka 中数据保存的时间，默认 7 天。
- `log.retention.minutes`：Kafka 中数据保存的时间，分钟级别，默认关闭。
- `log.retention.ms`：Kafka 中数据保存的时间，毫秒级别，默认关闭。

- `log.retention.check.interval.ms`：检查数据是否保存超时的间隔，默认是 5 分钟。
- `log.retention.bytes`：默认等于 -1，表示无穷大。超过设置的所有日志总大小，删除最早的 segment。
- `log.cleanup.policy`：默认是 delete，表示所有数据启用删除策略；如果设置为 compact，表示所有数据启用压缩策略。

### 线程

- `num.io.threads`：默认是 8。负责写磁盘的线程数。整个参数数值要占总核数 50%。
- `num.replica.fetchers`：默认是 1。副本拉取线程数，这个参数占总核数的 50% 的 1/3。
- `num.network.threads`：默认是 3。数据传输线程数，这个参数占总核数的 50% 的 2/3

### 页缓存

- `log.flush.interval.messages`：强制页缓存刷写到磁盘的条数，默认是 long 的最大值，9223372036854775807。一般不建议修改，交给系统自己处理。
- `log.flush.interval.ms`：每隔多久，刷数据到磁盘，默认是 null。一般不建议修改，交给系统自己管理。

## 服役新节点和退役旧节点

第 1 步，创建一个要均衡的主题：

```text
vi topics-to-move.json
{
  "topics": [
    {
      "topic": "my-favorite-topic"
    }
  ],
  "version": 1
}
```

第 2 步，生成一个负载均衡计划：

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--generate \
--topics-to-move-json-file topics-to-move.json \
--broker-list "1,2,3,4"
```

第 3 步，创建副本存储计划：

```text
vi increase-replication-factor.json
```

第 4 步，执行副本存储计划：

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--execute \
--reassignment-json-file increase-replication-factor.json
```

第 5 步，验证副本存储计划

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--verify \
--reassignment-json-file increase-replication-factor.json
```

## 增加分区

注意：分区数只能增加，不能减少。

修改分区数：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--alter --topic my-favorite-topic --partitions 4
```

## 增加副本因子

第 1 步，创建 topic：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--create \
--topic my-favorite-topic \
--partitions 4 \
--replication-factor 1
```

第 2 步，手动增加副本存储：

```text
vi increase-replication-factor.json
```

```json
{
  "version": 1,
  "partitions": [
    {
      "topic": "my-favorite-topic",
      "partition": 0,
      "replicas": [1, 2]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 1,
      "replicas": [0, 1]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 2,
      "replicas": [0, 1]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 3,
      "replicas": [0, 1]
    }
  ]
}
```

第 3 步，执行副本存储计划：

```text
$ kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--execute \
--reassignment-json-file increase-replication-factor.json
```

第 4 步，验证副本存储计划：

```text
$ kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--verify \
--reassignment-json-file increase-replication-factor.json
```

第 5 步，查看分区副本存储情况：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --describe --topic my-favorite-topic
```

## Leader Partition 负载均衡

- `auto.leader.rebalance.enable`：

默认是 true。自动 Leader Partition 平衡。生产环境中，leader 重选举的代价比较大，可能会带来性能影响，建议设置为 false。

- `leader.imbalance.per.broker.percentage`

默认是 10%。每个 broker 允许的不平衡的 leader 的比率。如果每个 broker 超过了这个值，控制器会触发 leader 的平衡。

- `leader.imbalance.check.interval.seconds`

默认值 300 秒。检查 leader 负载是否平衡的间隔时间。

## 自动创建主题

如果 broker 端配置参数 `auto.create.topics.enable` 设置为 `true`（默认值是 `true`），
那么生产者向一个未创建的主题发送消息时，会自动创建一个分区数为 `num.partitions`（默认值为 1）、
副本因子为 `default.replication.factor` （默认值为 1）的主题。
除此之外，当一个消费者开始从未知主题中读取消息时，或者当任意一个客户端向未知主题发送元数据请求时，都会自动创建一个相应主题。
这种创建主题的方式是非预期的，增加了主题管理和维护的难度。
**生产环境建议将该参数设置为 `false`。**
