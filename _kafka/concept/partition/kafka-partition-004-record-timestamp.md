---
title: "Record 时间戳"
sequence: "104"
---

- 生产者
- 消费者
- Broker

## 消息的时间

有两种：

- 消息自带的时间
- Broker 记录的时间

## Broker 配置

Kafka的 `log.message.timestamp.type` 有两种：

- `CreateTime`：默认值，是由 ProducerRecord 记录的时间
- `LogAppendTime`：是 Broker 添加记录的时间

### 配置文件

要通过命令行修改Kafka的`log.message.timestamp.type`设置，您可以按照以下步骤进行操作：

第 1 步，修改 `kafka/config/server.properties` 文件：

```text
log.message.timestamp.type=LogAppendTime
```

第 2 步，重启 Kafka 服务器，以使新的配置生效。

如果您正在使用 Kafka 集群，您需要在所有的 Kafka 服务器上执行相同的配置更改，以确保一致性。

### 命令

```text
./bin/kafka-configs.sh --bootstrap-server=0.0.0.0:9092 \
--entity-type brokers --entity-default \
--alter \
--add-config log.message.timestamp.type=LogAppendTime
```

```text
./bin/kafka-configs.sh --bootstrap-server 0.0.0.0:9092 \
--entity-type brokers --entity-default \
--alter \
--delete-config log.message.timestamp.type
```

```text
./bin/kafka-configs.sh --bootstrap-server=0.0.0.0:9092 \
--entity-type brokers --entity-default \
--describe
```

## 消息顺序

## timestamp

Recent versions of the producer record contain a timestamp on the events you send.
A user can either pass the time into the constructor as a Java type `long` when sending a
`ProducerRecord` Java object or the current system time.
The actual time that is used in the message can stay as this value,
or it can be a broker timestamp that occurs when the message is logged.
Setting the topic configuration `log.message.timestamp.type` to `CreateTime` uses the time set by the client,
whereas setting it to `LogAppendTime` uses the broker time.

```text
$ docker logs kafka-0 | grep "log.message.timestamp.type"
	log.message.timestamp.type = CreateTime
```

Why would you want to choose one over the other?
You might want to use the created time in order to have the time that a transaction (like a sales order) takes place
rather than when it made its way to the broker.
Using the broker time can be useful
when the created time is handled inside the message itself or an actual event time is not business or order relevant.

As always, timestamps can be tricky.
For example, we might get a record with an earlier timestamp than that of a record before it.
This can happen in cases where a failure occurred and a different message with a later timestamp was committed before
the retry of the first record completed.
The data is ordered in the log by offsets and not by timestamp.
Although reading timestamped data is often thought of as a consumer client concern,
it is also a producer concern
because the producer takes the first steps in ensuring message order.

As discussed earlier, this is also why `max.in.flight.requests.per.connection` is important
when considering whether you want to allow retries or many inflight requests at a time.
If a retry happens and other requests succeed on their first attempt,
earlier messages might be added after the later ones.

Figure 4.8 provides an example of when a message can get out of order.
Even though message 1 was sent first,
it does not make it into the log in an ordered manner because retries were enabled.

![](/assets/images/kafka/producer/producer-retry-impact-on-order.png)

