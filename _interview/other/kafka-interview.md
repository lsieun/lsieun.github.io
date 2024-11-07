---
title: "Kafka"
sequence: "kafka"
---

## 基础

### Kafka 为什么这么快

- 硬盘的顺序读写
- 页缓存
- 零拷贝
- 批量处理

### Kafka 里的核心概念

（1）ZooKeeper： Zookeeper 负责保存 broker 集群元数据，并对控制器进行选举等操作。

（2）Producer： 生产者负责创建消息，将消息发送到 Broker。

（3）Broker: 一个独立的 Kafka 服务器被称作 broker，broker 负责接收来自生产者的消息，为消息设置偏移量，并将消息存储在磁盘。broker
为消费者提供服务，对读取分区的请求作出响应，返回已经提交到磁盘上的消息。

（4）Consumer： 消费者负责从 Broker 订阅并消费消息。

（5）Consumer Group： Consumer Group 为消费者组，一个消费者组可以包含一个或多个 Consumer 。

使用 多分区 + 多消费者 方式可以极大 提高数据下游的处理速度，同一消费者组中的消费者不会重复消费消息，同样的，不同消费组中的消费者消费消息时互不影响。Kafka
就是通过消费者组的方式来实现消息 P2P 模式和广播模式。

（6）Topic： Kafka 中的消息 以 Topic 为单位进行划分，生产者将消息发送到特定的 Topic，而消费者负责订阅 Topic 的消息并进行消费。

（7）Partition： 一个 Topic 可以细分为多个分区，每个分区只属于单个主题。同一个主题下不同分区包含的消息是不同的，分区在存储层面可以看作一个可追加的
日志（Log）文件，消息在被追加到分区日志文件的时候都会分配一个特定的 偏移量（offset）。

（8）Offset： offset 是消息在分区中的唯一标识，Kafka 通过它来保证消息在分区内的顺序性，不过 offset
并不跨越分区，也就是说，Kafka保证的是分区有序性而不是主题有序性。

（9）Replication： 副本，是 Kafka 保证数据高可用的方式，Kafka 同一 Partition 的数据可以在多 Broker
上存在多个副本，通常只有主副本对外提供读写服务，当主副本所在 broker 崩溃或发生网络异常，Kafka 会在 Controller 的管理下会重新选择新的
Leader 副本对外提供读写服务。

（10）Record： 实际写入 Kafka 中并可以被读取的消息记录。每个 record 包含了 key、value 和 timestamp。

（11）Leader: 每个分区多个副本的 “主” leader,生产者发送数据的对象，以及消费者消费数据的对象都是 leader。

（12）follower: 每个分区多个副本中的"从" follower,实时从 Leader 中同步数据，保持和 leader 数据的同步。Leader 发生故障时，某个
follow 会成为新的 leader。

- Producer
- Consumer
    - Consumer Group
- Broker
    - topic
    - partition
        - replication
            - leader
                - follower
    - segment
    - record

## 生产者

### 生产者向 Kafka 发送消息的执行流程介绍一下？

![](/assets/images/kafka/producer/producer-send-record.png)

（1）生产者要往 Kafka 发送消息时，需要创建 ProducerRecord,代码如下：

```text
ProducerRecord<String,String> record 
      = new ProducerRecoder<>("CostomerCountry","Precision Products","France");
      try{
      producer.send(record);
      }catch(Exception e){
        e.printStackTrace();
      }
```

（2）ProducerRecoder 对象会包含目标 topic，分区内容，以及指定的 key 和 value,在发送 ProducerRecord 时，
生产者会先把键和值对象序列化成字节数组，然后在网络上传输。

（3）生产者在将消息发送到某个 Topic ，需要经过拦截器、序列化器和分区器（Partitioner）。

（4）如果消息 ProducerRecord 没有指定 partition 字段，那么就需要依赖分区器，根据 key 这个字段来计算 partition 的值。分区器的作用就是为消息分配分区。

若没有指定分区，且消息的 key 不为空，则使用 murmur 的 Hash 算法（非加密型 Hash 函数，具备高运算性能及低碰撞率）来计算分区分配。
若没有指定分区，且消息的 key 也是空，则用轮询的方式选择一个分区。

（5）分区选择好之后，会将消息添加到一个记录批次中，这个批次的所有消息都会被发送到相同的 Topic 和 partition 上。
然后会有一个独立的线程负责把这些记录批次发送到相应的 broker 中。

（6）broker 接收到 Msg 后，会作出一个响应。如果成功写入 Kafka 中，就返回一个 RecordMetaData 对象，它包含 Topic 和 Partition 信息，以及记录在分区的 offset。

（7）若写入失败，就返回一个错误异常，生产者在收到错误之后尝试重新发送消息，几次之后如果还失败，就返回错误信息。


## Kafka 的分区策略有哪些？

```text
partition --> key --> 分区器
```

1、指明Partition的情况下,直接将指明的值作为Partiton值。例如Partition等于0，所有数据写入分区0。

2、没有指明Partition值但有key的情况下，将key的hash值与Topic的Partition数进行取余数得到Partition值。例如: key1的hash值=5，
key2的hash值=6 , Topic的Partition数=2，那么key1对应的value1写入1号分区,key2对应的value2写入0号分区。

3、既没有Partition值又没有key值的情况下，Kafka采用Sticky
Partition（黏性分区器），会随机选择一个分区，并尽可能一直使用该分区，待该分区的batch已满或者已完成，Kafka再随机一个分区进行使用(
和上一次的分区不同)。例如:第一次随机选择0号分区，等0号分区当前批次满了（默认16k)
或者linger.ms设置的时间到，Kafka再随机一个分区进行使用(如果还是0会继续随机）。

Kafka 提供了多种分区策略，用于确定消息应该被发送到哪个分区。不同的分区策略适用于不同的场景和需求。以下是 Kafka 中常见的分区策略：

- 随机分区策略（Random Partitioning）：
  这是最简单的分区策略，消息被随机发送到可用的分区中。这种策略适用于负载均衡和简单的情况，但可能导致数据倾斜问题。

- 哈希分区策略（Hash Partitioning）：
  根据消息的键值进行哈希计算，将相同键的消息发送到同一个分区。这确保了具有相同键的消息被发送到同一个分区，适用于需要保证顺序性或者将相关消息分区到相同的分区的场景。

- 轮询分区策略（Round-robin Partitioning）：
  消息依次轮流发送到每个分区，实现消息在各分区之间的均匀分布。适用于负载均衡和简单的情况。

- 自定义分区策略（Custom Partitioning）：
  用户可以根据自己的需求编写自定义的分区策略，通过实现 org.apache.kafka.clients.producer.Partitioner 接口来自定义消息发送到分区的逻辑。

选择合适的分区策略取决于具体的业务需求和场景。对于需要保证顺序性的消息，通常会选择哈希分区策略；对于需要负载均衡的场景，可以考虑随机分区或轮询分区策略。自定义分区策略则提供了更大的灵活性，可以根据具体需求实现自定义的分区逻辑。

Kafka 避免使用 JVM，直接使用操作系统的页缓存特性提高处理速度，
进而避免了 JVM GC 带来的性能损耗
Kafka 采用字节紧密存储，避免产生对象，这样可以进一步提高空间利用率。

## Broker

### Kafka 是如何清理过期数据的？

Kafka 将数据持久化到了硬盘上，允许你配置一定的策略对数据清理。清理的策略有两个，**删除**和**压缩**。

数据清理的方式

1、删除

`log.cleanup.policy=delete` 启用删除策略

直接删除，删除后的消息不可恢复。可配置以下两个策略：

```text
#清理超过指定时间清理：  
log.retention.hours=16
#超过指定大小后，删除旧的消息：
log.retention.bytes=1073741824
```

为了避免在删除时阻塞读操作，采用了 copy-on-write 形式的实现，删除操作进行时，
读取操作的二分查找功能实际是在一个静态的快照副本上进行的，这类似于 Java 的 CopyOnWriteArrayList。

2、压缩

将数据压缩，只保留每个 key 最后一个版本的数据。

首先在 broker 的配置中设置 `log.cleaner.enable=true` 启用 cleaner，这个默认是关闭的。

在 topic 的配置中设置 `log.cleanup.policy=compact` 启用压缩策略。

## Rebalanced



