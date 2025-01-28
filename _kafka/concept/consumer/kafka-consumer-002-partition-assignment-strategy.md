---
title: "分区分配策略"
sequence: "102"
---

## 分区分配策略

Kafka 有四种主流的分区分配策略：

- Range
- RoundRobin
- Sticky
- CooperativeSticky

Kafka 可以同时使用多个分区策略：

### 默认分区策略

- 默认分区策略：Range + CooperativeSticky

- `partition.assignment.strategy`：消费者分区分配策略，默认策略是 `Range` + `CooperativeSticky`。

```text
partition.assignment.strategy = [
    class org.apache.kafka.clients.consumer.RangeAssignor,
    class org.apache.kafka.clients.consumer.CooperativeStickyAssignor
]
```

### 修改分区策略

- 修改分区策略：通过 `partition.assignment.strategy` 配置参数

## Range

![](/assets/images/kafka/internal/Kafka_Internals_069.png)
