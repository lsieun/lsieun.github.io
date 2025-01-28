---
title: "Kafka 消费者组"
sequence: "102"
---

## 消费者组

消费者组，其实就是一个容器，可以容纳若干个消费者。每个消费者必须被包含在某一个消费者组里面。

```text
$ kafka-console-consumer.sh --bootstrap-server 0.0.0.0:9092 \
--topic my-favorite-topic \
--from-beginning \
--group my-console-group
```

在使用 `--group` 指定分组的时候，

- 如果分组存在，则将当前消费者添加到这个分组中；
- 如果分组不存在，则会自动创建分组，并当前消费者添加到这个分组。

如果消费者在启动的时候，没有指定分组，则会自动创建一个带有序号的分组，将消费者添加到这个分组中。

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 \
--describe --group my-console-group
```

### 查看消费者组列表

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 --list
```

### 查看消费者组详细信息

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 --describe --group my-console-group

GROUP     TOPIC    PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG    CONSUMER-ID             HOST            CLIENT-ID
my-console-group  test     0          1               1               0      console-consumer-...5b7 /192.168.80.131 console-consumer
my-console-group  test     1          13              13              0      console-consumer-...5b7 /192.168.80.131 console-consumer
my-console-group  test     2          0               0               0      console-consumer-...5b7 /192.168.80.131 console-consumer
```

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 --describe --group my-java-group --members

GROUP           CONSUMER-ID                             GROUP-INSTANCE-ID HOST            CLIENT-ID                 #PARTITIONS     
my-java-group   C0-b8203f75-d1c8-4df1-9a21-a6e54c850424 C0                /192.168.80.1   consumer-my-java-group-C0 3               
my-java-group   C1-9a96d08e-b3b7-4520-a299-715eb851b700 C1                /192.168.80.1   consumer-my-java-group-C1 2               
my-java-group   C3-48f08b9c-ac7c-4382-a2de-a6315e5e82f1 C3                /192.168.80.1   consumer-my-java-group-C3 2
```

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 --describe --group my-java-group --members --verbose

GROUP           CONSUMER-ID            GROUP-INSTANCE-ID HOST            CLIENT-ID                 #PARTITIONS     ASSIGNMENT
my-java-group   C0-...-a6e54c850424    C0                /192.168.80.1   consumer-my-java-group-C0 3               my-favorite-topic(0,1,2)
my-java-group   C1-...-715eb851b700    C1                /192.168.80.1   consumer-my-java-group-C1 2               my-favorite-topic(3,4)
my-java-group   C3-...-a6315e5e82f1    C3                /192.168.80.1   consumer-my-java-group-C3 2               my-favorite-topic(5,6)
```

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 --describe --group my-java-group --state            

GROUP                     COORDINATOR (ID)          ASSIGNMENT-STRATEGY  STATE           #MEMBERS
my-java-group             192.168.80.133:9092 (3)   range                Stable          3
```

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 --describe --group my-java-group --offsets

GROUP           TOPIC        PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG    CONSUMER-ID            HOST            CLIENT-ID
my-java-group   my-x-topic   0          4               4               0      C0-...-a6e54c850424    /192.168.80.1   consumer-my-java-group-C0
my-java-group   my-x-topic   1          4               4               0      C0-...-a6e54c850424    /192.168.80.1   consumer-my-java-group-C0
my-java-group   my-x-topic   2          4               4               0      C0-...-a6e54c850424    /192.168.80.1   consumer-my-java-group-C0
my-java-group   my-x-topic   3          4               4               0      C1-...-715eb851b700    /192.168.80.1   consumer-my-java-group-C1
my-java-group   my-x-topic   4          4               4               0      C1-...-715eb851b700    /192.168.80.1   consumer-my-java-group-C1
my-java-group   my-x-topic   5          4               4               0      C3-...-a6315e5e82f1    /192.168.80.1   consumer-my-java-group-C3
my-java-group   my-x-topic   6          4               4               0      C3-...-a6315e5e82f1    /192.168.80.1   consumer-my-java-group-C3
```

### 删除消费者组

```text
$ kafka-consumer-groups.sh --bootstrap-server 0.0.0.0:9092 --delete --group my-console-group
```

## 消费数据详解

Kafka 消费者在消费数据的时候，都是分组别的。
不同组的消费不受影响，相同组内的消费需要注意。
如果 partition 有 3 个，消费者有 3 个，那么便是每一个消费者消费其中一个 partition 对应的数据；
如果有 2 个消费者，此时一个消费者消费其中一个 partition 数据，另一个消费者消费 2 个 partition 的数据；
如果有超过 3 个消费者，同一时间只能最多有 3 个消费者消费得到数据。

```text
$ kafka-console-consumer.sh --bootstrap-server 0.0.0.0:9092 \
--group my-console-group \
--topic my-favorite-topic \
--offset earliest \
--partition 2
```

在组内，Kafka 的 topic 的 partition 个数，代表了 Kafka 的 topic 的并行度，
同一时间最多可以有多个线程来消费 topic 的数据，所以如果要想提高 Kafka 的 topic 的消费能力，
应该增大 partition 的个数。
