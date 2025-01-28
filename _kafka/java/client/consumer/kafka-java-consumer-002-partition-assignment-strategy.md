---
title: "生产经验：分区的分配以及再平衡"
sequence: "102"
---

思考：

- 从 topic 角度讲，有多个 partition 组成
- 从 consumer group 角度讲，有多个 consumer 组成

那么，到底由哪个 consumer 来消费哪个 partition 的数据呢？




![](/assets/images/kafka/consumer/consumer-partition-assignment-strategy.png)

## 分区分配策略详细

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--create --topic my-favorite-topic --partitions 7 --replication-factor 1
```

```text
$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--create --topic t0 --partitions 2 --replication-factor 1

$ kafka-topics.sh --bootstrap-server 0.0.0.0:9092 \
--create --topic t1 --partitions 2 --replication-factor 1
```

### Range

![](/assets/images/kafka/consumer/kafka-consumer-partition-assign-strategy-range.png)



![](/assets/images/kafka/consumer/kafka-consumer-partition-assign-strategy-range-002.png)

![](/assets/images/kafka/consumer/kafka-consumer-partition-assign-strategy-range-003.png)

```java
import org.apache.kafka.clients.consumer.*;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

public class KafkaConsumer_001 {
    public static void main(String[] args) {
        Properties props = PropertyUtils.getConsumerProperties();

        // transmission - request - poll
        props.put(ConsumerConfig.GROUP_INSTANCE_ID_CONFIG, "C0");
        props.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG, RoundRobinAssignor.class.getName());


        // 第 1 步，创建 Consumer
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // 第 2 步，订阅 topic
        consumer.subscribe(
                Collections.singletonList(KafkaConst.TOPIC_NAME)
        );

        // 第 3 步，消费消息
        LogUtils.log(KafkaConst.SEPARATION_LINE);
        long begin = System.currentTimeMillis();
        while (true) {
            long diff = System.currentTimeMillis() - begin;
            if (diff > 10 * 60 * 1000) {
                break;
            }

            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(5));
            if (records.isEmpty()) {
                continue;
            }

            for (ConsumerRecord<String, String> record : records) {
                LogUtils.log(
                        "topic = {}, partition = {}, offset = {}, key = {}, value = {}",
                        record.topic(), record.partition(), record.offset(), record.key(), record.value()
                );
            }
        }
        LogUtils.log(KafkaConst.SEPARATION_LINE);


        // 第 4 步，关闭 Consumer
        consumer.close();
    }
}
```

### RoundRobin

![](/assets/images/kafka/consumer/kafka-consumer-partition-assign-strategy-round-robin.png)

![](/assets/images/kafka/consumer/kafka-consumer-partition-assign-strategy-round-robin-002.png)

![](/assets/images/kafka/consumer/kafka-consumer-partition-assign-strategy-round-robin-003.png)

```java
import org.apache.kafka.clients.consumer.*;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

public class KafkaConsumer_001 {
    public static void main(String[] args) {
        Properties props = PropertyUtils.getConsumerProperties();

        // transmission - request - poll
        props.put(ConsumerConfig.PARTITION_ASSIGNMENT_STRATEGY_CONFIG, RoundRobinAssignor.class.getName());


        // 第 1 步，创建 Consumer
        KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);

        // 第 2 步，订阅 topic
        consumer.subscribe(
                Collections.singletonList(KafkaConst.TOPIC_NAME)
        );

        // 第 3 步，消费消息
        LogUtils.log(KafkaConst.SEPARATION_LINE);
        long begin = System.currentTimeMillis();
        while (true) {
            long diff = System.currentTimeMillis() - begin;
            if (diff > 10 * 60 * 1000) {
                break;
            }

            ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(5));
            if (records.isEmpty()) {
                continue;
            }

            for (ConsumerRecord<String, String> record : records) {
                LogUtils.log(
                        "topic = {}, partition = {}, offset = {}, key = {}, value = {}",
                        record.topic(), record.partition(), record.offset(), record.key(), record.value()
                );
            }
        }
        LogUtils.log(KafkaConst.SEPARATION_LINE);


        // 第 4 步，关闭 Consumer
        consumer.close();
    }
}
```

### Sticky

![](/assets/images/kafka/consumer/kafka-consumer-partition-assign-strategy-sticky.png)


## 触发再平衡的时机

rebalance触发的条件有三个：

- consumer group成员发生变更，比方说有新的consumer实例加入，或者有consumer实例离开组，或者有consumer实例发生奔溃。
- consumer group订阅的topic数发生变更，这种情况主要发生在基于正则表达式订阅topic情况，当有新匹配的topic创建时则会触发rebalance。
- consumer group 订阅的topic分区数发生变更。

其实无论哪种触发条件，我们可以发现根本原因还是因为topic 中partition或者consumer实例发生了变更。


- 分区
- 消费者
    - 加入
    - 退出
        - 正常退出
        - 异常退出
            - 超时
                - `session.timeout.ms`
                - `max.poll.interval.ms`

- `heartbeat.interval.ms`：Kafka 消费者 与 Coordinator 之间的心跳时间，默认为 3 秒。
    - 该值必须小于 `session.timeout.ms`，也不应该高于 `session.timeout.ms` 的 1/3。
- `session.timeout.ms`：Kafka 消费者与 Coordinator 之间连接超时时间，默认 45 秒。超过该值，该消费者被移除，消费者组执行再平衡。
- `max.poll.interval.ms`：消费者处理消息的最大时长，默认为 5 分钟。超过该值，该消费者被移除，消费者组执行再平衡。

默认值：

```text
heartbeat.interval.ms = 3000
session.timeout.ms = 45000
max.poll.interval.ms = 300000
```

## Reference

- [Kafka Rebalance详解](https://blog.csdn.net/qq_35901141/article/details/115710558)

- [Consumer Group Protocol](https://developer.confluent.io/courses/architecture/consumer-group-protocol/)
