---
title: "生产者：数据去重（幂等性+事务）"
sequence: "105"
---

Note that enabling idempotence requires the `acks` config value to be 'all'.
If conflicting configurations are set and idempotence is not explicitly enabled, idempotence is disabled.

## 数据传递语义

- 至少一次（At Least Once） = ACK 级别设置为 `-1` + 分区副本大于等于 2 + ISR 里应答的最小副本数量大于等于 2
- 最多一次（At Most Once） = ACK 级别设置为 0

总结：

- At Least Once 可以保证数据不丢失，但是**不能保证数据不重复**
- At Most Once 可以保证数据不重复，但是**不能保证数据不丢失**。

- 精确一次（Exactly Once）：对于一些非常重要的信息，要求数据即不能重复，也不能丢失

Kafka 0.11 版本之后，引入了一项重大特性：**『幂等性』和『事务』。**

## 幂等性

### 幂等性原理

幂等性，是指 Producer 不论向 Broker 发送多少条重复数据，Broker 端都只会持久化一条，保证了不重复。

```text
Exactly Once = 不丢失（At Least Once）+不重复（幂等性） 
精确一次（Exactly Once） = 幂等性（不重） + 至少一次 （ACK = -1 + 分区副本数 >= 2 + ISR 最小副本数量 >=2）
```

重复数据的判断标准：具有 `<PID, Partition, SeqNumber>` 相同主键的消息提交时，Broker 只会持久化一条。
其中，

- `PID` 是 Kafka **每次重启都会分配一个新的 Producer ID**；
- `Partition` 表示分区号；
- Sequence Number 是单调自增的。

所以，**幂等性只能保证在单分区（Partition）、单会话（Session）内不重复**。

### 如何使用幂等性

开启参数 `enable.idempotence`，默认为 `true`。

```text
# 默认值
enable.idempotence = true
```

## 生产者事务

![](/assets/images/kafka/producer/producer-transaction-001.png)


### Kafka 事务原理

```text
注意：开启事务，必须开启幂等性。
```

Producer 在使用事务前，必须先自定义一个唯一的 `transaction.id`。
有了 `transaction.id`，即使客户端出现故障后，重启之后也能继续处理未完成的事务。

```java
public interface Producer<K, V> extends Closeable {
    void initTransactions();

    void beginTransaction() throws ProducerFencedException;

    void sendOffsetsToTransaction(Map<TopicPartition, OffsetAndMetadata> offsets,
                                  ConsumerGroupMetadata groupMetadata) throws ProducerFencedException;

    void commitTransaction() throws ProducerFencedException;

    void abortTransaction() throws ProducerFencedException;
}
```

## 代码

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;

public class KafkaProducer_004_Transaction {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();

        // connection: server
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // data: serializer
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        // 设置 transactional.id
        props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "my-transaction-id");


        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        LogUtils.log("=================================================================================");
        try {
            producer.initTransactions();
            producer.beginTransaction();

            for (int i = 0; i < 10; i++) {
                // 第 2 步，创建 Record
                String value = String.format("Hello Kafka |%06d|==============================", i);
                ProducerRecord<String, String> record = new ProducerRecord<>(KafkaConst.TOPIC_NAME, value);

                // 第 3 步，发送 Record
                producer.send(record);
            }

            int i = 10 / 0;

            producer.commitTransaction();
        } catch (Exception ex) {
            producer.abortTransaction();
        }

        LogUtils.log("=================================================================================");

        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```
