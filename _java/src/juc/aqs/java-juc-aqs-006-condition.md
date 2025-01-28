---
title: "AQS 源码解析：条件变量实现原理"
sequence: "106"
---

## 示例

```java
import java.util.Stack;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockWithCondition {

    Stack<String> stack = new Stack<>();
    int CAPACITY = 5;

    ReentrantLock lock = new ReentrantLock();
    Condition stackEmptyCondition = lock.newCondition();
    Condition stackFullCondition = lock.newCondition();

    public void pushToStack(String item) {
        try {
            lock.lock();
            while (stack.size() == CAPACITY) {
                stackFullCondition.await();
            }
            stack.push(item);
            stackEmptyCondition.signalAll();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();
        }
    }

    public String popFromStack() {
        try {
            lock.lock();
            while (stack.size() == 0) {
                stackEmptyCondition.await();
            }
            return stack.pop();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            stackFullCondition.signalAll();
            lock.unlock();
        }
    }
}
```

注意：线程，不能直接调用 await 方法（`stackFullCondition.await()`），需要先获取锁（`lock.lock()`）才行。

## ReentrantLock

```java
public class ReentrantLock implements Lock, Serializable {
    public Condition newCondition() {
        return sync.newCondition();
    }

    abstract static class Sync extends AbstractQueuedSynchronizer {
        final ConditionObject newCondition() {
            return new ConditionObject();
        }
    }
}
```

## AbstractQueuedSynchronizer

### ConditionObject

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        private transient Node firstWaiter;
        private transient Node lastWaiter;
    }
}
```

### await

#### await

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        public final void await() throws InterruptedException {
            if (Thread.interrupted()) {
                throw new InterruptedException();
            }

            // 创建一个 node 代表当前获取锁的线程
            Node node = addConditionWaiter();
            
            // 让当前线程释放锁
            int savedState = fullyRelease(node);
            
            int interruptMode = 0;
            
            // 在 park 之前，当前 node 不在 AQS 队列，而是在 ConditionObject 队列；
            // 在 unpark 之后，当前 node 就会加入 AQS 队列，会退出 while 循环
            while (!isOnSyncQueue(node)) {
                LockSupport.park(this);
                if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
                    break;
            }
            
            // 在 AQS 队列中，等待着获取“锁”（回归 AQS 的正常处理逻辑）
            if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
                interruptMode = REINTERRUPT;
            if (node.nextWaiter != null) // clean up if cancelled
                unlinkCancelledWaiters();
            if (interruptMode != 0)
                reportInterruptAfterWait(interruptMode);
        }

    }
}
```

#### addConditionWaiter

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        private Node addConditionWaiter() {
            // 第 1 步，找到最后一个 Node
            Node t = lastWaiter;
            
            // （可以忽略）
            // If lastWaiter is cancelled, clean out.
            if (t != null && t.waitStatus != Node.CONDITION) {
                unlinkCancelledWaiters();
                t = lastWaiter;
            }

            // 第 2 步，新建一个 node
            Node node = new Node(Thread.currentThread(), Node.CONDITION);
            
            // 第 3 步，将 node 加入 ConditionObject 队列
            if (t == null) {
                // 如果 ConditionObject 队列是空的
                firstWaiter = node;
            }
            else {
                // 如果 ConditionObject 队列不是空的，就放到末尾
                t.nextWaiter = node;
            }
            
            // 第 4 步，更新 lastWaiter
            lastWaiter = node;
            return node;
        }
    }
}
```

#### fullyRelease

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        final int fullyRelease(Node node) {
            boolean failed = true;
            try {
                // 如果是重入锁，并且进行了多次重入，这个值就不是 1
                // 例如，这个 state 的值可能是 5，表示锁重入了 5 次
                int savedState = getState();
                if (release(savedState)) {
                    failed = false;
                    
                    // 这个 state 状态进行返回，是为了后续再恢复
                    return savedState;
                } else {
                    throw new IllegalMonitorStateException();
                }
            } finally {
                if (failed)
                    node.waitStatus = Node.CANCELLED;
            }
        }
    }
}
```

#### isOnSyncQueue

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    // 判断 node 是在 AQS 队列
    final boolean isOnSyncQueue(Node node) {
        if (node.waitStatus == Node.CONDITION || node.prev == null) {
            return false;
        }
        
        // 在 AQS 队列，使用 next；在 ConditionObject 上，使用 nextWaiter
        if (node.next != null) { // If has successor, it must be on queue
            return true;
        }
            
        /*
         * node.prev can be non-null, but not yet on queue because
         * the CAS to place it on queue can fail. So we have to
         * traverse from tail to make sure it actually made it.  It
         * will always be near the tail in calls to this method, and
         * unless the CAS failed (which is unlikely), it will be
         * there, so we hardly ever traverse much.
         */
        return findNodeFromTail(node);
    }

    private boolean findNodeFromTail(Node node) {
        // 到队列尾部
        Node t = tail;
        
        // 逐个向前查找
        for (;;) {
            if (t == node)
                return true;
            if (t == null)
                return false;
            t = t.prev;
        }
    }
}
```

#### await - 阻塞

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        public final void await() throws InterruptedException {
            if (Thread.interrupted()) {
                throw new InterruptedException();
            }

            // 创建一个 node 代表当前获取锁的线程
            Node node = addConditionWaiter();
            
            // 让当前线程释放锁
            int savedState = fullyRelease(node);
            
            int interruptMode = 0;
            
            // 在 park 之前，当前 node 不在 AQS 队列，而是在 ConditionObject 队列；
            // 在 unpark 之后，当前 node 就会加入 AQS 队列，会退出 while 循环
            while (!isOnSyncQueue(node)) {
                // 在这里阻塞
                LockSupport.park(this);
                if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
                    break;
            }
            
            // 在 AQS 队列中，等待着获取“锁”（回归 AQS 的正常处理逻辑）
            if (acquireQueued(node, savedState) && interruptMode != THROW_IE)
                interruptMode = REINTERRUPT;
            if (node.nextWaiter != null) // clean up if cancelled
                unlinkCancelledWaiters();
            if (interruptMode != 0)
                reportInterruptAfterWait(interruptMode);
        }

    }
}
```

### signal

#### signal

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        public final void signal() {
            // 如果当前线程不是获取锁的线程
            if (!isHeldExclusively()) {
                throw new IllegalMonitorStateException();
            }

            // 找到 ConditionObject 上的第一个 node
            Node first = firstWaiter;
            if (first != null) {
                doSignal(first);
            }
        }

        public final void signalAll() {
            if (!isHeldExclusively()) {
                throw new IllegalMonitorStateException();
            }

            // 找到 ConditionObject 上的第一个 node
            Node first = firstWaiter;
            if (first != null) {
                doSignalAll(first);
            }
        }
    }
}
```

#### doSignal

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        private void doSignal(Node first) {
            do {
                // 更新 firstWaiter <-- first.nextWaiter
                if ( (firstWaiter = first.nextWaiter) == null) {
                    lastWaiter = null;
                }
                
                // 将 first 与后续的 node 断开连接
                first.nextWaiter = null;
            } 
            
            while (
                    // 将 first 转移到 AQS 队列
                    !transferForSignal(first) && 
                            // 更新 first <-- firstWaiter
                            (first = firstWaiter) != null);
        }

        private void doSignalAll(Node first) {
            // 将 ConditionObject 队列清空
            lastWaiter = firstWaiter = null;
            do {
                // next 是 first 的后一个节点
                Node next = first.nextWaiter;
                // 断开 first 与 next 之间的关系
                first.nextWaiter = null;
                // 将 first 转移到 AQS 队列
                transferForSignal(first);
                
                // 让 first 成为 next 
                first = next;
            } while (first != null);
        }
    }
}
```

#### transferForSignal

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        final boolean transferForSignal(Node node) {
            /*
             * If cannot change waitStatus, the node has been cancelled.
             */
            // 第 1 步，将 Node 的状态由 CONDITION 修改为 0
            // 另外，加入 AQS 队列尾部的 Node 的状态都是 0
            if (!compareAndSetWaitStatus(node, Node.CONDITION, 0))
                return false;

            /*
             * Splice onto queue and try to set waitStatus of predecessor to
             * indicate that thread is (probably) waiting. If cancelled or
             * attempt to set waitStatus fails, wake up to resync (in which
             * case the waitStatus can be transiently and harmlessly wrong).
             */
            // 第 2 步，将 node 加入 AQS 队列的末尾
            Node p = enq(node);
            
            // 第 3 步，将 AQS 队列倒数第二个 node 的 waitStatus 设置为 SIGNAL
            int ws = p.waitStatus;
            if (ws > 0 || !compareAndSetWaitStatus(p, ws, Node.SIGNAL)) {
                // 第 4 步，将 node 对应的 thread 唤醒
                LockSupport.unpark(node.thread);
            }
                
            return true;
        }
    }
}
```

#### await - 线程唤醒

```java
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements Serializable {
    public class ConditionObject implements Condition, Serializable {
        public final void await() throws InterruptedException {
            if (Thread.interrupted()) {
                throw new InterruptedException();
            }

            // 创建一个 node 代表当前获取锁的线程
            Node node = addConditionWaiter();
            
            // 让当前线程释放锁
            int savedState = fullyRelease(node);
            
            int interruptMode = 0;
            
            // 在 park 之前，当前 node 不在 AQS 队列，而是在 ConditionObject 队列；
            // 在 unpark 之后，当前 node 就会加入 AQS 队列，会退出 while 循环
            // 如果别的 thread，不是进行了 signal，而是进行了 interrupt，代码仍会在 while 中进行 park
            while (!isOnSyncQueue(node)) {
                LockSupport.park(this);
                
                // 唤醒之后，从这儿继续执行
                if ((interruptMode = checkInterruptWhileWaiting(node)) != 0)
                    break;
            }
            
            // 在 AQS 队列中，等待着获取“锁”（回归 AQS 的正常处理逻辑）
            if (acquireQueued(node, savedState) && interruptMode != THROW_IE) {
                interruptMode = REINTERRUPT;
            }

            if (node.nextWaiter != null) { // clean up if cancelled
                unlinkCancelledWaiters();
            }
            if (interruptMode != 0) {
                reportInterruptAfterWait(interruptMode);
            }
        }

        private int checkInterruptWhileWaiting(Node node) {
            return Thread.interrupted() ?
                    (transferAfterCancelledWait(node) ? THROW_IE : REINTERRUPT) :
                    0;
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
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;
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
}
```
