---
title: "任务调度线程池"
sequence: "109"
---

[UP](/java-concurrency.html)


## Timer

在『任务调度线程池』功能加入之前，可以使用 `java.util.Timer` 来实现定时功能。

Timer 也有自己的优点和缺点：

- 优点：简单易用。
- 缺点：由于所有任务都是由同一个线程来调度，因此所有任务都是串行执行的，同一时间只能有一个任务在执行，前一个任务的延迟或异常都将会影响到之后的任务。

```java
import lombok.extern.slf4j.Slf4j;

import java.util.Timer;
import java.util.TimerTask;

import static lsieun.concurrent.utils.SleepUtils.sleep;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        Timer timer = new Timer();
        TimerTask task1 = new TimerTask() {
            @Override
            public void run() {
                log.debug("task 1 begin");
                // sleep(2);
                // int i = 1 / 0;
                log.debug("task 1 end");
            }
        };
        TimerTask task2 = new TimerTask() {
            @Override
            public void run() {
                log.debug("task 2");
            }
        };

        log.debug("start...");
        // 使用 timer 添加两个任务，希望它们都在 1s 后执行
        // 但由于 timer 内只有一个线程来顺序执行队列中的任务，因此『任务 1 』的延时，影响了『任务 2 』的执行
        timer.schedule(task1, 1000);
        timer.schedule(task2, 1000);
    }
}
```

## ScheduledExecutorService

### 介绍

`ScheduledThreadPool` 支持定时或周期性执行任务。

```java
public interface ScheduledExecutorService extends ExecutorService {
    public ScheduledFuture<?> schedule(Runnable command, long delay, TimeUnit unit);
    public <V> ScheduledFuture<V> schedule(Callable<V> callable, long delay, TimeUnit unit);
    
    public ScheduledFuture<?> scheduleAtFixedRate(Runnable command,
                                                  long initialDelay,
                                                  long period,
                                                  TimeUnit unit);
    
    public ScheduledFuture<?> scheduleWithFixedDelay(Runnable command,
                                                     long initialDelay,
                                                     long delay,
                                                     TimeUnit unit);
}
```

### 运行一次

```java
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        ScheduledExecutorService pool = Executors.newScheduledThreadPool(2);

        // 添加两个任务，希望它们都在 1s 后执行
        pool.schedule(() -> {
            log.info("任务 1");
            sleep(2);
        }, 1000, TimeUnit.MILLISECONDS);

        pool.schedule(() -> {
            log.info("任务 2");
        }, 1000, TimeUnit.MILLISECONDS);

        pool.shutdown();
    }
}
```

### 运行多次（周期运行）

要让任务隔一段时间就执行一次，可以调用 scheduleAtFixedRate()、scheduleWithFixedDelay()

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        ScheduledExecutorService pool = Executors.newScheduledThreadPool(1);

        log.debug("start...");
        pool.scheduleAtFixedRate(() -> {
            log.debug("running...");
        }, 1, 1, TimeUnit.SECONDS);

        sleep(10);
        pool.shutdown();
    }
}
```

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import static lsieun.concurrent.utils.SleepUtils.sleep;

@Slf4j
public class HelloWorld {
    public static void main(String[] args) {
        ScheduledExecutorService pool = Executors.newScheduledThreadPool(1);

        log.debug("start...");
        pool.scheduleWithFixedDelay(() -> {
            log.debug("running...");
            sleep(2);
        }, 1, 1, TimeUnit.SECONDS);

        sleep(10);
        pool.shutdown();
    }
}
```

```text
40.45.146 [main] DEBUG start...
40.46.160 [pool-1-thread-1] DEBUG running...
40.49.174 [pool-1-thread-1] DEBUG running...
40.52.196 [pool-1-thread-1] DEBUG running...
```

比如，每隔 10 秒执行一次任务，而实现的方法主要有 3 种：

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class CommonUsedThreadPool {
    public static void main(String[] args) {
        ScheduledExecutorService service = Executors.newScheduledThreadPool(10);

        // 第一种，表示延迟指定时间后执行一次任务，比较简单。
        // 如果代码中设置参数为 10 秒，也就是 10 秒后执行一次任务后就结束。
        service.schedule(new Task(), 10, TimeUnit.SECONDS);

        // 第二种，以固定的频率执行任务。
        // 第 2 个参数，initialDelay，表示第一次延时时间
        // 第 3 个参数，period，表示周期
        service.scheduleAtFixedRate(new Task(), 10, 10, TimeUnit.SECONDS);

        // 第三种，与第二种类似，也是周期执行任务，区别在于对周期的定义。
        // scheduleAtFixedRate 是以任务开始的时间为时间起点计时，时间到了，就开始执行第二次任务，而不管任务需要花费多久执行。
        // scheduleWithFixedDelay 是当任务结束后，间隔一定的时间，再去执行下一次的任务。
        service.scheduleWithFixedDelay(new Task(), 10, 10, TimeUnit.SECONDS);
    }

    private static class Task implements Runnable {
        @Override
        public void run() {
            System.out.println("Hello Task");
        }
    }
}
```

## 应用

### 示例一：每周四执行

每周四 18:00:00 定时执行任务

```java
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
public class HelloWorld {
    // 每周四 18:00:00 定时执行任务
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        // 获取当前时间
        LocalDateTime now = LocalDateTime.now();
        log.info("now = {}", now);

        // 获取周四时间
        LocalDateTime time = now.withHour(18).withMinute(56).withSecond(0).withNano(0)
                .with(DayOfWeek.THURSDAY);
        log.info("time = {}", time);

        // 如果 当前时间 > 本周四，必须找到下周四
        if (now.isAfter(time)) {
            time = time.plusWeeks(1);
            log.info("time = {}", time);
        }


        long initialDelay = Duration.between(now, time).toMillis();
        long delay = 1000 * 60 * 60 * 24 * 7;
        log.info("initialDelay = {}", initialDelay);
        log.info("delay = {}", delay);

        ScheduledExecutorService pool = Executors.newScheduledThreadPool(1);
        pool.scheduleAtFixedRate(() -> {
            log.info("running");
        }, initialDelay, delay, TimeUnit.MILLISECONDS);


        // pool.shutdown();
    }
}
```
