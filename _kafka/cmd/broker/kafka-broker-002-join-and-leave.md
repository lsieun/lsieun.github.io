---
title: "新节点服役+旧节点退役"
sequence: "102"
---

```text
$ kafka-topics --bootstrap-server 0.0.0.0:9092 --describe --topic my-favorite-topic
Topic: my-favorite-topic	TopicId: VJwNG6k9R8qY0CHXRRdHrw	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: my-favorite-topic	Partition: 0	Leader: 3	Replicas: 3,1,2	Isr: 3,1,2
	Topic: my-favorite-topic	Partition: 1	Leader: 1	Replicas: 1,2,3	Isr: 1,2,3
	Topic: my-favorite-topic	Partition: 2	Leader: 2	Replicas: 2,3,1	Isr: 2,3,1
```

## 服役新节点

第 1 步，创建一个要均衡的主题

```text
vi topics-to-move.json
```

```json
{
  "topics": [
    {
      "topic": "my-favorite-topic"
    }
  ],
  "version": 1
}
```

```text
$ cat <<EOF > topics-to-move.json
{
  "topics": [
    {
      "topic": "my-favorite-topic"
    }
  ],
  "version": 1
}
EOF
```

第 2 步，生成一个负载均衡的计划

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--generate \
--topics-to-move-json-file topics-to-move.json \
--broker-list "1,2,3,4"
```

```text
$ kafka-reassign-partitions --bootstrap-server 0.0.0.0:9092 --generate --topics-to-move-json-file topics-to-move.json --broker-list "1,2,3,4"
Current partition replica assignment
{
  "version": 1,
  "partitions": [
    {
      "topic": "my-favorite-topic",
      "partition": 0,
      "replicas": [3, 1, 2],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 1,
      "replicas": [1, 2, 3],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 2,
      "replicas": [2, 3, 1],
      "log_dirs": ["any", "any", "any"]
    }
  ]
}

Proposed partition reassignment configuration
{
  "version": 1,
  "partitions": [
    {
      "topic": "my-favorite-topic",
      "partition": 0,
      "replicas": [1, 2, 3],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 1,
      "replicas": [2, 3, 4],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 2,
      "replicas": [3, 4, 1],
      "log_dirs": ["any", "any", "any"]
    }
  ]
}
```

第 3 步，创建副本存储计划

```text
vi increase-replication-factor.json
```

```json
{
  "version": 1,
  "partitions": [
    {
      "topic": "my-favorite-topic",
      "partition": 0,
      "replicas": [1, 2, 3],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 1,
      "replicas": [2, 3, 4],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 2,
      "replicas": [3, 4, 1],
      "log_dirs": ["any", "any", "any"]
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
      "topic": "my-favorite-topic",
      "partition": 0,
      "replicas": [1, 2, 3],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 1,
      "replicas": [2, 3, 4],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 2,
      "replicas": [3, 4, 1],
      "log_dirs": ["any", "any", "any"]
    }
  ]
}
EOF
```

第 4 步，执行副本存储计划

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--execute \
--reassignment-json-file increase-replication-factor.json
```

```text
$ kafka-reassign-partitions --bootstrap-server 0.0.0.0:9092 --execute --reassignment-json-file increase-replication-factor.json
Current partition replica assignment

{
  "version": 1,
  "partitions": [
    {
      "topic": "my-favorite-topic",
      "partition": 0,
      "replicas": [
        3,
        1,
        2
      ],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 1,
      "replicas": [1, 2, 3],
      "log_dirs": ["any", "any", "any"]
    },
    {
      "topic": "my-favorite-topic",
      "partition": 2,
      "replicas": [2, 3, 1],
      "log_dirs": ["any", "any", "any"]
    }
  ]
}

Save this to use as the --reassignment-json-file option during rollback
Successfully started partition reassignments for my-favorite-topic-0,my-favorite-topic-1,my-favorite-topic-2
```



第 5 步，验证副本存储计划

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--verify \
--reassignment-json-file increase-replication-factor.json
```

```text
$ kafka-reassign-partitions --bootstrap-server 0.0.0.0:9092 --verify --reassignment-json-file increase-replication-factor.json
Status of partition reassignment:
Reassignment of partition my-favorite-topic-0 is completed.
Reassignment of partition my-favorite-topic-1 is completed.
Reassignment of partition my-favorite-topic-2 is completed.

Clearing broker-level throttles on brokers 1,2,3,4
Clearing topic-level throttles on topic my-favorite-topic
```

```text
$ kafka-topics --bootstrap-server 0.0.0.0:9092 --describe --topic my-favorite-topic
Topic: my-favorite-topic	TopicId: VJwNG6k9R8qY0CHXRRdHrw	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: my-favorite-topic	Partition: 0	Leader: 1	Replicas: 1,2,3	Isr: 3,1,2
	Topic: my-favorite-topic	Partition: 1	Leader: 2	Replicas: 2,3,4	Isr: 2,3,4
	Topic: my-favorite-topic	Partition: 2	Leader: 3	Replicas: 3,4,1	Isr: 3,1,4
```

## 退役旧节点

第 1 步，创建一个要均衡的主题

```text
vi topics-to-move.json
```

```json
{
  "topics": [
    {
      "topic": "my-favorite-topic"
    }
  ],
  "version": 1
}
```

```text
$ cat <<EOF > topics-to-move.json
{
  "topics": [
    {
      "topic": "my-favorite-topic"
    }
  ],
  "version": 1
}
EOF
```

第 2 步，创建执行计划

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--generate \
--topics-to-move-json-file topics-to-move.json \
--broker-list "1,2,3"
```

```text
$ kafka-reassign-partitions --bootstrap-server 0.0.0.0:9092 --generate --topics-to-move-json-file topics-to-move.json --broker-list "1,2,3"
```

第 3 步，创建副本存储计划

```text
vi increase-replication-factor.json
```

第 4 步，执行副本存储计划

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--execute \
--reassignment-json-file increase-replication-factor.json
```

第 5 步，验证副本存储计划

```text
$ bin/kafka-reassign-partitions.sh \
--bootstrap-server 0.0.0.0:9092 \
--verify \
--reassignment-json-file increase-replication-factor.json
```

```text
$ kafka-topics --bootstrap-server 0.0.0.0:9092 --describe --topic my-favorite-topic
```
