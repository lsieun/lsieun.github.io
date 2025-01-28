---
title: "生产经验：数据积压（消费者如何提高吞吐量）"
sequence: "107"
---

## Partition 角度

如果是 Kafka 消费能力不足，则可以考虑 **增加 Topic 的分区数**，并且同时提升消费者组的消费者数量，`消费者数=分区数`。（两者缺一不可）

## Request 角度

如果是下游的数据处理不及时，**提高每批次拉取的数量**。
批次拉取数据过少（`拉取数据/处理时间 < 生产速度`），使处理的数据小于生产的数据，也会造成数据积压。

- `max.poll.records`: 500. The maximum number of records returned in a single call to `poll()`.
- `fetch.max.bytes`: 52428800 (50 mebibytes) The maximum amount of data the server should return for a fetch request.

![](/assets/images/kafka/consumer/kafka-consumer-throughout.png)


