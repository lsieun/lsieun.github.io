---
title: "CAS Lock"
sequence: "101"
---

[UP](/java-concurrency.html)


## 底层

其实，CAS 的底层是 `lock cmpxchg` 指令（X86 架构），在单核 CPU 和多核 CPU 下都能保证“比较 - 交换”的原子性。

在多核状态下，某个执行行到带 lock 的指令时，CPU 会让总线锁住，当这个核把此指令执行完毕，再开启总线。
这个过程中，不会被线程的调度机制所打断，保证了多个线程对内存操作的准确性，是原子的。

## volatile

获取共享变量时，为了保证该变量的可见性，需要使用 volatile 修饰。

`volatile` 可以用来修饰成员变量和静态成员变量，可以避免线程从自己的工作缓存中查找变量的值，必须到主存中获取它的值，
线程操作 volatile 变量都是直接操作主存，即一个线程对 volatile 变量的修改，对另一个线程可见。

注意：`volatile` 仅仅保证了共享变量的可见性，让其它线程能够看到最新值，但不能解决指令交错问题（不能保证原子性）。

CAS 必须借助 volatile 才能读取到共享变量的最新值来实现“比较 - 交换”的效果。

## CAS 效率分析

## CAS 的特点

结合 CAS 和 volatile 可以实现无锁并发，**适用于线程少、多核 CPU 的场景下**。

- CAS 是基于乐观锁的思想：最乐观的估计，不怕别的线程来修改共享变量，就算改了也没关系，我吃亏点再重试呗。
- synchronized 是基于悲观锁的思想：最悲观的估计，得防着其它线程来修改共享变量。我上了锁，你们都别想改；等我改完了，解开锁，你们才有机会。

CAS 体现的是**无锁并发**、**无阻塞并发**，请仔细体会这两句话的意思：

- 因为没有使用 `synchronized`，所以**线程不会陷入阻塞**，这是效率提升的因素之一
- 但是，如果竞争激烈，重试必然频繁发生，反而效率会受影响。

## LockCas

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

// 不要用于生产实践
public class LockCas {
    private final AtomicInteger state = new AtomicInteger(0);

    public void lock() {
        while (true) {
            if (state.compareAndSet(0, 1)) {
                break;
            }
        }
    }

    // 解锁，不需要 CAS 操作，因为只有获取锁的线程，才能释放锁
    public void unlock() {
        LogUtils.log("unlock...");
        state.set(0);
    }

    public static void main(String[] args) {
        LockCas lock = new LockCas();
        new Thread(() -> {
            LogUtils.log("begin...");
            lock.lock();
            try {
                LogUtils.log("lock...");
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                lock.unlock();
            }
        }, "A").start();

        new Thread(() -> {
            LogUtils.log("begin...");
            lock.lock();
            try {
                LogUtils.log("lock...");
            } finally {
                lock.unlock();
            }
        }, "B").start();
    }
}
```

```text
[A] INFO begin...
[B] INFO begin...
[A] INFO lock...
[A] INFO unlock...
[B] INFO lock...
[B] INFO unlock...
```
