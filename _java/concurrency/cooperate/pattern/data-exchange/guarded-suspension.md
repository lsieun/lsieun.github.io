---
title: "保护性暂停（Guarded Suspension）"
sequence: "101"
---

[UP](/java-concurrency.html)


保护性暂停，即 Guarded Suspension，用在一个线程等待另一个线程的执行结果。

join 也是保护性暂停，join 是要等待调用线程执行完了才会继续执行其他

要点

- 有一个结果需要从一个线程传递到另一个线程，让他们关联同一个 GuardedObject
- 如果有结果不断从一个线程到另一个线程那么可以使用消息队列（见生产者/消费者）
- JDK 中，join 的实现、Future 的实现，采用的就是此模式
- 因为要等待另一方的结果，因此归类到同步模式

![](/assets/images/java/concurrency/obj/obj-wait-notify-guarded-object.png)

## GuardedObject

```java
class GuardedObject {
    private Object response;
    private final Object lock = new Object();

    public Object get() {
        synchronized (lock) {
            // 条件不满足则等待
            while (response == null) {
                try {
                    lock.wait();
                } catch (InterruptedException ex) {
                    ex.printStackTrace();
                }
            }
            return response;
        }
    }

    public void complete(Object response) {
        synchronized (lock) {
            // 条件满足，通知等待线程
            this.response = response;
            lock.notifyAll();
        }
    }
}
```

```java
import java.io.IOException;
import java.util.List;

import static lsieun.concurrent.utils.SleepUtils.sleep;

public class GuardedObjectRun {
    public static void main(String[] args) {
        GuardedObject guardedObject = new GuardedObject();

        Thread t1 = new Thread(() -> {
            LogUtils.log("waiting...");
            // 线程阻塞等待
            Object response = guardedObject.get();
            List<String> lines = (List<String>) response;
            LogUtils.log("get response: [{}] lines", lines.size());
            for (String line : lines) {
                LogUtils.log("line: " + line);
            }
        }, "t1");
        t1.start();

        sleep(1);

        Thread t2 = new Thread(() -> {
            try {
                // 子线程执行下载
                List<String> response = Downloader.download();
                LogUtils.log("download complete...");
                guardedObject.complete(response);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        t2.start();
    }

}
```

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class Downloader {
    public static List<String> download() throws IOException {
        URL url = new URL("https://httpbin.org/get");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        List<String> lines = new ArrayList<>();
        try (
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8)
                )
        ) {
            String line;
            while ((line = reader.readLine()) != null) {
                lines.add(line);
            }
            return lines;
        }
    }
}
```

## 带超时版 GuardedObject


```java
class GuardedObjectV2 {
    private Object response;
    private final Object lock = new Object();

    public Object get(long millis) {
        synchronized (lock) {
            // 1) 记录最初时间
            long begin = System.currentTimeMillis();
            // 2) 已经经历的时间
            long timePassed = 0;
            while (response == null) {
                // 4) 假设 millis 是 1000，结果在 400 时唤醒了，那么还有 600 要等
                long waitTime = millis - timePassed;
                LogUtils.log("waitTime: {}", waitTime);
                if (waitTime <= 0) {
                    LogUtils.log("break...");
                    break;
                }
                try {
                    lock.wait(waitTime);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                // 3) 如果提前被唤醒，这时已经经历的时间假设为 400
                timePassed = System.currentTimeMillis() - begin;
                LogUtils.log(
                        "timePassed: {}, object is ready: {}",
                        timePassed, response != null
                );
            }
            return response;
        }
    }

    public void complete(Object response) {
        synchronized (lock) {
            // 条件满足，通知等待线程
            this.response = response;
            LogUtils.log("notify...");
            lock.notifyAll();
        }
    }
}
```

```java
public class GuardedObjectRunV2 {
    public static void main(String[] args) {
        GuardedObjectV2 v2 = new GuardedObjectV2();

        Thread t1 = new Thread(() -> {
            Object response = v2.get(2500);
            if (response != null) {
                LogUtils.log("get response: {}", response);
            } else {
                LogUtils.log("can't get response");
            }
        }, "t1");
        t1.start();

        Thread t2 = new Thread(() -> {
            sleep(1);
            v2.complete(null);
            sleep(1);
            v2.complete("My Secret");
        }, "t2");
        t2.start();
    }
}
```

```text
09:58.220 [t1] INFO waitTime: 2500
09:59.161 [t2] INFO notify...
09:59.161 [t1] INFO timePassed: 1015, object is ready: false
09:59.161 [t1] INFO waitTime: 1485
10:00.164 [t2] INFO notify...
10:00.164 [t1] INFO timePassed: 2018, object is ready: true
10:00.164 [t1] INFO get response: My Secret
```

测试，超时

```text
Object response = v2.get(1500);
```

```text
10:45.365 [t1] INFO waitTime: 1500
10:46.315 [t2] INFO notify...
10:46.315 [t1] INFO timePassed: 1011, object is ready: false
10:46.315 [t1] INFO waitTime: 489
10:46.804 [t1] INFO timePassed: 1500, object is ready: false
10:46.804 [t1] INFO waitTime: 0
10:46.804 [t1] INFO break...
10:46.805 [t1] INFO can't get response
10:47.329 [t2] INFO notify...
```

## join 原理

`t.join()` 方法阻塞调用此方法的线程(calling thread)进入 `TIMED_WAITING` 状态，直到线程 `t` 完成，此线程再继续；

通常用于在 main()主线程内，等待其它线程完成再结束 main()主线程

是调用者轮询检查线程 alive 状态

```text
t1.join();
```

```java
public class Thread implements Runnable {
    public final void join() throws InterruptedException {
        join(0);
    }

    public final synchronized void join(final long millis) throws InterruptedException {
        if (millis > 0) {
            if (isAlive()) {
                final long startTime = System.nanoTime();
                long delay = millis;
                do {
                    wait(delay);
                } while (isAlive() && (delay = millis -
                        TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime)) > 0);
            }
        } else if (millis == 0) {
            while (isAlive()) {
                wait(0);
            }
        } else {
            throw new IllegalArgumentException("timeout value is negative");
        }
    }
}
```

等价于下面的代码

```text
synchronized (t1) {
    // 调用者线程进入 t1 的 waitSet 等待, 直到 t1 运行结束
    // 此处 t1 线程对象作为了锁
    while (t1.isAlive()) {
        // 调用线程进了锁 t1 的 waitSet
        // 注意，调用线程不是 t1，t1 此处是作为锁而不是作为线程
        // 调用线程是其他线程，一般是主线程
        t1.wait(0);
    }
}
```

## 多任务版 GuardedObject

图中 Futures 就好比居民楼一层的信箱（每个信箱有房间编号），左侧的 t0，t2，t4 就好比等待邮件的居民，右侧的 t1，t3，t5 就好比邮递员

如果需要在多个类之间使用 GuardedObject 对象，作为参数传递不是很方便，因此设计一个用来解耦的中间类，
这样不仅能够解耦【结果等待者】和【结果生产者】，还能够同时支持多个任务的管理。

![](/assets/images/java/concurrency/obj/obj-wait-notify-futures.png)

```java
class GuardedObjectV3 {

    // 标识 Guarded Object
    private final int id;

    // 结果
    private Object response;

    public GuardedObjectV3(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    // 获取结果
    // timeout 表示要等待多久 2000
    public Object get(long timeout) {
        synchronized (this) {
            long begin = System.currentTimeMillis();
            // 经历的时间
            long passedTime = 0;
            while (response == null) {
                // 这一轮循环应该等待的时间
                long waitTime = timeout - passedTime;
                // 经历的时间超过了最大等待时间时，退出循环
                if (timeout - passedTime <= 0) {
                    break;
                }
                try {
                    this.wait(waitTime); // 虚假唤醒
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                // 求得经历时间
                passedTime = System.currentTimeMillis() - begin;
            }
            return response;
        }
    }

    // 产生结果
    public void complete(Object response) {
        synchronized (this) {
            // 给结果成员变量赋值
            this.response = response;
            this.notifyAll();
        }
    }
}
```

```java
import java.util.Hashtable;
import java.util.Map;
import java.util.Set;

class Mailboxes {
    private static final Map<Integer, GuardedObjectV3> boxes = new Hashtable<>();

    private static int id = 1;

    // 产生唯一 id
    private static synchronized int generateId() {
        return id++;
    }

    // HashTable 线程安全的，不用加 synchronized
    public static GuardedObjectV3 getGuardedObject(int id) {
        return boxes.remove(id);
    }

    // HashTable 线程安全的，不用加 synchronized
    public static GuardedObjectV3 createGuardedObject() {
        GuardedObjectV3 resource = new GuardedObjectV3(generateId());
        boxes.put(resource.getId(), resource);
        return resource;
    }

    public static Set<Integer> getIds() {
        return boxes.keySet();
    }
}
```

```java
public class GuardedObjectRunV3 {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            new People().start();
        }
        sleep(1);
        for (Integer id : Mailboxes.getIds()) {
            new Postman(id, "内容" + id).start();
        }
    }
}

class People extends Thread {
    @Override
    public void run() {
        // 收信
        GuardedObjectV3 guardedObject = Mailboxes.createGuardedObject();
        LogUtils.log("开始收信 id:{}", guardedObject.getId());
        Object mail = guardedObject.get(5000);
        LogUtils.log("收到信 id:{}, 内容:{}", guardedObject.getId(), mail);
    }
}

class Postman extends Thread {
    private int id;
    private String mail;

    public Postman(int id, String mail) {
        this.id = id;
        this.mail = mail;
    }

    @Override
    public void run() {
        GuardedObjectV3 guardedObject = Mailboxes.getGuardedObject(id);
        LogUtils.log("送信 id:{}, 内容:{}", id, mail);
        guardedObject.complete(mail);
    }
}
```
