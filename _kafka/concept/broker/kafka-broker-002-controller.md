---
title: "Controller"
sequence: "102"
---

## Controller

### 只有一个 Controller

当 Kafka 集群启动时，集群中的所有 Broker 都会竞选成为 Controller。
最终，只有一个 Broker 会成功当选为 Controller，而其他 Broker 则会成为普通的参与者。
选举 Controller 的过程是通过 ZooKeeper 协调的，确保只有一个 Broker 被选中作为 Controller。

### 作用

Controller 负责管理**集群 Broker 的上下线**，**所有 topic 的分区副本分配**和 **Partition Leader 选举**等工作。

Controller 通过监控 ZooKeeper 中的信息来维护整个集群的状态。
