---
title: "Kafka Intro"
sequence: "101"
---


## 核心概念

![](/assets/images/kafka/kafka-core-concepts.png)

- **Broker**（代理）：Kafka节点，一个 Kafka 节点就是一个 Broker；多个 Broker 可以组成一个 Kafka 集群，每一个 Broker 可以有多个 Topic。
- **Producer**（生产者）：生产 message （数据）发送到 topic。
- **Consumer**（消费者）：订阅 topic 消费 message，consumer 作为一个线程来消费。
- **Consumer Group**（消费组）：一个 Consumer Group 包含多个 consumer，这个是预先在配置文件中配置好的。
- **Topic**（主题）：一种消息类型，每一条发送到 Kafka 集群的消息都可以有一个类别，这个类别叫做 topic。
  不同的消息会进行分开存储；如果 topic 很大，可以分布到多个 broker 上，例如 page view 日志、click 日志等都可以以 topic 的形式存在，
  Kafka 集群能够同时负责多个 topic 的分发。也可以这样理解：topic 被认为是一个队列，每一条消息都必须指定它的 topic，
  可以说我们需要明确把消息放入哪一个队列。
- **Partition**（分区）：topic 物理上的分组，一个 topic 可以分为多个 partition，每个 partition 是一个有序的队列。
- **Replicas**（副本）：每一个分区，根据副本因子 N，会有 N 个副本。
  比如，在 broker1 上有一个 topic，分区为 topic-1，副本因子为 2，
  那么在两个 broker 的数据目录里，就都有一个 topic-1，其中一个是 leader，一个是 replicas。
- **Segment**：partition 物理上由多个 segment 组成，每个 segment 存着 message 信息。

## 应用场景

- 缓冲/消峰
- 解耦
- 异步通信

消息队列两种模式：

- 点对点模式
    - 一个消费者
    - 消费者主动摘取数据，
    - 消息收到后，清除消息
- 发布/订阅模式：
    - 多个消费者
    - 可以有多个topic主题
    - 消费者消费数据之后，不删除数据
    - 每个消费者相互独立，都可以消费到数据

Kafka基础架构

- 一个topic分成多个partition



