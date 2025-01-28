---
title: "消费者"
sequence: "101"
---

## 快速开始

### 代码

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
        Properties props = new Properties();

        // connection: server
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // init: group + position
        props.put(ConsumerConfig.GROUP_ID_CONFIG, KafkaConst.CONSUMER_GROUP_NAME);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        // data: deserializer
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());


        // 第 1 步，创建 Consumer
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // 第 2 步，订阅 topic
        ArrayList<String> topics = new ArrayList<>();
        // 可以订阅多个消息
        topics.add(KafkaConst.TOPIC_NAME);
        consumer.subscribe(topics);

        // 第 3 步，消费消息
        ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(5));
        LogUtils.log(KafkaConst.SEPARATION_LINE);
        for (ConsumerRecord<String, String> record : records) {
            LogUtils.log(
                    "topic = {} partition = {}, offset = {}, key = {}, value = {}",
                    record.topic(), record.partition(), record.offset(), record.key(), record.value()
            );
        }
        LogUtils.log(KafkaConst.SEPARATION_LINE);

        // 第 4 步，关闭 Consumer
        consumer.close();
    }
}
```

### 注意事项

如果不指定 `ConsumerConfig.GROUP_ID_CONFIG`（`group.id`），就会出现 `InvalidGroupIdException` 异常：

```text
Exception in thread "main" org.apache.kafka.common.errors.InvalidGroupIdException:
To use the group management or offset commit APIs, you must provide a valid group.id in the consumer configuration.
```
