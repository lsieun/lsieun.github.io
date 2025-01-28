---
title: "硬件选择"
sequence: "101"
---

## 数据量

100 万日活 * 每人每天产生日志 100 条 = 1 亿条 （中型公司）

处理日志速度：1 亿条 / (24 * 3600s) = 1150 条/s

1 条日志，占用空间大小 `0.5k` ~ `2k`，平均大小 `1k`

高峰值（中午小高峰 8~12、晚上小高峰 20~24）： 1m/s * 20 倍 = 20m/s，1m/s * 40 倍 = 40m/s

## 几台服务器

购买多少台服务器

```text
服务器台数 = 2 * （生产者峰值生产速率 * 副本数 / 100） + 1
         = 2 * （20m/s * 2 / 100） + 1
         = 3 台
```

## 磁盘选择

Kafka 按照顺序读写：机械硬盘和固态硬盘，顺序读写速度差不多。

```text
1 亿条 * 1k = 100G

# 3 天，保留日志的时间
# 0.7，预留一些空间
(100G * 2 个副本 * 3 天) / 0.7 = 1T 

建议三台服务器，总的磁盘大小，大于 1T。
```

## 内存选择

```text
Kafka 内存 = 堆内存（Kafka内部配置） + 页缓存（服务器内存）
Kafka 堆内存建议每个节点 10G~15G
```

```text
kafka/bin/kafka-server-start.sh
```

原来内容：

```text
if [ "x$KAFKA_HEAP_OPTS" = "x" ]; then
    export KAFKA_HEAP_OPTS="-Xmx1G -Xms1G"
fi
```

修改为：

```text
export KAFKA_HEAP_OPTS="-Xmx10G -Xms10G"
```

```text
export KAFKA_HEAP_OPTS="-server -Xmx2G -Xms2G -XX:PermSize=128m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:ParallelGCThreads=8 -XX:ConcGCThreads=5 -XX:InitiatingHeapOccupancyPercent=70"
```


