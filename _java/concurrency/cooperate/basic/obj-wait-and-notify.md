---
title: "Object: wait and notify"
sequence: "101"
---

[UP](/java-concurrency.html)

[each object has a monitor.](https://docs.oracle.com/javase/specs/jvms/se6/html/Instructions2.doc9.html)

## wait/notify 原理

### Monitor 结构

![](/assets/images/java/concurrency/obj/obj-monitor-owner-entry-set-wait-set-trim.gif)

### 线程状态

![](/assets/images/java/concurrency/obj/obj-monitor-state-waiting-and-blocked.png)

- Runnable --> Waiting: Owner 线程发现条件不满足，调用 `wait` 方法，即可进入 WaitSet 变为 `WAITING` 状态
- `BLOCKED` 和 `WAITING` 的线程都处于阻塞状态，不占用 CPU 时间片
- Blocked --> Runnable: `BLOCKED` 线程会在 Owner 线程释放锁时唤醒
- Waiting --> Runnable: `WAITING` 线程会在 Owner 线程调用 `notify` 或 `notifyAll` 时唤醒，但唤醒后并不意味者立刻获得锁，仍需进入
  EntryList 重新竞争

## API 介绍

```java
public class Object {
    public final void wait() throws InterruptedException {
        wait(0L);
    }

    public final void wait(long timeoutMillis, int nanos) throws InterruptedException {
        if (timeoutMillis < 0) {
            throw new IllegalArgumentException("timeoutMillis value is negative");
        }

        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException(
                    "nanosecond timeout value out of range");
        }

        if (nanos > 0 && timeoutMillis < Long.MAX_VALUE) {
            timeoutMillis++;
        }

        wait(timeoutMillis);
    }

    public final native void wait(long timeoutMillis) throws InterruptedException;

    public final native void notify();

    public final native void notifyAll();
}
```

- `obj.wait()` 让进入 object 监视器的线程到 waitSet 等待
- `obj.notify()` 在 object 上正在 waitSet 等待的线程中挑一个唤醒
- `obj.notifyAll()` 让 object 上正在 waitSet 等待的所有线程全部唤醒

它们都是线程之间进行协作的手段，都属于 `Object` 对象的方法。



## 如何使用

### 示例一：必须获得锁

必须获得此对象的锁，才能调用这几个方法

```java
public class ObjectWaitNotify_001_Wait_A_Without_Sync {
    // 使用 final 修饰，避免 obj 指向别的对象实例
    private static final Object obj = new Object();

    public static void main(String[] args) {
        try {
            obj.wait(3000); // IllegalMonitorStateException: current thread is not owner
        }
        catch (InterruptedException ex) {
            ex.printStackTrace();
        }
    }
}
```

出现错误：

```text
Exception in thread "main" java.lang.IllegalMonitorStateException: current thread is not owner
```

正确写法：

```java
public class ObjectWaitNotify_001_Wait_B_With_Sync {
    // 使用 final 修饰，避免 obj 指向别的对象实例
    private static final Object obj = new Object();

    public static void main(String[] args) {
        // 必须先获取锁对象之后，才能调用 wait 方法
        synchronized (obj) {
            try {
                obj.wait(3000);
            }
            catch (InterruptedException ex) {
                ex.printStackTrace();
            }
        }
    }
}
```

### 示例二：notify 与 notifyAll

```java
import lsieun.utils.LogUtils;

import static lsieun.utils.SleepUtils.sleep;

public class ObjectWaitNotify_002_Notify {
    // 使用 final 修饰，避免 obj 指向别的对象实例
    private static final Object obj = new Object();

    public static void main(String[] args) {
        LogUtils.color("测试：obj.wait() 会释放锁");

        // =================================================================================
        // t1: 火遁·豪火球
        Thread t1 = new Thread(() -> {
            synchronized (obj) {
                LogUtils.color("火遁");
                try {
                    obj.wait();
                }
                catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
                LogUtils.color("豪火球");
            }
        }, "t1");
        t1.start();

        // =================================================================================
        // t2: 水遁·水龙弹
        Thread t2 = new Thread(() -> {
            synchronized (obj) {
                LogUtils.color("水遁");
                try {
                    obj.wait();
                }
                catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
                LogUtils.color("水龙弹");
            }
        }, "t2");
        t2.start();

        // =================================================================================
        // main: 休息一秒，让 t1 和 t2 进入阻塞，再由 main 线程唤醒 t1、t2
        sleep(1);
        LogUtils.color("唤醒 obj-Monitor-WaitSet 的线程");
        synchronized (obj) {
            // obj.notify();    // 唤醒obj上一个线程
            obj.notifyAll(); // 唤醒obj上所有等待线程
        }

        // =================================================================================
        // main: 休息一秒，等待 t1 和 t2 结束，main 线程最后退出
        sleep(1);
        LogUtils.color("测试：结束");
        System.exit(0);
    }
}
```

```text
327       [main]    INFO  LogUtils - 测试：obj.wait() 会释放锁
331       [t1]      INFO  LogUtils - 火遁
331       [t2]      INFO  LogUtils - 水遁
1344      [main]    INFO  LogUtils - 唤醒 obj-Monitor-WaitSet 的线程
1344      [t1]      INFO  LogUtils - 豪火球
1344      [t2]      INFO  LogUtils - 水龙弹
2358      [main]    INFO  LogUtils - 测试：结束
```

## 经典场景：线程协作

```text
// 一个线程
synchronized(lock) {
    while(条件不成立) {
        lock.wait();
    }
    // 干活
}

// 另一个线程
synchronized(lock) {
    lock.notifyAll();
}
```

## FAQ

### sleep 和 wait 的区别

`sleep(long n)` 和 `wait(long n)` 的区别

- 相同：两者都是 `TIMED_WAITING` 状态
- 不同
    - 所属类：`sleep` 是 `Thread` 方法，而 `wait` 是 `Object` 的方法
    - 锁：
        - 场景：`sleep` 不需要强制和 `synchronized` 配合使用，但 `wait` 需要和 `synchronized` 一起用
        - 释放锁：`sleep` 在睡眠的同时，不会释放对象锁的，但 `wait` 在等待的时候会释放对象锁

## Reference

- [Inside the Java Virtual Machine: Thread Synchronization](https://www.artima.com/insidejvm/ed2/threadsynchP.html) 写的好
- [wait and notify() Methods in Java](https://www.baeldung.com/java-wait-notify)
- [Difference Between Wait and Sleep in Java](https://www.baeldung.com/java-wait-and-sleep)
- [Why wait() Requires Synchronization?](https://www.baeldung.com/java-wait-necessary-synchronization)
