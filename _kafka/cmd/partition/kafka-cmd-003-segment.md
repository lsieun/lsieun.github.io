---
title: "Kafka Segment"
sequence: "103"
---

## 文件存储机制

### Segment 的组成

Segment 是一个逻辑概念，由两种类型的文件组成，分别是 `.log` 和 `.index` 文件：

- `.log` 文件记录了消息的内容，生产者生产的消息不会断追加到文件的末尾
- `.index` 文件中记录的是指定 offset 的消息在 `.log` 文件中的位置信息。

```text
$ ls -lh
total 32M
-rw-rw-r--. 1 devops devops 10M Jan  1 22:49 00000000000000000000.index
-rw-rw-r--. 1 devops devops 32M Jan  1 22:49 00000000000000000000.log
-rw-rw-r--. 1 devops devops 10M Jan  1 22:49 00000000000000000000.timeindex
-rw-rw-r--. 1 devops devops   8 Jan  1 22:49 leader-epoch-checkpoint
-rw-rw-r--. 1 devops devops  43 Jan  1 21:37 partition.metadata
```

### 查看 Segment 的 log 中的内容

```text
$ kafka-run-class.sh kafka.tools.DumpLogSegments --print-data-log --files 00000000000000000000.log
```

```text
$ kafka-run-class.sh kafka.tools.DumpLogSegments --print-data-log --files 00000000000000000000.log
Dumping 00000000000000000000.log
Log starting offset: 0
```

```text
$ kafka-run-class.sh kafka.tools.DumpLogSegments --print-data-log --files 00000000000000000000.log
Dumping 00000000000000000000.log
Log starting offset: 0

baseOffset: 0 lastOffset: 0 count: 1 baseSequence: 0 lastSequence: 0 
producerId: 3001 producerEpoch: 0 
partitionLeaderEpoch: 0 isTransactional: false isControl: false deleteHorizonMs: OptionalLong.empty position: 0 
CreateTime: 1704130275765 size: 79 magic: 2 compresscodec: none crc: 4210434693 isvalid: true
| offset: 0 CreateTime: 1704130275765 keySize: -1 valueSize: 11 sequence: 0 headerKeys: [] payload: hello kafka

baseOffset: 1 lastOffset: 1 count: 1 baseSequence: 1 lastSequence: 1 
producerId: 3001 producerEpoch: 0 
partitionLeaderEpoch: 0 isTransactional: false isControl: false deleteHorizonMs: OptionalLong.empty position: 79 
CreateTime: 1704130285686 size: 83 magic: 2 compresscodec: none crc: 2914178472 isvalid: true
| offset: 1 CreateTime: 1704130285686 keySize: -1 valueSize: 15 sequence: 1 headerKeys: [] payload: hello zookeeper

baseOffset: 2 lastOffset: 2 count: 1 baseSequence: 2 lastSequence: 2 
producerId: 3001 producerEpoch: 0 
partitionLeaderEpoch: 0 isTransactional: false isControl: false deleteHorizonMs: OptionalLong.empty position: 162 
CreateTime: 1704130290912 size: 79 magic: 2 compresscodec: none crc: 4003118577 isvalid: true
| offset: 2 CreateTime: 1704130290912 keySize: -1 valueSize: 11 sequence: 2 headerKeys: [] payload: hello world
```

```text
$ kafka-run-class.sh kafka.tools.DumpLogSegments --print-data-log --files 00000000000000000000.index 
Dumping 00000000000000000000.index
offset: 0 position: 0
```

![](/assets/images/kafka/partition/kafka-partition-segment-001.png)

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;

import java.util.Properties;
import java.util.concurrent.Future;

public class KafkaProducer_001_Record_D_SendBatch {
    public static void main(String[] args) throws Exception {
        Properties props = PropertyUtils.getProducerProperties();


        // 第 1 步，创建 Producer
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);

        LogUtils.log(KafkaConst.SEPARATION_LINE);
        for (int i = 0; i < 400; i++) {
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
        LogUtils.log(KafkaConst.SEPARATION_LINE);

        // 第 4 步，关闭 Producer
        producer.close();
    }
}
```

```text
kafka-run-class.sh kafka.tools.DumpLogSegments --print-data-log --files 00000000000000000000.index            
Dumping 00000000000000000000.index
offset: 35 position: 4130
offset: 70 position: 8260
offset: 105 position: 12390

$ kafka-run-class.sh kafka.tools.DumpLogSegments --print-data-log --files 00000000000000000138.index
Dumping 00000000000000000138.index
offset: 173 position: 4130
offset: 208 position: 8260
offset: 243 position: 12390
```

```java
import java.io.IOException;
import java.io.RandomAccessFile;

public class FileOffsetReader {
    public static void main(String[] args) {
        String filePath = "D:\\00000000000000000000.log";  // 替换为你的文件路径
        long offset = 4130;
        int length = 120;

        try (RandomAccessFile file = new RandomAccessFile(filePath, "r")) {
            file.seek(offset);  // 设置文件指针到指定的 offset 处
            byte[] buffer = new byte[length];
            int bytesRead = file.read(buffer, 0, length);
            if (bytesRead != -1) {
                System.out.println(new String(buffer, 0, bytesRead));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 文件清理策略

### 判断是否过期

- 判断是否过期
  - 时间维度
  - 空间维度

Kafka 中默认的日志保存时间为 7 天，可以通过调整如下参数修改保存时间。

- `log.retention.hours`，最低优先级，默认 7 天
- `log.retention.minutes`，分钟
- `log.retention.ms`，最高优先级，毫秒
- `log.retention.check.interval.ms`，负责设置检查周期，默认 5 分钟

```text
log.retention.hours = 168
log.retention.minutes = null
log.retention.ms = null
log.retention.check.interval.ms = 300000
log.retention.bytes = -1
```

### 两种过期策略

Kafka 中提供的日志清理策略有 delete 和 compact 两种

#### delete 策略

delete 日志删除：将过期数据删除

```text
log.cleanup.policy = [delete]
```

- **基于时间**：默认打开。**以 segment 中所有记录中的最大时间戳作为文件时间戳**
- **基于大小**：默认关闭。超过设置的所有日志大小，删除最早的 segment。

```text
# 默认值等于 -1，表示无穷大
log.retention.bytes = -1
```

思考：如果一个 segment 中有一部分数据过期，一部分没有过期，怎么处理呢？

#### compact 日志压缩

compact 日志压缩：对于相同 key 的不同 value 值，只保留最后一个版本。

```text
# 所有数据启用压缩策略
log.cleanup.policy = compact
```

这种策略只适合特殊场景，比如消息的 key 是用户 ID，value 是用户的资料，
通过这种压缩策略，整个消息集里就保存了所有用户的最新的资料。



