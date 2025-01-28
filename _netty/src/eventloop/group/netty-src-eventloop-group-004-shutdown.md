---
title: "EventLoopGroup 优雅关闭"
sequence: "104"
---

[UP](/netty.html)

```java
public abstract class AbstractEventExecutorGroup implements EventExecutorGroup {
    @Override
    public Future<?> shutdownGracefully() {
        // DEFAULT_SHUTDOWN_QUIET_PERIOD = 2
        // DEFAULT_SHUTDOWN_TIMEOUT = 15
        return shutdownGracefully(DEFAULT_SHUTDOWN_QUIET_PERIOD, DEFAULT_SHUTDOWN_TIMEOUT, TimeUnit.SECONDS);
    }
}
```

```java
public abstract class MultithreadEventExecutorGroup extends AbstractEventExecutorGroup {
    private final AtomicInteger terminatedChildren = new AtomicInteger();
    private final Promise<?> terminationFuture = new DefaultPromise(GlobalEventExecutor.INSTANCE);

    protected MultithreadEventExecutorGroup(int nThreads, Executor executor,
                                            EventExecutorChooserFactory chooserFactory, Object... args) {
        // 代码省略
        
        // 第 3 步，terminationListener 的实现逻辑
        final FutureListener<Object> terminationListener = new FutureListener<Object>() {
            @Override
            public void operationComplete(Future<Object> future) throws Exception {
                // 第 4 步，只有 terminatedChildren 的数量与 children 的数量相等时，才进行方法体
                if (terminatedChildren.incrementAndGet() == children.length) {
                    // 第 5 步，将 terminationFuture 设置为成功
                    terminationFuture.setSuccess(null);
                }
            }
        };

        // 第 1 步，遍历 children 中的 EventExecutor
        for (EventExecutor e : children) {
            // 第 2 步，为每一个 EventExecutor 添加 Listener
            e.terminationFuture().addListener(terminationListener);
        }
        
        // 代码省略
    }

    @Override
    public Future<?> terminationFuture() {
        return terminationFuture;
    }

    // quietPeriod = 2
    // timeout = 15
    // unit = TimeUnit.SECONDS
    @Override
    public Future<?> shutdownGracefully(long quietPeriod, long timeout, TimeUnit unit) {
        for (EventExecutor l : children) {
            l.shutdownGracefully(quietPeriod, timeout, unit);
        }
        return terminationFuture();
    }
}
```
