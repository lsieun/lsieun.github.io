---
title: "生产者：数据有序和无序"
sequence: "107"
---

![](/assets/images/kafka/producer/producer-data-order-001.png)

## 数据乱序

Kafka 在 1.x 版本之前，保证数据单分区有序，条件如下：

```text
# 不需要考虑是否开启幂等性
max.in.flight.requests.per.connection=1
```

Kafka 在 1.x 及以后版本，保证数据单分区有序，条件如下：

- 未开启幂等性：`max.in.flight.requests.per.connection` 需要设置为 `1`
- 开启幂等性：`max.in.flight.requests.per.connection` 需要设置小于等于 `5`

原因说明：因为在 Kafka 1.x 之后，启用幂等性后，Kafka 服务端会缓存 Producer 发来的最近 5 个 Request 的元数据，
因此可以保证最近 5 个 Request 的数据都是有序的。


