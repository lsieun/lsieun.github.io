---
title: "生产者时间戳"
sequence: "109"
---

## 生产者

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

import java.util.Properties;

public class KafkaTimestamp_001_Producer_A_One {
    public static void main(String[] args) throws Exception {
        Properties props = PropertyUtils.getProducerProperties();

        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        // 第 2 步，创建 Record
        long timestamp = DateUtils.getTimestampOfDays(-1);
        ProducerRecord<String, String> record = new ProducerRecord<>(
                KafkaConst.TOPIC_NAME, null,
                timestamp,
                null, "Hello Kafka"
        );

        // 第 3 步，发送 Record
        RecordMetadata metadata = producer.send(record).get();
        PrintUtils.printMetadata(metadata);


        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```
