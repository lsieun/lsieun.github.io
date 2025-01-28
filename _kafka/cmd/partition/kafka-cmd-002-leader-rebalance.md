---
title: "平衡 Leader"
sequence: "102"
---

## 平衡 Leader

## 如何出现不平衡

### 创建主题

创建主题：

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 \
--create \
--topic my-favorite-topic \
--partitions 3 \
--replication-factor 3
```

查看主题：

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
```

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
Topic: test	TopicId: BKS-TlfqS9GxDsQ6TSEB8w	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 2	Replicas: 2,3,1	Isr: 2,3,1
	Topic: test	Partition: 1	Leader: 3	Replicas: 3,1,2	Isr: 3,1,2
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2,3	Isr: 1,2,3
```

### 关闭 server2

关闭 `server2` 上的 Kafka：

```text
$ kafka-server-start.sh -daemon /opt/module/kafka/config/server.properties
$ kafka-server-stop.sh
```

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
Topic: test	TopicId: BKS-TlfqS9GxDsQ6TSEB8w	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 3	Replicas: 2,3,1	Isr: 3,1
	Topic: test	Partition: 1	Leader: 3	Replicas: 3,1,2	Isr: 3,1
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2,3	Isr: 1,3
```

### 关闭 server3

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
Topic: test	TopicId: BKS-TlfqS9GxDsQ6TSEB8w	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 1	Replicas: 2,3,1	Isr: 1
	Topic: test	Partition: 1	Leader: 1	Replicas: 3,1,2	Isr: 1
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2,3	Isr: 1
```

### 启动 server2

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
Topic: test	TopicId: BKS-TlfqS9GxDsQ6TSEB8w	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 1	Replicas: 2,3,1	Isr: 1,2
	Topic: test	Partition: 1	Leader: 1	Replicas: 3,1,2	Isr: 1,2
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2,3	Isr: 1,2
```

### 启动 server3

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
Topic: test	TopicId: BKS-TlfqS9GxDsQ6TSEB8w	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 1	Replicas: 2,3,1	Isr: 1,2,3
	Topic: test	Partition: 1	Leader: 1	Replicas: 3,1,2	Isr: 1,2,3
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2,3	Isr: 1,2,3
```

## 手动平衡 Leader

### 如何使用

```text
$ kafka-leader-election.sh --help
```

使用的脚本：`kafka-leader-election.sh`

必要的参数：

- `--bootstrap-server`：指定服务器列表
- `--election-type`：选举的类型，默认选择 `preferred`

下面三个参数三选一：

- `--all-topic-partitions`：平衡所有的主题、所有的分区
- `--topic`：平衡指定的主题。如果选择这个参数，则必须使用 `--partition` 指定分区
- `--path-to-json-file`：将需要平衡的主题、分区信息写入一个 json 文件

### 平衡所有

```text
$ kafka-leader-election.sh \
--bootstrap-server server1:9092,server2:9092,server3:9092 \
--election-type preferred \
--all-topic-partitions
```

```text
$ kafka-leader-election.sh \
> --bootstrap-server server1:9092,server2:9092,server3:9092 \
> --election-type preferred \
> --all-topic-partitions
Successfully completed leader election (PREFERRED) for partitions test-1, test-0

$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
Topic: test	TopicId: BKS-TlfqS9GxDsQ6TSEB8w	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 2	Replicas: 2,3,1	Isr: 1,2,3
	Topic: test	Partition: 1	Leader: 3	Replicas: 3,1,2	Isr: 1,2,3
	Topic: test	Partition: 2	Leader: 1	Replicas: 1,2,3	Isr: 1,2,3
```

### 平衡指定主题

```text
$ kafka-leader-election.sh \
--bootstrap-server server1:9092,server2:9092,server3:9092 \
--election-type preferred \
--topic my-favorite-topic \
--partition 1
```

### JSON 文件平衡

File: `test.json`

```json
{
  "partitions": [
    {
      "topic": "test",
      "partition": 1
    },
    {
      "topic": "test",
      "partition": 2
    }
  ]
}
```

```text
$ kafka-leader-election.sh \
--bootstrap-server server1:9092,server2:9092,server3:9092 \
--election-type preferred \
--path-to-json-file test.json
```

## 自动平衡 Leader

如果不想每次都手动执行命令平衡 Leader，那么可以修改配置文件，实现 Leader 的自动平衡：

```text
vi $KAFKA_HOME/config/server.properties
```

```text
auto.leader.rebalance.enable=true
```

但是，一般我们都不会去做自动的平衡 Leader，真的出现了倾斜的情况，我们一般会设计定时任务，周期性的去调用手动平衡的方式来实现 Leader 的平衡。

