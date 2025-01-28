---
title: "停止线程：不推荐使用 stop 方法"
sequence: "103"
---

[UP](/java-concurrency.html)


## ThreadDeath

`Thread.stop()` 方法会暴力结束线程，而不管线程上的任务是否结束，并抛出 `ThreadDeath` 错误

```java
public class ThreadDeath extends Error {
}
```


```java
public class ThreadStopWithError {
    public static void main(String[] args) {
        Runnable task = () -> {
            long begin = System.currentTimeMillis();

            try {
                for (int i = 0; i < 100; i++) {
                    LogUtils.log("running ... {}", i);
                    Thread.sleep(10);
                }
            } catch (Throwable ex) {
                LogUtils.log("catch: {}", ex.getClass().getName());
            } finally {
                LogUtils.log("finally");
            }

            long end = System.currentTimeMillis();
            long diff = end - begin;
            LogUtils.log("elapsed time: {} ms", diff);
        };

        Thread t = new Thread(task);
        t.start();
        try {
            Thread.sleep(100);
        } catch (InterruptedException ignored) {
        }

        LogUtils.log("stop before");
        t.stop();
        LogUtils.log("stop after");
    }
}
```

执行结果：

```text
50.780 [Thread-0] INFO running ... 0
50.798 [Thread-0] INFO running ... 1
50.813 [main] INFO stop before
50.813 [Thread-0] INFO running ... 2
50.813 [main] INFO stop after
50.813 [Thread-0] INFO catch: java.lang.ThreadDeath    # 这里是 ThreadDeath
50.813 [Thread-0] INFO finally
50.813 [Thread-0] INFO elapsed time: 113 ms
```

## 锁的视角

Stopping a thread causes it to unlock all the monitors that it has locked.
(The monitors are unlocked as the `ThreadDeath` exception propagates up the stack.)

```java
public class ThreadStopUnlockMonitor {
    public static void main(String[] args) throws InterruptedException {
        // 定义锁对象
        Object lock = new Object();

        // 先让线程 t1 持有锁，并且等待 3 秒然后释放
        Thread t1 = new Thread(() -> {
            try {
                synchronized (lock) {
                    LogUtils.log("拿到锁");
                    Thread.sleep(3000);
                    LogUtils.log("释放锁");
                }
            } catch (Throwable ex) {
                LogUtils.log("catch: {}", ex.getClass().getName());
            }
        });

        // 线程 t2 排队等待锁
        Thread t2 = new Thread(() -> {
            synchronized (lock) {
                LogUtils.log("拿到锁");
            }
        });

        // 拿锁持有 3 秒
        t1.start();
        Thread.sleep(1000);
        t2.start();

        t1.stop();
    }
}
```

执行结果：

```text
22:39:28.172 [Thread-0] INFO 拿到锁
22:39:29.087 [Thread-0] INFO catch: java.lang.ThreadDeath
22:39:29.087 [Thread-1] INFO 拿到锁
```

注释掉 `t1.stop();`，则执行结果如下：

```text
22:40:00.386 [Thread-0] INFO 拿到锁
22:40:03.398 [Thread-0] INFO 释放锁
22:40:03.398 [Thread-1] INFO 拿到锁
```

## 总结

从执行代码结果的层面来看，如果直接调用 `stop` 方法会即刻在线程的 `run()` 方法内抛出 `ThreadDeath` 异常，
而且抛出的位置不确定，还有可能在 catch 或 finally 语句中。

直接使用 `stop` 停止线程是非常不明智的，
如果突然释放锁，会导致本来加锁的对象，被其他线程抢到锁从而修改属性值，导致数据不一致的情况产生。
