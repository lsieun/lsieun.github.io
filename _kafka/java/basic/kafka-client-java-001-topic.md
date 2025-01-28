---
title: "Kafka Topic: Producer + Consumer"
sequence: "101"
---

## 准备

创建主题：

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 \
--create \
--topic my-favorite-topic \
--partitions 3 \
--replication-factor 3
```

主题列表、描述和删除：

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --list
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --delete --topic my-favorite-topic
```

生产者：

```text
$ kafka-console-producer.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --topic my-favorite-topic
```

消费者：

```text
$ kafka-console-consumer.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --topic my-favorite-topic
```

## pom.xml

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>${kafka.version}</version>
</dependency>
```

## 代码

### Producer

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

import java.util.Properties;

public class KafkaQuickStart_001_Producer {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();

        // connection: server
        props.put("bootstrap.servers", "192.168.80.131:9092,192.168.80.132:9092,192.168.80.133:9092");

        // data: serializer
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");


        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        // 第 2 步，创建 Record
        String topic = "my-favorite-topic";
        ProducerRecord<String, String> record = new ProducerRecord<>(topic, "Hello Kafka");

        // 第 3 步，发送 Record
        RecordMetadata metadata = producer.send(record).get();

        LogUtils.log(
                "topic = {}, partition = {}, offset = {}, timestamp = {}",
                metadata.topic(),
                metadata.partition(),
                metadata.offset(),
                metadata.timestamp()
        );


        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```

### Consumer

```java
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.List;
import java.util.Properties;

public class KafkaQuickStart_002_Consumer {
    public static void main(String[] args) {
        Properties props = new Properties();

        // connection: server
        props.put("bootstrap.servers", "192.168.80.131:9092,192.168.80.132:9092,192.168.80.133:9092");

        // init: group + position
        props.put("group.id", "my-java-group");
        props.put("auto.offset.reset", "earliest");

        // data: deserializer
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");


        // 第 1 步，创建 Consumer
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // 第 2 步，订阅 topic
        List<String> topics = List.of(
                // 可以订阅多个 topic
                "my-favorite-topic"
        );
        consumer.subscribe(topics);

        // 第 3 步，消费消息
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(5));
        for (ConsumerRecord<String, String> record : records) {
            LogUtils.log(
                    "topic = {}, partition = {}, offset = {}, key = {}, value = {}",
                    record.topic(), record.partition(), record.offset(), record.key(), record.value()
            );
        }

        // 第 4 步，关闭 Consumer
        consumer.close();
    }
}
```
