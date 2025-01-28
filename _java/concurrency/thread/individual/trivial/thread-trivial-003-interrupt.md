---
title: "interrupt"
sequence: "103"
---

[UP](/java-concurrency.html)


## interrupt 停止标记法

### interrupt 中断方法介绍

熟悉这种方法前必须先了解一组 API

- public void interrupt() 中断线程
- public static boolean interrupted() 测试当前线程是否中断
- public boolean isInterrupted() 测试当前线程是否中断

### 代码解析中断判断方法

#### interrupted

```java
public class ThreadInterruption_A_Flag {
    public static void main(String[] args) {
        // 中断线程
        Thread.currentThread().interrupt();
        // 测试线程是否是中断状态，执行后将中断标志更改为 false

        System.out.println(Thread.interrupted()); // true
        System.out.println(Thread.interrupted()); // false
        System.out.println(Thread.interrupted()); // false
    }
}
```

#### isInterrupted

```java
public class ThreadInterruption_B_Flag {
    public static void main(String[] args) {
        // 中断线程
        Thread.currentThread().interrupt();
        // isInterrupted：测试线程是否是中断状态，执行后不更改状态标志
        // true
        System.out.println(Thread.currentThread().isInterrupted());
        // true
        System.out.println(Thread.currentThread().isInterrupted());
        // true
        System.out.println(Thread.currentThread().isInterrupted());
    }
}
```

### 中断程序如何实现

其实 interrupt 中断方法和标志位法原理相似，但标识变量不需要自己定义

```java
public class StopThread4 {
    public static void main(String[] args) throws InterruptedException {
        InterruptThread thread = new InterruptThread();

        thread.start();
        Thread.sleep(500);
        thread.stop();
    }
}

class InterruptThread {
    public Thread thread;

    public void start() {
        thread = new Thread(() -> {
            while (!thread.isInterrupted()) {
                System.out.println("do...something");
            }
        });
        thread.start();
    }

    public void stop() {
        thread.interrupt();
    }
}
```

### interrupt 中断方法的特性

通过 `interrupt` 方法的文档可知，如果在线程阻塞时调用中断方法会抛出异常，同时清理中断状态

```text
If this thread is blocked in an invocation of
the wait(), wait(long), or wait(long, int) methods of the Object class,
or of the join(), join(long), join(long, int), sleep(long), or sleep(long, int) methods of this class,
then its interrupt status will be cleared and it will receive an InterruptedException.
```

```java
import java.util.concurrent.TimeUnit;

public class StopThread5 {
    public static void main(String[] args) throws InterruptedException {
        InterruptThread1 taskCase3 = new InterruptThread1();
        taskCase3.start();
        Thread.sleep(3000);
        taskCase3.stop();
    }
}

class InterruptThread1 {
    private Thread thread;

    public void start() {
        thread = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    System.out.println("doSomething");
                    TimeUnit.MICROSECONDS.sleep(1);
                } catch (InterruptedException e) {
                    // 重置中断标志位为 true
                    // thread.interrupt();
                    e.printStackTrace();
                    System.out.println("抛出中断异常，中断程序");
                }
            }
        });
        thread.start();
    }

    public void stop() {
        thread.interrupt();
    }
}
```

注意：从 jdk 文档可知，如果 interrupt 中断的是阻塞的线程，那么就会导致抛出异常 InterruptedException，
并且会清理中断标志位，所以如上代码是一个死循环，如何解决呢？
就是要重置标识位 `thread.interrupt();`，catch 异常后要重置标识位即可解决问题

### 思考

现在可以了解到如果是线程阻塞然后中断就会抛出异常，那么假设线程先 interrupt 中断后再去阻塞会怎么样呢？

```java
public class StopThread6 {
    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(() -> {
            try {
                // 数值尽可能的大
                for (int i = 0; i < 1000000; i++) {
                    System.out.println("i=" + (i + 1));
                }
                System.out.println("开始阻塞");
                Thread.sleep(200);
                System.out.println("阻塞完毕");
            } catch (InterruptedException e) {
                System.out.println("中断报错 ·······");
                e.printStackTrace();
            }
        });

        thread.start();
        thread.interrupt();
    }
}
```

结论：如果线程先中断然后进入阻塞同样会抛出异常

## 打断

### 打断阻塞线程

### 打断正常运行的线程

## Thread Interruption

When you set off a thread to go free running,
you always have the power to interrupt what the thread is doing by using the `interrupt()` method.
Thread interruption in Java is done in a really gentle way.
No matter what the target thread is doing, it always has an elegant way out.

Imagine while the target thread is crunching some hard numbers diligently,
another thread, thinking the target thread has worked for an unreasonably long time and should be interrupted,
calls the `interrupt()` method on the target thread.
This interruption, however, is more like a reminder.
What the interrupting thread does is to set an internal flag called the **interrupt status**.
The interrupted thread can check its interrupt status
by using either the `isInterrupted()` method or the `interrupted()` method
(the difference is that the `isInterrupted()` method will not clear the interrupt status
while the `interrupted()` method will reset the interrupt status to `false`).
It is actually entirely up to the interrupted thread to determine what to do
if it finds out that the flag for interrupt status is set.
Usually the interrupted thread does some **cleaning up work** before it terminate itself.
Below is an example of how to interrupt a running thread:

```text
Thread t1 = new Thread(()-> {
    while (true) {
        if (Thread.currentThread().interrupted()) {
            ... // clean up a bit before breaking from the loop
            break;
        }
        ... // crunch some numbers
    }
});
t1.start();

Thread.sleep(5000);
t1.interrupt();
```

In the above, thread `t1` is allowed to constantly crunch number in a loop for 5 seconds
before it finds out about being interrupted and exits the loop.
Note the kind of freedom `t1` is given to handle its own fate in case of an interruption.

Interruption can also be given to **a waiting thread** — a thread that is blocked
by calling one of the `wait()`, `join()`, `sleep()` methods
(including the versions with parameters for duration of time).
In this case, an invocation of the `interrupt()` method on the waiting target thread
causes it to receive an `InterruptedException`.
In addition, the interrupt status flag is reset to `false`.
For this reason, when an `InterruptedException` is caught by a waiting thread,
it is usually a good idea to invoke the `interrupt()` method again to set the interrupt status,
making the next check for `isInterrupted()` return `true`.
This pattern is what is known as **two phase termination**, as illustrated in the code below:

```text
Thread t1 = new Thread(()-> {
    while (true) {
        if (Thread.currentThread().isInterrupted()) {
           ... // clean up a bit
           break;
        }
        ... // do this every second
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            // without the following line, cannot break from the loop
            Thread.currentThread().interrupt(); // IMPORTANT!
        }
    }
});
t1.start();

Thread.sleep(5000);
t1.interrupt();
```
