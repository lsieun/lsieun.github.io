---
title: "Replica/Leader/Follower"
sequence: "101"
---

## 副本

### 副本基本信息

Kafka 副本作用：提高数据可靠性

```text
作用
```

Kafka 默认副本 1 个，生产环境一般配置为 2 个，保证数据可靠性；
如果副本数量太多，会增加磁盘存储空间，增加网络数据传输，降低效率。

```text
数量
```

Kafka 中副本分为 Leader 和 Follower。
Kafka 生产者只会把数据发往 Leader，然后 Follower 找 Leader 进行同步数据。

```text
角色
```

### Leader 选举流程

在 Kafka 中，Partition Leader 的选举流程如下：

1. 检测 Leader 不可用：Kafka 集群中的每个 Broker 都会与 ZooKeeper 保持连接，并通过心跳机制告知其健康状态。当一个 Broker 发现某个 Partition 的 Leader 不可用时，它会将该信息上报给 Controller。


2. ISR 中选择新的 Leader：Controller 接收到 Leader 不可用的通知后，会根据 ISR（In-Sync Replica）列表来选择一个新的 Leader。ISR 是与 Leader 保持同步的副本列表，通常包括多个副本。Controller 会选择 ISR 中的一个副本作为新的 Leader。

3. 选举条件：Controller 会选择 ISR 中的一个副本作为新的 Leader，需要满足以下条件：
  - 副本必须在 ISR 列表中。
  - 副本的数据与 Leader 的数据保持同步。
  - 副本必须是活跃的，即与 ZooKeeper 保持连接并能够正常工作。

4. 更新选举结果：Controller 选择完新的 Leader 后，会将选举结果写入 ZooKeeper，通知集群中的所有 Broker 更新 Partition 的元数据信息。

5. 客户端感知：一旦选举结果被更新到 ZooKeeper，客户端就会感知到新的 Leader，并开始将生产者和消费者的请求发送给新的 Leader。

需要注意的是，如果 ISR 中没有足够的副本满足选举条件，那么无法进行 Leader 选举，Partition 将处于 ISR 不可用的状态，直到有足够的副本与 Leader 同步为止。这样可以确保数据的一致性和可用性。

总结起来，Partition Leader 的选举流程是通过 Controller 检测 Leader 不可用，并根据 ISR 列表选择一个满足条件的副本作为新的 Leader，然后将选举结果更新到 ZooKeeper，通知集群中的所有 Broker。

## Leader 和 Follower 故障处理细节

### Follower 故障处理细节

- LEO (Log End Offset)：每个副本的最后一个 offset，LEO 其实就是最新的 offset + 1
- HW (High Watermark)：所有副本中最小的 LEO

Follower 故障

- 1、Follower (broker2) 发生故障后，会被临时踢出 ISR
- 2、这个期间 Leader(broker0) 和 Follower(broker1) 继续接收数据
- 3、待该 Follower(broker2) 恢复后，Follower(broker2) 会读取本地磁盘记录的上次 HW，并将 Log 文件高于 HW 的部分截取掉，从 HW 开始向 Leader(broker0) 进行同步
- 4、等该 Follower(broker2) 的 LEO 大于等于该 Partition 的HW，即 Follower(broker2) 追上 Leader(broker0) 之后，就可以重新加入 ISR 了

![](/assets/images/kafka/broker/kafka-broker-partition-follower-fail-001.png)

![](/assets/images/kafka/broker/kafka-broker-partition-follower-fail-002.png)

![](/assets/images/kafka/broker/kafka-broker-partition-follower-fail-003.png)

![](/assets/images/kafka/broker/kafka-broker-partition-follower-fail-004.png)

### Leader 故障处理细节

- Leader 发生故障之后，会从 ISR 中选出一个新的 Leader
- 为保证多个副本之间的数据一致性，其余的 Follower 会先将各自的 Log 文件高于 HW 的部分截掉，然后从新的 Leader 同步数据

注意：这只能保证副本之间的数据一致性，并不能保证数据不丢失或者不重复。

![](/assets/images/kafka/broker/kafka-broker-partition-leader-fail-001.png)




