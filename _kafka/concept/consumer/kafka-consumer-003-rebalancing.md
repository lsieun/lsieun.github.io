---
title: "消费者组重新平衡"
sequence: "103"
---

## 两个角色



## Group Coordinator

在 Kafka Cluster 中，一般有多个 Group Coordinator。

在 Kafka 中，Group Coordinator 是在 Consumer Group 的第一个成员加入时动态创建的。
当第一个消费者尝试加入一个新的 Consumer Group 时，Kafka 集群会自动选择一个 Broker 作为该 Consumer Group 的 Group Coordinator，
并将其分配给该 Consumer Group。这个选举过程是在第一个消费者发起 JoinGroup 请求时触发的。

![](/assets/images/kafka/internal/Kafka_Internals_065.png)

### Group Leader

The first consumer who requests the group coordinator to join the group becomes the **group leader**.
When a rebalance occurs for any reason,
the group leader receives a list of the group members from the group coordinator.
Then, the group leader reassigns the partitions among the consumers in that list
using a customizable strategy set in the `partition.assignment.strategy` configuration.

### 两者的区别

The **consumer group coordinator** is one of the brokers
while the **group leader** is one of the consumer in a consumer group.

The group coordinator is nothing but one of the brokers which receives heartbeats (or polling for messages)
from all consumers of a consumer group.
Every consumer group has a group coordinator.
If a consumer stops sending heartbeats, the coordinator will trigger a rebalance.

### 这样设计有什么好处？

What is the benefit from separating group management into two different sets of responsibilities?

The key point of this separation is that **group leader** is responsible for computing the assignments for the whole group.

It means that this assignment strategy can be configured on a consumer (see `partition.assignment.strategy` consumer config parameter).

If a partitions assignment was handled by a **consumer group coordinator**,
it would be impossible to configure a custom assignment strategy without rebooting the broker.

## Group Startup

### Step 1 – Find Group Coordinator

![](/assets/images/kafka/internal/Kafka_Internals_066.png)

- Consumer：当一个 consumer 启动的时候，它会向某一个 `broker(i)` 发送 `FindCoordinatorRequest`，其中包含 `group.id`。
- Broker：
    - `broker(i)` 根据 `group.id` 计算一个 `hash` 值
    - 找到 `__consumer_offsets` topic 的 partition 数量为 `n`，一般为 50
    - 计算 `partition(index)` 的索引：`index = hash % n`
    - `partition(index)` 所在的 `broker(x)` 就是 Group Coordinator 的位置
    - `broker(i)` 将 `broker(x)` 返回给 consumer

查看 `__consumer_offsets` 主题：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --describe --topic __consumer_offsets
```

查看主题对应的 Group Coordinator：

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 --describe --group my-java-group --state
GROUP                     COORDINATOR (ID)          ASSIGNMENT-STRATEGY  STATE           #MEMBERS
my-java-group             192.168.80.133:9092 (3)   range                Stable          1
```

### Step 2 – Members Join

![](/assets/images/kafka/internal/Kafka_Internals_067.png)

- Consumer: consumer 向 `broker(x)` 发送一个 `JoinGroupRequest`，其中包含着 topic subscription 信息。
- Broker：
    - 在 `broker(x)` 上，Group Coordinator 会选择第一个发送 `JoinGroupRequest` 的 consumer 作为 Group
      Leader，表示为 `consumer(leader)`。
    - Group Coordinator 会向 `consumer(leader)` 发送 `memberId`、member list、subscriptions 信息
    - Group Coordinator 只会向其它 consumer 发送 `memberId` 信息
- Consumer：`consumer(leader)` 会根据 member list、subscriptions 信息和分区分配策略（partition assignment
  strategy）进行『消费者-分区分配』规划。

```text
Group Coordinator 是在 Broker 一侧的；
Group Leader 是在 Consumer 一侧的
```

### Step 3 – Partitions Assigned

![](/assets/images/kafka/internal/Kafka_Internals_068.png)

- Consumer
    - `consumer(leader)` 会向 Group Coordinator 发送 `SyncGroupRequest`，其中包含 `memberId`、group partition assignments
      信息。
    - 普通的 consumer 也会向 Group Coordinator 发送 `SyncGroupRequest`，其中只包含 `memberId` 信息。
- Broker
    - Group Coordinator 会将 group partition assignments 信息分发给所有的 consumer。
- Consumer：开始消费数据

## 记录消费位置

### Tracking Partition Consumption

![](/assets/images/kafka/internal/Kafka_Internals_071.png)

- Consumer：consumer 向 Group Coordinator 发送 `CommitOffsetRequest`
- Broker：Group Coordinator 将 `offset` 信息存储在 `__consumer_offsets` topic 中

### Determining Starting Offset to Consume

![](/assets/images/kafka/internal/Kafka_Internals_072.png)

- Consumer：当 consumer 重启的时候，它会向 Group Coordinator 发送 `OffsetFetchRequest`
- Broker：
    - 如果有 `offset` 记录，Group Coordinator 会将 `offset` 返回给 consumer
    - 如果没有 `offset` 记录，Group Coordinator 会根据 `auto.offset.reset` 的值来决定 `offset` 值，然后返回给 consumer
- Consumer：consumer 从 `offset` 位置开始消费数据

## Group Coordinator Failover

![](/assets/images/kafka/internal/Kafka_Internals_073.png)

The internal `__consumer_offsets` topic is replicated like any other Kafka topic.
Also, recall that the group coordinator is the broker
that hosts the leader replica of the `__consumer_offsets` partition assigned to this group.
So if the group coordinator fails,
a broker that is hosting one of the follower replicas of that partition will become the new group coordinator.
Consumers will be notified of the new coordinator when they try to make a call to the old one,
and then everything will continue as normal.

## Consumer Group Rebalance Triggers

![](/assets/images/kafka/internal/Kafka_Internals_074.png)

One of the key features of consumer groups is rebalancing.
Let's consider some of the events that can trigger a rebalance:

- An instance fails to send a heartbeat to the coordinator before the timeout and is removed from the group
- An instance has been added to the group
- Partitions have been added to a topic in the group's subscription
- A group has a wildcard subscription and a new matching topic is created
- And, of course, initial group startup

An example is the creation of a topic where a consumer is configured with a pattern subscription that matches this topic name.


When a new consumer joins a consumer group it sends a `JoinGroup` request to the **Group Coordinator** on the broker.
The topic partitions are then reassigned across all one or more consumers in the group.
Likewise, when a consumer leaves a group it notifies the Group Coordinator via a `LeaveGroup` request
which again reassigns the topic partitions across the remaining consumers, if there are any.

```text
consumer 是主动者，Group Coordinator 是被动接收者
```

When the Group Coordinator does not hear from a consumer within the expected timeframe,
be it a **heartbeat** or the next `poll()` call,
then it evicts the consumer from the group believing it may have failed.
Once again the topic partitions are reassigned across any other consumers remaining in the group.

```text
个人理解：上面这几种情况，本质上都是『consumer 或 partition 的数量发生了变化』
```

- topic 增加
- 分区
    - 消费者组订阅的任意一个 topic 发生了分区数量的变化
- 消费者组
    - 加入
        - 有新的消费者加入消费者组
    - 退出
        - 消费者退出消费者组
        - 消费者调用 `unsubscribe()` 取消订阅。
        - 有消费者宕机下线。例如长时间的GC。网络延迟导致消费者长时间没有向GroupCoordinator发送心跳请求。
        - 超时
            - `session.timeout.ms`, `heartbeat.interval.ms`
            - `max.poll.interval.ms`

在 Kafka 中，Rebalance 是发生在 Consumer 端的操作。当消费者组内的消费者实例发生变化（如有新的消费者加入或有消费者离开）时，就会触发
Rebalance 操作。

在 Consumer Group 中，每个消费者负责消费一个或多个 Partition 中的消息。
当消费者加入或离开消费者组时，需要重新分配 Partition 给各个消费者，以确保每个 Partition 只被消费者组内的一个消费者消费。

Rebalance 的过程包括以下步骤：

- 当有新的消费者加入或有消费者离开消费者组时，Consumer Group Coordinator 会触发 Rebalance。
- Consumer Group Coordinator 会确定新的消费者分配的 Partition，然后通知每个消费者它们负责消费的 Partition。
- 每个消费者收到分配的 Partition 后，会停止当前正在消费的 Partition，并开始消费新分配的 Partition。

Rebalance 的过程是由 Consumer Group Coordinator 协调并触发的，主要涉及到消费者组内部的重新分配工作，以确保消费者之间均衡地消费消息并避免重复消费或消息漏失的情况。

总结来说，Rebalance 发生在 Consumer 端，是为了在消费者组内部动态调整消费者与 Partition
的分配，确保消费者能够均衡地消费消息，并在消费者变化时保持数据的一致性。

## 发生了 Rebalance

### Consumer Group Rebalance Notification

![](/assets/images/kafka/internal/Kafka_Internals_075.png)

The rebalance process begins with the coordinator notifying the consumer instances that a rebalance has begun.
It does this by piggybacking on the `HeartbeatResponse` or the `OffsetFetchResponse`.

### Stop-the-World Rebalance

![](/assets/images/kafka/internal/Kafka_Internals_076.png)

The traditional rebalance process is rather involved.
Once the consumers receive the rebalance notification from the coordinator,
they will revoke their current partition assignments.
If they have been maintaining any state associated with the data in their previously assigned partitions,
they will also have to clean that up.
Now they are basically like new consumers and will go through the same steps as a new consumer joining the group.

They will send a `JoinGroupRequest` to the coordinator, followed by a `SyncGroupRequest`.
The coordinator will respond accordingly, and the consumers will each have their new assignments.

Any state that is required by the consumer would now have to be rebuilt from the data in the newly assigned partitions.
This process, while effective, has some drawbacks. Let's look at a couple of those now.

### Stop-the-World Problem #1 – Rebuilding State

![](/assets/images/kafka/internal/Kafka_Internals_077.png)

The first problem is the need to **rebuild state**.
If a consumer application was maintaining state based on the events in the partition it had been assigned to,
it may need to read all of the events in the partition to rebuild that state after the rebalance is complete.
As you can see from our example, sometimes this work is being done even when it is not needed.
If a consumer revokes its assignment to a particular partition and
then is assigned that same partition during the rebalance,
a significant amount of wasted processing may occur.

### Stop-the-World Problem #2 – Paused Processing

![](/assets/images/kafka/internal/Kafka_Internals_078.png)

The second problem is that we're required to pause all processing while the rebalance is occurring,
hence the name “Stop-the-world.”
Since the partition assignments for all consumers are revoked at the beginning of the process,
nothing can happen until the process completes and the partitions have been reassigned.
In many cases, as in our example here, some consumers will keep some of the same partitions and could have,
in theory, continued working with them while the rebalance was underway.

Let's see some of the improvements that have been made to deal with these problems.

### Avoid Needless State Rebuild with StickyAssignor

![](/assets/images/kafka/internal/Kafka_Internals_079.png)

First, using the new `StickyAssignor` we can avoid unnecessary state rebuilding.
The main difference with the `StickyAssignor`, is that the state cleanup is moved to a later step,
after the reassignments are complete.
That way if a consumer is reassigned the same partition
it can just continue with its work and not clear or rebuild state.
In our example, state would only need to be rebuilt for partition `p2`, which is assigned to the new consumer.

### Avoid Pause with CooperativeStickyAssignor Step 1

![](/assets/images/kafka/internal/Kafka_Internals_080.png)

To solve the problem of **paused processing**, we introduced the `CooperativeStickyAssignor`.
This assignor works in a two-step process.
In the first step the determination is made as to which partition assignments need to be revoked.
Those assignments are revoked at the end of the first rebalance step.
The partitions that are not revoked can continue to be processed.

### Avoid Pause with CooperativeStickyAssignor Step 2

![](/assets/images/kafka/internal/Kafka_Internals_081.png)

In the second rebalance step, the revoked partitions will be assigned.
In our example, partition 2 was the only one revoked, and it is assigned to the new consumer 3.
In a more involved system, all of the consumers might have new partition assignments,
but the fact remains that any partitions that did not need to move
can continue to be processed without the world grinding to a halt.

## Avoid Rebalance with Static Group Membership

![](/assets/images/kafka/internal/Kafka_Internals_082.png)

As the saying goes, the fastest rebalance is the one that doesn't happen.
That's the goal of static group membership.
With static group membership each consumer instance is assigned a `group.instance.id`.
Also, when a consumer instance leaves gracefully it will not send a `LeaveGroup` request to the coordinator,
so no rebalance is started.
When the same instance rejoins the group,
the coordinator will recognize it and allow it to continue with its existing partition assignments.
Again, no rebalance needed.

Likewise, if a consumer instance fails but is restarted before its heartbeat interval has timed out,
it will be able to continue with its existing assignments.

## Reference

- [Consumer Group Protocol](https://developer.confluent.io/courses/architecture/consumer-group-protocol/)

- [Kafka Consumer Group Rebalance (1 of 2)](https://www.linkedin.com/pulse/kafka-consumer-group-rebalance-1-2-rob-golder) 有许多细节，还需要再看
- [Kafka Consumer Group Rebalance (2 of 2)](https://www.linkedin.com/pulse/kafka-consumer-group-rebalance-2-rob-golder/) 有许多细节，还需要再看
- [Manage Kafka Consumer Groups](https://www.baeldung.com/kafka-manage-consumer-groups)
- [What is the difference in Kafka between a Consumer Group Coordinator and a Consumer Group Leader?](https://stackoverflow.com/questions/42015158/what-is-the-difference-in-kafka-between-a-consumer-group-coordinator-and-a-consu)
- [kafka 重平衡（Rebalance）](https://blog.csdn.net/qq_21383435/article/details/108720155) 有许多细节，还需要再看
- [Kafka Rebalance详解](https://blog.csdn.net/qq_35901141/article/details/115710558) 有许多细节，还需要再看
- [Kafka Client-side Assignment Proposal](https://cwiki.apache.org/confluence/display/KAFKA/Kafka+Client-side+Assignment+Proposal)

