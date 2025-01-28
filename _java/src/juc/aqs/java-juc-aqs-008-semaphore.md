---
title: "AQS 源码解析：Semaphore 原理"
sequence: "108"
---

## Semaphore

```java
public class Semaphore implements Serializable {
    private final Sync sync;

    public Semaphore(int permits) {
        sync = new NonfairSync(permits);
    }

    public void acquire() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }

    public void release() {
        sync.releaseShared(1);
    }
}
```

## Sync

```java
public class Semaphore implements Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        Sync(int permits) {
            setState(permits);
        }

        final int getPermits() {
            return getState();
        }
    }
}
```

### acquire

```java
public class Semaphore implements Serializable {
    public void acquire() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }
    
    abstract static class Sync extends AbstractQueuedSynchronizer {
        // 代码复制自 AQS 类（方便阅读）
        public final void acquireSharedInterruptibly(int arg) throws InterruptedException {
            if (Thread.interrupted()) {
                throw new InterruptedException();
            }

            if (tryAcquireShared(arg) < 0) {
                doAcquireSharedInterruptibly(arg);
            }
        }
    }
}
```

#### tryAcquireShared

```java
public class Semaphore implements Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        final int nonfairTryAcquireShared(int acquires) {
            for (;;) {
                int available = getState();
                int remaining = available - acquires;
                if (remaining < 0 ||
                        compareAndSetState(available, remaining))
                    return remaining;
            }
        }
    }

    static final class NonfairSync extends Sync {
        NonfairSync(int permits) {
            super(permits);
        }

        protected int tryAcquireShared(int acquires) {
            return nonfairTryAcquireShared(acquires);
        }
    }
}
```

#### doAcquireSharedInterruptibly

```java
public class Semaphore implements Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {

        // 复制自 AWS 类（方便阅读）
        private void doAcquireSharedInterruptibly(int arg) throws InterruptedException {
            final Node node = addWaiter(Node.SHARED);
            boolean failed = true;
            try {
                for (;;) {
                    final Node p = node.predecessor();
                    if (p == head) {
                        int r = tryAcquireShared(arg);
                        if (r >= 0) {
                            setHeadAndPropagate(node, r);
                            p.next = null; // help GC
                            failed = false;
                            return;
                        }
                    }
                    if (shouldParkAfterFailedAcquire(p, node) &&
                            parkAndCheckInterrupt())
                        throw new InterruptedException();
                }
            } finally {
                if (failed)
                    cancelAcquire(node);
            }
        }
    }
}
```

### release

```java
public class Semaphore implements Serializable {
    public void release() {
        sync.releaseShared(1);
    }

    abstract static class Sync extends AbstractQueuedSynchronizer {
    }
}
```

#### releaseShared

```java
public class Semaphore implements Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {

        // 复制自 AWS 类（方便阅读）
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
public class Semaphore implements Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {
        protected final boolean tryReleaseShared(int releases) {
            for (;;) {
                int current = getState();
                int next = current + releases;
                if (next < current) // overflow
                    throw new Error("Maximum permit count exceeded");
                if (compareAndSetState(current, next))
                    return true;
            }
        }
    }
}
```

#### doReleaseShared

```java
public class Semaphore implements Serializable {
    abstract static class Sync extends AbstractQueuedSynchronizer {

        // 复制自 AWS 类（方便阅读）
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
