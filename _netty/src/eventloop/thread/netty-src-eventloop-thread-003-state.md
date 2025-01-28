---
title: "EventLoop 线程状态切换：阻塞和唤醒"
sequence: "103"
---

[UP](/netty.html)


## 线程阻塞

### 何时阻塞

第 1 个问题，何时阻塞？

简单来说，EventLoop 在『没有事情可做』的情况下会阻塞，具体情况如下：

- Channel 中没有 I/O 事件发生
- 没有任务
    - `scheduledTaskQueue` 队列中没有定时任务到期
    - `taskQueue` 队列中没有普通任务
    - `tailTasks` 队列中没有任务

### 阻塞多长时间

第 2 个问题，阻塞多长时间

- `taskQueue` 有任务，不阻塞
    - 会调用 `selector.selectNow` 方法，获取到 Channel IO 事件
- `taskQueue` 无任务
    - `scheduledTaskQueue` 有任务，则取第 1 个定时任务的时间
    - `scheduledTaskQueue` 无任务，则无限取 `Long.MAX_VALUE` 值

```java
public final class NioEventLoop extends SingleThreadEventLoop {
    private static final long AWAKE = -1L;
    private static final long NONE = Long.MAX_VALUE;

    // nextWakeupNanos is:
    //    AWAKE            when EL is awake
    //    NONE             when EL is waiting with no wakeup scheduled
    //    other value T    when EL is waiting with wakeup scheduled at time T
    // EL = EventLoop
    private final AtomicLong nextWakeupNanos = new AtomicLong(AWAKE);

    protected void run() {
        for (; ; ) {
            int strategy = selectStrategy.calculateStrategy(selectNowSupplier, hasTasks());
            switch (strategy) {
                case SelectStrategy.CONTINUE:
                    continue;

                case SelectStrategy.BUSY_WAIT:
                case SelectStrategy.SELECT:
                    long curDeadlineNanos = nextScheduledTaskDeadlineNanos();
                    if (curDeadlineNanos == -1L) {
                        curDeadlineNanos = NONE; // nothing on the calendar
                    }
                    nextWakeupNanos.set(curDeadlineNanos);
                    try {
                        if (!hasTasks()) {
                            // 进行阻塞
                            strategy = select(curDeadlineNanos);
                        }
                    }
                    finally {
                        // This update is just to help block unnecessary selector wakeups
                        // so use of lazySet is ok (no race condition)
                        nextWakeupNanos.lazySet(AWAKE);
                    }
                    // fall through
                default:
            }
        }
    }

    private int select(long deadlineNanos) throws IOException {
        if (deadlineNanos == NONE) {
            return selector.select();
        }
        // Timeout will only be 0 if deadline is within 5 microsecs
        long timeoutMillis = deadlineToDelayNanos(deadlineNanos + 995000L) / 1000000L;
        return timeoutMillis <= 0 ? selector.selectNow() : selector.select(timeoutMillis);
    }
}
```

```java
public interface SelectStrategy {
    int calculateStrategy(IntSupplier selectSupplier, boolean hasTasks) throws Exception;
}
```

```java
final class DefaultSelectStrategy implements SelectStrategy {
    static final SelectStrategy INSTANCE = new DefaultSelectStrategy();

    private DefaultSelectStrategy() { }

    @Override
    public int calculateStrategy(IntSupplier selectSupplier, boolean hasTasks) throws Exception {
        return hasTasks ? selectSupplier.get() : SelectStrategy.SELECT;
    }
}
```

## 线程唤醒

### Channel IO 事件发生

### 任务提交

```java
public abstract class SingleThreadEventExecutor extends AbstractScheduledEventExecutor implements OrderedEventExecutor {
    private void execute(Runnable task, boolean immediate) {
        boolean inEventLoop = inEventLoop();
        addTask(task);

        // ...

        if (!addTaskWakesUp && immediate) {
            // 进行唤醒
            wakeup(inEventLoop);
        }
    }
}
```

```java
public final class NioEventLoop extends SingleThreadEventLoop {
    protected void wakeup(boolean inEventLoop) {
        // NOTE: inEventLoop，一定是其它线程来唤醒阻塞的线程
        // NOTE: nextWakeupNanos，如果有多个线程来提交任务，只有一个线程会成功唤醒，避免多次调用 selector.wakeup();
        if (!inEventLoop && nextWakeupNanos.getAndSet(AWAKE) != AWAKE) {
            // NOTE: selector.wakeup() 是一个重量级的操作
            selector.wakeup();
        }
    }
}
```

