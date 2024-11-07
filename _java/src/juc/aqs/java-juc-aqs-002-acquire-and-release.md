---
title: "AQS 源码解析：acquire + release"
sequence: "102"
---

## 获取锁和释放锁

![](/assets/images/java/concurrency/aqs/aqs-acquire-release-mind-map.png)

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    private volatile int state;
    private transient volatile Node head;
    private transient volatile Node tail;

    // 方法重写逻辑
    public final void acquire(int arg) {
        // 第 1 步，尝试获取“锁”
        if (tryAcquire(arg)) {
            // 如果成功了，则返回
            return;
        }
        // 走到这儿，说明：当前 thread 获取锁失败了

        // 第 2 步，添加一个 Node，代表当前线程，并加入等待队列
        Node node = addWaiter(Node.EXCLUSIVE);
        
        // 第 3 步，进入队列中，循环竞争“锁”（阻塞、唤醒）
        boolean isInterrupted = acquireQueued(node, arg);
        
        // 第 4 步，处理“打断”逻辑
        if (isInterrupted) {
            selfInterrupt();
        }
    }
    
    public final boolean release(int arg) {
        // 尝试释放锁
        if (tryRelease(arg)) {
            // 队列头节点
            Node h = head;
            // 队列不为 null
            // waitStatus == Node.SIGNAL 才需要 unpark
            if (h != null && h.waitStatus != 0)
                // unpark AQS 中等待的线程
                unparkSuccessor(h);
            return true;
        }
        return false;
    }
}
```

### 获取锁

#### acquire

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public final void acquire(int arg) {
             // 1 
        if (!tryAcquire(arg) &&
                // 3          // 2
                acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }

    static void selfInterrupt() {
        Thread.currentThread().interrupt();
    }
}
```

方法重写逻辑：

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {

    public final void acquire(int arg) {
        // 第 1 步，尝试获取“锁”
        if (tryAcquire(arg)) {
            // 如果成功了，则返回
            return;
        }
        // 走到这儿，说明：当前 thread 获取锁失败了

        // 第 2 步，添加一个 Node，代表当前线程，并加入等待队列
        Node node = addWaiter(Node.EXCLUSIVE);
        
        // 第 3 步，进入队列中，循环竞争“锁”（阻塞、唤醒）
        boolean isInterrupted = acquireQueued(node, arg);
        
        // 第 4 步，处理“打断”逻辑
        if (isInterrupted) {
            // 如果打断状态为 true
            selfInterrupt();
        }
    }

    static void selfInterrupt() {
        // 重新产生一次中断
        Thread.currentThread().interrupt();
    }
}
```

#### addWaiter

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    private Node addWaiter(Node mode) {
        // 第 1 步，创建一个 Node
        Node node = new Node(Thread.currentThread(), mode);
        
        // 第 2 步，将 Node 加入 AQS 队列
        // Try the fast path of enq; backup to full enq on failure
        Node pred = tail;
        // 如果 tail 不为 null, cas 尝试将 Node 对象加入 AQS 队列尾部
        if (pred != null) {
            node.prev = pred;
            if (compareAndSetTail(pred, node)) {
                // 双向链表
                pred.next = node;
                return node;
            }
        }
        
        // 尝试将 Node 加入 AQS
        enq(node);
        return node;
    }
    
    private Node enq(final Node node) {
        for (;;) {
            Node t = tail;
            if (t == null) { // Must initialize
                // 还没有任何 Node 存在，设置 head 为哨兵节点（不对应线程，状态为 0）
                if (compareAndSetHead(new Node()))
                    tail = head;
            } else {
                // cas 尝试将 Node 对象加入 AQS 队列尾部
                node.prev = t;
                if (compareAndSetTail(t, node)) {
                    t.next = node;
                    return t;
                }
            }
        }
    }
}
```

#### acquireQueued

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            for (;;) {
                final Node p = node.predecessor();
                // 上一个节点是 head，表示轮到自己（当前线程对应的 node）了，尝试获取
                if (p == head && tryAcquire(arg)) {
                    // 获取成功, 设置自己（当前线程对应的 node）为 head
                    setHead(node);
                    // 上一个节点
                    p.next = null; // help GC
                    failed = false;
                    // 还是需要获得锁后, 才能返回打断状态
                    return interrupted;
                }
                
                // 判断是否应当 park
                if (shouldParkAfterFailedAcquire(p, node) &&
                    // park 等待, 此时 Node 的状态被置为 Node.SIGNAL
                    parkAndCheckInterrupt())
                    // 如果是因为 interrupt 被唤醒，返回打断状态为 true
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
    
    private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
        // 获取上一个节点的状态
        int ws = pred.waitStatus;
        if (ws == Node.SIGNAL) {
            /*
             * This node has already set status asking a release
             * to signal it, so it can safely park.
             */
            // 上一个节点都在阻塞, 那么自己也阻塞好了
            return true;
        }

        // > 0 表示取消状态
        if (ws > 0) {
            // 上一个节点取消，那么重构删除前面所有取消的节点，返回到外层循环重试
            /*
             * Predecessor was cancelled. Skip over predecessors and
             * indicate retry.
             */
            do {
                node.prev = pred = pred.prev;
            } while (pred.waitStatus > 0);
            pred.next = node;
        } else {
            /*
             * waitStatus must be 0 or PROPAGATE.  Indicate that we
             * need a signal, but don't park yet.  Caller will need to
             * retry to make sure it cannot acquire before parking.
             */
            // 这次还没有阻塞
            // 但下次如果重试不成功，则需要阻塞，这时需要设置上一个节点状态为 Node.SIGNAL
            compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
        }
        return false;
    }
    
    private final boolean parkAndCheckInterrupt() {
        // 阻塞当前线程
        // 如果打断标记已经是 true, 则 park 会失效
        LockSupport.park(this);
        // 这里调用 Thread.interrupted() 会获取“中断”状态，也会清除“中断”状态，
        // 清除“中断”标记的目的，是为了下一次能够再次 park 住
        return Thread.interrupted();
    }
}
```

注意：是否需要 `unpark` 是由当前节点的前驱节点的 `waitStatus == Node.SIGNAL` 来决定，而不是本节点的 `waitStatus` 决定。

### 释放锁

#### release

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public final boolean release(int arg) {
        if (tryRelease(arg)) {
            Node h = head;
            if (h != null && h.waitStatus != 0)
                unparkSuccessor(h);
            return true;
        }
        return false;
    }
}
```

#### unparkSuccessor

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    private void unparkSuccessor(Node node) {
        /*
         * If status is negative (i.e., possibly needing signal) try
         * to clear in anticipation of signalling.  It is OK if this
         * fails or if status is changed by waiting thread.
         */
        // 第 1 步，将 node 的 waitStatus 修改为 0
        int ws = node.waitStatus;
        if (ws < 0) {
            compareAndSetWaitStatus(node, ws, 0);
        }

        /*
         * Thread to unpark is held in successor, which is normally
         * just the next node.  But if cancelled or apparently null,
         * traverse backwards from tail to find the actual
         * non-cancelled successor.
         */
        // 第 2 步，找到需要 unpark 的节点。但是，当前 node 从 AQS 队列中脱离，是由唤醒节点完成的
        Node s = node.next;
        if (s == null || s.waitStatus > 0) {
            s = null;
            // 不考虑已取消的节点, 从 AQS 队列从后至前找到队列最前面需要 unpark 的节点
            for (Node t = tail; t != null && t != node; t = t.prev)
                if (t.waitStatus <= 0)
                    s = t;
        }
        
        // 第 3 步，唤醒 thread
        if (s != null) {
            LockSupport.unpark(s.thread);
        }
    }
}
```

## 过程

### 初始状态

```java
public abstract class AbstractOwnableSynchronizer implements Serializable {
    private transient Thread exclusiveOwnerThread;
}
```

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    private volatile int state;
    private transient volatile Node head;
    private transient volatile Node tail;
}
```

- 最初始状态

![](/assets/images/java/concurrency/aqs/aqs-demo-001.png)

### t0 获取锁

```text
AbstractQueuedSynchronizer.java --> acquire --> tryAcquire
```

![](/assets/images/java/concurrency/aqs/aqs-method-acquire-invoke-try-acquire.png)

- t0 线程：获取锁，修改 `exclusiveOwnerThread` 和 `state`

![](/assets/images/java/concurrency/aqs/aqs-demo-002.png)

### t1 获取锁失败后

```text
AbstractQueuedSynchronizer.java --> acquire --> addWaiter
```

- t1 线程：获取锁失败后，添加 `node0` 节点

![](/assets/images/java/concurrency/aqs/aqs-demo-003.png)

- t1 线程：将 `node1` 节点加入 AQS 队列

![](/assets/images/java/concurrency/aqs/aqs-demo-004.png)

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> shouldParkAfterFailedAcquire & parkAndCheckInterrupt
```

![](/assets/images/java/concurrency/aqs/aqs-method-acquireQueued-invoke-park.png)

- t1 线程：进入阻塞状态

![](/assets/images/java/concurrency/aqs/aqs-demo-005.png)

### t2 获取锁失败后

```text
AbstractQueuedSynchronizer.java --> acquire --> addWaiter
```

- t2 线程：将 `node2` 加入 AQS 队列

![](/assets/images/java/concurrency/aqs/aqs-demo-006.png)

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> shouldParkAfterFailedAcquire & parkAndCheckInterrupt
```

- t2 线程：进入阻塞状态

![](/assets/images/java/concurrency/aqs/aqs-demo-007.png)

### t3 获取锁失败后

```text
AbstractQueuedSynchronizer.java --> acquire --> addWaiter
```

- t3 线程：将 `node3` 加入 AQS 队列

![](/assets/images/java/concurrency/aqs/aqs-demo-008.png)

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> shouldParkAfterFailedAcquire & parkAndCheckInterrupt
```

- t3 线程：进入阻塞状态

![](/assets/images/java/concurrency/aqs/aqs-demo-009.png)

### t0 释放锁

```text
AbstractQueuedSynchronizer.java --> release --> tryRelease
```

- t0 线程：释放锁，修改 `exclusiveOwnerThread` 和 `state`

![](/assets/images/java/concurrency/aqs/aqs-demo-010.png)

```text
AbstractQueuedSynchronizer.java --> release --> unparkSuccessor
```

- t0 线程：唤醒 t1 线程

![](/assets/images/java/concurrency/aqs/aqs-demo-011.png)

### t1 获取锁

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> tryAcquire
```

- t1 线程：获取锁，修改 `exclusiveOwnerThread` 和 `state`

![](/assets/images/java/concurrency/aqs/aqs-demo-012.png)

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> setHead
```

- t1 线程：更换 AQS 队列的 `head`

![](/assets/images/java/concurrency/aqs/aqs-demo-013.png)

```text
整理一下
```

![](/assets/images/java/concurrency/aqs/aqs-demo-014.png)

### t1 释放锁

```text
AbstractQueuedSynchronizer.java --> release --> tryRelease
```

- t1 线程：释放锁，修改 `exclusiveOwnerThread` 和 `state`

![](/assets/images/java/concurrency/aqs/aqs-demo-015.png)

```text
AbstractQueuedSynchronizer.java --> release --> unparkSuccessor
```

- t1 线程：唤醒 t2 线程

![](/assets/images/java/concurrency/aqs/aqs-demo-016.png)

### t2 获取锁

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> tryAcquire
```

- t2 线程：获取锁，修改 `exclusiveOwnerThread` 和 `state`

![](/assets/images/java/concurrency/aqs/aqs-demo-017.png)

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> setHead
```

- t2 线程：更换 AQS 队列的 `head`

![](/assets/images/java/concurrency/aqs/aqs-demo-018.png)

```text
整理一下
```

![](/assets/images/java/concurrency/aqs/aqs-demo-019.png)


### t2 释放锁

```text
AbstractQueuedSynchronizer.java --> release --> tryRelease
```

- t2 线程：释放锁，修改 `exclusiveOwnerThread` 和 `state`

![](/assets/images/java/concurrency/aqs/aqs-demo-020.png)

```text
AbstractQueuedSynchronizer.java --> release --> unparkSuccessor
```

- t2 线程：唤醒 t3 线程

![](/assets/images/java/concurrency/aqs/aqs-demo-021.png)

### t3 获取锁

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> tryAcquire
```

- t3 线程：获取锁，修改 `exclusiveOwnerThread` 和 `state`

![](/assets/images/java/concurrency/aqs/aqs-demo-022.png)

```text
AbstractQueuedSynchronizer.java --> acquire --> acquireQueued --> setHead
```

- t3 线程：更换 AQS 队列的 `head`

![](/assets/images/java/concurrency/aqs/aqs-demo-023.png)

```text
整理一下
```

![](/assets/images/java/concurrency/aqs/aqs-demo-024.png)

### t3 释放锁

```text
AbstractQueuedSynchronizer.java --> release --> tryRelease
```

- t3 线程：释放锁，修改 `exclusiveOwnerThread` 和 `state`

![](/assets/images/java/concurrency/aqs/aqs-demo-025.png)

### 结束状态

- 最终状态

![](/assets/images/java/concurrency/aqs/aqs-demo-026.png)
