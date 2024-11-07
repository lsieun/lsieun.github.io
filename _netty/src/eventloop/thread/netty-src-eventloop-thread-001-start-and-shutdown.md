---
title: "线程启动和关闭"
sequence: "101"
---

[UP](/netty.html)

## 线程数量

```text
线程数量 = EventLoop 数量
```

线程是懒惰创建的

## 线程何时启动？

EventLoop 的 NIO 线程在何时启动？

- 当首次调用 `execute` 方法时

![](/assets/images/netty/eventloop/thread/netty-eventloop-thread-1.svg)

![](/assets/images/netty/eventloop/thread/netty-eventloop-thread-2.svg)

## 避免线程重复启动

EventLoop 只有一个线程，会不会存在重复启动的问题？

- 通过状态位（`state`）控制线程只能启动一次

```java
public abstract class SingleThreadEventExecutor extends AbstractScheduledEventExecutor implements OrderedEventExecutor {
    private static final int ST_NOT_STARTED = 1;
    private static final int ST_STARTED = 2;
    private static final int ST_SHUTTING_DOWN = 3;
    private static final int ST_SHUTDOWN = 4;
    private static final int ST_TERMINATED = 5;

    private volatile int state = ST_NOT_STARTED;

    private static final AtomicIntegerFieldUpdater<SingleThreadEventExecutor> STATE_UPDATER =
            AtomicIntegerFieldUpdater.newUpdater(SingleThreadEventExecutor.class, "state");

    private void startThread() {
        // 未启动：ST_NOT_STARTED
        if (state == ST_NOT_STARTED) {
            // 尝试启动：ST_NOT_STARTED --> ST_STARTED
            if (STATE_UPDATER.compareAndSet(this, ST_NOT_STARTED, ST_STARTED)) {
                boolean success = false;
                try {
                    doStartThread();
                    success = true;
                } finally {
                    if (!success) {
                        // 未启动成功：ST_STARTED --> ST_NOT_STARTED
                        STATE_UPDATER.compareAndSet(this, ST_STARTED, ST_NOT_STARTED);
                    }
                }
            }
        }
    }
}
```

## 线程关闭

线程关闭，经历两个步骤：

- 第 1 步，修改 `state` 状态
- 第 2 步，关闭相关资源

### shutdownGracefully

```java
public abstract class SingleThreadEventExecutor extends AbstractScheduledEventExecutor implements OrderedEventExecutor {
    private volatile long gracefulShutdownQuietPeriod;
    private volatile long gracefulShutdownTimeout;
    private long gracefulShutdownStartTime;

    private final Promise<?> terminationFuture = new DefaultPromise<Void>(GlobalEventExecutor.INSTANCE);

    @Override
    public Future<?> shutdownGracefully(long quietPeriod, long timeout, TimeUnit unit) {
        ObjectUtil.checkPositiveOrZero(quietPeriod, "quietPeriod");
        if (timeout < quietPeriod) {
            throw new IllegalArgumentException(
                    "timeout: " + timeout + " (expected >= quietPeriod (" + quietPeriod + "))");
        }
        ObjectUtil.checkNotNull(unit, "unit");

        // 第 1 步，如果已有线程修改了 state 状态，表示此时正在关闭，则直接返回
        if (isShuttingDown()) {
            return terminationFuture();
        }
        // 到这儿，说明 state 只能为 ST_NOT_STARTED 和 ST_STARTED 状态

        // 第 2 步，更新 state 状态
        boolean inEventLoop = inEventLoop();
        boolean wakeup;
        int oldState;
        for (; ; ) {
            if (isShuttingDown()) {
                return terminationFuture();
            }
            int newState;
            wakeup = true;
            // 记录旧状态
            oldState = state;
            if (inEventLoop) {
                // 如果当前线程是 EventLoop 线程，则将新状态记录为 ST_SHUTTING_DOWN
                newState = ST_SHUTTING_DOWN;
            }
            else {
                switch (oldState) {
                    case ST_NOT_STARTED:
                    case ST_STARTED:
                        newState = ST_SHUTTING_DOWN;
                        break;
                    default:
                        newState = oldState;
                        wakeup = false;
                }
            }
            
            
            if (STATE_UPDATER.compareAndSet(this, oldState, newState)) {
                break;
            }
        }
        
        
        // 第 3 步，更新两个字段
        gracefulShutdownQuietPeriod = unit.toNanos(quietPeriod);
        gracefulShutdownTimeout = unit.toNanos(timeout);

        
        // 第 4 步，如果原来是『未启动』状态，则启动线程，然后返回
        if (ensureThreadStarted(oldState)) {
            return terminationFuture;
        }

        
        // 第 5 步，是否唤醒
        if (wakeup) {
            taskQueue.offer(WAKEUP_TASK);
            if (!addTaskWakesUp) {
                wakeup(inEventLoop);
            }
        }

        return terminationFuture();
    }

    @Override
    public Future<?> terminationFuture() {
        return terminationFuture;
    }

    @Override
    public boolean isShuttingDown() {
        return state >= ST_SHUTTING_DOWN;
    }
}
```

### run

```java
public abstract class SingleThreadEventExecutor extends AbstractScheduledEventExecutor implements OrderedEventExecutor {
    protected void run() {
        for (; ; ) {
            try {
                // 省略代码
            }
            finally {
                // Always handle shutdown even if the loop processing threw an exception.
                try {
                    if (isShuttingDown()) {
                        closeAll();
                        if (confirmShutdown()) {
                            return;
                        }
                    }
                }
                catch (Error e) {
                    throw e;
                }
                catch (Throwable t) {
                    handleLoopException(t);
                }
            }
        }
    }

    private void closeAll() {
        selectAgain();
        Set<SelectionKey> keys = selector.keys();
        Collection<AbstractNioChannel> channels = new ArrayList<AbstractNioChannel>(keys.size());
        for (SelectionKey k : keys) {
            Object a = k.attachment();
            if (a instanceof AbstractNioChannel) {
                channels.add((AbstractNioChannel) a);
            }
            else {
                k.cancel();
                NioTask<SelectableChannel> task = (NioTask<SelectableChannel>) a;
                invokeChannelUnregistered(task, k, null);
            }
        }

        for (AbstractNioChannel ch : channels) {
            ch.unsafe().close(ch.unsafe().voidPromise());
        }
    }
}
```
