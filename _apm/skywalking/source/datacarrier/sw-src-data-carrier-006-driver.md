---
title: "Driver"
sequence: "106"
---

IDriver 可以理解成“操作多个线程”的工具。

```text
               ┌─── ConsumeDriver (C)
IDriver (I) ───┤
               └─── ConsumerPool (I) ────┼─── BulkConsumePool (C)
```

## IDriver

```text
           ┌─── begin(Channels channels)
IDriver ───┤
           └─── close(Channels channels)
```

```java
public interface IDriver {
    void begin(Channels channels);

    void close(Channels channels);

    boolean isRunning(Channels channels);
}
```

## ConsumeDriver

### Fields

```java
public class ConsumeDriver<T> implements IDriver {
    // A. 数据
    private Channels<T> channels;
    
    // B. 线程 = consumer + datasource(buffer)
    private ConsumerThread[] consumerThreads;
    private ReentrantLock lock;

    // C. 线程是否运行
    private boolean running;

    private ConsumeDriver(Channels<T> channels, int num) {
        this.channels = channels;

        this.consumerThreads = new ConsumerThread[num];
        this.lock = new ReentrantLock();

        this.running = false;
    }


    public ConsumeDriver(String name, Channels<T> channels, IConsumer<T> prototype, int num, long consumeCycle) {
        // A. 初始化字段
        this(channels, num);
        
        // B. consumer 初始化
        prototype.init(new Properties());

        // C. 创建线程
        for (int i = 0; i < num; i++) {
            consumerThreads[i] = new ConsumerThread(
                    "DataCarrier." + name + ".Consumer." + i + ".Thread", // thread 完整名称
                    prototype,                                            // consumer 的实例
                    consumeCycle                                          // thread 休息时间
            );
            consumerThreads[i].setDaemon(true);
        }
    }


    public ConsumeDriver(String name,                                 // thread 名称
                         Channels<T> channels,                        // 数据
                         Class<? extends IConsumer<T>> consumerClass, // 数据消费者
                         int num,                                     // thread 数量
                         long consumeCycle,                           // thread 休息时间
                         Properties properties) {                     // consumer 的初始化属性
        // A. 初始化字段
        this(channels, num);

        // B. 创建线程
        for (int i = 0; i < num; i++) {
            consumerThreads[i] = new ConsumerThread(
                    "DataCarrier." + name + ".Consumer." + i + ".Thread", // thread 完整名称
                    getNewConsumerInstance(consumerClass, properties),    // consumer 的实例 - 由方法创建
                    consumeCycle                                          // thread 休息时间
            );
            consumerThreads[i].setDaemon(true);
        }
    }

    private IConsumer<T> getNewConsumerInstance(Class<? extends IConsumer<T>> consumerClass, Properties properties) {
        try {
            IConsumer<T> inst = consumerClass.getDeclaredConstructor().newInstance();
            inst.init(properties);
            return inst;
        } catch (InstantiationException | IllegalAccessException | 
                 NoSuchMethodException | InvocationTargetException e) {
            throw new ConsumerCannotBeCreatedException(e);
        }
    }
}
```

### IDriver

```java
public class ConsumeDriver<T> implements IDriver {
    @Override
    public void begin(Channels channels) {
        // A. begin()方法 只能调用一次
        if (running) {
            return;
        }
        
        // B. 加锁
        lock.lock();
        try {
            // C1. 将数据（buffer）分配到线程（thread）
            this.allocateBuffer2Thread();
            
            // C2. 启动线程
            for (ConsumerThread consumerThread : consumerThreads) {
                consumerThread.start();
            }
            
            // C3. 更新 running 字段
            running = true;
        } finally {
            // D. 解锁
            lock.unlock();
        }
    }

    private void allocateBuffer2Thread() {
        // A. 获取 Buffer 的数量
        int channelSize = this.channels.getChannelSize();
        
        /**
         * if consumerThreads.length < channelSize
         * each consumer will process several channels.
         *
         * if consumerThreads.length == channelSize
         * each consumer will process one channel.
         *
         * if consumerThreads.length > channelSize
         * there will be some threads do nothing.
         */
        // B. 将 Buffer 分配到线程里
        for (int channelIndex = 0; channelIndex < channelSize; channelIndex++) {
            // B1. 计算线程的索引
            int consumerIndex = channelIndex % consumerThreads.length;
            
            // B2. 线程添加数据
            consumerThreads[consumerIndex].addDataSource(
                    channels.getBuffer(channelIndex)
            );
        }

    }

    @Override
    public void close(Channels channels) {
        // A. 加锁
        lock.lock();
        try {
            // B1. 设置 running 为 false
            this.running = false;
            
            // B2. 调用 shutdown 方法
            for (ConsumerThread consumerThread : consumerThreads) {
                consumerThread.shutdown();
            }
        } finally {
            // C. 解锁
            lock.unlock();
        }
    }

    @Override
    public boolean isRunning(Channels channels) {
        return running;
    }
}
```

## ConsumerPool

```java
public interface ConsumerPool extends IDriver {
    void add(String name, Channels channels, IConsumer consumer);
}
```

## BulkConsumePool

### Fields

```java
public class BulkConsumePool implements ConsumerPool {
    private List<MultipleChannelsConsumer> allConsumers;
    private volatile boolean isStarted = false;

    public BulkConsumePool(String name, int size, long consumeCycle) {
        // A. 修正 size 的值
        size = EnvUtil.getInt(name + "_THREAD", size);
        
        // B. 创建数组
        allConsumers = new ArrayList<MultipleChannelsConsumer>(size);
        
        // C. 创建线程
        for (int i = 0; i < size; i++) {
            MultipleChannelsConsumer multipleChannelsConsumer = new MultipleChannelsConsumer(
                    "DataCarrier." + name + ".BulkConsumePool." + i + ".Thread",
                    consumeCycle
            );
            multipleChannelsConsumer.setDaemon(true);
            allConsumers.add(multipleChannelsConsumer);
        }
    }
}
```

### Data: ConsumerPool

```java
public class BulkConsumePool implements ConsumerPool {
    @Override
    synchronized public void add(String name, Channels channels, IConsumer consumer) {
        // A. 获取负载最低的 thread
        MultipleChannelsConsumer multipleChannelsConsumer = getLowestPayload();
        
        // B. 将数据（channels）和 consumer 添加到线程中去
        multipleChannelsConsumer.addNewTarget(channels, consumer);
    }

    private MultipleChannelsConsumer getLowestPayload() {
        // A. 获取第一个线程
        MultipleChannelsConsumer winner = allConsumers.get(0);
        
        // B. 遍历剩余线程
        for (int i = 1; i < allConsumers.size(); i++) {
            // 哪个存储的数量少，哪个就是最小负载
            MultipleChannelsConsumer option = allConsumers.get(i);
            if (option.size() < winner.size()) {
                winner = option;
            }
        }
        return winner;
    }
}
```

### IDriver

```java
public class BulkConsumePool implements ConsumerPool {
    @Override
    public void begin(Channels channels) {
        // A. begin 方法只能调用一次
        if (isStarted) {
            return;
        }
        
        // B. 遍历启动各个线程
        for (MultipleChannelsConsumer consumer : allConsumers) {
            consumer.start();
        }
        
        // C. 修改 isStarted 状态
        isStarted = true;
    }

    @Override
    public void close(Channels channels) {
        // A. 循环所有线程，调用 shutdown 方法
        for (MultipleChannelsConsumer consumer : allConsumers) {
            consumer.shutdown();
        }
    }
    
    @Override
    public boolean isRunning(Channels channels) {
        return isStarted;
    }
}
```

## ZZZ

### running

```text
                                   ┌─── boolean running
           ┌─── ConsumeDriver ─────┤
           │                       └─── ConsumerThread ────┼─── boolean running
IDriver ───┤
           │                       ┌─── boolean isStarted
           └─── BulkConsumePool ───┤
                                   └─── MultipleChannelsConsumer ───┼─── boolean running
```
