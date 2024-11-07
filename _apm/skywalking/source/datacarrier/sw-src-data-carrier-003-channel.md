---
title: "Channel"
sequence: "103"
---

## Channels

- project: `apm-commons/apm-datacarrier`
- package: `org.apache.skywalking.apm.commons.datacarrier.buffer`

```text
            ┌─── write ───┼─── save(T data)
Channels ───┤
            │             ┌─── getChannelSize()
            └─── read ────┤
                          └─── getBuffer(int index)
```

![](/assets/images/skywalking/source/sw-src-data-carrier-channels.png)


```java
public class Channels<T> {
    private final QueueBuffer<T>[] bufferChannels;
    private final BufferStrategy strategy;
    private final long size;
    
    private IDataPartitioner<T> dataPartitioner;
    

    public Channels(int channelSize, int bufferSize, IDataPartitioner<T> partitioner, BufferStrategy strategy) {
        // A. QueueBuffer 的数量
        this.bufferChannels = new QueueBuffer[channelSize];
        
        // B. 根据 BufferStrategy 使用不同的实现（ArrayBlockingQueueBuffer/Buffer）
        for (int i = 0; i < channelSize; i++) {
            if (BufferStrategy.BLOCKING.equals(strategy)) {
                bufferChannels[i] = new ArrayBlockingQueueBuffer<>(bufferSize, strategy);
            } else {
                bufferChannels[i] = new Buffer<>(bufferSize, strategy);
            }
        }
        
        // C. 记录 strategy
        this.strategy = strategy;

        // D. 数据的总量
        // it's not pointless, it prevents numeric overflow before assigning an integer to a long
        size = 1L * channelSize * bufferSize;
        
        this.dataPartitioner = partitioner;
    }

    public boolean save(T data) {
        // 第 1 步，获取索引 index
        int index = dataPartitioner.partition(bufferChannels.length, data);
        
        // 第 2 步，更新 retryCountDown
        int retryCountDown = 1;
        if (BufferStrategy.IF_POSSIBLE.equals(strategy)) {
            int maxRetryCount = dataPartitioner.maxRetryCount();
            if (maxRetryCount > 1) {
                retryCountDown = maxRetryCount;
            }
        }
        
        // 第 3 步，不断重试保存
        for (; retryCountDown > 0; retryCountDown--) {
            if (bufferChannels[index].save(data)) {
                return true;
            }
        }
        return false;
    }

    public int getChannelSize() {
        return this.bufferChannels.length;
    }

    public QueueBuffer<T> getBuffer(int index) {
        return this.bufferChannels[index];
    }

    public long size() {
        return size;
    }
}
```

## IDataPartitioner

```java
public interface IDataPartitioner<T> {
    int partition(int total, T data);

    int maxRetryCount();
}
```

### SimpleRollingPartitioner

```java
public class SimpleRollingPartitioner<T> implements IDataPartitioner<T> {
    private volatile int i = 0;

    @Override
    public int partition(int total, T data) {
        return Math.abs(i++ % total);
    }

    @Override
    public int maxRetryCount() {
        return 3;
    }
}
```

### ProducerThreadPartitioner

```java
public class ProducerThreadPartitioner<T> implements IDataPartitioner<T> {
    public ProducerThreadPartitioner() {
    }

    @Override
    public int partition(int total, T data) {
        return (int) Thread.currentThread().getId() % total;
    }

    @Override
    public int maxRetryCount() {
        return 1;
    }
}
```

