---
title: "Consumer"
sequence: "104"
---

## 消费者核心参数配置

### 自动提交

- `enable.auto.commit`：默认值为 `true`，消费者会自动周期性地向服务器提交偏移量。
- `auto.commit.interval.ms`：如果设置了 `enable.auto.commit` 的值为 `true`，则该值定义了消费者偏移量向 Kafka 提交的频率，默认 5s。

### offset

- `auto.offset.reset`

当 Kafka 中没有初始偏移量或当前偏移量在服务器中不存在（例如，数据被删除了），该如何处理？
earliest：自动重围偏移量到最早的位置。
latest：默认，自动重置偏移量为最新的偏移量。
none：如果消费者原来的偏移量不存在，则向消费者抛异常。
anything：向消费者抛异常。

- `offsets.topic.num.partitions`

`__consumer_offsets` 的分区数，默认是 50 个分区。不建议修改。

- `offsets.topic.replication.factor`：默认值为 3


### 超时

- `heartbeat.interval.ms`

Kafka 消费者和 Coordinator 之间的心跳时间，默认 3s。
该条目的值必须小于 `session.timeout.ms`，也不应该高于 `session.timeout.ms` 的 1/3。不建议修改。

- `session.timeout.ms`

Kafka 消费者和 Coordinator 之间连接超时时间，默认 45s。超过该值，该消费者被移除，消费者执行再平衡。

- `max.poll.interval.ms`

消费者处理消息的最大时长，默认是 5 分钟。超过该值，该消费者被移除，消费者组执行再平衡。

### 数据传输

- `fetch.min.bytes`：每批次最小抓取大小，默认 1 byte
- `fetch.max.bytes`：每批次最大抓取大小，默认 55 MB
- `fetch.max.wait.ms`：默认 500 ms
- `max.poll.records`：一次拉取数据返回消息的最大条数，默认 500 条

The maximum number of records returned in a single call to `poll()`.
**Note, that `max.poll.records` does not impact the underlying fetching behavior.**
The consumer will cache the records from each fetch request and returns them incrementally from each poll.

## 消费者再平衡

- `heartbeat.interval.ms`
- `session.timeout.ms`
- `max.poll.interval.ms`
- `partition.assignment.strategy`





