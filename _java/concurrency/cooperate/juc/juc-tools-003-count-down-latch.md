---
title: "CountDownLatch - 倒计时锁"
sequence: "103"
---

[UP](/java-concurrency.html)


## 设计目的

CountDownLatch 倒计时锁特别适合“总 - 分任务”，例如，多线程计算后的数据汇总。

Essentially, by using a `CountDownLatch` we can cause a thread to block
until other threads have completed a given task.

Simply put, a `CountDownLatch` has a `counter` field, which you can decrement as we require.
We can then use it to block a calling thread until it's been counted down to zero.

## 使用步骤

- 第 1 步，main thread：创建一个 `CountDownLatch` 对象，并设置 `counter` 字段的值与 worker thread 的数量相同。
- 第 2 步，main thread：启动 worker threads 之后，再调用 `CountDownLatch.await()` 方法进行阻塞。
- 第 3 步，worker threads：处理具体工作，完成之后，调用 `CountDownLatch.countdown()` 方法。
- 第 4 步，main thread：继续执行。

## 示例

### 示例一

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class Worker implements Runnable {
    private final CountDownLatch countDownLatch;

    public Worker(CountDownLatch countDownLatch) {
        this.countDownLatch = countDownLatch;
    }

    @Override
    public void run() {
        doSomeWork();
        LogUtils.log("调用 CountDownLatch.countDown() 方法");
        countDownLatch.countDown();
    }

    private void doSomeWork() {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

```java
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

public class CountDown_001_Simple {

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 CountDownLatch
        LogUtils.log("创建 CountDownLatch 对象");
        CountDownLatch countDownLatch = new CountDownLatch(5);


        // 第 2 步，启动 Worker Thread
        LogUtils.log("启动 Worker Thread");
        List<Thread> workers = Stream
                .generate(() -> new Thread(new Worker(countDownLatch)))
                .limit(5)
                .toList();
        workers.forEach(Thread::start);

        // 第 3 步，阻塞
        LogUtils.log("调用 CountDownLatch.await() 方法（阻塞）");
        countDownLatch.await();

        // 第 4 步，继续
        LogUtils.log("离开 CountDownLatch 范围（继续）");
        TimeUnit.SECONDS.sleep(2);
        LogUtils.log("结束");
    }
}
```

输出结果：

```text
[main] INFO 创建 CountDownLatch 对象
[main] INFO 启动 Worker Thread
[main] INFO 调用 CountDownLatch.await() 方法（阻塞）
[Thread-2] INFO 调用 CountDownLatch.countDown() 方法
[Thread-1] INFO 调用 CountDownLatch.countDown() 方法
[Thread-3] INFO 调用 CountDownLatch.countDown() 方法
[Thread-4] INFO 调用 CountDownLatch.countDown() 方法
[Thread-0] INFO 调用 CountDownLatch.countDown() 方法
[main] INFO 离开 CountDownLatch 范围（继续）
[main] INFO 结束
```

### Waiting Worker

![](/assets/images/java/concurrency/juc/tool/count-down-latch-waiting-worker.png)

```java
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.stream.Stream;

public class CountDown_002_Waiting {

    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 CountDownLatch
        CountDownLatch readyThreadCounter = new CountDownLatch(5);
        CountDownLatch callingThreadBlocker = new CountDownLatch(1);
        CountDownLatch completedThreadCounter = new CountDownLatch(5);

        // 第 2 步，创建 Worker Threads
        List<Thread> workers = Stream
                .generate(
                        () -> new Thread(
                                new WaitingWorker(
                                        readyThreadCounter,
                                        callingThreadBlocker,
                                        completedThreadCounter
                                )
                        )
                )
                .limit(5)
                .toList();

        // 第 3 步，启动 Worker Threads
        LogUtils.log("第一阶段，准备阶段开始");
        workers.forEach(Thread::start);

        // 第 4 步，阻塞，等待第一阶段完成
        readyThreadCounter.await();
        LogUtils.log("第一阶段，准备阶段完成");

        // 第 5 步，解决 Worker Threads 的阻塞
        LogUtils.log("第二阶段，工作阶段开始");
        callingThreadBlocker.countDown();

        // 第 6 步，阻塞，等待第二阶段完成
        completedThreadCounter.await();
        LogUtils.log("第二阶段，工作阶段完成");

        // 第 7 步，结束
        LogUtils.log("程序结束");
    }
}
```

```java
import java.util.Random;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class WaitingWorker implements Runnable {
    private final CountDownLatch readyThreadCounter;
    private final CountDownLatch callingThreadBlocker;
    private final CountDownLatch completedThreadCounter;

    public WaitingWorker(
            CountDownLatch readyThreadCounter,
            CountDownLatch callingThreadBlocker,
            CountDownLatch completedThreadCounter) {
        this.readyThreadCounter = readyThreadCounter;
        this.callingThreadBlocker = callingThreadBlocker;
        this.completedThreadCounter = completedThreadCounter;
    }

    @Override
    public void run() {
        LogUtils.log("准备开始 --->");
        prepare();
        LogUtils.log("准备结束 <---");
        readyThreadCounter.countDown();

        try {
            callingThreadBlocker.await();
            LogUtils.log("工作开始 --->");
            doSomeWork();
            LogUtils.log("工作结束 <---");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            completedThreadCounter.countDown();
        }
    }

    private void prepare() {
        try {
            Random rand = new Random();
            int val = 1 + rand.nextInt(3);
            TimeUnit.SECONDS.sleep(val);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    private void doSomeWork() {
        try {
            Random rand = new Random();
            int val = 3 + rand.nextInt(5);
            TimeUnit.SECONDS.sleep(val);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

输出结果：

```text
[main] INFO 第一阶段，准备阶段开始
[Thread-0] INFO 准备开始 --->
[Thread-2] INFO 准备开始 --->
[Thread-3] INFO 准备开始 --->
[Thread-1] INFO 准备开始 --->
[Thread-4] INFO 准备开始 --->
[Thread-1] INFO 准备结束 <---
[Thread-0] INFO 准备结束 <---
[Thread-4] INFO 准备结束 <---
[Thread-3] INFO 准备结束 <---
[Thread-2] INFO 准备结束 <---
[main] INFO 第一阶段，准备阶段完成
[main] INFO 第二阶段，工作阶段开始
[Thread-1] INFO 工作开始 --->
[Thread-4] INFO 工作开始 --->
[Thread-0] INFO 工作开始 --->
[Thread-2] INFO 工作开始 --->
[Thread-3] INFO 工作开始 --->
[Thread-3] INFO 工作结束 <---
[Thread-1] INFO 工作结束 <---
[Thread-4] INFO 工作结束 <---
[Thread-2] INFO 工作结束 <---
[Thread-0] INFO 工作结束 <---
[main] INFO 第二阶段，工作阶段完成
[main] INFO 程序结束
```

### 示例 N

比如说，DMA 分区

## 特殊问题处理

### 出现异常

```text
boolean completed = countDownLatch.await(3L, TimeUnit.SECONDS);
```

- [Link](https://www.baeldung.com/java-countdown-latch)

## Reference

- [Guide to CountDownLatch in Java](https://www.baeldung.com/java-countdown-latch)
