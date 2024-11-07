---
title: "生产者：消息发送流程"
sequence: "102"
---

## 发送原理

在消息的发送的过程中，涉及到两个线程：**main 线程**和 **sender 线程**。

- 在 main 线程中，创建一个**双端队列 RecordAccumulator**，main 线程将消息发送给 RecordAccumulator
- sender 线程，不断从 RecordAccumulator 中拉取消息发送到 Kafka Broker。

![](/assets/images/kafka/producer/producer-send-record-detail-001.png)

目标：将『外部数据』发送到『Kafka 集群』。

第 1 步，在 main 线程中，会创建 Producer 对象，然后调用 `send(ProducerRecord)` 方法

第 2 步，接下来，会经过『拦截器』（Interceptors），可以对数据进行加工和操作

第 3 步，经过『序列化器』（Serializer）。为什么不用 Java 的序列化器（`Serializable`）呢？
是因为Java的序列化器『太重』，里面除了『有效的数据』，还有一些『保证安全的数据』；
在大数据的场景下，每批传来的数据都非常庞大，就希望传过来的数据大部分都是『有效数据』，只做一个简单的校验就可以了，
因此大数据的框架就都拥有自己的序列化机制。

第 4 步，经过『分区器』（Partitioner）。将 Record 放到 `RecordAccumulator` 的不同分区队列里，每个分区（Partition）都有自己的队列（DQueue）。



第 5 步，`RecordAccumulator` 都是在内存里完成的，其总内存大小是 32MB；每一批次（`ProducerBatch`）的大小是 16K。

第 6 步，sender 线程中，NetworkClient 负责将 `RecordAccumulator` 的队列的数据发送到 Kafka 集群。

发送数据的两个条件（满足一个即可）：

- `batch.size`：默认 16K。只有数据积累到 `batch.size` 之后，sender 才会发送数据。
- `linger.ms`：单位 ms，默认值是 `0ms`，表示没有延迟。如果数据迟迟未达到 `batch.size`，sender 等待 `linger.ms` 设置的时间，到了之后，就会发送数据。

发送 Request 的细节：

- sender 线程，会将 `RecordAccumulator` 的队列的数据按照 `Broker` 分组，在同一个 Broker 组下，可能有不同的 Partition，那么每个 Partition 封装成一个 Request。
- sender 线程，发送了一个 Request，Broker 没有响应，sender 还可以继续发送 Request，最多可以发送 5 个。

第 7 步，sender 线程中，Selector

```text
NetworkClient 和 Selector 通常是在不同的线程中运行的，
其中 Selector 运行在专门的网络 I/O 线程中，负责处理网络连接的 I/O 事件，
而 NetworkClient 则负责管理连接、发送和接收数据等业务逻辑。
这种分离的设计有助于提高 Kafka 客户端的性能和并发处理能力。
```

第 8 步，Broker 进行应答：

- `0`：生产者发送过来的数据，不需要等数据落盘，就直接应答。
- `1`:生产者发送过来的数据，Leader 收到数据后应答。
- `-1`（`all`）:生产者发送过来的数据，Leader 和 ISR 队列里面的所有节点收齐数据后应答。

![](/assets/images/kafka/producer/producer-send-record-detail-002.png)

第 9 步，如果 selector 发送 Request 成功了，就会让 NetworkClient 删除相应的 Request，并从 RecordAccumulator 中删除相应的数据。

第 10 步，如果 selector 发送 Request 失败了，就会进行重试，默认是重试 Integer.MAX_VALUE。
默认的重试次数，设置的非常大，也就是说『不成功，就一直尝试，直到成功为止』。

## Reference

- [视频：Kafka 生产者原理](https://www.bilibili.com/video/BV1vr4y1677k?p=10)

