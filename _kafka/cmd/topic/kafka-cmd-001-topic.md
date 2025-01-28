---
title: "Kafka Topic"
sequence: "101"
---

## 主题帮助命令

主题操作相关命令：

```text
$ kafka-topics.sh --zookeeper server1:2181,server2:2181,server3:2181/kafka --[options]
```

查看帮助：

```text
$ kafka-topics.sh --help
This tool helps to create, delete, describe, or change a topic.
Option                                   Description                            
------                                   -----------                            
--alter                                  Alter the number of partitions and     
                                           replica assignment. Update the       
                                           configuration of an existing topic   
                                           via --alter is no longer supported   
                                           here (the kafka-configs CLI supports 
                                           altering topic configs with a --     
                                           bootstrap-server option).
--bootstrap-server <String: server to    REQUIRED: The Kafka server to connect  
  connect to>                              to.
--config <String: name=value>            A topic configuration override for the 
                                           topic being created or altered.
--create                                 Create a new topic.                    
--delete                                 Delete a topic
--describe                               List details for the given topics.
--help                                   Print usage information.
--if-exists                              if set when altering or deleting or    
                                           describing topics, the action will   
                                           only execute if the topic exists.    
--if-not-exists                          if set when creating topics, the       
                                           action will only execute if the      
                                           topic does not already exist.        
--list                                   List all available topics.
--partitions <Integer: # of partitions>  The number of partitions for the topic 
                                           being created or altered (WARNING:   
                                           If partitions are increased for a    
                                           topic that has a key, the partition  
                                           logic or ordering of the messages    
                                           will be affected). If not supplied   
                                           for create, defaults to the cluster  
                                           default.
--replication-factor <Integer:           The replication factor for each        
  replication factor>                      partition in the topic being         
                                           created. If not supplied, defaults   
                                           to the cluster default.
--topic <String: topic>                  The topic to create, alter, describe   
                                           or delete. It also accepts a regular 
                                           expression, except for --create      
                                           option. Put topic name in double     
                                           quotes and use the '\' prefix to     
                                           escape regular expression symbols; e.
                                           g. "test\.topic".
--topics-with-overrides                  if set when describing topics, only    
                                           show topics that have overridden     
                                           configs
```

### 查看主题列表

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --list
```

### 创建主题

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--create \
--topic my-favorite-topic \
--partitions 3 \
--replication-factor 3
```

> 注意：`--replication-factor` 的数量不能超过 Kafka 实例的数量

### 查看主题

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --describe --topic my-favorite-topic
Topic: test	TopicId: g7RpyQLxQiieQrGLAtHeqg	PartitionCount: 3	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 1	Replicas: 1,2,3	Isr: 1,2,3
	Topic: test	Partition: 1	Leader: 2	Replicas: 2,3,1	Isr: 2,3,1
	Topic: test	Partition: 2	Leader: 3	Replicas: 3,1,2	Isr: 3,1,2
```

在 Kafka 中，`ISR`（In-Sync Replicas）是指副本同步队列。

### 修改主题

可以修改主题分区和配置属性等信息，不能修改副本因子，同时也不能将分区数越改越小，例如 `test_topic` 当前分区为 3，修改为 1，这将会报错。

注意事项：

- 不能修改副本因子：`--replication-factor`
- 只能修改为更多的分区数量，不能减少或与当前分区数量相同

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--alter --topic my-favorite-topic --partitions 4
```

查看修改分区之后的 topic：

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --describe --topic my-favorite-topic
Topic: test	TopicId: g7RpyQLxQiieQrGLAtHeqg	PartitionCount: 4	ReplicationFactor: 3	Configs: 
	Topic: test	Partition: 0	Leader: 1	Replicas: 1,2,3	Isr: 1,2,3
	Topic: test	Partition: 1	Leader: 2	Replicas: 2,3,1	Isr: 2,3,1
	Topic: test	Partition: 2	Leader: 3	Replicas: 3,1,2	Isr: 3,1,2
	Topic: test	Partition: 3	Leader: 1	Replicas: 1,3,2	Isr: 1,3,2
```

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --alter --topic my-favorite-topic --partitions 2
Error while executing topic command : Topic currently has 4 partitions, which is higher than the requested 2.
ERROR org.apache.kafka.common.errors.InvalidPartitionsException: Topic currently has 4 partitions, which is higher than the requested 2.
 (kafka.admin.TopicCommand$)
```

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --alter --topic my-favorite-topic --partitions 4 --replication-factor 4
```

### 删除主题

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 --delete --topic my-favorite-topic
```

## 配置

与 topic 相关的配置，分为两个层面：

- 服务器层面
- topic 层面

Configurations pertinent to topics have both a **server default** as well **an optional per-topic override**.
If no per-topic configuration is given the server default is used.

### 创建 topic 时添加配置

The override can be set at topic creation time by giving one or more `--config` options.

```text
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic my-topic --partitions 1 \
  --replication-factor 1 --config max.message.bytes=64000 --config flush.messages=1
```

### 修改已有 topic 的配置

Overrides can also be changed or set later using the `alter` configs command.
This example updates the max message size for my-topic:

```text
bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name my-topic
  --alter --add-config max.message.bytes=128000
```

### 删除已有 topic 的配置

To remove an override you can do

```text
bin/kafka-configs.sh --bootstrap-server localhost:9092  --entity-type topics --entity-name my-topic
  --alter --delete-config max.message.bytes
```

### 查看 topic 的配置

To check overrides set on the topic you can do

```text
bin/kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name my-topic --describe
```
