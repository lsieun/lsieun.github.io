---
title: "线程的生命周期"
sequence: "101"
---

[UP](/java-concurrency.html)


![](/assets/images/java/thread/life-cycle-of-a-thread-in-java.jpg)

```text
                ┌─── NEW
                │
                │                                       ┌─── Ready to Run
                │                  ┌─── Runnable ───────┤
                │                  │                    └─── Running
                ├─── Alive ────────┤
Thread State ───┤                  │                    ┌─── Timed Waiting
                │                  │                    │
                │                  └─── Non-Runnable ───┼─── Waiting
                │                                       │
                │                                       └─── Blocked
                │
                └─── Terminated
```

## Life Cycle of a Thread in Java

`java.lang.Thread` 类包含了 `State` 枚举类，它包含一个线程的可能状态。

From the JVM perspective, a thread can be in one of the six states at any point of its life.

```java
public class Thread implements Runnable {
    public enum State {
        NEW,
        RUNNABLE,
        BLOCKED,
        WAITING,
        TIMED_WAITING,
        TERMINATED;
    }
}
```

- `NEW` - a newly created thread that has not yet started the execution
- `RUNNABLE` - either **running** or **ready for execution**, but it's waiting for resource allocation
- `BLOCKED` - waiting to acquire a monitor lock to enter or re-enter a `synchronized` block/method
- `WAITING` - waiting for some other thread to perform a particular action without any time limit
- `TIMED_WAITING` - waiting for some other thread to perform a specific action for a specified period
- `TERMINATED` - has completed its execution



### New

**A NEW Thread (or a Born Thread) is a thread that's been created but not yet started.**
It remains in this state until we start it using the `start()` method.

```java
public class ThreadState_001_New {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            // do something
        }, "t1");

        LogUtils.log("t1.getState(): {}", t1.getState()); // NEW
        LogUtils.log("t1.isAlive() : {}", t1.isAlive());  // false
    }
}
```

### Runnable

When we've created a new thread and called the `start()` method on that,
it's moved from `NEW` to `RUNNABLE` state.
Threads in this state are either **running** or **ready to run**,
but they're waiting for resource allocation from the system.

In a multithreaded environment,
the Thread-Scheduler (which is part of JVM) allocates a fixed amount of time to each thread.
So it runs for a particular amount of time, then relinquishes the control to other `RUNNABLE` threads.

```java
public class ThreadState_002_Runnable {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                Thread.yield();
            }
        }, "t1");
        t1.start();

        sleep(1);

        LogUtils.log("t1.getState(): {}", t1.getState()); // RUNNABLE
        LogUtils.log("t1.isAlive() : {}", t1.isAlive());  // true

        t1.interrupt();
    }
}
```

### Waiting

When a thread is in `WAITING` state, it is waiting for an action from another thread.

将线程从 `RUNNABLE` 状态切换到 `WAITING` 状态，可以调用以下三个方法中的一个：

- `Object.wait()`
- `Thread.join()`
- `LockSupport.park()`


When a thread calls the `wait()` method on an `Object`,
it is waiting for another thread to call `notify()` or `notifyAll()` on the same `Object`.

```java
public class ThreadState_003_Waiting_A_Join {

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            sleep(3);
        }, "t1");
        t1.start();

        Thread t2 = new Thread(() -> {
            try {
                t1.join();
            } catch (InterruptedException ignored) {
            }
        }, "t2");
        t2.start();

        sleep(1);

        LogUtils.log("t2.getState(): {}", t2.getState()); // WAITING
        LogUtils.log("t2.isAlive() : {}", t2.isAlive());  // true
    }
}
```

When a thread calls the `join()` method on a thread object `t`, it is waiting for that thread `t` to terminate.

```java
public class ThreadState_003_Waiting_B_ObjectWait {
    public static void main(String[] args) {
        Object obj = new Object();
        Thread t1 = new Thread(() -> {
            try {
                synchronized (obj) {
                    obj.wait();
                }
            } catch (InterruptedException ignored) {
            }
        }, "t1");
        t1.start();

        sleep(1);

        LogUtils.log("t1.getState(): {}", t1.getState()); // WAITING
        LogUtils.log("t1.isAlive() : {}", t1.isAlive());  // true

        synchronized (obj) {
            obj.notify();
        }
    }
}
```

When a thread is in the `WAITING` state due to a call to `LockSupport.park()`,
then a corresponding `LockSupport.unpark()` method can bring the thread back to the `RUNNABLE` state.

```java
import java.util.concurrent.locks.LockSupport;

public class ThreadState_003_Waiting_C_Park {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            LogUtils.log("before park");
            LockSupport.park();
            LogUtils.log("after park");
        }, "t1");
        t1.start();

        sleep(1);

        LogUtils.log("t1.getState(): {}", t1.getState()); // WAITING
        LogUtils.log("t1.isAlive() : {}", t1.isAlive());  // true

        LockSupport.unpark(t1);
    }
}
```

### Timed Waiting

When a thread is waiting for an action from another thread, but only up to a specified amount of time,
then the thread is in `TIMED_WAITING` state.

将线程从 `RUNNABLE` 状态转换成 `TIMED_WAITING` 状态，可以调用以下方法：

- `Object.wait(long timeout)`, `Object.wait(long timeout, int nanos)`
- `Thread.sleep(long millis)`, `Thread.sleep(long millis, int nanos)`
- `Thread.join(long millis)`, `Thread.join(long millis, int nanos)`
- `LockSupport.parkNanos(long nanos)`, `LockSupport.parkUntil(long deadline)`


```java
public class ThreadState_004_TimedWaiting {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            sleep(3);
        }, "t1");
        t1.start();

        sleep(1);

        LogUtils.log("t1.getState(): {}", t1.getState()); // TIMED_WAITING
        LogUtils.log("t1.isAlive() : {}", t1.isAlive());  // true
    }
}
```

### Blocked

A thread is in the `BLOCKED` state when it's currently not eligible to run.
**It enters this state when it is waiting for a monitor lock and
is trying to access a section of code that is locked by some other thread.**

```java
public class ThreadState_005_Blocked {
    public static void main(String[] args) {
        Object o = new Object();

        Thread t1 = new Thread(() -> {
            synchronized (o) {
                LogUtils.log("lock");
                sleep(5);
            }
        }, "t1");
        t1.start();

        sleep(1);

        Thread t2 = new Thread(() -> {
            synchronized (o) {
                LogUtils.log("lock");
            }
        }, "t2");
        t2.start();

        sleep(1);

        LogUtils.log("t2.getState(): {}", t2.getState()); // BLOCKED
        LogUtils.log("t2.isAlive() : {}", t2.isAlive());  // true
    }
}
```

### Terminated

This is the state of a dead thread.
**It's in the `TERMINATED` state when it has either finished execution or was terminated abnormally.**

```java
public class ThreadState_006_Terminated {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            // do something
        }, "t1");
        t1.start();

        sleep(1);

        LogUtils.log("t1.getState(): {}", t1.getState()); // TERMINATED
        LogUtils.log("t1.isAlive() : {}", t1.isAlive());  // false
    }
}
```

## Alive

In addition to the **thread state**,
we can check the `isAlive()` method to determine if the thread is alive or not.

```text
Assert.assertFalse(t1.isAlive());
```

**Put simply, a thread is alive if and only if it has been started and has not yet died.**

## Reference

- [Life Cycle of a Thread in Java](https://www.baeldung.com/java-thread-lifecycle)
