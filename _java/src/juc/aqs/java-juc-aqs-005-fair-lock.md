---
title: "AQS 源码解析：公平锁实现原理"
sequence: "105"
---

## ReentrantLock

```java
public class ReentrantLock implements Lock, Serializable {
    private final Sync sync;

    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }

    public void lock() {
        sync.lock();
    }

    public void unlock() {
        sync.release(1);
    }
}
```

## Sync

```java
public class ReentrantLock implements Lock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        abstract void lock();
    }
}
```

## FairSync

```java
public class ReentrantLock implements Lock, Serializable {
    static final class FairSync extends Sync {
        final void lock() {
            acquire(1);
        }

        // 源码从 AQS 复制
        public final void acquire(int arg) {
            if (!tryAcquire(arg) &&
                    acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
                selfInterrupt();
        }

        // 与非公平锁主要区别在于 tryAcquire 方法的实现
        protected final boolean tryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                // 先检查 AQS 队列中是否有前驱节点, 没有才去竞争
                if (!hasQueuedPredecessors() &&
                        compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            } else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
    }

    public final boolean hasQueuedPredecessors() {
        // The correctness of this depends on head being initialized
        // before tail and on head.next being accurate if the current
        // thread is first in queue.
        Node t = tail; // Read fields in reverse initialization order
        Node h = head;
        Node s;

        // return h != t && ((s = h.next) == null || s.thread != Thread.currentThread());

        // 第一种情况，head 和 tail 相同（可能都是 null，或者指向同一个 Node）
        if (h == t) {
            return false;
        }

        s = h.next;
        if (s == null) {
            return false;
        }

        if (s.thread == Thread.currentThread()) {
            return false;
        }

        return true;
    }
}
```
