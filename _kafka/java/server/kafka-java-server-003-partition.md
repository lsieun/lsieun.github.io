---
title: "Kafka Partition"
sequence: "103"
---

## Admin

```java
import org.apache.kafka.clients.admin.Admin;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.DescribeTopicsResult;
import org.apache.kafka.clients.admin.TopicDescription;
import org.apache.kafka.common.KafkaFuture;
import org.apache.kafka.common.Node;
import org.apache.kafka.common.TopicPartitionInfo;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class KafkaTopic_005_Partition {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // 第 1 步，创建 Admin
        Admin admin = Admin.create(props);

        // 第 2 步，使用 Admin 操作
        DescribeTopicsResult result = admin.describeTopics(
                Collections.singletonList(KafkaConst.TOPIC_NAME)
        );

        // 第 3 步，解析 Result
        Map<String, KafkaFuture<TopicDescription>> map = result.topicNameValues();
        KafkaFuture<TopicDescription> future = map.get(KafkaConst.TOPIC_NAME);
        TopicDescription topicDescription = future.get();
        List<TopicPartitionInfo> partitionInfoList = topicDescription.partitions();
        int size = partitionInfoList.size();
        LogUtils.log("partitions = {}", size);
        for (TopicPartitionInfo partitionInfo : partitionInfoList) {
            printPartitionInfo(partitionInfo);
        }

        // 第 4 步，关闭 Admin
        admin.close();
    }

    private static void printPartitionInfo(TopicPartitionInfo partitionInfo) {
        int partitionIndex = partitionInfo.partition();
        Node leader = partitionInfo.leader();
        List<Node> replicas = partitionInfo.replicas();
        LogUtils.log(
                "partition = {}, leader = {}, replicas = {}",
                partitionIndex,
                getNodeInfo(leader),
                replicas.stream().map(KafkaTopic_005_Partition::getNodeInfo).toList()
        );
    }

    private static String getNodeInfo(Node node) {
        String host = node.host();
        int port = node.port();
        return String.format("%s:%s", host, port);
    }
}
```

## Producer

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.PartitionInfo;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.List;
import java.util.Properties;

public class KafkaProducer_Partition {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());


        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);


        // 第 2 步，获取 Partition 列表
        List<PartitionInfo> list = producer.partitionsFor(KafkaConst.TOPIC_NAME);
        for (PartitionInfo partitionInfo : list) {
            LogUtils.log(
                    "topic = {}, partition = {}, leader = {}",
                    partitionInfo.topic(),
                    partitionInfo.partition(),
                    partitionInfo.leader()
            );
        }


        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```

