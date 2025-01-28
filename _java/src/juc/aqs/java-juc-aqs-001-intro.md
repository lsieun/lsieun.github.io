---
title: "AQS 源码解析"
sequence: "101"
---

## 概述

全称是 `AbstractQueuedSynchronizer`，是**阻塞式锁**和相关的**同步器工具**的框架。

- Abstract：描述它本身是抽象的，需要子类实现
- Queued：描述它的底层实现是基于 Queue
- Synchronizer：描述它的目的或用途

The `AbstractQueuedSynchronizer` class provides a framework for
implementing **blocking locks** and related **synchronizers** (semaphores, events, etc)
that rely on first-in-first-out (FIFO) wait queues.

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
}
```

## AQS 能做什么

- 同步队列的管理和维护
- 同步状态的管理
- 线程的阻塞、唤醒的管理

## 基本的设计思路

- 1、把来竞争的线程 及其 等待状态，封装成为 Node 对象
- 2、把这些 Node 放到一个同步队列中去。这个同步队列是一个 FIFO 的一个双向队列，是基于 CLH 队列来实现的
- 3、AQS 使用一个 `int state` 来表示“同步状态”，比如：是否有线程获得锁、锁的重入次数等等，具体的含义由具体的子类来定义。
- 4、线程的阻塞和唤醒（改变、变动、变化）：伴随着同步队列的维护，使用 LockSupport 来实现对线程的阻塞和唤醒。

## 特点

用 `state` 属性来表示资源的状态（分**独占模式**和**共享模式**），子类需要定义如何维护这个状态，控制如何获取锁和释放锁

- `getState` - 获取 `state` 状态
- `setState` - 设置 `state` 状态
- `compareAndSetState` - CAS 机制设置 `state` 状态
- **独占模式**是只有一个线程能够访问资源，而**共享模式**可以允许多个线程访问资源

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    private volatile int state;
    
    protected final int getState() {
        return state;
    }
    
    protected final void setState(int newState) {
        state = newState;
    }
    
    protected final boolean compareAndSetState(int expect, int update) {
        return U.compareAndSetInt(this, STATE, expect, update);
    }
}
```



提供了基于 FIFO 的等待队列，类似于 Monitor 的 EntryList

条件变量来实现等待、唤醒机制，支持多个条件变量，类似于 Monitor 的 WaitSet

子类主要实现这样一些方法（默认抛出 `UnsupportedOperationException`）

- tryAcquire
- tryRelease
- tryAcquireShared
- tryReleaseShared
- isHeldExclusively

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    protected boolean tryAcquire(int arg) {
        throw new UnsupportedOperationException();
    }

    protected boolean tryRelease(int arg) {
        throw new UnsupportedOperationException();
    }
    
    protected int tryAcquireShared(int arg) {
        throw new UnsupportedOperationException();
    }
    
    protected boolean tryReleaseShared(int arg) {
        throw new UnsupportedOperationException();
    }
    
    protected boolean isHeldExclusively() {
        throw new UnsupportedOperationException();
    }
}
```

获取锁：

```text
// 如果获取锁失败
if (!tryAcquire(arg)) {
    // 入队，可以选择阻塞当前线程 park unpark
}
```

释放锁：

```text
// 如果释放锁成功
if (tryRelease(arg)) {
    // 让阻塞线程恢复运行
}
```

## 实现不可重入锁

```java
import java.util.concurrent.locks.AbstractQueuedSynchronizer;
import java.util.concurrent.locks.Condition;

// 独占锁  同步器类
class MySynchronizer extends AbstractQueuedSynchronizer {
    @Override
    protected boolean tryAcquire(int arg) {
        if (compareAndSetState(0, 1)) {
            // 加上了锁，并设置 owner 为当前线程
            setExclusiveOwnerThread(Thread.currentThread());
            return true;
        }
        return false;
    }

    @Override
    protected boolean tryRelease(int arg) {
        setExclusiveOwnerThread(null);
        // state 是 volatile 变量，放在第二句，是为了保证 exclusiveOwnerThread 变量改变后的可见性
        setState(0);
        return true;
    }

    @Override // 是否持有独占锁
    protected boolean isHeldExclusively() {
        return getState() == 1;
    }

    public Condition newCondition() {
        return new ConditionObject();
    }
}
```

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;

// 自定义锁（不可重入锁）
class MyLock implements Lock {

    private final MySynchronizer sync = new MySynchronizer();

    @Override // 加锁（不成功会进入等待队列）
    public void lock() {
        // 内部实现，在tryAcquire失败后会加入entryList
        sync.acquire(1);
    }

    @Override // 加锁，可打断
    public void lockInterruptibly() throws InterruptedException {
        sync.acquireInterruptibly(1);
    }

    @Override // 尝试加锁（一次）
    public boolean tryLock() {
        return sync.tryAcquire(1);
    }

    @Override // 尝试加锁，带超时
    public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
        return sync.tryAcquireNanos(1, unit.toNanos(time));
    }

    @Override // 解锁
    public void unlock() {
        sync.release(1);
    }

    @Override // 创建条件变量
    public Condition newCondition() {
        return sync.newCondition();
    }
}
```

```java
import lombok.extern.slf4j.Slf4j;

import static lsieun.concurrent.utils.SleepUtils.sleep;

@Slf4j
public class MyLockRun {
    public static void main(String[] args) {
        MyLock lock = new MyLock();
        new Thread(() -> {
            lock.lock();
            try {
                log.debug("locking...");
                sleep(1);
            } finally {
                log.debug("unlocking...");
                lock.unlock();
            }
        }, "t1").start();

        new Thread(() -> {
            lock.lock();
            try {
                log.debug("locking...");
            } finally {
                log.debug("unlocking...");
                lock.unlock();
            }
        }, "t2").start();
    }
}
```

## Reference

视频

- [AQS源码解析](https://space.bilibili.com/660364896)

文章：

- [AQS 万字图文全面解析](https://zhuanlan.zhihu.com/p/463668014)
- [AQS 详细介绍](https://zhuanlan.zhihu.com/p/378219920)
