---
title: "停止线程：推荐使用两阶段终止"
sequence: "104"
---

[UP](/java-concurrency.html)


The typical `run` method of a thread should look like

```text
public void run () {
    initialize ();
    while (! isInterrupted ()) {
        ... // whatever execution
    }
    shutdown ();
}
```

Method `isInterrupted` tests the interrupted status of a thread.
The interrupted status is set when a thread's method interrupt is called and is cleared in various situations.

## 标志位法

这种方法的好处是让线程自己停下来，实现方式就是将一个变量作为标识，
线程每隔一段时间去判断下这个变量是否停止为停止标识，如果是则停止，否则继续运行。

```java
import java.util.concurrent.TimeUnit;


public class StopThread {
    public static void main(String[] args) throws InterruptedException {
        ThreadDemo threadDemo = new ThreadDemo();

        Thread thread = new Thread(threadDemo);
        thread.start();
        TimeUnit.SECONDS.sleep(3);
        threadDemo.stop();
    }
}

class ThreadDemo implements Runnable {
    public volatile boolean flag = true;

    @Override
    public void run() {
        while (flag) {
            System.out.println("do... something");
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void stop() {
        flag = false;
        System.out.println("run... stop");
    }
}
```

### 注意点

`volatile` 关键字，在多线程的情况下改变变量的值，如果需要马上通知其他线程，那么可以使用这个关键字，
这是基于 `volatile` 关键字的特性—>可见性。

在正常开发中肯定是不会去使用死循环来去判断是否需要停止线程的，这个可以在关键业务逻辑中去判断



## 代码

### TwoPhaseTermination

```java
import java.util.concurrent.TimeUnit;

public class TwoPhaseTermination {
    // 监控线程
    private Thread monitorThread;

    // 启动监控线程
    public void start() {
        monitorThread = new Thread(() -> {
            while (true) {
                Thread currentThread = Thread.currentThread();

                // 是否被打断
                if (currentThread.isInterrupted()) {
                    LogUtils.log("料理后事");
                    break;
                }

                try {
                    TimeUnit.SECONDS.sleep(1);
                    LogUtils.log("执行监控记录");
                } catch (InterruptedException e) {
                    // 因为 sleep 出现异常后，会清除打断标识，需要重置打断标记
                    LogUtils.log("InterruptedException: {}", currentThread.isInterrupted());
                    currentThread.interrupt();
                    LogUtils.log("InterruptedException: {}", currentThread.isInterrupted());
                }
            }
        }, "monitor");
        monitorThread.start();
    }

    // 停止监控线程
    public void stop() {
        monitorThread.interrupt();
    }

    public static void main(String[] args) throws InterruptedException {
        TwoPhaseTermination t = new TwoPhaseTermination();
        t.start();

        Thread.sleep(3500);
        LogUtils.log("stop");
        t.stop();
    }
}
```

### TwoPhaseTerminationVolatile

```java
import java.util.concurrent.TimeUnit;

public class TwoPhaseTerminationVolatile {
    // 监控线程
    private Thread monitorThread;
    private volatile boolean stop = false;

    // 启动监控线程
    public void start() {
        monitorThread = new Thread(() -> {
            while (true) {
                Thread currentThread = Thread.currentThread();

                if (stop) {
                    LogUtils.log("料理后事");
                    break;
                }

                try {
                    TimeUnit.SECONDS.sleep(1);
                    LogUtils.log("执行监控记录");
                } catch (InterruptedException e) {
                    LogUtils.log("InterruptedException: {}", currentThread.isInterrupted());
                }
            }
        }, "monitor");
        monitorThread.start();
    }

    // 停止监控线程
    public void stop() {
        stop = true;
        monitorThread.interrupt();
    }

    public static void main(String[] args) throws InterruptedException {
        TwoPhaseTerminationVolatile t = new TwoPhaseTerminationVolatile();
        t.start();

        Thread.sleep(3500);
        LogUtils.log("stop");
        t.stop();
    }
}
```

### ControlSubThread

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class ControlSubThread implements Runnable {

    private Thread worker;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final AtomicBoolean stopped = new AtomicBoolean(false);
    private final int interval;

    public ControlSubThread(int sleepInterval) {
        interval = sleepInterval;
    }

    public void start() {
        worker = new Thread(this);
        worker.start();
    }

    public void stop() {
        running.set(false);
        worker.interrupt();
    }

    boolean isRunning() {
        return running.get();
    }

    boolean isStopped() {
        return stopped.get();
    }

    public void run() {
        running.set(true);
        stopped.set(false);
        while (running.get()) {
            try {
                Thread.sleep(interval);
            } catch (InterruptedException e){
                Thread.currentThread().interrupt();
                System.out.println(
                        "Thread was interrupted, Failed to complete operation"
                );
            }
            // do something
        }
        stopped.set(true);
    }

    public static void main(String[] args) throws InterruptedException {
        ControlSubThread thread = new ControlSubThread(1000);
        thread.start();
        TimeUnit.SECONDS.sleep(3);
        thread.stop();
    }
}
```

## Reference

- [Java Thread Primitive Deprecation](https://docs.oracle.com/javase/8/docs/technotes/guides/concurrency/threadPrimitiveDeprecation.html)
- [How to Kill a Java Thread](https://www.baeldung.com/java-thread-stop)
- [java 多线程之 Two-Phase Termination 模式](https://blog.csdn.net/m0_37941483/article/details/103150023)
- [Design Pattern: Two-Phase termination Mode](https://topic.alibabacloud.com/a/design-pattern-two-phase-termination-mode_8_8_32320845.html)
- [第三部分 - 并发设计模式 35:两阶段终止模式](https://www.cnblogs.com/PythonOrg/p/14885679.html)
