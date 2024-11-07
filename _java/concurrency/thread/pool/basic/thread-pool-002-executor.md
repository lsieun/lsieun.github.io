---
title: "ThreadPoolExecutor"
sequence: "102"
---

[UP](/java-concurrency.html)


## ThreadPoolExecutor

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
                Executors.defaultThreadFactory(), defaultHandler);
    }

    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
                threadFactory, defaultHandler);
    }

    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              RejectedExecutionHandler handler) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
                Executors.defaultThreadFactory(), handler);
    }

    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
        if (corePoolSize < 0 ||
                maximumPoolSize <= 0 ||
                maximumPoolSize < corePoolSize ||
                keepAliveTime < 0)
            throw new IllegalArgumentException();
        if (workQueue == null || threadFactory == null || handler == null)
            throw new NullPointerException();
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }
}
```

## 线程数量变化

当我们利用线程池执行任务时：

- 如果此时线程池中的线程数量小于 `corePoolSize`，即使线程池中的线程处于空闲状态，也要创建新的线程来处理被添加的任务。
- 如果此时线程池中的线程数量等于 `corePoolSize`，但是缓冲队列 workQueue 未满，那么任务会被放入缓冲队列。
- 如果此时线程池中的线程数量大于等于 `corePoolSize`，缓冲队列 workQueue 满，并且线程池中的数量小于 maximumPoolSize，那么会新建线程来处理被添加的任务。
- 如果此时线程池中的线程数量大于 `corePoolSize`，缓冲队列 workQueue 满，并且线程池中的数量等于 `maximumPoolSize`，那么通过 handler 所指定的策略来处理此任务。
- 当线程池中的线程数量大于 `corePoolSize` 时，如果某线程空闲时间超过 `keepAliveTime`，线程将被终止。这样线程池可以动态调整池中的线程数。

## 代码示例

### 线程数量变化

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import static lsieun.concurrent.utils.SleepUtils.sleep;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 创建阻塞队列
        ArrayBlockingQueue<Runnable> queue = new ArrayBlockingQueue<>(10);

        // 创建线程池
        ThreadPoolExecutor pool = new ThreadPoolExecutor(
                5, // 核心线程数
                10, // 最大线程数
                2, // 线程空闲时间
                TimeUnit.SECONDS, // 时间单位
                queue // 阻塞队列
        );

        try {
            // 执行任务
            for (int i = 0; i < 20; i++) {
                final int task = i + 1;
                pool.execute(() -> {
                    log.info("Task " + task + " is running.");
                    if (task < 6) {
                        sleep(26 - task);
                    } else if (task < 11) {
                        sleep(5);
                    } else if (task < 16) {
                        sleep(5);
                    } else {
                        sleep(task - 15);
                    }
                    log.info("Task " + task + " is completed.");
                });

                printThreadPool(pool, task);
            }


        } finally {
            while (pool.getActiveCount() > 0) {
                printThreadPool(pool, 0);
                sleep(1);
            }

            // 关闭线程池
            pool.shutdown();
        }
    }

    private static void printThreadPool(ThreadPoolExecutor pool, int taskNum) {
        int poolSize = pool.getPoolSize();
        int activeCount = pool.getActiveCount();
        int taskSize = pool.getQueue().size();
        log.info("taskNum: {}, pool size: {}, active: {}, queue size: {}", taskNum, poolSize, activeCount, taskSize);
    }
}
```

```text
31.22.026 [main] INFO taskNum: 1, pool size: 1, active: 1, queue size: 0
31.22.028 [main] INFO taskNum: 2, pool size: 2, active: 2, queue size: 0
31.22.028 [main] INFO taskNum: 3, pool size: 3, active: 3, queue size: 0
31.22.029 [main] INFO taskNum: 4, pool size: 4, active: 4, queue size: 0
31.22.029 [main] INFO taskNum: 5, pool size: 5, active: 5, queue size: 0
31.22.029 [main] INFO taskNum: 6, pool size: 5, active: 5, queue size: 1
31.22.029 [main] INFO taskNum: 7, pool size: 5, active: 5, queue size: 2
31.22.029 [main] INFO taskNum: 8, pool size: 5, active: 5, queue size: 3
31.22.029 [main] INFO taskNum: 9, pool size: 5, active: 5, queue size: 4
31.22.029 [main] INFO taskNum: 10, pool size: 5, active: 5, queue size: 5
31.22.029 [main] INFO taskNum: 11, pool size: 5, active: 5, queue size: 6
31.22.030 [main] INFO taskNum: 12, pool size: 5, active: 5, queue size: 7
31.22.030 [main] INFO taskNum: 13, pool size: 5, active: 5, queue size: 8
31.22.030 [main] INFO taskNum: 14, pool size: 5, active: 5, queue size: 9
31.22.030 [main] INFO taskNum: 15, pool size: 5, active: 5, queue size: 10
31.22.030 [main] INFO taskNum: 16, pool size: 6, active: 6, queue size: 10
31.22.030 [main] INFO taskNum: 17, pool size: 7, active: 7, queue size: 10
31.22.030 [main] INFO taskNum: 18, pool size: 8, active: 8, queue size: 10
31.22.031 [main] INFO taskNum: 19, pool size: 9, active: 9, queue size: 10
31.22.031 [main] INFO taskNum: 20, pool size: 10, active: 10, queue size: 10
31.22.031 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 10
31.23.033 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 10
31.24.044 [main] INFO taskNum: 0, pool size: 10, active: 9, queue size: 8
31.25.056 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 7
31.26.067 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 6
31.27.068 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 5
31.28.080 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 4
31.29.081 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 3
31.30.087 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 2
31.31.096 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 1
31.32.109 [main] INFO taskNum: 0, pool size: 10, active: 10, queue size: 0
31.33.123 [main] INFO taskNum: 0, pool size: 10, active: 9, queue size: 0
31.34.134 [main] INFO taskNum: 0, pool size: 10, active: 8, queue size: 0
31.35.144 [main] INFO taskNum: 0, pool size: 9, active: 7, queue size: 0
31.36.157 [main] INFO taskNum: 0, pool size: 8, active: 6, queue size: 0
31.37.161 [main] INFO taskNum: 0, pool size: 7, active: 5, queue size: 0
31.38.176 [main] INFO taskNum: 0, pool size: 6, active: 5, queue size: 0
31.39.191 [main] INFO taskNum: 0, pool size: 5, active: 5, queue size: 0
31.40.196 [main] INFO taskNum: 0, pool size: 5, active: 5, queue size: 0
31.41.203 [main] INFO taskNum: 0, pool size: 5, active: 5, queue size: 0
31.42.215 [main] INFO taskNum: 0, pool size: 5, active: 5, queue size: 0
31.43.227 [main] INFO taskNum: 0, pool size: 5, active: 4, queue size: 0
31.44.236 [main] INFO taskNum: 0, pool size: 5, active: 3, queue size: 0
31.45.251 [main] INFO taskNum: 0, pool size: 5, active: 2, queue size: 0
31.46.261 [main] INFO taskNum: 0, pool size: 5, active: 1, queue size: 0
```

![](/assets/images/java/concurrency/pool/thread-pool-size-001.png)

![](/assets/images/java/concurrency/pool/thread-pool-size-002.png)

![](/assets/images/java/concurrency/pool/thread-pool-size-001-task.png)

![](/assets/images/java/concurrency/pool/thread-pool-size-002-pool-and-queue.png)

![](/assets/images/java/concurrency/pool/thread-pool-size-003-pool-and-queue.png)

![](/assets/images/java/concurrency/pool/thread-pool-size-004-pool-and-queue.png)


## 线程池为什么是先添加队列而不是先创建最大线程？

当线程池中的 `corePoolSize` 都在忙时，如果继续往线程池中添加任务，那么任务会先放入队列，队列满了之后，才会新开线程。

这就相当于，一个公司本来有 10 个程序员，本来这 10 个程序员能正常的处理各种需求，但是随着公司的发展，需要在慢慢的增加，
但是，一开始这些需求会增加在待开发列表中，然后这 10 个程序员加班加点的从待开发列表中获取需求并进行处理，
但是，某一天待开发列表满了，公司发现现有的 10 个程序员是真的处理不过来了，所以就可以招新员工了。
