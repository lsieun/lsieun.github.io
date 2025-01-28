---
title: "AR/ISR/OSR"
sequence: "102"
---

## AR/ISR/OSR

在 Kafka 中，AR（Assigned Replica）、ISR（In-Sync Replica）和 OSR（Out-of-Sync Replica）是在 Partition 一层的概念。
这些概念用于管理副本（Replica）的状态和复制机制。

每个 Topic 的每个 Partition 都有自己的 AR、ISR 和 OSR：

- AR（Assigned Replica）：AR 是 Partition 所分配的全部副本列表，包括 ISR 和 OSR。AR 代表了所有为该 Partition 提供数据冗余的副本。

- ISR（In-Sync Replica）：ISR 是 Partition 中与 Leader Broker 保持同步的副本列表。

- OSR（Out-of-Sync Replica）：OSR 是 Partition 中未能与 Leader Broker 保持同步的副本列表。OSR 中的副本可能由于网络延迟、硬件故障等原因而无法与 Leader Broker 同步。

这些概念的目的是确保数据的可靠性和高可用性。Kafka 通过维护 ISR 来确定可用的副本，并将消息复制到 ISR 中的所有副本来提供数据冗余和容错性。如果副本无法与 Leader Broker 保持同步，它将从 ISR 中移除，成为 OSR，直到它再次与 Leader Broker 同步为止。

### AR

Kafka 分区中的所有副本统称为 AR（Assigned Replicas）

```text
AR = ISR + OSR
```

### ISR

ISR，表示与 Leader 保持同步的 Follower 集合。
如果 Follower 长时间未向 Leader 发送通信请求或同步数据，则该 Follower 将被踢出 ISR。
该时间阈值由 `replica.lag.time.max.ms` 参数设定，默认为 30 秒。
Leader 发生故障之后，就会从 ISR 中选举新的 Leader。

```text
replica.lag.time.max.ms = 30000
```

### OSR

OSR 是指 **Out-of-Sync Replicas**，即与 Leader 副本不同步的 Follower 副本集合。
当 Follower 副本无法及时跟上 Leader 副本的同步进度时，
它将被移出 ISR（**In-Sync Replicas**，与 Leader 副本同步的 Follower副本集合），并被标记为 OSR。
OSR 副本将尝试追赶上来，一旦追赶上来并与 Leader副本保持同步，它将被重新添加到 ISR 中。
