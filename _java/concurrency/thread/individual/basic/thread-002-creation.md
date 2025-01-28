---
title: "创建线程的三种方式"
sequence: "102"
---

[UP](/java-concurrency.html)


Java 中创建线程的三种方式：

- 继承 `Thread` 类创建线程
- 实现 `Runnable` 接口创建线程
- 使用 `Callable` 和 `Future` 创建线程

## Thread 类

继承 `Thread` 类的方式创建线程

- 定义 `Thread` 类的子类，并重写该类的 `run()` 方法，该 `run()` 方法的方法体就代表了线程需要完成的任务
    - 创建 `Thread` 类的子类，即创建了线程对象
    - 调用线程对象的 `start()` 方法来创建并启动线程

```java
public class HelloWorldThread extends Thread {
    @Override
    public void run() {
        System.out.println("Hello World");
    }

    public static void main(String[] args) {
        // 第 1 步，创建线程
        HelloWorldThread thread = new HelloWorldThread();

        // 第 2 步，启动线程
        thread.start();
    }
}
```

## Runnable 接口

定义 `Runnable` 接口的实现类，并重写该接口的 `run()` 方法，该 `run()` 方法的方法体就是线程的线程执行体。

创建 `Runnable` 接口的实现类，并以此实例作为 `Thread` 类的 `target` 来创建 `Thread` 对象，该 `Thread` 对象才是真正的线程对象。

```java
public class Thread implements Runnable {
    public Thread(Runnable target) {
        // ...
    }
}
```

```java
public class HelloWorldRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Hello World");
    }

    public static void main(String[] args) {
        // 第 1 步，创建 Runnable 对象
        HelloWorldRunnable runnable = new HelloWorldRunnable();

        // 第 2 步，创建线程
        Thread thread = new Thread(runnable);

        // 第 3 步，启动线程
        thread.start();
    }
}
```

## Callable + Future

创建 `Callable` 接口的实现类，并实现 `call()` 方法。
该 `call()` 方法将作为线程的执行体，但该 `call()` 方法有返回值，再创建 `Callable` 实现类的实例。

- 使用 `FutureTask` 类来包装 Callable 对象，该 `FutureTask` 对象封装了该 `Callable` 对象的 `call()` 方法的返回值。
- 使用 `FutureTask` 对象作为 `Thread` 对象的 `target` 创建并启动新线程。
- 使用 `FutureTask` 对象的 `get()` 方法来获得子线程执行结束后的返回值。

### Thread + Callable

```java
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class HelloWorldCallable {
    public static void main(String[] args) {
        FutureTask<Integer> task = new FutureTask<>(() -> {
            int result = 0;
            for (int i = 0; i <= 100; i++) {
                result += i;
            }
            return result;
        });

        Thread thread = new Thread(task);
        thread.start();

        try {
            int value = task.get();
            System.out.println(value);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class HelloWorldCallable implements Callable<String> {

    @Override
    public String call() throws Exception {
        return "HelloWorld";
    }

    public static void main(String[] args) {
        // 第 1 步，创建任务
        FutureTask<String> futureTask = new FutureTask<>(new HelloWorldCallable());

        // 第 2 步，创建和启动线程
        Thread thread = new Thread(futureTask);
        thread.start();

        // 第 3 步，获取任务结果
        try {
            String result = futureTask.get();
            System.out.println(result);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

```java
public class FutureTask<V> implements RunnableFuture<V> {
    // A. 接收 Callable 参数的构造方法
    public FutureTask(Callable<V> callable) {
        if (callable == null)
            throw new NullPointerException();
        this.callable = callable;
        this.state = NEW;       // ensure visibility of callable
    }
    
    // B. 接收 Runnable 参数的构造方法
    public FutureTask(Runnable runnable, V result) {
        this.callable = Executors.callable(runnable, result);
        this.state = NEW;       // ensure visibility of callable
    }
    
    // ...
}
```

```java
public interface RunnableFuture<V> extends Runnable, Future<V> {
    void run();
}
```

### ThreadPool + Callable

```java
import java.util.concurrent.*;

public class HelloWorldCallable implements Callable<Integer> {

    @Override
    public Integer call() throws Exception {
        System.out.println("Hello World");
        return 1;
    }
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 第 1 步，创建 Callable 对象
        HelloWorldCallable callable = new HelloWorldCallable();

        // 第 2 步，创建线程池
        ExecutorService executorService = Executors.newFixedThreadPool(3);

        // 第 3 步，执行任务
        Future<Integer> future = executorService.submit(callable);
        Integer result = future.get();
        System.out.println(result);

        // 第 4 步，关闭线程池
        executorService.shutdown();
    }
}
```

## 利用线程池来创建线程

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HelloWorldThreadPool {
    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        executorService.execute(
                () -> {
                    System.out.println("Hello ThreadPool");
                }
        );
        executorService.shutdown();
    }
}
```

## 三种方式对比

<table>
    <thead>
    <tr>
        <th></th>
        <th>继承 Thread</th>
        <th>实现 Runnable</th>
        <th>利用线程池</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>优点</td>
        <td>编程简单，执行效率高</td>
        <td>面向接口编程，执行效率高</td>
        <td>容器管理线程，允许返回值与异常</td>
    </tr>
    <tr>
        <td>缺点</td>
        <td>单继承，无法对线程组有效控制</td>
        <td>无法对线程组有效控制，没有返回值、异常</td>
        <td>执行效率相对低，编程麻烦</td>
    </tr>
    <tr>
        <td>使用场景</td>
        <td>不推荐使用</td>
        <td>简单的多线程程序</td>
        <td>企业级应用，推荐使用</td>
    </tr>
    </tbody>
</table>

## Runnable or Thread?

Simply put, we generally encourage the use of `Runnable` over `Thread`:

- When extending the `Thread` class, we're not overriding any of its methods.
  Instead, we override the method of `Runnable` (which `Thread` happens to implement).
  This is a clear violation of IS-A Thread principle
- Creating an implementation of `Runnable` and passing it to the `Thread` class utilizes
  composition and not inheritance – which is more **flexible**
- After extending the `Thread` class, we **can't extend** any other class
- From Java 8 onwards, `Runnable`s can be represented as **lambda expressions**

## Reference

- [Implementing a Runnable vs Extending a Thread](https://www.baeldung.com/java-runnable-vs-extending-thread)
