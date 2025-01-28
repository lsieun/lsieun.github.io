---
title: "CyclicBarrier - 循环屏障"
sequence: "104"
---

[UP](/java-concurrency.html)


## 设计目标

CyclicBarrier 是一个同步的工具类，它允许一组线程互相等待，直到到达某个公共屏障点。
与 CountDownLatch 不同的是，该 barrier 在释放等待线程后可以重用，
所以称它为循环（Cyclic）的屏障（Barrier）。

[ˈ sa ɪ kl ɪ k ˈ bæri ɚ] 循环栅栏，用来进行线程协作，等待线程满足某个计数。
构造时设置『计数个数』，每个线程执行到某个需要“同步”的时刻调用 await() 方法进行等待，当等待的线程数满足『计数个数』时，继续执行

A `CyclicBarrier` is a synchronizer
that allows a set of threads to wait for each other to reach a common execution point, also called a **barrier**.

```text
barrier = a common execution point
```

CyclicBarriers are used in programs
in which we have a fixed number of threads
that must wait for each other to reach a common point before continuing execution.

**The barrier is called cyclic because it can be re-used after the waiting threads are released.**

## CyclicBarrier

### 构造方法

The constructor for a `CyclicBarrier` takes a single integer
that denotes the number of threads that need to call the `await()` method on the barrier instance
to signify reaching the common execution point:

```text
public CyclicBarrier(int parties)
```

### await 方法

The threads that need to synchronize their execution are also called **parties** and
calling the `await()` method is how we can register that a certain thread has reached the barrier point.

This call is **synchronous** and the thread calling this method suspends execution
till a specified number of threads have called the same method on the barrier.
This situation where the required number of threads have called `await()`, is called **tripping the barrier**.

Optionally, we can pass the second argument to the constructor, which is a `Runnable` instance.
This has logic that would be run by **the last thread** that trips the barrier:

```text
public CyclicBarrier(int parties, Runnable barrierAction)
```

## 示例

### 示例一：学习小组

```java
import java.util.Random;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.TimeUnit;

public class CyclicBarrierDemo_001_Study {
    public static void main(String[] args) {
        CyclicBarrier cyclicBarrier = new CyclicBarrier(5);

        String[] childNames = {"小红", "小明", "小刚", "小亮", "小飞"};
        for (int i = 0; i < 5; i++) {
            String childName = childNames[i];
            GoodChild child = new GoodChild(cyclicBarrier);
            Thread t = new Thread(child, childName);
            t.start();
        }

    }

    static class GoodChild implements Runnable {

        private final CyclicBarrier cyclicBarrier;

        public GoodChild(CyclicBarrier cyclicBarrier) {
            this.cyclicBarrier = cyclicBarrier;
        }

        @Override
        public void run() {

            Random rand = new Random();
            try {
                int sum = 0;
                {
                    int time = 1000 + rand.nextInt(2000);
                    TimeUnit.MILLISECONDS.sleep(time);

                    int minutes = time / 100;
                    sum += minutes;
                    LogUtils.log("学习语文 {} 分钟", minutes);

                    // 第 1 次等待
                    cyclicBarrier.await();
                }

                {
                    int time = 1000 + rand.nextInt(2000);
                    TimeUnit.MILLISECONDS.sleep(time);

                    int minutes = time / 100;
                    sum += minutes;
                    LogUtils.log("学习数学 {} 分钟", minutes);

                    // 第 2 次等待
                    cyclicBarrier.await();
                }


                {
                    int time = 1000 + rand.nextInt(2000);
                    TimeUnit.MILLISECONDS.sleep(time);

                    int minutes = time / 100;
                    sum += minutes;
                    LogUtils.log("学习英语 {} 分钟", minutes);

                    // 第 3 次等待
                    cyclicBarrier.await();
                }

                LogUtils.log("总共学习 {} 分钟", sum);

            } catch (InterruptedException | BrokenBarrierException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

输出结果：

```text
[小刚] INFO 学习语文 10 分钟
[小明] INFO 学习语文 11 分钟
[小亮] INFO 学习语文 16 分钟
[小飞] INFO 学习语文 22 分钟
[小红] INFO 学习语文 24 分钟

[小刚] INFO 学习数学 13 分钟
[小飞] INFO 学习数学 17 分钟
[小明] INFO 学习数学 22 分钟
[小亮] INFO 学习数学 23 分钟
[小红] INFO 学习数学 28 分钟

[小红] INFO 学习英语 12 分钟
[小明] INFO 学习英语 14 分钟
[小刚] INFO 学习英语 15 分钟
[小亮] INFO 学习英语 19 分钟
[小飞] INFO 学习英语 26 分钟

[小飞] INFO 总共学习 65 分钟
[小红] INFO 总共学习 64 分钟
[小刚] INFO 总共学习 38 分钟
[小明] INFO 总共学习 47 分钟
[小亮] INFO 总共学习 58 分钟
```

### 示例二：求和

There's an operation that a fixed number of threads perform and store the corresponding results in a list.
When all threads finish performing their action,
one of them (typically the last one that trips the barrier) starts processing the data
that was fetched by each of these.

场景：

- 第一步，有 5 个线程，每个线程生成 3 个随机数。每个线程的 3 个随机数，存储到 main 线程的变量中。
- 第二步，启用一个线程，对这 15 个数字求和。

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierDemo_002_Sum {
    private CyclicBarrier cyclicBarrier;
    private final List<List<Integer>> partialResults = Collections.synchronizedList(new ArrayList<>());
    private final Random random = new Random();
    private int NUM_PARTIAL_RESULTS;
    private int NUM_WORKERS;

    class NumberCruncherThread implements Runnable {

        @Override
        public void run() {
            List<Integer> partialResult = new ArrayList<>();

            // Crunch some numbers and store the partial result
            for (int i = 0; i < NUM_PARTIAL_RESULTS; i++) {
                Integer num = random.nextInt(10);
                LogUtils.log("Crunching some numbers! Final result - " + num);
                partialResult.add(num);
            }

            partialResults.add(partialResult);
            try {
                LogUtils.log("waiting for others to reach barrier.");
                cyclicBarrier.await();
            } catch (InterruptedException e) {
                // ...
            } catch (BrokenBarrierException e) {
                // ...
            }
        }
    }

    class AggregatorThread implements Runnable {

        @Override
        public void run() {

            LogUtils.log("Computing sum of " + NUM_WORKERS
                            + " workers, having " + NUM_PARTIAL_RESULTS + " results each.");
            int sum = 0;

            for (List<Integer> threadResult : partialResults) {
                System.out.print("Adding ");
                for (Integer partialResult : threadResult) {
                    System.out.print(partialResult+" ");
                    sum += partialResult;
                }
                LogUtils.log("");
            }
            LogUtils.log("Final result = " + sum);
        }
    }

    public void runSimulation(int numWorkers, int numberOfPartialResults) {
        NUM_PARTIAL_RESULTS = numberOfPartialResults;
        NUM_WORKERS = numWorkers;

        cyclicBarrier = new CyclicBarrier(NUM_WORKERS, new AggregatorThread());

        LogUtils.log("Spawning " + NUM_WORKERS
                + " worker threads to compute "
                + NUM_PARTIAL_RESULTS + " partial results each");

        for (int i = 0; i < NUM_WORKERS; i++) {
            Thread worker = new Thread(new NumberCruncherThread());
            worker.setName("Thread " + i);
            worker.start();
        }
    }

    public static void main(String[] args) {
        CyclicBarrierDemo_002_Sum demo = new CyclicBarrierDemo_002_Sum();
        demo.runSimulation(5, 3);
    }
}
```

## 注意事项

### CyclicBarrier 和 CountDownLatch 的区别

`CyclicBarrier` 与 `CountDownLatch` 的主要区别在于 

- “重用”视角：`CyclicBarrier` 是可以重用的，`CyclicBarrier` 可以被比喻为『人满发车』

### 线程池数量

线程池中线程个数，要与计数个数一致。

```java
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
public class HelloWorld {

    public static void main(String[] args) {
        // 线程池线程个数，要与计数个数一致。不然如果为 3，那么也有可能是第 1，3 个线程获得了锁
        ExecutorService service = Executors.newFixedThreadPool(3);
        CyclicBarrier barrier = new CyclicBarrier(2, () -> {
            log.debug("=== === ===");
        });
        for (int i = 0; i < 3; i++) { // task1  task2  task1
            service.submit(() -> {
                log.debug("task1 begin...");
                sleep(1);
                try {
                    barrier.await(); // 2-1=1
                    log.debug("task1 end...");
                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }
            });
            service.submit(() -> {
                log.debug("task2 begin...");
                sleep(2);
                try {
                    barrier.await(); // 1-1=0
                    log.debug("task2 end...");
                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }
            });
        }
        service.shutdown();
    }

}
```

```text
57.53.900 [pool-1-thread-1] DEBUG task1 begin...
57.53.900 [pool-1-thread-3] DEBUG task1 begin...
57.53.900 [pool-1-thread-2] DEBUG task2 begin...
57.54.907 [pool-1-thread-1] DEBUG === === ===
57.54.907 [pool-1-thread-1] DEBUG task1 end...
57.54.908 [pool-1-thread-3] DEBUG task1 end...
57.54.908 [pool-1-thread-1] DEBUG task2 begin...
57.54.908 [pool-1-thread-3] DEBUG task1 begin...
57.55.922 [pool-1-thread-3] DEBUG === === ===
57.55.922 [pool-1-thread-3] DEBUG task1 end...
57.55.922 [pool-1-thread-2] DEBUG task2 end...
57.55.922 [pool-1-thread-3] DEBUG task2 begin...
57.57.929 [pool-1-thread-3] DEBUG === === ===
57.57.929 [pool-1-thread-3] DEBUG task2 end...
57.57.929 [pool-1-thread-1] DEBUG task2 end...
```

## Reference

- [CyclicBarrier in Java](https://www.baeldung.com/java-cyclic-barrier)
- [Java CyclicBarrier vs CountDownLatch](https://www.baeldung.com/java-cyclicbarrier-countdownlatch)
