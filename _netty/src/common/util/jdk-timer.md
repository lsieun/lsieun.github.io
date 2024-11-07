---
title: "JDK Timer"
sequence: "103"
---

[UP](/netty.html)

## 介绍

### 基本概念

在 JDK Timer 中，涉及到四个概念：

- Task：某个任务
- TaskQueue：任务队列，将多个任务按时间先后排序
- TimerThread：定时器线程，从 TaskQueue 中取出任务进行执行
- Timer：定时器，是一个“协调者”，将 Task、TaskQueue 和 TimerThread 进行整合到一起。

![](/assets/images/netty/util/jdk-timer-concept.svg)

简单来说，一个新的 task 会提交给 Timer，Timer 会把 task 存储到 TaskQueue 中，TimerThread 从 TaskQueue 中取出 task，执行 task。

```text
             ┌─── TaskQueue ─────┼─── Task
JDK Timer ───┤
             └─── TimerThread
```

### 如何使用

```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Timer;
import java.util.TimerTask;

public class HelloWorld {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    public static void main(String[] args) throws InterruptedException {
        // main 线程：打印当前时间戳
        printTimestamp();

        // task
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                // TimerThread 线程：打印当前时间戳
                printTimestamp();
            }
        };

        // timer
        Timer timer = new Timer();

        // timer.schedule(task)
        timer.schedule(task, 1000, 3000);

        // main 线程：休息 10 秒
        Thread.sleep(10000);

        // timer.cancel()
        timer.cancel();
    }

    static void printTimestamp() {
        Thread thread = Thread.currentThread();
        LocalDateTime now = LocalDateTime.now();
        String timestamp = formatter.format(now);
        String info = String.format("%10s: %s", thread.getName(), timestamp);
        System.out.println(info);
    }
}
```

## 数据结构

### Task

在 JDK Timer 中，`TimerTask` 类表示具体的任务。

- 任务做什么：`TimerTask` 类继承自 `Runnable` 接口，我们需要实现 `run()` 方法来完成任务逻辑：

```java
public abstract class TimerTask implements Runnable {
    public abstract void run();
}
```

- 任务何时做：`TimerTask` 类中定义了 `nextExecutionTime` 和 `period` 两个变量，分别表示任务的执行时间和周期。

```java
public abstract class TimerTask implements Runnable {
    /**
     * Next execution time for this task in the format returned by
     * System.currentTimeMillis, assuming this task is scheduled for execution.
     * For repeating tasks, this field is updated prior to each task execution.
     */
    long nextExecutionTime;

    /**
     * Period in milliseconds for repeating tasks.
     * A positive value indicates fixed-rate execution.
     * A negative value indicates fixed-delay execution.
     * A value of 0 indicates a non-repeating task.
     */
    long period = 0;
}
```

- 任务状态：VIRGIN、SCHEDULED、EXECUTED、CANCELLED

![](/assets/images/netty/util/jdk-timer-task-state.svg)


```java
public abstract class TimerTask implements Runnable {
    /**
     * The state of this task, chosen from the constants below.
     */
    int state = VIRGIN;
    
    /**
     * This task has not yet been scheduled.
     */
    static final int VIRGIN = 0;

    /**
     * This task is scheduled for execution.  If it is a non-repeating task,
     * it has not yet been executed.
     */
    static final int SCHEDULED   = 1;

    /**
     * This non-repeating task has already executed (or is currently
     * executing) and has not been cancelled.
     */
    static final int EXECUTED    = 2;

    /**
     * This task has been cancelled (with a call to TimerTask.cancel).
     */
    static final int CANCELLED   = 3;
}
```

### TaskQueue

在 JDK Timer 中，`TaskQueue` 类表示任务队列，使用了二叉堆算法实现：

- `queue` 是一个数组，用于存储任务。
- `size` 用于存储当前队列中任务的数量。

```java
class TaskQueue {
    private TimerTask[] queue = new TimerTask[128];

    private int size = 0;
}
```

### TimerThread

在 JDK Timer 中，`TimerThread` 类是执行任务的线程：

- `queue`：任务队列
- `newTasksMayBeScheduled`：当任务队列为空时，是否等待添加新任务。

```java
class TimerThread extends Thread {
    /**
     * This flag is set to false by the reaper to inform us that
     * there are no more live references to our Timer object.
     * Once this flag is false and there are no more tasks in our queue,
     * there is no work left for us to do, so we terminate gracefully.
     * Note that this field is protected by queue's monitor!
     */
    boolean newTasksMayBeScheduled = true;

    /**
     * Our Timer's queue.  We store this reference in preference to
     * a reference to the Timer so the reference graph remains acyclic.
     * Otherwise, the Timer would never be garbage-collected and this
     * thread would never go away.
     */
    private TaskQueue queue;
}
```

### Timer

在 JDK Timer 中，`Timer` 类中包含 `TaskQueue` 和 `TimerThread` 两个对象：

```java
public class Timer {
    private final TaskQueue queue = new TaskQueue();

    private final TimerThread thread = new TimerThread(queue);
}
```

因此 `Timer` 类可以理解为：

```text
Timer = TaskQueue + TimerThread
```

## 实现逻辑

### 线程启动

当创建 `Timer` 对象时，会启动一个 `TimerThread` 线程：

```java
public class Timer {
    private final TaskQueue queue = new TaskQueue();

    private final TimerThread thread = new TimerThread(queue);

    public Timer(String name) {
        thread.setName(name);
        thread.start();
    }
}
```

需要注意的是，此时至少有两个线程在运行：
一个是 `TimerThread` 线程，另一个是创建 `Timer` 对象的线程（例如，`main` 线程）。

![](/assets/images/netty/util/jdk-timer-two-threads.svg)


### 任务执行

![](/assets/images/netty/util/jdk-timer-thread-mainloop-logic.svg)

在 `TimerThread` 类中，主要逻辑在 `mainLoop()` 方法中：

```java
class TimerThread extends Thread {
    boolean newTasksMayBeScheduled = true;

    private TaskQueue queue;

    public void run() {
        try {
            mainLoop();
        } finally {
            // Someone killed this Thread, behave as if Timer cancelled
            synchronized(queue) {
                newTasksMayBeScheduled = false;
                queue.clear();  // Eliminate obsolete references
            }
        }
    }

    private void mainLoop() {
        while (true) {
            try {
                TimerTask task;
                boolean taskFired;
                synchronized(queue) {
                    //=================================================================================
                    // 任务队列为空，等待任务加入
                    // Wait for queue to become non-empty
                    while (queue.isEmpty() && newTasksMayBeScheduled) {
                        queue.wait();
                    }

                    //=================================================================================
                    // 任务队列为空，退出循环
                    if (queue.isEmpty()) {
                        break; // Queue is empty and will forever remain; die
                    }

                    //=================================================================================
                    // 取出第 1 个任务
                    // Queue nonempty; look at first evt and do the right thing
                    long currentTime, executionTime;
                    task = queue.getMin();
                    synchronized(task.lock) {
                        if (task.state == TimerTask.CANCELLED) {
                            queue.removeMin();
                            continue;  // No action required, poll queue again
                        }
                        currentTime = System.currentTimeMillis();
                        executionTime = task.nextExecutionTime;
                        if (taskFired = (executionTime<=currentTime)) {
                            //=================================================================================
                            // 任务是否重复执行
                            if (task.period == 0) { // Non-repeating, remove
                                queue.removeMin();
                                task.state = TimerTask.EXECUTED;
                            } else { // Repeating task, reschedule
                                queue.rescheduleMin(
                                        task.period<0 ? currentTime   - task.period
                                                : executionTime + task.period);
                            }
                        }
                    }

                    //=================================================================================
                    // 第 1 个任务，时间未到，进行等待
                    if (!taskFired) { // Task hasn't yet fired; wait
                        queue.wait(executionTime - currentTime);
                    }
                }

                //=================================================================================
                // 第 1 个任务，时间已到，进行执行
                if (taskFired) { // Task fired; run it, holding no locks
                    task.run();
                }
            } catch(InterruptedException e) {
            }
        }
    }
}
```

### 任务提交

在 `Timer` 类中，定义了多个 `schedule()` 方法用于提交任务，它们会进一步调用 `sched()` 方法：

```java
public class Timer {
    private void sched(TimerTask task, long time, long period) {
        //=================================================================================
        // 方法参数校验
        if (time < 0) {
            throw new IllegalArgumentException("Illegal execution time.");
        }

        // Constrain value of period sufficiently to prevent numeric
        // overflow while still being effectively infinitely large.
        if (Math.abs(period) > (Long.MAX_VALUE >> 1)) {
            period >>= 1;
        }

        synchronized(queue) {
            //=================================================================================
            // 线程：状态检查
            if (!thread.newTasksMayBeScheduled)
                throw new IllegalStateException("Timer already cancelled.");

            //=================================================================================
            // 任务：参数补充
            synchronized(task.lock) {
                if (task.state != TimerTask.VIRGIN)
                    throw new IllegalStateException(
                            "Task already scheduled or cancelled");
                task.nextExecutionTime = time;
                task.period = period;
                task.state = TimerTask.SCHEDULED;
            }

            //=================================================================================
            // 队列：添加任务
            queue.add(task);

            //=================================================================================
            // 线程：阻塞唤醒
            if (queue.getMin() == task) {
                queue.notify();
            }
        }
    }
}
```

### 清理工作

在 `Timer` 类中，定义了 `threadReaper` 对象，它负责 `TimerThread` 线程的优雅退出：

```java
public class Timer {
    /**
     * This object causes the timer's task execution thread to exit gracefully
     * when there are no live references to the Timer object and no
     * tasks in the timer queue.
     * It is used in preference to a finalizer on Timer
     * as such a finalizer would be susceptible to a subclass's
     * finalizer forgetting to call it.
     */
    private final Object threadReaper = new Object() {
        protected void finalize() throws Throwable {
            synchronized(queue) {
                thread.newTasksMayBeScheduled = false;
                queue.notify(); // In case queue is empty.
            }
        }
    };
}
```

## 优缺点

### 优点

- 精确的时间

### 缺点

- 当任务数量太多时，使用二叉堆算法进行任务的添加和移除，其效率会越来越低
