---
title: "Partition 的文件存储"
sequence: "103"
---

## 文件结构

每个 partition 一个目录，该目录中是一堆 segment file（segment 默认大小是 1GB），该目录和 file 都是物理存储于磁盘。

每个 partition 目录，相当于一个巨型文件，被平均分配到多个大小相等的 segment（段）数据文件中。
但是，每个 segment file 消息数量不一定相等。

每个 partition 只需要支持顺序读写就行了，segment 文件生命周期由服务端配置参数决定。

这样做的好处就是能快速删除无用文件，有效提高磁盘利用率。

## retention

```text
# 时间维度
# 168 / 24 = 7 （天）
log.retention.hours=168

# 空间维度
# 1073741824 bytes = 1024 MB = 1 GB
log.segment.bytes=1073741824
```

```text
$ bin/kafka-configs.sh --alter \
  --add-config retention.ms=10000 \
  --bootstrap-server=0.0.0.0:9092 \
  --topic purge-scenario \
  && sleep 10
```

```text
$ bin/kafka-configs.sh --alter \
  --add-config retention.ms=604800000 \
  --bootstrap-server=0.0.0.0:9092 \
  --topic purge-scenario
```

## Reference

- [Configuring Message Retention Period in Apache Kafka](https://www.baeldung.com/kafka-message-retention)
