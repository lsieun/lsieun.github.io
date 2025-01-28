---
title: "AQS 源码解析：可重入"
sequence: "103"
---

可重入示例：

```java
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
public class HelloWorld {

    private static final ReentrantLock lock = new ReentrantLock();

    public static void main(String[] args) {
        method1();
    }

    public static void method1() {
        lock.lock();
        try {
            log.info("execute method1");
            method2();
        } finally {
            lock.unlock();
        }
    }

    public static void method2() {
        lock.lock();
        try {
            log.info("execute method2");
        } finally {
            lock.unlock();
        }
    }
}
```

## ReentrantLock

```java
public class ReentrantLock implements Lock, Serializable {
}
```

### lock + unlock

```java
public class ReentrantLock implements Lock, Serializable {
    private final Sync sync;

    public ReentrantLock() {
        sync = new NonfairSync();
    }

    public void lock() {
        sync.lock();
    }

    public void unlock() {
        sync.release(1);
    }
}
```

### Sync

```java
public class ReentrantLock implements Lock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        abstract void lock();

        final boolean nonfairTryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            // 如果还没有获得锁
            if (c == 0) {
                // 尝试用 CAS 获得，这里体现了非公平性: 不去检查 AQS 队列
                if (compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            // 如果已经获得了锁，线程还是当前线程，表示发生了锁重入
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0) // overflow
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            // 获取失败，回到调用处
            return false;
        }

        protected final boolean tryRelease(int releases) {
            int c = getState() - releases;
            if (Thread.currentThread() != getExclusiveOwnerThread())
                throw new IllegalMonitorStateException();
            boolean free = false;
            
            // 支持锁重入，只有 state 减为 0，才释放成功
            if (c == 0) {
                free = true;
                setExclusiveOwnerThread(null);
            }
            setState(c);
            return free;
        }
    }
}
```

### NonfairSync

```java
public class ReentrantLock implements Lock, Serializable {
    static final class NonfairSync extends Sync {
        final void lock() {
            // 首先用 cas 尝试（仅尝试一次）将 state 从 0 改为 1, 如果成功表示获得了独占锁
            if (compareAndSetState(0, 1))
                setExclusiveOwnerThread(Thread.currentThread());
            else
                // 如果尝试失败
                acquire(1);
        }

        // 继承自 AQS
        public final void acquire(int arg) {
            if (!tryAcquire(arg) &&
                    acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
                selfInterrupt();
        }

        protected final boolean tryAcquire(int acquires) {
            return nonfairTryAcquire(acquires);
        }
    }
}
```

