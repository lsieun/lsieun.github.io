---
title: "Consumer"
sequence: "104"
---

## IConsumer

```text
             ┌─── start ─────┼─── init(Properties properties)
             │
             │               ┌─── consume(List<T> data);  // 处理数据：有数据
             │               │
IConsumer ───┼─── process ───┼─── nothingToConsume()      // 处理数据：无数据
             │               │
             │               └─── onError(List<T> data, Throwable t);  // 处理数据：出现错误
             │
             └─── stop ──────┼─── onExit()
```

我想到了几个词，可能以后会用到：

- prepare/init
- start
- process
- stop

```java
public interface IConsumer<T> {
    void init(final Properties properties);

    void consume(List<T> data);

    void onError(List<T> data, Throwable t);

    void onExit();

    /**
     * Notify the implementation, if there is nothing fetched from the queue.
     * This could be used as a timer to trigger
     * reaction if the queue has no element.
     */
    default void nothingToConsume() {
        return;
    }
}
```

## SampleConsumer

```java
public class SampleConsumer implements IConsumer<SampleData> {
    public int i = 1;

    @Override
    public void init(final Properties properties) {

    }

    @Override
    public void consume(List<SampleData> data) {
        for (SampleData one : data) {
            one.setIntValue(this.hashCode());
            ConsumerTest.BUFFER.offer(one);
        }
    }

    @Override
    public void onError(List<SampleData> data, Throwable t) {

    }

    @Override
    public void onExit() {

    }
}
```

```java
public class SampleData {
    private int intValue;

    private String name;

    public int getIntValue() {
        return intValue;
    }

    public String getName() {
        return name;
    }

    public SampleData setIntValue(int intValue) {
        this.intValue = intValue;
        return this;
    }

    public SampleData setName(String name) {
        this.name = name;
        return this;
    }
}
```

## TraceSegmentServiceClient

```java
@DefaultImplementor
public class TraceSegmentServiceClient implements BootService, IConsumer<TraceSegment>, TracingContextListener, GRPCChannelListener {
    // ...
}
```
