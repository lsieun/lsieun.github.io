---
title: "Semaphore"
sequence: "102"
---

[UP](/java-concurrency.html)


Semaphore，用来限制能同时访问共享资源的线程上限。

We can use semaphores to limit the number of concurrent threads accessing a specific resource.

## 示例

### 示例一

```java
import java.util.concurrent.Semaphore;

@Slf4j
public class HelloWorld {

    public static void main(String[] args) {
        // 1. 创建 semaphore 对象
        Semaphore semaphore = new Semaphore(3);

        // 2. 10 个线程同时运行
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    semaphore.acquire();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                try {
                    log.debug("running...");
                    sleep(1);
                    log.debug("end...");
                } finally {
                    semaphore.release();
                }
            }).start();
        }
    }
}
```

### 限制登录的人数

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;

public class Semaphore_001_Login {
    public static void main(String[] args) throws Exception {
        int slots = 10;
        LoginQueueUsingSemaphore loginQueue = new LoginQueueUsingSemaphore(slots);

        ExecutorService executorService = Executors.newFixedThreadPool(slots);
        IntStream.range(0, slots)
                .forEach(user -> executorService.execute(loginQueue::tryLogin));
        executorService.shutdown();

        TimeUnit.SECONDS.sleep(1);
        printInfo(loginQueue);

        loginQueue.logout();

        printInfo(loginQueue);
    }

    private static void printInfo(LoginQueueUsingSemaphore loginQueue) {
        int availableSlots = loginQueue.availableSlots();
        System.out.println("availableSlots = " + availableSlots);

        boolean flag = loginQueue.tryLogin();
        System.out.println("flag = " + flag);
    }

    static class LoginQueueUsingSemaphore {

        private final Semaphore semaphore;

        public LoginQueueUsingSemaphore(int slotLimit) {
            semaphore = new Semaphore(slotLimit);
        }

        boolean tryLogin() {
            return semaphore.tryAcquire();
        }

        void logout() {
            semaphore.release();
        }

        int availableSlots() {
            return semaphore.availablePermits();
        }

    }
}
```

输出结果：

```text
availableSlots = 0
flag = false
availableSlots = 1
flag = true
```

## Semaphore 应用

限制对共享资源的使用

使用 Semaphore 限流，在访问高峰期时，让请求线程阻塞，高峰期过去再释放许可。
当然，它只适合限制单机线程数量，并且仅是**限制线程数**，而不是**限制资源数**（例如连接数，请对比 Tomcat LimitLatch 的实现）。

用 Semaphore 实现简单连接池，对比『享元模式』下的实现（用 wait notify），性能和可读性显然更好，注意下面的实现中线程数和数据库连接数是相等的。
且这里也是一个线程对应一个资源，适用于 Semaphore。


## Reference

- [What Is a Semaphore?](https://www.baeldung.com/cs/semaphore)
- [Semaphores in Java](https://www.baeldung.com/java-semaphore)
