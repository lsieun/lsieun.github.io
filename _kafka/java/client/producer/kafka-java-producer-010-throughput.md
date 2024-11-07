---
title: "生产者：如何提高吞吐量"
sequence: "110"
---

![](/assets/images/kafka/producer/producer-send-record-detail-002.png)

- `batch.size`：批次大小，默认 16K，可以改成 32K
- `liger.ms`：等待时间，默认为 0ms，可以修改为 5~100ms。如果等待时间的太长，会导致数据的『延迟』。
- `compression.type`：压缩 snappy
- `buffer.memory`（`RecordAccumulator`）：缓冲区大小，默认为 32MB，可以修改为 64MB

默认值：

```text
# 空间-批次大小-16K
batch.size = 16384
# 空间-缓冲区-32MB
buffer.memory = 33554432
# 空间-无压缩
compression.type = none
# 时间-不等待
linger.ms = 0
```

## 代码示例

### 调整四个参数

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.Future;

public class KafkaProducer_003_Config_A_Throughput {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();

        // connection: server
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // data: serializer
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        // 缓冲区大小
        props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 32 * 1024 * 1024);

        // 批次大小
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, "16384");

        // linger.ms
        props.put(ProducerConfig.LINGER_MS_CONFIG, 100);

        // 压缩
        props.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "snappy");


        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        LogUtils.log("=================================================================================");
        for (int i = 0; i < 320; i++) {
            // 第 2 步，创建 Record
            String value = String.format("Hello Kafka |%06d|==============================", i);
            ProducerRecord<String, String> record = new ProducerRecord<>(KafkaConst.TOPIC_NAME, value);

            // 第 3 步，发送 Record
            Future<RecordMetadata> future = producer.send(record);
            RecordMetadata recordMetadata = future.get();
            LogUtils.log(
                    "index = {}, topic = {}, partition = {}, offset = {}, value = {}",
                    i, recordMetadata.topic(), recordMetadata.partition(), recordMetadata.offset(), value
            );
        }
        LogUtils.log("=================================================================================");

        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```

## Reference

- [Producer Configs](https://kafka.apache.org/documentation/#producerconfigs)
    - [buffer.memory](https://kafka.apache.org/documentation/#producerconfigs_buffer.memory)
    - [compression.type](https://kafka.apache.org/documentation/#brokerconfigs_compression.type)
    - [batch.size](https://kafka.apache.org/documentation/#producerconfigs_batch.size)
    - [linger.ms](https://kafka.apache.org/documentation/#producerconfigs_linger.ms)
