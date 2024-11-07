---
title: "Kafka Partition"
sequence: "101"
---

## 分区副本分配

如果 Kafka 服务器有 4 个节点，那么设置 Kafka 的分区数大于服务器台数，在 Kafka 底层如何分配存储副本呢？

第 1 步，创建 16 个分区，3 个副本：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--create \
--topic my-favorite-topic \
--partitions 16 \
--replication-factor 3
```

第 2 步，查看分区和副本情况：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --describe --topic my-favorite-topic
```

```text
Topic: my-favorite-topic	TopicId: FfRu7Pt4Qa2Frln0OyS0YQ	PartitionCount: 16	ReplicationFactor: 3	Configs: 
	Topic: my-favorite-topic	Partition: 0	Leader: 4	Replicas: 4,1,2	Isr: 4,1,2
	Topic: my-favorite-topic	Partition: 1	Leader: 1	Replicas: 1,2,3	Isr: 1,2,3
	Topic: my-favorite-topic	Partition: 2	Leader: 2	Replicas: 2,3,4	Isr: 2,3,4
	Topic: my-favorite-topic	Partition: 3	Leader: 3	Replicas: 3,4,1	Isr: 3,4,1
	
	Topic: my-favorite-topic	Partition: 4	Leader: 4	Replicas: 4,3,1	Isr: 4,3,1
	Topic: my-favorite-topic	Partition: 5	Leader: 3	Replicas: 3,1,2	Isr: 3,1,2
	Topic: my-favorite-topic	Partition: 6	Leader: 1	Replicas: 1,2,4	Isr: 1,2,4
	Topic: my-favorite-topic	Partition: 7	Leader: 2	Replicas: 2,4,3	Isr: 2,4,3
	
	Topic: my-favorite-topic	Partition: 8	Leader: 1	Replicas: 1,2,4	Isr: 1,2,4
	Topic: my-favorite-topic	Partition: 9	Leader: 2	Replicas: 2,4,3	Isr: 2,4,3
	Topic: my-favorite-topic	Partition: 10	Leader: 4	Replicas: 4,3,1	Isr: 4,3,1
	Topic: my-favorite-topic	Partition: 11	Leader: 3	Replicas: 3,1,2	Isr: 3,1,2
	
	Topic: my-favorite-topic	Partition: 12	Leader: 2	Replicas: 2,3,1	Isr: 2,3,1
	Topic: my-favorite-topic	Partition: 13	Leader: 3	Replicas: 3,1,4	Isr: 3,1,4
	Topic: my-favorite-topic	Partition: 14	Leader: 1	Replicas: 1,4,2	Isr: 1,4,2
	Topic: my-favorite-topic	Partition: 15	Leader: 4	Replicas: 4,2,3	Isr: 4,2,3
```

## 生产经验-手动调整分区副本

在生产环境中，每台服务器的配置和性能不一致，但是 Kafka 只会根据自己的代码规则创建对应的分区副本，
就会导致个别服务器存储压力较大。所以需要手动调整分区副本的存储。

需求：创建一个新的 topic，4 个分区，2 个副本，名称为 `test`。将该 topic 的所有副本都存储到 broker1 和 broker2 两台服务器上。

![](/assets/images/kafka/partition/kafka-partition-reassign-replica-001.png)

第 1 步，创建新的 topic：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--create \
--topic test \
--partitions 4 \
--replication-factor 2
```

第 2 步，查看分区副本存储情况：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --describe --topic test
```

可以看到每一个 Broker 上都有 Partition 数据：

```text
Topic: test	TopicId: kefYt9HQS9GLDdUOXAkwyw	PartitionCount: 4	ReplicationFactor: 2	Configs: 
	Topic: test	Partition: 0	Leader: 3	Replicas: 3,4	Isr: 3,4
	Topic: test	Partition: 1	Leader: 4	Replicas: 4,1	Isr: 4,1
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2	Isr: 1,2
	Topic: test	Partition: 3	Leader: 2	Replicas: 2,3	Isr: 2,3
```

第 3 步，创建副本存储计划（所有副本都指定存储在 broker0、broker1中）

```text
vi increase-replication-factor.json
```

```json
{
  "version": 1,
  "partitions": [
    {
      "topic": "test",
      "partition": 0,
      "replicas": [1, 2]
    },
    {
      "topic": "test",
      "partition": 1,
      "replicas": [0, 1]
    },
    {
      "topic": "test",
      "partition": 2,
      "replicas": [0, 1]
    },
    {
      "topic": "test",
      "partition": 3,
      "replicas": [0, 1]
    }
  ]
}
```

```text
$ cat <<EOF > increase-replication-factor.json
{
  "version": 1,
  "partitions": [
    {
      "topic": "test",
      "partition": 0,
      "replicas": [1, 2]
    },
    {
      "topic": "test",
      "partition": 1,
      "replicas": [1, 2]
    },
    {
      "topic": "test",
      "partition": 2,
      "replicas": [2, 1]
    },
    {
      "topic": "test",
      "partition": 3,
      "replicas": [2, 1]
    }
  ]
}
EOF
```

第 4 步，执行副本存储计划：

```text
$ kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--execute \
--reassignment-json-file increase-replication-factor.json
```

第 5 步，验证副本存储计划：

```text
$ kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--verify \
--reassignment-json-file increase-replication-factor.json
```

第 6 步，查看分区副本存储情况：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --describe --topic test
```

## 生产经验-Leader Partition 自动平衡

正常情况下，Kafka 本身会自动把 Leader Partition 均匀分散在各个机器上，来保证每台机器的读写吞吐量都是均匀的。
但是，如果某些 Broker 宕机，会导致 Leader Partition 过于集中在其它少部分几台 Broker 上，
这会导致几台 Broker 的读写请求压力过高，其它宕机的 Broker 重启之后都是 Follower Partition，读写请求很低，造成集群不均衡。

- `auto.leader.rebalance.enable`，默认值是 `true`，即自动 Leader Partition 平衡
- `leader.imbalance.per.broker.percentage`：默认是 10%。每个 Broker 允许的不平衡 Leader 的比率。
  如果每个 Broker 超过了这个值，控制器会触发 Leader 的平衡。
- `leader.imbalance.check.interval.seconds`：默认值 300 秒。检查 Leader 负载是否平衡的时间间隔。

```text
auto.leader.rebalance.enable = true
leader.imbalance.check.interval.seconds = 300
leader.imbalance.per.broker.percentage = 10
```

![](/assets/images/kafka/partition/kafka-partition-leader-replica-rebalance.png)

## 生产经验-增加副本因子

在生产环境中，由于某个主题的重要等级需要提升，我们考虑增加副本。副本数的增加需要先制定计划，然后根据计划执行。

第 1 步，创建 topic：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--create \
--topic test2 \
--partitions 3 \
--replication-factor 1
```

第 2 步，创建副本存储计划：

```text
$ cat <<EOF > increase-replication-factor.json
{
  "version": 1,
  "partitions": [
    {
      "topic": "test2",
      "partition": 0,
      "replicas": [1, 2, 3]
    },
    {
      "topic": "test2",
      "partition": 1,
      "replicas": [2, 3, 1]
    },
    {
      "topic": "test2",
      "partition": 2,
      "replicas": [3, 1, 2]
    }
  ]
}
EOF
```

第 3 步，执行副本存储计划：

```text
$ kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--execute \
--reassignment-json-file increase-replication-factor.json
```

