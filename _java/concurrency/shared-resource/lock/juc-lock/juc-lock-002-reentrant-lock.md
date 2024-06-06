---
title: "ReentrantLock - 重入锁"
sequence: "102"
---

[UP](/java-concurrency.html)


## 基本介绍

重入锁，是指任意线程，在获取锁之后，再次获取该锁而不会被锁阻塞。

### ReentrantLock 类

`ReentrantLock` 类实现了 `Lock` 接口：

```java
public class ReentrantLock implements Lock, Serializable {
    // ...
}
```

It offers the same concurrency and memory semantics
as the **implicit monitor lock** accessed
using `synchronized` methods and statements, with extended capabilities.

### 与 synchronized 对比

相对于 synchronized 它具备如下特点

- 不同点
    - 可中断
    - 可以设置超时时间
    - 可以设置为公平锁
    - 支持多个条件变量
- 相同点
    - 与 synchronized 一样，都支持可重入

### 如何使用

```text
// 获取锁
reentrantLock.lock();
try {
    // 临界区
} finally {
    // 释放锁
    reentrantLock.unlock();        
}
```

```text
// 第 1 步，创建对象
ReentrantLock lock = new ReentrantLock();

try {
    // 第 2 步，调用 lock 方法
    lock.lock();
    // do something
}
finally {
    // 第 3 步，调用 unlock 方法
    // 要考虑发生异常的情况，放在 finally 里，确定 unlock 方法一定会调用
    lock.unlock();
}
```

## 特性

### 可重入

经典方式：

```java
import java.util.concurrent.locks.ReentrantLock;

public class LockReentrantRun {
    private static final ReentrantLock lock = new ReentrantLock();

    public static void main(String[] args) {
        method1();
    }

    public static void method1() {
        lock.lock();
        try {
            LogUtils.log("execute method1");
            method2();
        } finally {
            lock.unlock();
        }
    }

    public static void method2() {
        lock.lock();
        try {
            LogUtils.log("execute method2");
            method3();
        } finally {
            lock.unlock();
        }
    }

    public static void method3() {
        lock.lock();
        try {
            LogUtils.log("execute method3");
        } finally {
            lock.unlock();
        }
    }

}
```

输出：

```text
43:35.512 [main] INFO execute method1
43:35.513 [main] INFO execute method2
43:35.513 [main] INFO execute method3
```

一个递归的方式：

```java
import java.util.concurrent.locks.ReentrantLock;

public class LockReentrantRun {
    private static final ReentrantLock lock = new ReentrantLock();

    public static void main(String[] args) {
        work(1, 3);
    }

    private static void work(int currentDepth, int maxDepth) {
        if (currentDepth > maxDepth) {
            return;
        }

        try {
            LogUtils.log("lock: i = {}", currentDepth);
            lock.lock();
            work(currentDepth + 1, maxDepth);
        } finally {
            lock.unlock();
            LogUtils.log("unlock: i = {}", currentDepth);
        }
    }
}
```

输出：

```text
39:12.690 [main] INFO lock: i = 1
39:12.692 [main] INFO lock: i = 2
39:12.692 [main] INFO lock: i = 3
39:12.692 [main] INFO unlock: i = 3
39:12.692 [main] INFO unlock: i = 2
39:12.692 [main] INFO unlock: i = 1
```

### 可打断

```java
import java.util.concurrent.locks.ReentrantLock;

import static lsieun.concurrent.utils.SleepUtils.sleep;

public class LockInterruptRun {
    public static void main(String[] args) {
        ReentrantLock lock = new ReentrantLock();

        Thread t1 = new Thread(() -> {
            LogUtils.log("启动...");
            try {
                lock.lockInterruptibly();
            } catch (InterruptedException e) {
                e.printStackTrace();
                LogUtils.log("等锁的过程中被打断");
                return;
            }
            try {
                LogUtils.log("获得了锁");
            } finally {
                lock.unlock();
            }
        }, "t1");

        lock.lock();
        LogUtils.log("获得了锁");
        t1.start();
        try {
            sleep(1);
            t1.interrupt();
            LogUtils.log("执行打断");
        } finally {
            lock.unlock();
        }
    }

}
```

### 超时

```text
lock.tryLock()
lock.tryLock(1, TimeUnit.SECONDS)
```

```text
public void performTryLock(){
    boolean isLockAcquired = lock.tryLock(1, TimeUnit.SECONDS);
    
    if(isLockAcquired) {
        try {
            // Critical section here
        } finally {
            lock.unlock();
        }
    }
}
```

立刻失败

```java
import java.util.concurrent.locks.ReentrantLock;

import static lsieun.concurrent.utils.SleepUtils.sleep;

public class LockTimeoutRun {
    public static void main(String[] args) {
        ReentrantLock lock = new ReentrantLock();

        Thread t1 = new Thread(() -> {
            LogUtils.log("启动...");
            if (!lock.tryLock()) {
                LogUtils.log("获取立刻失败，返回");
                return;
            }
            try {
                LogUtils.log("获得了锁");
            } finally {
                lock.unlock();
            }
        }, "t1");

        lock.lock();
        LogUtils.log("获得了锁");
        t1.start();
        try {
            sleep(2);
        } finally {
            lock.unlock();
        }
    }

}
```

超时失败

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;


public class LockTimeoutRun {
    public static void main(String[] args) {
        ReentrantLock lock = new ReentrantLock();
        Thread t1 = new Thread(() -> {
            LogUtils.log("启动...");
            try {
                if (!lock.tryLock(2, TimeUnit.SECONDS)) {
                    LogUtils.log("获取等待 2s 后失败，返回");
                    return;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            try {
                LogUtils.log("获取等待 1s 后成功，获得了锁");
            } finally {
                lock.unlock();
            }
        }, "t1");

        lock.lock();
        LogUtils.log("获得了锁");
        t1.start();
        try {
            sleep(1);
        } finally {
            lock.unlock();
        }
    }

}
```

### 公平锁

`ReentrantLock` 默认是不公平的。

```text
Lock nonFairLock1 = new ReentrantLock();         // A non-fair lock (Default is non-fair)
Lock nonFairLock2 = new ReentrantLock(false);    // A non-fair lock
Lock fairLock = new ReentrantLock(true);         // A fair lock
```

- 公平锁：保证“先来，先获取锁；后来，后获取锁”的顺序
    - 缺点：公平锁一般没有必要，会降低并发度。
- 非公平锁：不能保证顺序
    - 缺点：在一些特殊情况下，有的线程总是拿不到锁

```java
import java.util.concurrent.locks.ReentrantLock;


public class LockFairRun {
    public static void main(String[] args) {
        ReentrantLock lock = new ReentrantLock(false);
        lock.lock();
        for (int i = 0; i < 500; i++) {
            new Thread(() -> {
                lock.lock();
                try {
                    LogUtils.log("running");
                } finally {
                    lock.unlock();
                }
            }, "t" + i).start();
        }

        // 1s 之后去争抢锁
        sleep(1);
        new Thread(() -> {
            LogUtils.log("start...");
            lock.lock();
            try {
                LogUtils.log("running");
            } finally {
                lock.unlock();
            }
        }, "强行插入").start();
        lock.unlock();
    }
}
```

强行插入，有机会在中间输出

注意：该实验不一定总能复现

### 条件变量

synchronized 中也有条件变量，就是我们讲原理时那个 waitSet 休息室，当条件不满足时进入 waitSet 等待

ReentrantLock 的条件变量比 synchronized 强大之处在于，它是支持多个条件变量的，这就好比

- synchronized 是那些不满足条件的线程都在一间休息室等消息
- 而 ReentrantLock 支持多间休息室，有专门等烟的休息室、专门等早餐的休息室、唤醒时也是按休息室来唤醒

使用要点：

- await 前需要获得锁
- await 执行后，会释放锁，进入 conditionObject 等待
- await 的线程被唤醒（或打断、或超时）取重新竞争 lock 锁
- 竞争 lock 锁成功后，从 await 后继续执行

```java
import lsieun.utils.LogUtils;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

import static lsieun.utils.SleepUtils.sleep;

public class LockConditionRun {
    static boolean hasCigarette = false;
    static boolean hasTakeout = false;
    static ReentrantLock ROOM = new ReentrantLock();
    // 等待烟的休息室
    static Condition waitCigaretteSet = ROOM.newCondition();
    // 等外卖的休息室
    static Condition waitTakeoutSet = ROOM.newCondition();

    public static void main(String[] args) {

        new Thread(() -> {
            ROOM.lock();
            try {
                LogUtils.color("有烟没？[{}]", hasCigarette);
                while (!hasCigarette) {
                    LogUtils.color("没烟，先歇会！");
                    try {
                        waitCigaretteSet.await();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                LogUtils.color("可以开始干活了");
            } finally {
                ROOM.unlock();
            }
        }, "小明").start();

        new Thread(() -> {
            ROOM.lock();
            try {
                LogUtils.color("外卖送到没？[{}]", hasTakeout);
                while (!hasTakeout) {
                    LogUtils.color("没外卖，先歇会！");
                    try {
                        waitTakeoutSet.await();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                LogUtils.color("可以开始干活了");
            } finally {
                ROOM.unlock();
            }
        }, "小红").start();

        sleep(1);
        new Thread(() -> {
            ROOM.lock();
            try {
                hasTakeout = true;
                waitTakeoutSet.signal();
            } finally {
                ROOM.unlock();
            }
        }, "送外卖的").start();

        sleep(1);

        new Thread(() -> {
            ROOM.lock();
            try {
                hasCigarette = true;
                waitCigaretteSet.signal();
            } finally {
                ROOM.unlock();
            }
        }, "送烟的").start();
    }

}
```

```text
269       [小明]    INFO  LogUtils - 有烟没？[false]
272       [小明]    INFO  LogUtils - 没烟，先歇会！
272       [小红]    INFO  LogUtils - 外卖送到没？[false]
273       [小红]    INFO  LogUtils - 没外卖，先歇会！
967       [小红]    INFO  LogUtils - 可以开始干活了
1970      [小明]    INFO  LogUtils - 可以开始干活了
```

## 可见性

```text
我心中的疑问：使用 ReentrantLock 进行同步，那么对『共享变量的内存可见性』是不是也保障了？
```

### 机制

在 Java 中，使用 `ReentrantLock` 进行同步，确实保障了进入和退出临界区时**对共享变量的内存可见性**，即便这些变量没有被声明为 `volatile`。
这是因为 `ReentrantLock` 的内部机制遵守了 Java 内存模型（JMM）的 happens-before 原则。具体来说：

- **锁的释放和获取**：当一个线程释放一个锁（无论是 `ReentrantLock` 还是内置的 `synchronized` 锁）时，
  Java 内存模型保证释放锁的线程对**共享变量的写操作**对于随后获得同一个锁的另一个线程是可见的。
  这意味着，**使用 `ReentrantLock` 锁时，线程在锁定和解锁时，都会有一个内存同步的操作，确保锁内部的读写操作对其他线程可见**。

### 如何使用

**使用锁来保护变量**：确保所有对共享变量的读写操作都在锁的保护之下进行。
这不仅意味着**在修改变量时需要持有锁，读取变量时也需要持有锁**。
这样可以确保在变量被修改后，其它线程在读取这些变量时也必须通过锁，因此能看到最新的修改。

例如：

```text
private int count = 0;
private final ReentrantLock lock = new ReentrantLock();

public void increment() {
    lock.lock();
    try {
        count++; // 安全地修改变量
    } finally {
        lock.unlock();
    }
}

public int getCount() {
    lock.lock();
    try {
        return count; // 安全地读取变量
    } finally {
        lock.unlock();
    }
}

```

在上述代码中，即使 `count` 变量没有被声明为 `volatile`，通过锁的保护，依然保证了其修改对所有后续获得该锁的线程的可见性。

### 合理使用 volatile

**合理使用 volatile**：在某些情况下，如果一个字段经常被读取而很少修改，为了避免每次读取都需要加锁的开销，可以将该字段声明为 `volatile`。
这样，对该字段的读写就会自动保证内存可见性，但需要注意，`volatile` 并不提供原子性。

总之，`ReentrantLock` 本身通过内部的内存同步措施，确保了锁内操作的内存可见性，即便共享变量未被声明为 `volatile`。
正确的锁使用习惯（锁的范围和策略）是确保多线程程序正确性的关键。

## 示例代码

### 求和

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

public class Sum {
    public static void main(String[] args) {
        SharedObjectWithLock instance = new SharedObjectWithLock();

        List<Thread> threadList = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Thread t = new Thread(() -> {
                for (int j = 0; j < 10000; j++) {
                    instance.perform();
                }
            });
            threadList.add(t);
        }

        threadList.forEach(Thread::start);
        threadList.forEach(t -> {
            try {
                t.join();
            } catch (InterruptedException ex) {
                ex.printStackTrace();
            }
        });

        int counter = instance.getCounter();
        LogUtils.log("counter = {}", counter);
    }
}


class SharedObjectWithLock {
    final ReentrantLock lock = new ReentrantLock();
    int counter = 0;

    public void perform() {
        lock.lock();
        try {
            // Critical section here
            counter++;
        } finally {
            lock.unlock();
        }
    }

    public int getCounter() {
        lock.lock();
        try {
            return counter;
        } finally {
            lock.unlock();
        }
    }
}
```

### Lock 接口

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class ThreadExample implements Runnable {

    final Lock lock;

    public ThreadExample(final Lock lock) {
        this.lock = lock;
    }

    @Override
    public void run() {
        while (true) {
            try {
                if (lock.tryLock(1, TimeUnit.SECONDS)) {
                    try {
                        LogUtils.log("acquire lock");
                        TimeUnit.SECONDS.sleep(2);
                    } finally {
                        lock.unlock();
                        LogUtils.log("release lock");
                    }
                    break;
                } else {
                    LogUtils.log("unable to acquire the lock");
                }
            } catch (InterruptedException ignore) {
            }
        }
    }

    public static void main(String[] args) {
        final Lock lock = new ReentrantLock();
        new Thread(new ThreadExample(lock), "thread_1").start();
        new Thread(new ThreadExample(lock), "thread_2").start();
    }
}
```

```text
13:49.605 [thread_1] INFO acquire lock
13:50.517 [thread_2] INFO unable to acquire the lock
13:51.528 [thread_2] INFO unable to acquire the lock
13:51.608 [thread_1] INFO release lock
13:51.608 [thread_2] INFO acquire lock
13:53.616 [thread_2] INFO release lock
```


