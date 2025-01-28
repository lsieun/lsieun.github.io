---
title: "DataCarrier"
sequence: "107"
---

## DataCarrier

### Fields

```java
public class DataCarrier<T> {
    // A. 线程的基础名字
    private String name;

    // B. 管理多个线程的工具
    private IDriver driver;

    // C. 数据：channelSize x bufferSize
    private Channels<T> channels;
}
```

### 数据 Channels 初始化

数据 Channels 的大小：`channelSize x bufferSize`

```java
public class DataCarrier<T> {
    public DataCarrier(int channelSize, int bufferSize) {
        this("DEFAULT", channelSize, bufferSize);
    }

    public DataCarrier(String name, int channelSize, int bufferSize) {
        this(name, name, channelSize, bufferSize);
    }

    public DataCarrier(String name, String envPrefix, int channelSize, int bufferSize) {
        this(name, envPrefix, channelSize, bufferSize, BufferStrategy.BLOCKING);
    }

    public DataCarrier(String name, String envPrefix, int channelSize, int bufferSize, BufferStrategy strategy) {
        this.name = name;
        bufferSize = EnvUtil.getInt(envPrefix + "_BUFFER_SIZE", bufferSize);
        channelSize = EnvUtil.getInt(envPrefix + "_CHANNEL_SIZE", channelSize);
        channels = new Channels<>(channelSize, bufferSize, new SimpleRollingPartitioner<T>(), strategy);
    }

    public DataCarrier(int channelSize, int bufferSize, BufferStrategy strategy) {
        this("DEFAULT", "DEFAULT", channelSize, bufferSize, strategy);
    }
}
```

### Producer

```java
public class DataCarrier<T> {
    public boolean produce(T data) {
        if (driver != null) {
            if (!driver.isRunning(channels)) {
                return false;
            }
        }

        return this.channels.save(data);
    }
}
```

### Consumer

```java
public class DataCarrier<T> {
    // A. Consumer Class + ConsumeDriver
    public DataCarrier consume(Class<? extends IConsumer<T>> consumerClass, int num) {
        return this.consume(consumerClass, num, 20, new Properties());
    }

    // A. Consumer Class + ConsumeDriver
    public DataCarrier consume(Class<? extends IConsumer<T>> consumerClass,
                               int num,
                               long consumeCycle,
                               Properties properties) {
        if (driver != null) {
            driver.close(channels);
        }
        driver = new ConsumeDriver<T>(this.name, this.channels, consumerClass, num, consumeCycle, properties);
        driver.begin(channels);
        return this;
    }

    // B. Consumer Instance + ConsumeDriver
    public DataCarrier consume(IConsumer<T> consumer, int num) {
        return this.consume(consumer, num, 20);
    }

    // B. Consumer Instance + ConsumeDriver
    public DataCarrier consume(IConsumer<T> consumer, int num, long consumeCycle) {
        if (driver != null) {
            driver.close(channels);
        }
        driver = new ConsumeDriver<T>(this.name, this.channels, consumer, num, consumeCycle);
        driver.begin(channels);
        return this;
    }

    // C. Consumer Instance + ConsumerPool
    public DataCarrier consume(ConsumerPool consumerPool, IConsumer<T> consumer) {
        driver = consumerPool;
        consumerPool.add(this.name, channels, consumer);
        driver.begin(channels);
        return this;
    }

    // D. 上面的全是 IDriver.begin() 方法调用，这里是 IDriver.close() 方法调用
    public void shutdownConsumers() {
        if (driver != null) {
            driver.close(channels);
        }
    }
}
```
