---
title: "线程池关闭"
sequence: "107"
---

[UP](/java-concurrency.html)


## 关闭线程池

- **graceful termination** via `ExecutorService.shutdown`
- **abrupt termination** via `ExecutorService.shutdownNow`

<table>
    <thead>
    <tr>
        <th></th>
        <th>shutdown</th>
        <th>shutdownNow</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>方法：返回值</td>
        <td><code>void</code></td>
        <td><code>List&lt;Runnable&gt;</code></td>
    </tr>
    <tr>
        <td>线程池：状态</td>
        <td>RUNNING -&gt; SHUTDOWN</td>
        <td>RUNNING -&gt; STOP</td>
    </tr>
    <tr>
        <td>任务：新任务</td>
        <td>不能添加</td>
        <td>不能添加</td>
    </tr>
    <tr>
        <td>任务：正在执行的任务</td>
        <td>执行完成</td>
        <td>线程会接收到 <code>Thread.interrupt()</code> 打断操作，是否继续执行，需要看具体代码是否进行了处理</td>
    </tr>
    <tr>
        <td>任务：队列中的任务</td>
        <td>执行完成</td>
        <td>不运行，作为结果返回</td>
    </tr>
    </tbody>
</table>

### shutdown

When we invoke `shutdown`, the thread pool stops accepting new tasks.
Then, it waits for already submitted tasks to complete even if they didn't start yet.

```text
/*
线程池状态变为 SHUTDOWN
- 不会接收新任务
- 但已提交任务会执行完
- 此方法不会阻塞调用线程的执行
*/
void shutdown();

```

源码：

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    public void shutdown() {
        final ReentrantLock mainLock = this.mainLock;
        mainLock.lock();
        try {
            checkShutdownAccess();
            // 修改线程池状态
            advanceRunState(SHUTDOWN);
            // 仅会打断空闲线程
            interruptIdleWorkers();
            // 扩展点 ScheduledThreadPoolExecutor
            onShutdown(); // hook for ScheduledThreadPoolExecutor
        } finally {
            mainLock.unlock();
        }

        // 尝试终结(没有运行的线程可以立刻终结，如果还有运行的线程也不会等)
        tryTerminate();
    }
}
```

### shutdownNow

The `shutdownNow` method results in an abrupt termination because **`shutdownNow` tries to cancel running tasks.**
It also removes the waiting tasks from the queue and returns to the caller - possibly to store the state and retry
later.

```text
/*
线程池状态变为 STOP
- 不会接收新任务
- 会将队列中的任务返回
- 并用 interrupt 的方式中断正在执行的任务
*/
List<Runnable> shutdownNow();

```

源码：

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    public List<Runnable> shutdownNow() {
        List<Runnable> tasks;
        final ReentrantLock mainLock = this.mainLock;
        mainLock.lock();
        try {
            checkShutdownAccess();
            // 修改线程池状态
            advanceRunState(STOP);
            // 打断所有线程
            interruptWorkers();
            // 获取队列中剩余任务
            tasks = drainQueue();
        } finally {
            mainLock.unlock();
        }

        // 尝试终结
        tryTerminate();
        return tasks;
    }
}
```

### 其它方法

```text
// 不在 RUNNING 状态的线程池，此方法就返回 true
boolean isShutdown();

// 线程池状态是否是 TERMINATED
boolean isTerminated();

// 调用 shutdown 后，由于调用线程并不会等待所有任务运行结束，因此如果它想在线程池 TERMINATED 后做些事情，可以利用此方法等待
boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException;
```

### 代码示例

#### 第一版

```java
import java.util.concurrent.*;

@Slf4j
public class PoolShutdown {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(2);

        Future<Integer> result1 = pool.submit(() -> {
            log.info("task 1 running...");
            Thread.sleep(1000);
            log.info("task 1 finish...");
            return 1;
        });

        Future<Integer> result2 = pool.submit(() -> {
            log.info("task 2 running...");
            Thread.sleep(1000);
            log.info("task 2 finish...");
            return 2;
        });

        Future<Integer> result3 = pool.submit(() -> {
            log.info("task 3 running...");
            Thread.sleep(1000);
            log.info("task 3 finish...");
            return 3;
        });

        log.info("shutdown");
        pool.shutdown();
        // pool.awaitTermination(3, TimeUnit.SECONDS);
        // List<Runnable> runnables = pool.shutdownNow();
        log.info("other....");
    }

}
```

测试目标：在 main 线程中，调用 `pool.shutdown()` 方法，

- main 线程是否阻塞？不会。
- 在线程池中，“正在执行的任务”和“队列中的任务”是否继续执行？会
- 在线程池中，是否可以添加新的任务？不可以

```text
pool.shutdown();
log.info("other....");
```

```text
34.52.096 [pool-1-thread-2] INFO task 2 running...
34.52.096 [main] INFO shutdown
34.52.096 [pool-1-thread-1] INFO task 1 running...
34.52.099 [main] INFO other....                      // 主线程调用 shutdown 方法，并没有阻塞
34.53.100 [pool-1-thread-2] INFO task 2 finish...
34.53.101 [pool-1-thread-2] INFO task 3 running...
34.53.106 [pool-1-thread-1] INFO task 1 finish...
34.54.115 [pool-1-thread-2] INFO task 3 finish...    // 会等待所有的 task 执行结束
```

```text
pool.shutdown();

Future<Integer> result4 = pool.submit(() -> {
    log.info("task 4 running...");
    Thread.sleep(1000);
    log.info("task 4 finish...");
    return 4;
});
```

#### 第二版

```java

@Slf4j
public class NamedSleepRunnable implements Runnable {
    public final String name;
    public final int millis;

    public NamedSleepRunnable(String name, int millis) {
        this.name = name;
        this.millis = millis;
    }

    @Override
    public void run() {
        log.info("{} --->", name);
        try {
            Thread.sleep(millis);
        } catch (InterruptedException ex) {
            log.info("exception: {}", ex.getMessage());
        }
        log.info("{} <---", name);
    }
}
```

```java
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Slf4j
public class PoolShutdown {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(2);

        pool.submit(new NamedSleepRunnable("task1", 1000));
        pool.submit(new NamedSleepRunnable("task2", 1000));
        pool.submit(new NamedSleepRunnable("task3", 1000));

        log.info("shutdown");
        pool.shutdown();
        log.info("other....");

        List<Runnable> taskList = pool.shutdownNow();
        log.info("other.... {}", taskList.size());

        boolean flag = pool.awaitTermination(3, TimeUnit.SECONDS);
        log.info("flag = {}", flag);
    }

}
```

## Two-phase termination

在 `ExecutorService` 类的 [Javadoc][executor-servvice-url] 中，介绍了 two-phase termination 方法：

- 第一阶段，调用 `shutdown` 方法，这样可以避免 **new tasks** 提交到 thread pool 当中。
    - 执行 `awaitTermination()` 方法，等待一段时间
- 第二阶段，调用 `shutdownNow` 方法, if necessary, to cancel any lingering tasks:
    - 再次执行 `awaitTermination()` 方法，等待一段时间

Here, we're first calling `shutdown` and then waiting for `n` seconds.
**The `awaitTermination` call will block until the pool terminates or the timeout occurs.**
Then we're invoking `shutdownNow` to cancel any lingering tasks.
Then we're waiting for additional `n` seconds.
If the pool doesn't terminate after these steps, we must inspect and modify the cancellation policies for our tasks.

```text
public void shutdownAndAwaitTermination(int n) throws InterruptedException {
    final ExecutorService threadPool = Executors.newFixedThreadPool(1);
    
    threadPool.shutdown(); // Disable new tasks from being submitted
    if (!threadPool.awaitTermination(n, TimeUnit.SECONDS)) {
        threadPool.shutdownNow(); // Cancel currently executing tasks
        if (!threadPool.awaitTermination(n, TimeUnit.SECONDS)) {
            System.out.println("The pool did not terminate");
        }
    }
}
```

```text
void shutdownAndAwaitTermination(ExecutorService pool) {
    pool.shutdown(); // Disable new tasks from being submitted
    try {
        // Wait a while for existing tasks to terminate
        if (!pool.awaitTermination(60, TimeUnit.SECONDS)) {
            pool.shutdownNow(); // Cancel currently executing tasks
            // Wait a while for tasks to respond to being cancelled
            if (!pool.awaitTermination(60, TimeUnit.SECONDS)) {
                System.err.println("Pool did not terminate");
            }
        }
    } catch (InterruptedException ie) {
        // (Re-)Cancel if current thread also interrupted
        pool.shutdownNow();
        // Preserve interrupt status
        Thread.currentThread().interrupt();
    }
}
```



## Reference

- [How to shut down the executor service in Java](https://www.educative.io/answers/how-to-shut-down-the-executor-service-in-java)
- [Shut Down Thread Pool using Java ExecutorService](http://www.javabyexamples.com/shut-down-thread-pool-using-java-executorservice)
- [TPS02-J. Ensure that tasks submitted to a thread pool are interruptible](https://wiki.sei.cmu.edu/confluence/display/java/TPS02-J.+Ensure+that+tasks+submitted+to+a+thread+pool+are+interruptible)

[executor-servvice-url]: https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ExecutorService.html
