---
title: "ThreadLocal"
sequence: "101"
---

[UP](/java-concurrency.html)

```java
public class ThreadLocal_A {

    private static final ThreadLocal<String> local = new ThreadLocal<>();

    public static void main(String[] args) {
        local.set("ABC");
        String str = local.get();
        System.out.println("str = " + str);

        local.remove();

        System.out.println(local.get());
    }
}
```

```java
public class ThreadLocal_B {

    private static final ThreadLocal<String> local = ThreadLocal.withInitial(() -> "ABC");

    public static void main(String[] args) {
        System.out.println(local.get());
    }
}
```

```java
public class ThreadLocal_C {
    private static final ThreadLocal<String> threadLocal = ThreadLocal.withInitial(() -> "ABC");

    public static void main(String[] args) {
        try {
            System.out.println(threadLocal.get());
        }
        finally {
            // 避免内存泄漏
            threadLocal.remove();
        }
    }
}
```

## 线程池时使用 ThreadLocal

web容器(如tomcat)一般都是使用线程池处理用户到请求, 此时用ThreadLocal要特别注意内存泄漏的问题，
一个请求结束了，处理它的线程也结束，但此时这个线程并没有死掉，它只是归还到了线程池中，
这时候应该清理掉属于它的ThreadLocal信息，

remove()
线程结束时应当调用ThreadLocal的这个方法清理掉thread-local变量

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ThreadLocal_MemoryLeak {
    // -Xms25m -Xmx25m
    public static void main(String[] args) {
        // 创建一个线程池
        ExecutorService pool = Executors.newFixedThreadPool(30);
        for (int i = 0; i < 30; i++) {
            pool.execute(ThreadLocal_MemoryLeak::doSomething);
            try {
                TimeUnit.MILLISECONDS.sleep(50);
            }
            catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

        pool.shutdown();
    }

    public static void doSomething() {
        ThreadLocal<MyClass> threadLocal = new ThreadLocal<>();
        try {
            MyClass myClass = new MyClass(); // 1mb
            threadLocal.set(myClass);
            System.out.println(Thread.currentThread().getName());
        }
        finally {
            // 解决内存泄露的核心
            // threadLocal.remove();
        }
    }

    public static void doSomethingByList() {
        // 使用 list 不存在内存泄露
        List<MyClass> list = new ArrayList<>();
        MyClass myClass = new MyClass(); // 1mb
        list.add(myClass);
        System.out.println(Thread.currentThread().getName());
    }

    private static class MyClass {
        private final byte[] array = new byte[1024 * 1024];
    }
}
```

## Reference

- [An Introduction to ThreadLocal in Java](https://www.baeldung.com/java-threadlocal)
- [Guide to ThreadLocalRandom in Java](https://www.baeldung.com/java-thread-local-random)
- [分析 ThreadLocal 如何做到单个线程独享](https://developer.aliyun.com/article/1252903)

- [Why 0x61c88647?](https://www.javaspecialists.eu/archive/Issue164-Why-0x61c88647.html)
