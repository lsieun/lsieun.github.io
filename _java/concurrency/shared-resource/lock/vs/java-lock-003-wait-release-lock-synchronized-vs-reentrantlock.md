---
title: "wait()释放锁：Object VS. Condition"
sequence: "103"
---

[UP](/java-concurrency.html)

| Object      | Condition   |
|-------------|-------------|
| wait()      | await()     |
| notify()    | signal()    |
| notifyAll() | signalAll() |

## synchronized

```java
import lsieun.utils.LogUtils;

import static lsieun.utils.SleepUtils.sleep;

public class HelloWorld {
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
                    // 只有当前线程释放锁，别的线程才能获取锁
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
                    // 只有当前线程释放锁，别的线程才能获取锁
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
            obj.notifyAll(); // 唤醒 obj 上所有等待线程
        }

        // =================================================================================
        // main: 休息一秒，等待 t1 和 t2 结束，main 线程最后退出
        sleep(1);
        LogUtils.color("测试：结束");
    }
}
```

```text
318       [main]     INFO  LogUtils - 测试：obj.wait() 会释放锁
323       [t1]       INFO  LogUtils - 火遁
323       [t2]       INFO  LogUtils - 水遁
1325      [main]     INFO  LogUtils - 唤醒 obj-Monitor-WaitSet 的线程
1325      [t1]       INFO  LogUtils - 豪火球
1325      [t2]       INFO  LogUtils - 水龙弹
2327      [main]     INFO  LogUtils - 测试：结束
```

## ReentrantLock

```java
import lsieun.utils.LogUtils;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

import static lsieun.utils.SleepUtils.sleep;

public class HelloWorld {
    private static final ReentrantLock lock = new ReentrantLock();

    private static final Condition condition = lock.newCondition();

    public static void main(String[] args) {
        LogUtils.color("测试：condition.await() 会释放锁");

        // =================================================================================
        // t1: 火遁·豪火球
        Thread t1 = new Thread(() -> {
            lock.lock();
            try {
                LogUtils.color("火遁");
                try {
                    // 只有当前线程释放锁，别的线程才能获取锁
                    condition.await();
                }
                catch (InterruptedException ex) {
                    System.out.println("ex=============");
                    ex.printStackTrace();
                }
                LogUtils.color("豪火球");
            }
            finally {
                lock.unlock();
            }
        }, "t1");
        t1.start();

        // =================================================================================
        // t2: 水遁·水龙弹
        Thread t2 = new Thread(() -> {
            lock.lock();
            try {
                LogUtils.color("水遁");
                try {
                    // 只有当前线程释放锁，别的线程才能获取锁
                    condition.await();
                }
                catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
                LogUtils.color("水龙弹");
            }
            finally {
                lock.unlock();
            }
        }, "t2");
        t2.start();

        // =================================================================================
        // main: 休息一秒，让 t1 和 t2 进入阻塞，再由 main 线程唤醒 t1、t2
        sleep(1);
        LogUtils.color("唤醒 Condition.await() 的线程");
        lock.lock();
        try {
            condition.signalAll();
        }
        finally {
            lock.unlock();
        }

        // =================================================================================
        // main: 休息一秒，等待 t1 和 t2 结束，main 线程最后退出
        sleep(1);
        LogUtils.color("测试：结束");
    }
}
```

```text
310       [main]    INFO  LogUtils - 测试：condition.await() 会释放锁
314       [t1]      INFO  LogUtils - 火遁
315       [t2]      INFO  LogUtils - 水遁
1324      [main]    INFO  LogUtils - 唤醒 Condition.await() 的线程
1324      [t1]      INFO  LogUtils - 豪火球
1325      [t2]      INFO  LogUtils - 水龙弹
2326      [main]    INFO  LogUtils - 测试：结束
```
