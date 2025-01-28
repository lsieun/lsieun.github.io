---
title: "正确处理线程池的异常"
sequence: "108"
---

[UP](/java-concurrency.html)


正确处理线程池的异常，有两种方式：

- 第一种，在任务当中，使用 `try...catch` 来处理异常
- 第二种，使用 `Future` 对象来处理异常

## 第一种方式

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(5);

        pool.execute(() -> {
            try {
                int i = 1 / 0;
                log.info("i = {}", i);
            } catch (Exception ex) {
                log.info("exception", ex);
            }
        });

        pool.shutdown();
    }
}
```

## 第二种方式

```java
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService pool = Executors.newFixedThreadPool(5);

        Future<Integer> future = pool.submit(() -> {
            int i = 1 / 0;
            return i;
        });

        log.info("result = {}", future.get());

        pool.shutdown();
    }
}
```

```text
Exception in thread "main" java.util.concurrent.ExecutionException: java.lang.ArithmeticException: / by zero
	at java.base/java.util.concurrent.FutureTask.report(FutureTask.java:122)
	at java.base/java.util.concurrent.FutureTask.get(FutureTask.java:191)
	at run.HelloWorld.main(HelloWorld.java:20)
```
