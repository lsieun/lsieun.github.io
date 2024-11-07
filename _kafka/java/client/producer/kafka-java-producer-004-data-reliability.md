---
title: "生产者：数据可靠性-ACK + Retry"
sequence: "104"
---

![](/assets/images/kafka/producer/producer-ack-reliability.png)

![](/assets/images/kafka/producer/producer-ack-reliability-002.png)

![](/assets/images/kafka/producer/producer-ack-reliability-003.png)

- Producer configuration
    - `acks`: the number of brokers who need to acknowledge receiving the message
      before it is considered a successful write.
    - `retries`
- Kafka configuration
    - `min.insync.replicas`

默认值：

```text
acks = -1
# 重试次数，默认为 int 最大值
retries = 2147483647
```

## Producer 端

- Request：Producer 发送一条 Record 到 Broker
- Response：Broker 返回一个 ACK 给 Producer

我觉得，这个地方巧妙的地方在于：

- `acks` 是由 Producer 提供的，而不是在 Broker 上直接设置的
- 这样做的好处就是，不同的 Broker 可以使用不同的 `acks` 值

### ACK

#### 默认值

The default value of `acks` has changed with Kafka v3.0:

- 在 Kafka v3.0 版本以前，默认值为 `acks=1`
- 在 Kafka v3.0 版本及以后，默认值为 `acks=all`

#### ACK: 0

If set to zero then the producer will not wait for any acknowledgment from the server at all.

![](/assets/images/kafka/producer/producer-conf-ack-0.webp)

应用场景：As a sample use case, say that we have a web-tracking platform that collects the clicks on a
page and sends these events to Kafka. In this situation, it might not be a big deal to lose
a single link press or hover event. If one is lost, there is no real business impact.

#### ACK: 1

This will mean the leader will write the record to its local log
but will respond without awaiting full acknowledgement from all followers.

![](/assets/images/kafka/producer/producer-conf-ack-1.webp)

#### ACK: -1 or all

This means the leader will wait for the full set of in-sync replicas to acknowledge the record.

![](/assets/images/kafka/producer/producer-conf-ack-all.webp)

思考：Leader 收到数据，所有 Follower 都开始同步数据，但有一个 Follower，因为某种故障，迟迟不能与 Leader 进行同步，那这个问题怎么解决？


### Retry

## Broker 端

### ISR

Leader 维护了一个动态 的 in-sync replica set （ISR），意为“与 Leader 保持同步的 Follower + Leader 集合”（`leader:0, isr: 0,1,2`）

如果 Follower 长时间未向 Leader 发送通信请求或同步数据，则该 Follower 将被踢出 ISR。
该时间阈值由 `replica.lag.time.max.ms` 参数设定，默认 `30s`。

这样就不用等长期联系不上或已经故障的节点。

```text
$ docker logs kafka-1 2>&1 | grep "replica.lag.time.max.ms"
	replica.lag.time.max.ms = 30000
```

### min.insync.replicas

```text
kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic configured-topic
```

```text
kafka-configs.sh --bootstrap-server localhost:9092 --alter \
--entity-type topics \
--entity-name configured-topic \
--add-config min.insync.replicas=2
```

```text
kafka-configs.sh --bootstrap-server localhost:9092 --alter \
--entity-type topics \
--entity-name configured-topic \
--delete-config min.insync.replicas
```

```text
kafka-configs.sh --bootstrap-server localhost:9092 --describe \
--entity-type topics \
--entity-name configured-topic
```

## 数据可靠性分析

如果分区副本设置为 1 个，或者 ISR 里应答的最小副本数量（`min.insync.replicas` 默认为 1），设置为 1。
这就和 `ack=1` 的效果是一样的，仍然有丢数据的风险（`leader: 0, isr: 0`）。

```text
数据完全可靠性条件 = ACKS 级别设置为 -1 + 分区副本大于等于 2 + ISR 里应答的最小副本数量大于等于 2
                    ack              replicas           ack
```

### Popular Configuration

`acks=all` and `min.insync.replicas=2` is the most popular option for data durability and availability
and allows you to withstand at most the loss of one Kafka broker

### 总结

可靠性总结：

- `acks=0`：生产者发送过来的数据，不需要等待数据落盘应答，可靠性差，效率高
    - 数据可靠性分析：丢数据（几乎不使用）
- `acks=1`：生产者发送过来的数据，Leader 收到数据后应答，可靠性中等，效率中等
    - 数据可靠性分析：好一些，但还是有丢失数据的可能
- `acks=-1`(`all`)：生产者发送过来的数据，Leader 和 ISR 队列里面的所有节点收齐数据后应答，可靠性高，效率低

在生产环境中，

- `acks=0` 很少使用；
- `acks=1`，一般用于传输普通日志，允许丢失个别数据；
- `acks=-1`，一般用于传输和钱相关的数据，对可靠性要求比较高的场景。

## 代码

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.Future;

public class KafkaProducer_003_Config_B_Data_Reliability {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();

        // connection: server
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConst.BOOTSTRAP_SERVER_URL);

        // data: serializer
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        // 设置 ACKS
        props.put(ProducerConfig.ACKS_CONFIG, "all");

        // 重试次数
        props.put(ProducerConfig.RETRIES_CONFIG, "3");


        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        LogUtils.log("=================================================================================");
        for (int i = 0; i < 10; i++) {
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
    - [acks](https://kafka.apache.org/documentation/#producerconfigs_acks)
    - [retries](https://kafka.apache.org/documentation/#producerconfigs_retries)
- [Kafka Producer Acks Deep Dive](https://www.conduktor.io/kafka/kafka-producer-acks-deep-dive/)
