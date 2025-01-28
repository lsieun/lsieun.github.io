---
title: "Thread"
sequence: "105"
---

## ConsumerThread

```text
                                   ┌─── DataSource_1 ───┼─── Buffer
                                   │
                                   ├─── DataSource_2 ───┼─── Buffer
                  ┌─── data ───────┤
                  │                ├─── ...
ConsumerThread ───┤                │
                  │                └─── DataSource_n ───┼─── Buffer
                  │
                  └─── consumer ───┼─── IConsumer
```

### Fields

![](/assets/images/skywalking/source/sw-src-data-carrier-consumer-thread.png)


```java
public class ConsumerThread<T> extends Thread {
    // A. 数据
    private List<DataSource> dataSources;
    
    // B. 数据消费者
    private IConsumer<T> consumer;
    private long consumeCycle;  // 本次消费没有取到数据时，线程 sleep 的时间

    // C. 线程的状态（是否正在运行）
    private volatile boolean running;

    ConsumerThread(String threadName, IConsumer<T> consumer, long consumeCycle) {
        super(threadName);
        
        // A. 数据
        this.dataSources = new ArrayList<DataSource>(1);

        // B. 数据消费者
        this.consumer = consumer;
        this.consumeCycle = consumeCycle;

        // C. 线程的状态（是否正在运行）
        this.running = false;
    }
}
```

### DataSource

```java
public class ConsumerThread<T> extends Thread {
    void addDataSource(QueueBuffer<T> sourceBuffer) {
        this.dataSources.add(new DataSource(sourceBuffer));
    }
}
```

```java
class DataSource {
    private QueueBuffer<T> sourceBuffer;

    DataSource(QueueBuffer<T> sourceBuffer) {
        this.sourceBuffer = sourceBuffer;
    }

    // 将 sourceBuffer 中的数据取出来，放到 consumeList 中
    void obtain(List<T> consumeList) {
        sourceBuffer.obtain(consumeList);
    }
}
```

### Thread

```java
public class ConsumerThread<T> extends Thread {
    @Override
    public void run() {
        // A. 设置 running 为 true
        // 在 shutdown() 方法中，会将 running 设置为 false
        running = true;

        // B. 准备一个数据容器
        final List<T> consumeList = new ArrayList<T>(1500);
        
        // C. 在 while 循环中，“消费”数据
        while (running) {
            if (!consume(consumeList)) { // 这里是真正的“消费”逻辑
                try {
                    Thread.sleep(consumeCycle);
                } catch (InterruptedException e) {
                }
            }
        }

        // D. 最后一次“消费”数据
        // consumer thread is going to stop
        // consume the last time
        consume(consumeList);

        // E. 退出
        consumer.onExit();
    }

    // true ：表示消费的数据
    // false: 表示没有数据可以消费
    private boolean consume(List<T> consumeList) {
        // A. 数据转移：DataSource --> QueueBuffer --> List<T>
        for (DataSource dataSource : dataSources) {
            dataSource.obtain(consumeList);
        }

        // B1. consumeList 不为空，则进行消费
        if (!consumeList.isEmpty()) {
            try {
                consumer.consume(consumeList);    // 数据消费：正常
            } catch (Throwable t) {
                consumer.onError(consumeList, t); // 数据消费：异常
            } finally {
                consumeList.clear();              // 数据清空
            }
            return true;
        }
        
        // B2. consumeList 为空，没有数据可以消费
        consumer.nothingToConsume();
        
        return false;
    }


    void shutdown() {
        running = false;
    }
}
```

## MultipleChannelsConsumer

![](/assets/images/skywalking/source/sw-src-data-carrier-multiple-channels-consumer.png)

```text
                                                              ┌─── Buffer_1
                                                              │
                                                              ├─── Buffer_2
                                            ┌─── Channels ────┤
                                            │                 ├─── ...
                            ┌─── Group_1 ───┤                 │
                            │               │                 └─── Buffer_n
                            │               │
                            │               └─── IConsumer
                            │
                            │                                 ┌─── Buffer_1
                            │                                 │
                            │                                 ├─── Buffer_2
                            │               ┌─── Channels ────┤
                            │               │                 ├─── ...
                            ├─── Group_2 ───┤                 │
MultipleChannelsConsumer ───┤               │                 └─── Buffer_n
                            │               │
                            │               └─── IConsumer
                            │
                            ├─── ...
                            │
                            │                                 ┌─── Buffer_1
                            │                                 │
                            │                                 ├─── Buffer_2
                            │               ┌─── Channels ────┤
                            │               │                 ├─── ...
                            └─── Group_n ───┤                 │
                                            │                 └─── Buffer_n
                                            │
                                            └─── IConsumer
```

### Fields

```java
public class MultipleChannelsConsumer extends Thread {
    // A. 数据 + 消费者：group = channels(data) + consumer
    private volatile ArrayList<Group> consumeTargets;
    private volatile long size;      // 所有 buffer 的数量
    private final long consumeCycle; // consumer 的休息时间

    // B. 线程的状态（是否正在运行）
    private volatile boolean running;

    public MultipleChannelsConsumer(String threadName, long consumeCycle) {
        super(threadName);

        this.consumeTargets = new ArrayList<Group>();
        this.consumeCycle = consumeCycle;
    }
}
```

### Data: Group

```java
public class MultipleChannelsConsumer extends Thread {
    
    public void addNewTarget(Channels channels, IConsumer consumer) {
        // A. group = channels + consumer
        Group group = new Group(channels, consumer);
        
        // B. 复制一份
        // Recreate the new list to avoid change list while the list is used in consuming.
        ArrayList<Group> newList = new ArrayList<Group>();
        for (Group target : consumeTargets) {
            newList.add(target);
        }
        
        // C. 添加新的 group
        newList.add(group);
        
        // D. 赋值
        consumeTargets = newList;
        
        // E. 更新 size
        size += channels.size();
    }

    public long size() {
        return size;
    }
}
```

```java
private static class Group {
    private Channels channels;
    private IConsumer consumer;

    public Group(Channels channels, IConsumer consumer) {
        this.channels = channels;
        this.consumer = consumer;
    }
}
```

### Thread

```java
public class MultipleChannelsConsumer extends Thread {
    @Override
    public void run() {
        // A. 设置 running 为 true
        // 在 shutdown() 方法中，会将 running 设置为 false
        running = true;

        // B. 准备一个数据容器
        final List consumeList = new ArrayList(2000);

        // C. 在 while 循环中，“消费”数据
        while (running) {
            boolean hasData = false;
            for (Group target : consumeTargets) {
                boolean consume = consume(target, consumeList);    // 这里是真正的“消费”逻辑
                hasData = hasData || consume;
            }

            if (!hasData) {
                try {
                    Thread.sleep(consumeCycle);
                } catch (InterruptedException e) {
                }
            }
        }

        // D. 最后一次“消费”数据 + 退出
        // consumer thread is going to stop
        // consume the last time
        for (Group target : consumeTargets) {
            consume(target, consumeList);

            target.consumer.onExit();
        }
    }

    private boolean consume(Group target, List consumeList) {
        // A. 数据转移：Group --> QueueBuffer --> List<T>
        for (int i = 0; i < target.channels.getChannelSize(); i++) {
            QueueBuffer buffer = target.channels.getBuffer(i);
            buffer.obtain(consumeList);
        }

        // B1. consumeList 不为空，则进行消费
        if (!consumeList.isEmpty()) {
            try {
                target.consumer.consume(consumeList);    // 数据消费：正常
            } catch (Throwable t) {
                target.consumer.onError(consumeList, t); // 数据消费：异常
            } finally {
                consumeList.clear();                    // 数据清空
            }
            return true;
        }

        // B2. consumeList 为空，没有数据可以消费
        target.consumer.nothingToConsume();

        return false;
    }

    void shutdown() {
        running = false;
    }
}
```

