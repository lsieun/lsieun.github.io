---
title: "JVM 中的所有线程"
sequence: "102"
---

[UP](/java-concurrency.html)


## 使用 Thread 类

在 `Thread` 类中，有一个 static method 叫作 `getAllStackTraces()`，它返回 `Map<Thread, StackTraceElement[]>`：

```java
public class Thread implements Runnable {
    public static Map<Thread, StackTraceElement[]> getAllStackTraces() {
        // ...
    }
}
```

我们可以通过调用 `Thread.getAllStackTraces()` 方法，然后访问 `Map<Thread, StackTraceElement[]>` 的 keyset 来获取所有线程：

```java
import java.util.Set;

public class JvmGetAllThreads {
    public static void main(String[] args) {
        Set<Thread> threads = Thread.getAllStackTraces().keySet();
        System.out.printf("%-15s \t %-15s \t %-15s \t %s\n", "Name", "State", "Priority", "isDaemon");
        for (Thread t : threads) {
            System.out.printf("%-15s \t %-15s \t %-15d \t %s\n",
                    t.getName(), t.getState(), t.getPriority(), t.isDaemon());
        }
    }
}
```

输出结果：

```text
Name            	 State           	 Priority        	 isDaemon
Attach Listener 	 RUNNABLE        	 5               	 true
Monitor Ctrl-Break 	 RUNNABLE        	 5               	 true
Signal Dispatcher 	 RUNNABLE        	 9               	 true
Finalizer       	 WAITING         	 8               	 true
Reference Handler 	 WAITING         	 10              	 true
main            	 RUNNABLE        	 5               	 false
```

其中，`main` 表示 main 线程；另外，还有一些其它的线程：

- **Signal Dispatcher**: 这个 thread 用来处理由 Operating System 发送给 JVM 的 signal。
- **Finalizer**: this thread performs finalizations for objects that no longer need to release system resources.
- **Reference Handler**: this thread puts objects
  that are no longer needed into the queue to be processed by the **Finalizer** thread.

All these threads will be terminated if the main program exits.

## Reference

- [Get All Running JVM Threads](https://www.baeldung.com/java-get-all-threads)
