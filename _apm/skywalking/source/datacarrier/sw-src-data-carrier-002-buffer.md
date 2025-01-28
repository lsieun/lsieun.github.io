---
title: "Buffer"
sequence: "102"
---

## QueueBuffer

```text
                             ┌─── save(T data)
               ┌─── write ───┤
               │             └─── setStrategy(BufferStrategy strategy);
QueueBuffer ───┤
               │             ┌─── obtain(List<T> consumeList)
               └─── read ────┤
                             └─── int getBufferSize();
```

```java
public interface QueueBuffer<T> {
    boolean save(T data);

    // Set different strategy when queue is full.
    void setStrategy(BufferStrategy strategy);

    void obtain(List<T> consumeList);

    int getBufferSize();
}
```

### BufferStrategy

```java
public enum BufferStrategy {
    BLOCKING,       // 如果空间不够了，就阻塞新数据加入
    IF_POSSIBLE;    // 如果空间不够了，就抛弃掉新数据
}
```

## Buffer

![](/assets/images/skywalking/source/sw-src-data-carrier-buffer.png)

```java
/**
 * Self implementation ring queue.
 */
public class Buffer<T> implements QueueBuffer<T> {
    private final Object[] buffer;
    private AtomicRangeInteger index;
    private BufferStrategy strategy;
    

    Buffer(int bufferSize, BufferStrategy strategy) {
        buffer = new Object[bufferSize];
        index = new AtomicRangeInteger(0, bufferSize);
        this.strategy = strategy;
    }

    @Override
    public boolean save(T data) {
        int i = index.getAndIncrement();
        if (buffer[i] != null) {
            switch (strategy) {
                case IF_POSSIBLE:
                    return false;
                default:
            }
        }
        buffer[i] = data;
        return true;
    }

    @Override
    public void setStrategy(BufferStrategy strategy) {
        this.strategy = strategy;
    }

    @Override
    public void obtain(List<T> consumeList) {
        this.obtain(consumeList, 0, buffer.length);
    }

    void obtain(List<T> consumeList, int start, int end) {
        for (int i = start; i < end; i++) {
            if (buffer[i] != null) {
                consumeList.add((T) buffer[i]);
                buffer[i] = null;
            }
        }
    }
    
    @Override
    public int getBufferSize() {
        return buffer.length;
    }
}
```

### AtomicRangeInteger

```java
public class AtomicRangeInteger extends Number implements Serializable {
    // 第 1 个，数组
    private AtomicIntegerArray values;
    
    // 第 2 个，位置，数组中间的位置
    private static final int VALUE_OFFSET = 15;
    
    // 第 3 个，数组元素，取值的“最小值”和“最大值”
    private int startValue;
    private int endValue;

    public AtomicRangeInteger(int startValue, int maxValue) {
        // A. 初始化数组
        this.values = new AtomicIntegerArray(31);
        
        // B. 设置元素的值
        this.values.set(VALUE_OFFSET, startValue);
        
        // C. 记录最小值和最大值
        this.startValue = startValue;
        this.endValue = maxValue - 1;
    }

    // B. 这里是 getAndIncrement
    public final int getAndIncrement() {
        int next;
        do {
            // A. 这里是 incrementAndGet
            next = this.values.incrementAndGet(VALUE_OFFSET);
            if (next > endValue && this.values.compareAndSet(VALUE_OFFSET, next, startValue)) {
                return endValue;
            }
        }
        while (next > endValue);

        return next - 1;
    }

    public final int get() {
        return this.values.get(VALUE_OFFSET);
    }
}
```

## ArrayBlockingQueueBuffer

```java
public class ArrayBlockingQueueBuffer<T> implements QueueBuffer<T> {
    
    private ArrayBlockingQueue<T> queue;
    private int bufferSize;

    private BufferStrategy strategy;

    ArrayBlockingQueueBuffer(int bufferSize, BufferStrategy strategy) {
        this.strategy = strategy;
        this.queue = new ArrayBlockingQueue<T>(bufferSize);
        this.bufferSize = bufferSize;
    }

    @Override
    public boolean save(T data) {
        //only BufferStrategy.BLOCKING
        try {
            queue.put(data);
        } catch (InterruptedException e) {
            // Ignore the error
            return false;
        }
        return true;
    }

    @Override
    public void setStrategy(BufferStrategy strategy) {
        this.strategy = strategy;
    }

    @Override
    public void obtain(List<T> consumeList) {
        queue.drainTo(consumeList);
    }

    @Override
    public int getBufferSize() {
        return bufferSize;
    }
}
```
