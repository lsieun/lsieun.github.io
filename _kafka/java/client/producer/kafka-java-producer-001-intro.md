---
title: "生产者消息发送流程"
sequence: "101"
---



```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class KafkaProducer_001_Simple {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());


        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        // 第 2 步，创建 Record
        ProducerRecord<String, String> record = new ProducerRecord<>(KafkaConst.TOPIC_NAME, "Hello Kafka1");

        // 第 3 步，发送 Record
        Future<RecordMetadata> future = producer.send(record);
        RecordMetadata recordMetadata = future.get();

        LogUtils.log(
                "topic = {}, partition = {}, offset = {}",
                recordMetadata.topic(),
                recordMetadata.partition(),
                recordMetadata.offset()
        );


        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```



## Reference

- [Unleash Kafka Producer's Architecture and Internal Workings](http://www.clairvoyant.ai/blog/unleash-kafka-producers-architecture-and-internal-workings)
- [6张图为你分析Kafka Producer 消息缓存模型](https://developer.huawei.com/consumer/cn/forum/topic/0202832444660380156)
- [Exploring Kafka Producer's Internals](https://blog.developer.adobe.com/exploring-kafka-producers-internals-37411b647d0f)
- [Sender — Kafka Producer Network Thread](https://jaceklaskowski.gitbooks.io/apache-kafka/content/kafka-producer-internals-Sender.html)
- [RecordAccumulator](https://jaceklaskowski.gitbooks.io/apache-kafka/content/kafka-producer-internals-RecordAccumulator.html)
