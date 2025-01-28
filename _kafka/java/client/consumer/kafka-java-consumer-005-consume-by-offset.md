---
title: "按 offset 消费"
sequence: "105"
---

```java
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.TopicPartition;

import java.time.Duration;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.TimeUnit;

public class KafkaTimestamp_002_Consumer_A_Offset {
    public static void main(String[] args) {
        Properties props = PropertyUtils.getConsumerProperties();

        // 第 1 步，创建 Consumer
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // 第 2 步，订阅 topic
        consumer.subscribe(List.of(KafkaConst.TOPIC_NAME));

        // 指定分区位置进行消费
        Set<TopicPartition> assignment = consumer.assignment();

        // 保证分区分配方案已经制定完毕
        while (assignment.size() == 0) {
            consumer.poll(Duration.ofSeconds(1));

            assignment = consumer.assignment();
        }

        for (TopicPartition topicPartition : assignment) {
            consumer.seek(topicPartition, 3);
        }


        // 第 3 步，消费消息
        for (int i = 0; i < 5; i++) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));

            PrintUtils.printRecords(records);

            try {
                TimeUnit.SECONDS.sleep(1);
            }
            catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }


        // 第 4 步，关闭 Consumer
        consumer.close();

    }
}
```
