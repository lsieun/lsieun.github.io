---
title: "线程池的状态"
sequence: "106"
---

[UP](/java-concurrency.html)


```java
public interface Executor {
    void execute(Runnable command);
}
```

```java
public interface ExecutorService extends Executor {
    void shutdown();
    List<Runnable> shutdownNow();

    boolean isShutdown();
    boolean isTerminated();

    boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException;

    <T> Future<T> submit(Callable<T> task);
    <T> Future<T> submit(Runnable task, T result);
    Future<?> submit(Runnable task);

    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks)
            throws InterruptedException;
    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks, long timeout, TimeUnit unit)
            throws InterruptedException;

    <T> T invokeAny(Collection<? extends Callable<T>> tasks)
            throws InterruptedException, ExecutionException;
    <T> T invokeAny(Collection<? extends Callable<T>> tasks, long timeout, TimeUnit unit)
            throws InterruptedException, ExecutionException, TimeoutException;
}
```

```java
public abstract class AbstractExecutorService implements ExecutorService {
    //
}
```

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    //
}
```

`ThreadPoolExecutor` 的核心属性是 `ctl` 字段；
基于 `ctl` 字段，可以拿到**线程池的状态**以及**工作线程个数**。

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    // ctl 是 control 的意思，是线程池的核心属性
    // ctl 就是一个 int 类型的数值，一共 32-bit，内部是基于 AtomicInteger 套了一层，进行运算时，是原子性的。
    // ctl 表示线程池中的两个核心状态：
    // 高 3 位：表示线程池状态
    // 后 29 位：表示工作线程的数量
    private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
    
    // Integer.SIZE 是 32
    // COUNT_BITS = 32 - 3 = 29
    private static final int COUNT_BITS = Integer.SIZE - 3;
    
    // 00000000 00000000 00000000 00000001 = 1
    // 00100000 00000000 00000000 00000000 = 1 << 29
    // 00011111 11111111 11111111 11111111 = 1 << 29 - 1
    // CAPACITY 是当前工作线程能记录的工作线程的最大个数，即 2^29
    private static final int CAPACITY   = (1 << COUNT_BITS) - 1;
}
```

线程池的五种状态：

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    // runState is stored in the high-order bits
    // 线程池状态的表示：
    // 当前五个状态中，只有 RUNNING 状态代表线程池没有问题，可以正常接收任务处理
    // 111： 代表 RUNNING 状态，RUNNING 可以处理任务，并且处理阻塞队列中的任务
    // 11100000 00000000 00000000 00000000
    private static final int RUNNING    = -1 << COUNT_BITS;

    // 000: 代表 SHUTDOWN 状态，不会接收新任务，正在处理的任务正常执行，阻塞队列的任务也会做完
    // 00000000 00000000 00000000 00000000
    private static final int SHUTDOWN   =  0 << COUNT_BITS;

    // 001: 代表 STOP 状态，不会接收新任务，正在处理的任务会被中断，阻塞队列的任务一个不管
    // 00100000 00000000 00000000 00000000
    private static final int STOP       =  1 << COUNT_BITS;

    // 010：代表 TIDYING 状态，这个状态是由 SHUTDOWN 或 STOP 转换过来的，代表当前线程池马上关闭，就是过渡状态
    // 01000000 00000000 00000000 00000000
    private static final int TIDYING    =  2 << COUNT_BITS;

    // 011: 代表 TERMINATED 状态，这个状态是由 TIDYING 状态转换过来的，转换过来只需要执行一个 terminated() 方法
    // 01100000 00000000 00000000 00000000
    private static final int TERMINATED =  3 << COUNT_BITS;
}
```

```java
public class ThreadPoolExecutor extends AbstractExecutorService {
    // 基于 & 运算的特点，保证只会拿到 ctl 高 3 位的值
    private static int runStateOf(int c)     { return c & ~CAPACITY; }

    // 基于 & 运算的特点，保证会到拿到 ctl 低 29 位的值
    private static int workerCountOf(int c)  { return c & CAPACITY; }
}
```

## 线程池的状态转换

![](/assets/images/java/concurrency/pool/thread-pool-5-states.png)

```java
import java.lang.reflect.Field;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.atomic.AtomicInteger;

public class ThreadPool_State {
    public static void main(String[] args) throws Exception {
        printRunning();
        printShutDown();
        printStop();
        printTerminated();
    }

    private static void printRunning() throws Exception {
        // 第 1 步，创建线程池
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        printThreadPoolState(executorService);

        // 第 2 步，关闭线程池
        executorService.shutdown();
    }

    private static void printShutDown() throws Exception {
        // 第 1 步，创建线程池
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        // 第 2 步，为线程池赋予任务
        for (int i = 0; i < 5; i++) {
            final int val = i;
            executorService.execute(
                    () -> {
                        String threadName = Thread.currentThread().getName();
                        System.out.println(threadName + " begin: " + val);
                        try {
                            Thread.sleep(val * 1000);
                        } catch (InterruptedException e) {
                            System.out.println(threadName + " is interrupted: " + val);
                        }
                        System.out.println(threadName + " end: " + val);
                    }
            );
        }

        // 第 3 步，关闭线程池
        executorService.shutdown();
        printThreadPoolState(executorService);
    }

    private static void printStop() throws Exception {
        // 第 1 步，创建线程池
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        // 第 2 步，为线程池赋予任务
        for (int i = 0; i < 5; i++) {
            final int val = i;
            executorService.execute(
                    () -> {
                        String threadName = Thread.currentThread().getName();
                        System.out.println(threadName + " [begin]: " + val);
                        try {
                            Thread.sleep(val * 1000);
                        } catch (InterruptedException e) {
                            System.out.println(threadName + " is interrupted: " + val);
                        }
                        System.out.println(threadName + " [end]: " + val);
                    }
            );
        }

        Thread.sleep(2000);

        // 第 3 步，关闭线程池
        executorService.shutdownNow();
        printThreadPoolState(executorService);
    }

    private static void printTerminated() throws Exception {
        // 第 1 步，创建线程池
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        // 第 2 步，关闭线程池
        executorService.shutdown();

        printThreadPoolState(executorService);
    }

    private static void printThreadPoolState(ExecutorService threadPool) throws Exception {
        // 第 1 步，判断类型
        boolean flag = threadPool instanceof ThreadPoolExecutor;
        if (!flag) {
            System.out.println("threadPool is not ThreadPoolExecutor: " + threadPool);
            return;
        }

        // 第 2 步，通过反射获取 ctl 字段的值
        ThreadPoolExecutor executor = (ThreadPoolExecutor) threadPool;
        Class<ThreadPoolExecutor> clazz = ThreadPoolExecutor.class;
        Field field = clazz.getDeclaredField("ctl");
        field.setAccessible(true);
        AtomicInteger ctl = (AtomicInteger) field.get(executor);

        // 第 3 步，将 ctl 的值转换成字符串
        int val = ctl.get();
        int stateVal = (val >> 29) & 0b111;

        String stateStr = "";
        if (stateVal == 0b111) {
            stateStr = "RUNNING";
        } else if (stateVal == 0b000) {
            stateStr = "SHUTDOWN";
        } else if (stateVal == 0b001) {
            stateStr = "STOP";
        } else if (stateVal == 0b010) {
            stateStr = "TIDYING";
        } else if (stateVal == 0b011) {
            stateStr = "TERMINATED";
        }

        System.out.println("Thread Pool State: " + stateStr);
    }
}
```
