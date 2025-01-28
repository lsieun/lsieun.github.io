---
title: "ExecutorService"
sequence: "104"
---

[UP](/java-concurrency.html)


## 如何使用 ExecutorService

使用 ExecutorService 的步骤：

- 第 1 步，创建 ExecutorService 对象
- 第 2 步，给 ExecutorService 赋予 Task
- 第 3 步，关闭 ExecutorService

### 创建 ExecutorService 对象

第一种方式，使用 `Executors` 提供的方法：

```text
ExecutorService executor = Executors.newFixedThreadPool(10);
```

第二种方式，直接使用 `ExecutorService` 的具体实现类：

```text
ExecutorService executorService = new ThreadPoolExecutor(
    1, 1,
    0L, TimeUnit.MILLISECONDS,   
    new LinkedBlockingQueue<Runnable>()
);
```

### 给 ExecutorService 赋予 Task

`ExecutorService` 可以执行 `Runnable` 和 `Callable` 类型的 task。

`ExecutorService` 提供了一些方法：

- `execute()`：继承自 `Executor` 接口
- `submit()`
- `invokeAny()`
- `invokeAll()`

The `execute()` method is `void` and doesn't give any possibility
to get the result of a task's execution or to check the task's status (is it running):

```text
Runnable runnableTask = () -> {
    try {
        TimeUnit.MILLISECONDS.sleep(300);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
};

executorService.execute(runnableTask);
```

`submit()` submits a `Callable` or a `Runnable` task to an `ExecutorService` and
returns a result of type `Future`:

```text
Callable<String> callableTask = () -> {
    TimeUnit.MILLISECONDS.sleep(300);
    return "Task's execution";
};

Future<String> future = executorService.submit(callableTask);
```

`invokeAny()` assigns a collection of tasks to an `ExecutorService`,
causing each to run, and returns the result of a successful execution of one task
(if there was a successful execution):

```text
String result = executorService.invokeAny(callableTasks);
```

`invokeAll()` assigns a collection of tasks to an `ExecutorService`,
causing each to run, and returns the result of all task executions
in the form of a list of objects of type `Future`:

```text
List<Future<String>> futures = executorService.invokeAll(callableTasks);
```

### 关闭 ExecutorService

In general, the `ExecutorService` will not be automatically destroyed
when there is no task to process.
It will stay alive and wait for new work to do.

> ExecutorService 并不会自动关闭

In some cases this is very helpful,
such as when an app needs to process tasks
that appear on an irregular basis or the task quantity is not known at compile time.

On the other hand, an app could reach its end but not be stopped
because a waiting `ExecutorService` will cause the JVM to keep running.

#### 两个方法

To properly shut down an `ExecutorService`, we have the `shutdown()` and `shutdownNow()` APIs.

The `shutdown()` method doesn't cause immediate destruction of the `ExecutorService`.
It will make the `ExecutorService` stop accepting new tasks and
shut down after all running threads finish their current work:

```text
executorService.shutdown();
```

The `shutdownNow()` method tries to destroy the `ExecutorService` immediately,
but it doesn't guarantee that all the running threads will be stopped at the same time:

```text
List<Runnable> notExecutedTasks = executorService.shutDownNow();
```

This method returns a list of tasks that are waiting to be processed.
It is up to the developer to decide what to do with these tasks.

#### 最佳方式

One good way to shut down the `ExecutorService`
(which is also [recommended by Oracle][executor-service-url])
is to use both of these methods combined with the `awaitTermination()` method:

```text
executorService.shutdown();
try {
    if (!executorService.awaitTermination(800, TimeUnit.MILLISECONDS)) {
        executorService.shutdownNow();
    } 
} catch (InterruptedException e) {
    executorService.shutdownNow();
}
```

With this approach, the `ExecutorService` will first stop taking new tasks and
then wait up to a specified period of time for all tasks to be completed.
If that time expires, the execution is stopped immediately.

## The Future Interface

The `submit()` and `invokeAll()` methods return an object or a collection of objects of type `Future`,
which allows us to **get the result of a task's execution** or to **check the task's status (is it running)**.

```java
public interface Future<V> {
    boolean isDone();

    V get() throws InterruptedException, ExecutionException;
    V get(long timeout, TimeUnit unit)
            throws InterruptedException, ExecutionException, TimeoutException;

    boolean cancel(boolean mayInterruptIfRunning);
    boolean isCancelled();
}
```

### get

The `Future` interface provides a special blocking method `get()`,
which returns an actual result of the `Callable` task's execution or `null` in the case of a `Runnable` task:

```text
Future<String> future = executorService.submit(callableTask);
String result = null;
try {
    result = future.get();
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
}
```

Calling the `get()` method while the task is still running will cause execution to block
until the task properly executes and the result is available.

### get with timeout

With very long blocking caused by the `get()` method, an application's performance can degrade.
If the resulting data is not crucial, it is possible to avoid such a problem by using timeouts:

```text
String result = future.get(200, TimeUnit.MILLISECONDS);
```

If the execution period is longer than specified (in this case, 200 milliseconds), a `TimeoutException` will be thrown.

### isDone

We can use the `isDone()` method to check if the assigned task already processed or not.

### cancel

The `Future` interface also provides for
canceling task execution with the `cancel()` method and
checking the cancellation with the `isCancelled()` method:

```text
boolean canceled = future.cancel(true);
boolean isCancelled = future.isCancelled();
```

## Reference

- [A Guide to the Java ExecutorService](https://www.baeldung.com/java-executor-service-tutorial)

[executor-service-url]: https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/ExecutorService.html
