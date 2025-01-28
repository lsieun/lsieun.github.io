---
title: "分区策略"
sequence: "103"
---

- 在 Kafka 2.4 版本之前，a message with no key was a **round-robin assignment strategy**
- 在 Kafka 2.4 版本之前，messages without keys use a **sticky partition strategy**.

However, sometimes we have specific ways that we want our data to be partitioned.
One way to take control of this is to write our own unique partitioner class.

## Key

### 无 key

**When we publish a message to a Kafka topic,
it's distributed among the available partitions in a round-robin fashion.**
Hence, within a Kafka topic, the order of messages is guaranteed within a partition but not across partitions.

### 有 Key

When we publish messages with a key to a Kafka topic,
all messages with the same key are guaranteed to be stored in the same partition by Kafka.
Thus, keys in Kafka messages are useful
if we want to maintain order for messages having the same key.

### 总结

To summarize, keys aren't mandatory as a part of sending messages to Kafka.
Basically, if we wish to maintain a strict order of messages with the same key,
then we should definitely be using keys with messages.
For all other cases, having `null` keys will provide a better distribution of messages amongst the partitions.

## 自定义分区器

```java
import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;

import java.util.Map;

public class MyPartitioner implements Partitioner {
    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        String str = String.valueOf(value);

        if (str.contains("a")) {
            LogUtils.log("USE PARTITION 1");
            return 1;
        } else if (str.contains("b")) {
            LogUtils.log("USE PARTITION 2");
            return 2;
        }

        LogUtils.log("USE PARTITION 0");
        return 0;
    }

    @Override
    public void close() {

    }

    @Override
    public void configure(Map<String, ?> configs) {

    }
}
```

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class KafkaProducer_002_Partition_C_Custom {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        Properties props = new Properties();

        // connection: server
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // data: serializer
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        // partitioner
        props.put(ProducerConfig.PARTITIONER_CLASS_CONFIG, MyPartitioner.class.getName());


        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        // 第 2 步，创建 Record
        ProducerRecord<String, String> record = new ProducerRecord<>(KafkaConst.TOPIC_NAME, "message-key", "Hello Kafka");

        // 第 3 步，发送 Record
        Future<RecordMetadata> future = producer.send(record);
        RecordMetadata metadata = future.get();

        LogUtils.log("=================================================================================");
        LogUtils.log(
                "topic = {}, partition = {}, offset = {}",
                metadata.topic(),
                metadata.partition(),
                metadata.offset()
        );
        LogUtils.log("=================================================================================");


        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```

## Reference

- [Producer Configs](https://kafka.apache.org/documentation/#producerconfigs)
    - [partitioner.class](https://kafka.apache.org/documentation/#producerconfigs_partitioner.class)
- [Is a Key Required as Part of Sending Messages to Kafka?](https://www.baeldung.com/java-kafka-message-key)
