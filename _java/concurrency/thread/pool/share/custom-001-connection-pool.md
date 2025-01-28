---
title: "自定义连接池"
sequence: "101"
---

[UP](/java-concurrency.html)


## Connection

```java
public interface Connection {
}
```

## MockConnection

```java
class MockConnection implements Connection {

    private final String name;

    public MockConnection(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return String.format("MockConnection{ name = '%s'}", name);
    }
}
```

## Pool

### wait-notify 版本

```java
import java.util.concurrent.atomic.AtomicIntegerArray;

class Pool {
    // 1. 连接池大小
    private final int poolSize;

    // 2. 连接对象数组
    private final Connection[] connections;

    // 3. 连接状态数组 0 表示空闲， 1 表示繁忙
    private final AtomicIntegerArray states;

    // 4. 构造方法初始化
    public Pool(int poolSize) {
        this.poolSize = poolSize;
        this.connections = new Connection[poolSize];
        this.states = new AtomicIntegerArray(new int[poolSize]);
        for (int i = 0; i < poolSize; i++) {
            connections[i] = new MockConnection("连接" + (i + 1));
        }
    }

    // 5. 借连接
    public Connection borrow() {
        LogUtils.log("start borrow");
        while (true) {
            for (int i = 0; i < poolSize; i++) {
                // 获取空闲连接
                if (states.get(i) == 0) {
                    if (states.compareAndSet(i, 0, 1)) {
                        sleep(1);
                        LogUtils.log("borrow {}", connections[i]);
                        return connections[i];
                    }
                }
            }
            // 如果没有空闲连接，当前线程进入等待
            synchronized (this) {
                try {
                    LogUtils.log("wait...");
                    this.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // 6. 归还连接
    public void free(Connection conn) {
        for (int i = 0; i < poolSize; i++) {
            if (connections[i] == conn) {
                states.set(i, 0);
                synchronized (this) {
                    LogUtils.log("free {}", conn);
                    this.notifyAll();
                }
                break;
            }
        }
    }
}
```

### Semaphore 版本

```java
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicIntegerArray;

@Slf4j
public class PoolWithSemaphore {
    // 1. 连接池大小
    private final int poolSize;

    // 2. 连接对象数组
    private Connection[] connections;

    // 3. 连接状态数组 0 表示空闲， 1 表示繁忙
    private AtomicIntegerArray states;

    private Semaphore semaphore;

    // 4. 构造方法初始化
    public PoolWithSemaphore(int poolSize) {
        this.poolSize = poolSize;
        // 让许可数与资源数一致
        this.semaphore = new Semaphore(poolSize);
        this.connections = new Connection[poolSize];
        this.states = new AtomicIntegerArray(new int[poolSize]);
        for (int i = 0; i < poolSize; i++) {
            connections[i] = new MockConnection("连接" + (i + 1));
        }
    }

    // 5. 借连接
    public Connection borrow() {// t1, t2, t3
        // 获取许可
        try {
            semaphore.acquire(); // 没有许可的线程，在此等待
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        for (int i = 0; i < poolSize; i++) {
            // 获取空闲连接
            if (states.get(i) == 0) {
                if (states.compareAndSet(i, 0, 1)) {
                    log.debug("borrow {}", connections[i]);
                    return connections[i];
                }
            }
        }
        // 不会执行到这里
        return null;
    }

    // 6. 归还连接
    public void free(Connection conn) {
        for (int i = 0; i < poolSize; i++) {
            if (connections[i] == conn) {
                states.set(i, 0);
                log.debug("free {}", conn);
                semaphore.release();
                break;
            }
        }
    }
}
```

## ConnectionPoolRun

```java
public class ConnectionPoolRun {
    public static void main(String[] args) {
        Pool pool = new Pool(2);
        for (int i = 0; i < 5; i++) {
            int index = i;
            new Thread(() -> {
                Connection conn = pool.borrow();
                try {
                    int second = index % 3 + 3;
                    Thread.sleep(second * 1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                pool.free(conn);
            }, "t" + i).start();
        }
    }
}
```
