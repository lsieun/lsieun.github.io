---
title: "消费者偏移量"
sequence: "103"
---

## 初始偏移量

```text
# 默认是 latest
auto.offset.reset = earliest | latest | none
```

当 Kafka 中没有初始偏移量（消费者组第一次消费）或服务器上不存在当前偏移量（例如，该数据已经被删除），该怎么办？

- `earliest`：自动将偏移量重置为最早的偏移量（`--from-begining`）
- `latest`：默认值，自动将偏移量重置为最新偏移量。
- `none`：如果未找到消费者组的先前偏移量，则向消费者抛出异常。

## 偏移量存储位置

- 在 Kafka 0.9 版本之前，消费者的偏移量保存在 ZooKeeper 中。
- 从 Kafka 0.9 版本开始，消费者的偏移量保存在 Kafka 的内部主题 `__consumer_offsets` 中，而不再依赖于 ZooKeeper。


