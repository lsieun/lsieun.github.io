---
title: "Kafka 在 ZooKeeper 上的节点信息"
sequence: "101"
---

- /kafka
    - cluster
        - id：代表的是一个 Kafka 集群包含的集群的版本和集群的ID
    - controller：是 Kafka 中非常重要的一个角色，意为控制器，控制 partition 的 leader 选举，topic 的 CRUD 操作。
      brokerid 意为其 id 对应的 broker 承担 controller 的角色
    - controller_epoch：代表 controller 的纪元。换句话说，是代表 controller 的更迭，
      每当 controller 的 brokerid 更换一次，controller_epoch 就 + 1
    - brokers
        - ids：存放当前 Kafka 的 brokder 实例列表
        - topics：当前 Kafka 中的 topic 列表
        - seqid：系统的序列 ID
    - consumers：老版本用于存储 Kafka 消费者的信息，主要保存对应的 offset，新版本中基本不用，此时用户的消费信息，保存在一个系统的 topic 中：`__consumer_offsets`
    - config：存放配置信息

```text
ls /kafka 
[admin, brokers, cluster, config, consumers, controller, controller_epoch, feature,
 isr_change_notification, latest_producer_id_block, log_dir_event_notification]
 
 ls /kafka/cluster 
[id]

get /kafka/cluster/id
{"version":"1","id":"eQzK4lYlQ9y8P21IScOl_g"}

get /kafka/controller
{"version":2,"brokerid":1,"timestamp":"1704032949256","kraftControllerEpoch":-1}

get /kafka/controller_epoch 
1

ls /kafka/brokers 
[ids, seqid, topics]

ls /kafka/brokers/ids
[1, 2, 3]

get /kafka/brokers/ids/1
{"features":{},"listener_security_protocol_map":{"PLAINTEXT":"PLAINTEXT"},"endpoints":["PLAINTEXT://server1:9092"],"jmx_port":-1,"port":9092,"host":"server1","version":5,"timestamp":"1704032948949"}

get /kafka/brokers/ids/2
{"features":{},"listener_security_protocol_map":{"PLAINTEXT":"PLAINTEXT"},"endpoints":["PLAINTEXT://server2:9092"],"jmx_port":-1,"port":9092,"host":"server2","version":5,"timestamp":"1704032949464"}

get /kafka/brokers/ids/3
{"features":{},"listener_security_protocol_map":{"PLAINTEXT":"PLAINTEXT"},"endpoints":["PLAINTEXT://server3:9092"],"jmx_port":-1,"port":9092,"host":"server3","version":5,"timestamp":"1704047264682"}

ls /kafka/brokers/seqid 
[]

ls /kafka/brokers/topics 
[]
```
