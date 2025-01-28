---
title: "Kafka Properties"
sequence: "102"
---

## Producer

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

public class KafkaProducer_001_Simple {
    public static void main(String[] args) {
        Properties prop = new Properties();

        prop.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);
        prop.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        prop.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        prop.put(ProducerConfig.ACKS_CONFIG, "all");
        prop.put(ProducerConfig.RETRIES_CONFIG, 0);
        prop.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
        prop.put(ProducerConfig.LINGER_MS_CONFIG, 1);
        prop.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);

        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(prop);

        // 第 2 步，创建 Record
        String topic = "test";
        ProducerRecord<String, String> record = new ProducerRecord<>(topic, Integer.toString(2), "hello kafka3");

        // 第 3 步，发送 Record
        producer.send(record);


        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```

## Consumer

```java
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Properties;

public class KafkaConsumer_001_Simple {
    public static void main(String[] args) {
        Properties prop = new Properties();

        prop.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);
        prop.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        prop.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        prop.put(ConsumerConfig.GROUP_ID_CONFIG, "con-1");
        prop.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
        //自动提交偏移量
        prop.put("auto.commit.intervals.ms", "true");
        //自动提交时间
        prop.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");

        // 第 1 步，创建 Consumer
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(prop);

        // 第 2 步，订阅 topic
        ArrayList<String> topics = new ArrayList<>();
        //可以订阅多个消息
        topics.add("test");
        consumer.subscribe(topics);

        // 第 3 步，消费消息
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(20));
        for (ConsumerRecord<String, String> consumerRecord : records) {
            System.out.println(consumerRecord);
        }

        // 第 4 步，关闭 Consumer
        consumer.close();
    }
}
```
