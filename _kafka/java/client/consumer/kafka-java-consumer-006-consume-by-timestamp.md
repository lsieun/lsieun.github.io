---
title: "按指定时间戳消费"
sequence: "106"
---

使用场景：在生产环境中，会遇到最近消费的几个小时数据异常，想重新按照时间消费。
例如，要求按照时间消费前一天的数据，怎么处理？

## 根据时间查询

```text
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.consumer.OffsetAndTimestamp;
import org.apache.kafka.common.TopicPartition;

import java.time.Duration;
import java.util.*;

public class KafkaTimestamp_002_Consumer_B_ByTime {
    public static void main(String[] args) {
        Properties props = PropertyUtils.getConsumerProperties();

        // 第 1 步，创建 Consumer
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // 第 2 步，订阅 topic
        consumer.subscribe(Collections.singletonList(KafkaConst.TOPIC_NAME));

        // 指定分区位置进行消费
        Set<TopicPartition> assignment = consumer.assignment();

        // 保证分区分配方案已经制定完毕
        while (assignment.size() == 0) {
            consumer.poll(Duration.ofSeconds(1));

            assignment = consumer.assignment();
        }

        long timestamp = DateUtils.getTimestampOfDaysBeginning(-1);
        Map<TopicPartition, Long> map = new HashMap<>();
        for (TopicPartition topicPartition : assignment) {
            map.put(topicPartition, timestamp);
        }

        Map<TopicPartition, OffsetAndTimestamp> topicPartitionOffsetAndTimestampMap = consumer.offsetsForTimes(map);

        for (TopicPartition topicPartition : assignment) {
            OffsetAndTimestamp offsetAndTimestamp = topicPartitionOffsetAndTimestampMap.get(topicPartition);
            long offset = offsetAndTimestamp.offset();
            consumer.seek(topicPartition, offset);
        }


        // 第 3 步，消费消息
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
            if (records.isEmpty()) {
                break;
            }

            PrintUtils.printRecords(records);
        }


        // 第 4 步，关闭 Consumer
        consumer.close();

    }
}
```
