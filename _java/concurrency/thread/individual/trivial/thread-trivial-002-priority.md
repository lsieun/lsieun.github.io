---
title: "线程的优先级"
sequence: "102"
---

[UP](/java-concurrency.html)


You, as a programmer, can determine when to start a thread by calling the `start()` method.
After that, when a thread actually gets to run on CPU is out of your control.
On a regular machine, there will always be many processes and threads ready to run.
The operating system scheduler determines which thread has the right to use CPU at which time slice.
A higher priority thread usually has a better chance to use the CPU than a lower priority thread.
However, the OS scheduler is like a teenager kid, do not even think about controlling it,
the best you can do is to give your opinions.
Setting priorities for threads is simply a suggestion to the scheduler, the scheduler may or may not consider it.

在 Java 中，优先级（也称为优先级值）是在执行时决定线程运行顺序的一个重要因素。
但是，并不是说优先级值越大，线程的优先级就越高。

```java
public class Thread implements Runnable {
    // The minimum priority that a thread can have.
    public static final int MIN_PRIORITY = 1;
    // The default priority that is assigned to a thread.
    public static final int NORM_PRIORITY = 5;
    // The maximum priority that a thread can have.
    public static final int MAX_PRIORITY = 10;
}
```

实际上，Java 中的线程优先级被划分为 10 个级别，从最低的 1 到最高的 10。
当多个线程都处于就绪状态时，系统会根据线程的优先级来选择首先执行哪个线程。
优先级越高的线程会比优先级低的线程更早地获得执行权。

具体来说，Java 中的线程优先级有以下特点：

- 优先级值越高的线程在竞争 CPU 资源时具有更高的优先级。
- 线程的优先级可以在程序运行时动态地改变。
- 线程的优先级只是一种建议，并不保证一定会按照优先级的高低来执行线程。也就是说，即使一个线程的优先级高于其他线程，它也不一定会比其他线程更早地获得执行权。
- 在 Java 中，可以通过 `Thread.setPriority()` 方法来设置线程的优先级。

需要注意的是，虽然线程的优先级可以影响线程的执行顺序，但它并不是决定性的因素。
线程的执行顺序还会受到其他因素的影响，如线程的调度、CPU 的分配等。
因此，不能单纯地通过优先级值的大小来判断线程的优先级高低。

```java
public class ThreadPriority {
    public static void main(String[] args) throws InterruptedException {
        Runnable task1 = () -> {
            int count = 0;
            for (; ; ) {
                System.out.println("--->1 " + count++);
            }
        };

        Runnable task2 = () -> {
            int count = 0;
            for (; ; ) {
                 // Thread.yield();
                System.out.println("     --->2 " + count++);
            }
        };

        Thread t1 = new Thread(task1, "t1");
        Thread t2 = new Thread(task2, "t2");

        // t1.setPriority(Thread.MIN_PRIORITY);
        // t2.setPriority(Thread.MAX_PRIORITY);

        t1.start();
        t2.start();

        Thread.sleep(100);

        System.exit(1);
    }
}
```
