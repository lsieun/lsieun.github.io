---
title: "线程池的常见陷阱"
sequence: "109"
---

[UP](/java-concurrency.html)


## 不关闭线程池

Keeping an unused `ExecutorService` alive.

## 线程池的线程数量不合理

**Wrong thread-pool capacity while using fixed length thread pool**:
It is very important to determine how many threads the application will need to run tasks efficiently.
A too-large thread pool will cause unnecessary overhead just to create threads that will mostly be in the waiting mode.
Too few can make an application seem unresponsive because of long waiting periods for tasks in the queue.

## 任务取消后，获取结果

**Calling a `Future`'s `get()` method after task cancellation**:
Attempting to get the result of an already canceled task triggers a `CancellationException`.

```java
import java.util.concurrent.*;

public class ThreadPool_Task_Result {
    public static void main(String[] args) {
        // 第 1 步，创建线程池
        ExecutorService executorService = Executors.newSingleThreadExecutor();

        // 第 2 步，为线程池赋予任务
        Callable<String> callable = () -> {
            System.out.println("before sleep");
            try {
                Thread.sleep(3000);
            } catch (InterruptedException ex) {
                System.out.println("遇到 InterruptedException");
                throw new RuntimeException(ex.getMessage());
            }
            System.out.println("after sleep");
            return "HelloWorld";
        };
        Future<String> future = executorService.submit(callable);

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        // A. 判断是否完成
        boolean isDone = future.isDone();
        System.out.println("isDone = " + isDone);

        // B. 取消任务
        future.cancel(true);
        boolean isCancelled = future.isCancelled();
        System.out.println("isCancelled = " + isCancelled);

        // C. 获取任务结果
        try {
            String result = future.get();
            System.out.println(result);
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
        finally {
            // 第 3 步，关闭线程池
            executorService.shutdown();
        }
    }
}
```

```text
before sleep
isDone = false
isCancelled = true
遇到 InterruptedException
Exception in thread "main" java.util.concurrent.CancellationException
	at java.util.concurrent.FutureTask.report(FutureTask.java:121)
	at java.util.concurrent.FutureTask.get(FutureTask.java:192)
	at lsieun.concurrent.juc.pool.ThreadPool_Task_Result.main(ThreadPool_Task_Result.java:41)
```

## 阻塞时间太长

Unexpectedly long blocking with `Future`'s `get()` method:
We should use timeouts to avoid unexpected waits.
