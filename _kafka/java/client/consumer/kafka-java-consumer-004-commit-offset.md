---
title: "消费者提交偏移量"
sequence: "104"
---

## 自动提交

### 自动提交的问题

## 手动提交

要进行手动提交，需要关闭自动提交位移参数：

```text
enable.auto.commit=false
```

手动提交，可以划分为

- 同步提交
- 异步提交
- 联合提交（同步+异步）

### 同步提交

```java
public interface Consumer<K, V> extends Closeable {
    void commitSync();

    void commitSync(Duration timeout);

    void commitSync(Map<TopicPartition, OffsetAndMetadata> offsets);

    void commitSync(final Map<TopicPartition, OffsetAndMetadata> offsets, final Duration timeout);
}
```

同步提交方式，是 Consumer 向 Broker 提交 offset 后等待 broker 响应。
若没有收到响应，则会重新提交，直到获取到响应。
在这个等待过程中，消费者是阻塞的，会严重影响 Consumer 的吞吐量。

### 异步提交

```java
public interface Consumer<K, V> extends Closeable {
    void commitAsync();

    void commitAsync(OffsetCommitCallback callback);

    void commitAsync(Map<TopicPartition, OffsetAndMetadata> offsets, OffsetCommitCallback callback);
}
```


### 同步 + 异步提交



## Reference

- [位移提交说明（十一）](https://blog.csdn.net/qq_34475529/article/details/121414544)

