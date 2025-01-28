---
title: "Executor"
sequence: "103"
---

[UP](/netty.html)

## Executor 的传递过程

```java
public abstract class MultithreadEventExecutorGroup extends AbstractEventExecutorGroup {
    protected MultithreadEventExecutorGroup(int nThreads, Executor executor,
                                            EventExecutorChooserFactory chooserFactory,
                                            Object... args) {
        if (executor == null) {
            // 第 1 步，初始化 executor
            executor = new ThreadPerTaskExecutor(newDefaultThreadFactory());
        }

        children = new EventExecutor[nThreads];
        for (int i = 0; i < nThreads; i++) {
            // 第 2 步，将 executor 传递给 newChild() 方法
            children[i] = newChild(executor, args);
        }
    }

    protected ThreadFactory newDefaultThreadFactory() {
        // NOTE: getClass() 此时应该返回 NioEventLoopGroup.class
        return new DefaultThreadFactory(getClass());
    }
}
```

```java
public class NioEventLoopGroup extends MultithreadEventLoopGroup {
    protected EventLoop newChild(Executor executor, Object... args) throws Exception {
        // 第 3 步，将 executor 传递给 NioEventLoop 的构造方法
        return new NioEventLoop(this, executor, ...);
    }
}
```

```java
public abstract class SingleThreadEventExecutor extends AbstractScheduledEventExecutor implements OrderedEventExecutor {
    protected SingleThreadEventExecutor(EventExecutorGroup parent, Executor executor,
                                        boolean addTaskWakesUp, int maxPendingTasks,
                                        RejectedExecutionHandler rejectedHandler) {
        // 第 4 步，将 executor 传递给 ThreadExecutorMap.apply() 方法
        this.executor = ThreadExecutorMap.apply(executor, this);
    }
}
```

```java
public final class ThreadExecutorMap {
    private static final FastThreadLocal<EventExecutor> mappings = new FastThreadLocal<EventExecutor>();

    private ThreadExecutorMap() { }

    public static EventExecutor currentExecutor() {
        return mappings.get();
    }

    private static void setCurrentEventExecutor(EventExecutor executor) {
        mappings.set(executor);
    }
    
    public static Executor apply(final Executor executor, final EventExecutor eventExecutor) {
        // 第 5 步，对 executor 进一步包装为匿名类
        return new Executor() {
            @Override
            public void execute(final Runnable command) {
                executor.execute(apply(command, eventExecutor));
            }
        };
    }

    public static Runnable apply(final Runnable command, final EventExecutor eventExecutor) {
        return new Runnable() {
            @Override
            public void run() {
                setCurrentEventExecutor(eventExecutor);
                try {
                    command.run();
                } finally {
                    setCurrentEventExecutor(null);
                }
            }
        };
    }
}
```

## ThreadPerTaskExecutor

```java
public final class ThreadPerTaskExecutor implements Executor {
    private final ThreadFactory threadFactory;

    public ThreadPerTaskExecutor(ThreadFactory threadFactory) {
        this.threadFactory = ObjectUtil.checkNotNull(threadFactory, "threadFactory");
    }

    @Override
    public void execute(Runnable command) {
        // 第 1 步，线程创建交给 threadFactory
        // 第 2 步，线程启动由自己调用
        threadFactory.newThread(command).start();
    }
}
```

## DefaultThreadFactory

```java
public class DefaultThreadFactory implements ThreadFactory {
    private static final AtomicInteger poolId = new AtomicInteger();

    private final AtomicInteger nextId = new AtomicInteger();
    private final String prefix;
    private final boolean daemon;
    private final int priority;
    protected final ThreadGroup threadGroup;

    // NOTE: 传入值 NioEventLoopGroup.class
    //  代码调用：MultithreadEventExecutorGroup.newDefaultThreadFactory()
    public DefaultThreadFactory(Class<?> poolType) {
        // Thread.NORM_PRIORITY = 5
        this(poolType, false, Thread.NORM_PRIORITY);
    }

    // poolType = NioEventLoopGroup.class
    // daemon = false
    // priority = 5
    public DefaultThreadFactory(Class<?> poolType, boolean daemon, int priority) {
        this(toPoolName(poolType), daemon, priority);
    }

    // poolName = nioEventLoopGroup
    // daemon = false
    // priority = 5
    public DefaultThreadFactory(String poolName, boolean daemon, int priority) {
        this(poolName, daemon, priority, null);
    }

    // poolName = nioEventLoopGroup
    // daemon = false
    // priority = 5
    // threadGroup = null
    public DefaultThreadFactory(String poolName, boolean daemon, int priority, ThreadGroup threadGroup) {
        // NOTE: poolId 为什么是 2 呢？因为还有一个 GlobalEventExecutor
        // prefix = "nioEventLoopGroup-2-"
        prefix = poolName + '-' + poolId.incrementAndGet() + '-';
        this.daemon = daemon;
        this.priority = priority;
        this.threadGroup = threadGroup;
    }

    @Override
    public Thread newThread(Runnable r) {
        Thread t = newThread(FastThreadLocalRunnable.wrap(r), prefix + nextId.incrementAndGet());
        try {
            if (t.isDaemon() != daemon) {
                t.setDaemon(daemon);
            }

            if (t.getPriority() != priority) {
                t.setPriority(priority);
            }
        } catch (Exception ignored) {
            // Doesn't matter even if failed to set.
        }
        return t;
    }
}
```

## GlobalEventExecutor


