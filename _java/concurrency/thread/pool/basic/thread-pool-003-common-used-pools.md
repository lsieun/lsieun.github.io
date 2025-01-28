---
title: "常用的线程池"
sequence: "103"
---

[UP](/java-concurrency.html)


在 `java.util.concurrent` 中，提供了工具类 `Executors` （调度器）对象来创建线程池。
可创建的线程池有四种：

- CachedThreadPool —— 可缓存线程池
- FixedThreadPool —— 定长线程池
- SingleThreadExecutor —— 单线程池
- ScheduledThreadPool —— 调度线程池

## 常见的线程池有哪些？它们分别适合什么场景使用？

6 种常见的线程池：

- FixedThreadPool
- CachedThreadPool
- ScheduledThreadPool
- SingleThreadExecutor
- SingleThreadScheduledExecutor

常见线程池中使用场景有哪些

## FixedThreadPool

```java
public class Executors {
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(
                nThreads, nThreads,          // 核心线程数 == 最大线程数
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<Runnable>());
    }
}
```

特点：

- 核心线程数 == 最大线程数；没有救急线程被创建，因此无需超时时间
- 阻塞队列是无界的，可以任意数量的任务

场景：适用于任务量已知、相对耗时的任务。

## CachedThreadPool

```java
public class Executors {
    // 整个线程池表现为线程数会根据任务量不断增长，没有上限。
    // 当任务执行完毕，空闲 1 分钟后，释放线程。
    // 场景：适合任务数比较密集，但每个任务执行时间较短的情况。
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(
                0, Integer.MAX_VALUE,    // 核心线程数是 0，最大线程数是 Integer.MAX_VALUE
                60L, TimeUnit.SECONDS,   // 救急线程的空间生存时间是 60 秒。--> 这意味着，全是救急线程（60 秒后回收），可以无限创建
                new SynchronousQueue<Runnable>()); // 队列采用了 SynchronousQueue 实现特点是，它没有容量，没有线程来取是放不进去的
    }
}
```

The cached thread pool may grow without bounds to accommodate any number of submitted tasks.
But when the threads are not needed anymore, they will be disposed of after 60 seconds of inactivity.

应用场景：A typical use case is when we have a lot of short-living tasks in our application.

The queue size will always be **zero** because internally a `SynchronousQueue` instance is used.
In a `SynchronousQueue`, pairs of `insert` and `remove` operations always occur simultaneously.
So, the queue never actually contains anything.

## SingleThreadExecutor

```java
public class Executors {
    // 场景：希望多个任务排除执行。线程数固定为 1，任务多于 1 时，会放入无界队列排除。任务执行完毕，这唯一的线程也不会被释放。
    // 
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
                (new ThreadPoolExecutor(1, 1,
                        0L, TimeUnit.MILLISECONDS,
                        new LinkedBlockingQueue<Runnable>()));
    }
}
```

区别：

- 自己创建一个单线程串行执行任务，如果任务失败，则终止，没有任何补救措施；而线程池，还会新建一个线程，保证池的正常工作
- `Executors.newSingleThreadExecutor()` 线程个数始终为 `1`，不能修改
  - `FinalizableDelegatedExecutorService` 应用的是装饰器模式，只对外暴露了 ExecutorService 接口，因此不能调用 `ThreadPoolExecutor` 中特有的方法
- `Executors.newFixedThreadPool(1)` 初始时为，以后还可以修改
  - 对外暴露的是 `ThreadPoolExecutor` 对象，可以强转后调用 `setCorePoolSize` 等方法进行修改。

## Executors

```java
public class Executors {
    //
}
```

### 构造方法

```java
public class Executors {
    /** Cannot instantiate. */
    private Executors() {}
}
```

### FixedThreadPool

```java
public class Executors {
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(
            nThreads, nThreads,
            0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<Runnable>()
        );
    }

    public static ExecutorService newFixedThreadPool(int nThreads, ThreadFactory threadFactory) {
        return new ThreadPoolExecutor(
            nThreads, nThreads,
            0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<Runnable>(),
            threadFactory
        );
    }
}
```

### SingleThreadExecutor

```java
public class Executors {
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService(
            new ThreadPoolExecutor(
                1, 1,
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<Runnable>()
            )
        );
    }

    public static ExecutorService newSingleThreadExecutor(ThreadFactory threadFactory) {
        return new FinalizableDelegatedExecutorService(
            new ThreadPoolExecutor(
                1, 1,
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<Runnable>(),
                threadFactory
            )
        );
    }
}
```

### CachedThreadPool

```java
public class Executors {
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(
            0, Integer.MAX_VALUE,
            60L, TimeUnit.SECONDS,
            new SynchronousQueue<Runnable>()
        );
    }

    public static ExecutorService newCachedThreadPool(ThreadFactory threadFactory) {
        return new ThreadPoolExecutor(
            0, Integer.MAX_VALUE,
            60L, TimeUnit.SECONDS,
            new SynchronousQueue<Runnable>(),
            threadFactory
        );
    }
}
```

### ThreadScheduledExecutor

```java
public class Executors {
    public static ScheduledExecutorService newSingleThreadScheduledExecutor() {
        return new DelegatedScheduledExecutorService(new ScheduledThreadPoolExecutor(1));
    }

    public static ScheduledExecutorService newSingleThreadScheduledExecutor(ThreadFactory threadFactory) {
        return new DelegatedScheduledExecutorService(new ScheduledThreadPoolExecutor(1, threadFactory));
    }

    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }

    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize, ThreadFactory threadFactory) {
        return new ScheduledThreadPoolExecutor(corePoolSize, threadFactory);
    }
}
```

### ThreadFactory

```java
public class Executors {
    public static ThreadFactory defaultThreadFactory() {
        return new DefaultThreadFactory();
    }

    private static class DefaultThreadFactory implements ThreadFactory {
        private static final AtomicInteger poolNumber = new AtomicInteger(1);
        private final ThreadGroup group;
        private final AtomicInteger threadNumber = new AtomicInteger(1);
        private final String namePrefix;

        DefaultThreadFactory() {
            @SuppressWarnings("removal")
            SecurityManager s = System.getSecurityManager();
            group = (s != null) ? s.getThreadGroup() :
                    Thread.currentThread().getThreadGroup();
            namePrefix = "pool-" +
                    poolNumber.getAndIncrement() +
                    "-thread-";
        }

        public Thread newThread(Runnable r) {
            Thread t = new Thread(
                group,    // thread group
                r,        // task
                namePrefix + threadNumber.getAndIncrement(), // thread name
                0         // stack size
            );
            
            // 确保线程池里的线程不是 daemon 线程
            if (t.isDaemon())
                t.setDaemon(false);

            if (t.getPriority() != Thread.NORM_PRIORITY)
                t.setPriority(Thread.NORM_PRIORITY);
            return t;
        }
    }
}
```

```java
public interface ThreadFactory {
    Thread newThread(Runnable r);
}
```

### callable

将 `Runnable` 转换成 `Callable`：

```java
public class Executors {
    public static <T> Callable<T> callable(Runnable task, T result) {
        if (task == null)
            throw new NullPointerException();
        return new RunnableAdapter<T>(task, result);
    }

    public static Callable<Object> callable(Runnable task) {
        if (task == null)
            throw new NullPointerException();
        return new RunnableAdapter<Object>(task, null);
    }

    private static final class RunnableAdapter<T> implements Callable<T> {
        private final Runnable task;
        private final T result;

        RunnableAdapter(Runnable task, T result) {
            this.task = task;
            this.result = result;
        }

        public T call() {
            task.run();
            return result;
        }

        public String toString() {
            return super.toString() + "[Wrapped task = " + task + "]";
        }
    }
}
```

## FAQ

### 为什么不建议使用 Executors 来创建线程池？

当我们使用 `Executors` 创建 FixedThreadPool 时，对应的方法为：

```java
public class Executors {
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(
            nThreads, nThreads,
            0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<Runnable>()
        );
    }
}
```

在上面的代码中，创建的队列为 `LinkedBlockingQueue`，它是一个无界阻塞队列。
如果使用该线程池执行任务，当任务过多时，就不会断添加到队列中，任务越多，占用的内存就越多，最终可能耗尽内存，导致 OOM。

当我们使用 `Executors` 创建 SingleThreadExecutor 时，对应的方法为：

```java
public class Executors {
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService(
            new ThreadPoolExecutor(
                1, 1,
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<Runnable>()
            )
        );
    }
}
```

在上面的代码中，也是使用 `LinkedBlockingQueue`，所以同样会耗尽内存。

除了有可能造成 OOM 之外，我们使用 `Executors` 来创建线程池，也不能自定义线程的名字，
不利于排查问题，所以建议直接使用 `ThreadPoolExecutor` 来定义线程池，这样可以灵活控制。

![](/assets/images/java/concurrency/pool/alibaba-forbid-executors-thread-pool.png)
