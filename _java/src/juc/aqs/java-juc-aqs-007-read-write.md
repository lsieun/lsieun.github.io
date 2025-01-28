---
title: "AQS 源码解析：读写锁原理"
sequence: "107"
---

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
}
```

## ReentrantReadWriteLock

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    private final ReentrantReadWriteLock.ReadLock readerLock;
    private final ReentrantReadWriteLock.WriteLock writerLock;
    final Sync sync;

    public ReentrantReadWriteLock() {
        this(false);
    }

    public ReentrantReadWriteLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
        readerLock = new ReadLock(this);
        writerLock = new WriteLock(this);
    }

    public ReentrantReadWriteLock.WriteLock writeLock() { return writerLock; }
    public ReentrantReadWriteLock.ReadLock  readLock()  { return readerLock; }
}
```

### WriteLock

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    public static class WriteLock implements Lock, Serializable {
        private final Sync sync;

        protected WriteLock(ReentrantReadWriteLock lock) {
            sync = lock.sync;
        }

        public void lock() {
            sync.acquire(1);
        }

        public void unlock() {
            sync.release(1);
        }
    }
}
```

### ReadLock

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    private final Sync sync;

    protected ReadLock(ReentrantReadWriteLock lock) {
        sync = lock.sync;
    }

    public void lock() {
        sync.acquireShared(1);
    }

    public void unlock() {
        sync.releaseShared(1);
    }
}
```



## Sync

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        /*
         * Read vs write count extraction constants and functions.
         * Lock state is logically divided into two unsigned shorts:
         * The lower one representing the exclusive (writer) lock hold count,
         * and the upper the shared (reader) hold count.
         */

        static final int SHARED_SHIFT   = 16;
        static final int SHARED_UNIT    = (1 << SHARED_SHIFT);
        static final int MAX_COUNT      = (1 << SHARED_SHIFT) - 1;
        static final int EXCLUSIVE_MASK = (1 << SHARED_SHIFT) - 1;

        static int sharedCount(int c)    { return c >>> SHARED_SHIFT; }
        static int exclusiveCount(int c) { return c & EXCLUSIVE_MASK; }
    }
}
```

### acquire

#### tryAcquire

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {

        // 代码复制自 AQS 类（方便阅读）
        public final void acquire(int arg) {
            if (!tryAcquire(arg) &&
                    acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
                selfInterrupt();
        }

        protected final boolean tryAcquire(int acquires) {
            /*
             * Walkthrough:
             * 1. If read count nonzero or write count nonzero
             *    and owner is a different thread, fail.
             * 2. If count would saturate, fail. (This can only
             *    happen if count is already nonzero.)
             * 3. Otherwise, this thread is eligible for lock if
             *    it is either a reentrant acquire or
             *    queue policy allows it. If so, update state
             *    and set owner.
             */
            Thread current = Thread.currentThread();
            int c = getState();
            int w = exclusiveCount(c);
            
            // 读锁 or 写锁：c != 0，说明要么有读锁，要么有写锁
            if (c != 0) {
                // (Note: if c != 0 and w == 0 then shared count != 0)
                // 读锁：w == 0，表示没有写锁，当前是读锁；目前，要获取写锁，因此直接返回 false
                if (w == 0) {
                    return false;
                }

                // 写锁：到这儿， w != 0，说明是“写锁”
                // current != getExclusiveOwnerThread()，说明是写锁，但又不是当前 thread，写-写 也是互斥，因此返回 false
                if (current != getExclusiveOwnerThread()) {
                    return false;
                }
                
                // 写锁：到这儿，说明是“写锁”，且是同一个线程重入
                if (w + exclusiveCount(acquires) > MAX_COUNT) {
                    throw new Error("Maximum lock count exceeded");
                }
                
                // 写锁：重入
                // Reentrant acquire
                setState(c + acquires);
                return true;
            }
            
            // 无锁：到这儿，说明 c == 0，表示没有读锁，也没有写锁
            // writerShouldBlock() 分两种情况：
            // 如果是非公平锁，writerShouldBlock() 一直返回 false，因此它不考虑 AQS 队列是否有 node
            // 如果是公平锁，writerShouldBlock() 则需要判断 AQS 队列中是否有 node
            if (writerShouldBlock() ||
                    !compareAndSetState(c, c + acquires))
                return false;
            setExclusiveOwnerThread(current);
            return true;
        }
    }
}
```

### release

#### tryRelease

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {

        // 代码复制自 AQS 类（方便阅读）
        public final boolean release(int arg) {
            if (tryRelease(arg)) {
                Node h = head;
                if (h != null && h.waitStatus != 0)
                    unparkSuccessor(h);
                return true;
            }
            return false;
        }

        protected final boolean tryRelease(int releases) {
            if (!isHeldExclusively()) {
                throw new IllegalMonitorStateException();
            }

            // 预期的状态
            int nextc = getState() - releases;
            
            // 当 write 线程的数量为 0 时，则可以释放“锁”了
            boolean free = exclusiveCount(nextc) == 0;
            if (free) {
                setExclusiveOwnerThread(null);
            }

            // 设置 state
            setState(nextc);
            return free;
        }
    }
}
```

### acquireShared

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        // 代码来自 AQS 类（方便阅读）
        public final void acquireShared(int arg) {
            if (tryAcquireShared(arg) < 0)
                doAcquireShared(arg);
        }
    }
}
```

#### tryAcquireShared

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        // -1 表示失败
        // 0  表示成功，但后继节点不会继续唤醒
        // 正数，表示成功，而且数值是还有几个后续节点需要唤醒
        // 对于 ReadWriteLock 来说，只返回两个值：-1（失败） 和 1 成功）
        protected final int tryAcquireShared(int unused) {
            /*
             * Walkthrough:
             * 1. If write lock held by another thread, fail.
             * 2. Otherwise, this thread is eligible for
             *    lock wrt state, so ask if it should block
             *    because of queue policy. If not, try
             *    to grant by CASing state and updating count.
             *    Note that step does not check for reentrant
             *    acquires, which is postponed to full version
             *    to avoid having to check hold count in
             *    the more typical non-reentrant case.
             * 3. If step 2 fails either because thread
             *    apparently not eligible or CAS fails or count
             *    saturated, chain to version with full retry loop.
             */
            Thread current = Thread.currentThread();
            int c = getState();
            
            // 写锁：写锁，如果不是当前线程，不可以降级为读锁
            if (exclusiveCount(c) != 0 &&
                    getExclusiveOwnerThread() != current)
                return -1;
            
            // 情况：写锁且重入、读锁、无锁
            // Read 线程的数量
            int r = sharedCount(c);
            if (!readerShouldBlock() &&
                    r < MAX_COUNT &&
                    compareAndSetState(c, c + SHARED_UNIT)) {
                if (r == 0) {
                    firstReader = current;
                    firstReaderHoldCount = 1;
                } else if (firstReader == current) {
                    firstReaderHoldCount++;
                } else {
                    HoldCounter rh = cachedHoldCounter;
                    if (rh == null || rh.tid != getThreadId(current))
                        cachedHoldCounter = rh = readHolds.get();
                    else if (rh.count == 0)
                        readHolds.set(rh);
                    rh.count++;
                }
                return 1;
            }
            return fullTryAcquireShared(current);
        }
    }
}
```

#### doAcquireShared

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        private void doAcquireShared(int arg) {
            // 注意：这里加的是 SHARED 类型的节点
            final Node node = addWaiter(Node.SHARED);
            boolean failed = true;
            try {
                boolean interrupted = false;
                for (;;) {
                    final Node p = node.predecessor();
                    if (p == head) {
                        int r = tryAcquireShared(arg);
                        if (r >= 0) {
                            setHeadAndPropagate(node, r);
                            p.next = null; // help GC
                            if (interrupted)
                                selfInterrupt();
                            failed = false;
                            return;
                        }
                    }
                    if (shouldParkAfterFailedAcquire(p, node) &&
                            parkAndCheckInterrupt())
                        interrupted = true;
                }
            } finally {
                if (failed)
                    cancelAcquire(node);
            }
        }

        private void setHeadAndPropagate(Node node, int propagate) {
            Node h = head; // Record old head for check below
            setHead(node);
            /*
             * Try to signal next queued node if:
             *   Propagation was indicated by caller,
             *     or was recorded (as h.waitStatus either before
             *     or after setHead) by a previous operation
             *     (note: this uses sign-check of waitStatus because
             *      PROPAGATE status may transition to SIGNAL.)
             * and
             *   The next node is waiting in shared mode,
             *     or we don't know, because it appears null
             *
             * The conservatism in both of these checks may cause
             * unnecessary wake-ups, but only when there are multiple
             * racing acquires/releases, so most need signals now or soon
             * anyway.
             */
            if (propagate > 0 || h == null || h.waitStatus < 0 ||
                    (h = head) == null || h.waitStatus < 0) {
                Node s = node.next;
                if (s == null || s.isShared())
                    doReleaseShared();
            }
        }
    }
}
```

### releaseShared

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        // 代码来自 AQS 类（方便阅读）
        public final boolean releaseShared(int arg) {
            if (tryReleaseShared(arg)) {
                doReleaseShared();
                return true;
            }
            return false;
        }
    }
}
```

#### tryReleaseShared

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        protected final boolean tryReleaseShared(int unused) {
            Thread current = Thread.currentThread();
            if (firstReader == current) {
                // assert firstReaderHoldCount > 0;
                if (firstReaderHoldCount == 1)
                    firstReader = null;
                else
                    firstReaderHoldCount--;
            } else {
                HoldCounter rh = cachedHoldCounter;
                if (rh == null || rh.tid != getThreadId(current))
                    rh = readHolds.get();
                int count = rh.count;
                if (count <= 1) {
                    readHolds.remove();
                    if (count <= 0)
                        throw unmatchedUnlockException();
                }
                --rh.count;
            }
            for (;;) {
                int c = getState();
                int nextc = c - SHARED_UNIT;
                if (compareAndSetState(c, nextc))
                    // Releasing the read lock has no effect on readers,
                    // but it may allow waiting writers to proceed if
                    // both read and write locks are now free.
                    return nextc == 0;
            }
        }
    }
}
```

#### doReleaseShared

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {

        // 代码来自 AQS 类（方便阅读）
        private void doReleaseShared() {
            /*
             * Ensure that a release propagates, even if there are other
             * in-progress acquires/releases.  This proceeds in the usual
             * way of trying to unparkSuccessor of head if it needs
             * signal. But if it does not, status is set to PROPAGATE to
             * ensure that upon release, propagation continues.
             * Additionally, we must loop in case a new node is added
             * while we are doing this. Also, unlike other uses of
             * unparkSuccessor, we need to know if CAS to reset status
             * fails, if so rechecking.
             */
            for (;;) {
                Node h = head;
                if (h != null && h != tail) {
                    int ws = h.waitStatus;
                    if (ws == Node.SIGNAL) {
                        if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
                            continue;            // loop to recheck cases
                        unparkSuccessor(h);
                    }
                    else if (ws == 0 &&
                            !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))
                        continue;                // loop on failed CAS
                }
                if (h == head)                   // loop if head changed
                    break;
            }
        }
    }
}
```

## 示例

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Slf4j
public class HelloWorld {

    public static void main(String[] args) {
        ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
        ReentrantReadWriteLock.ReadLock readLock = lock.readLock();
        ReentrantReadWriteLock.WriteLock writeLock = lock.writeLock();

        Thread t1 = new Thread(() -> {
            writeLock.lock();
            try {
                sleep(5);
                log.info("执行完成");
            } finally {
                writeLock.unlock();
            }
        }, "t1");
        t1.start();

        sleep(1);
        Thread t2 = new Thread(() -> {
            readLock.lock();
            try {
                sleep(3);
                log.info("执行完成");
            } finally {
                readLock.unlock();
            }
        }, "t2");
        t2.start();

        sleep(1);
        Thread t3 = new Thread(() -> {
            readLock.lock();
            try {
                sleep(3);
                log.info("执行完成");
            } finally {
                readLock.unlock();
            }
        }, "t3");
        t3.start();

        sleep(1);
        Thread t4 = new Thread(() -> {
            readLock.lock();
            try {
                sleep(3);
                log.info("执行完成");
            } finally {
                readLock.unlock();
            }
        }, "t4");
        t4.start();

        sleep(1);
        Thread t5 = new Thread(() -> {
            writeLock.lock();
            try {
                sleep(5);
                log.info("执行完成");
            } finally {
                writeLock.unlock();
            }
        }, "t5");
        t5.start();

    }
}
```

输出：

```text
23.44.610 [t1] INFO 执行完成
23.47.624 [t3] INFO 执行完成
23.47.624 [t4] INFO 执行完成
23.47.624 [t2] INFO 执行完成
23.52.628 [t5] INFO 执行完成
```

![](/assets/images/java/concurrency/aqs/aqs-read-write-demo-000.png)

![](/assets/images/java/concurrency/aqs/aqs-initial-state.png)


### t1 获取锁

![](/assets/images/java/concurrency/aqs/aqs-read-write-demo-001.png)

