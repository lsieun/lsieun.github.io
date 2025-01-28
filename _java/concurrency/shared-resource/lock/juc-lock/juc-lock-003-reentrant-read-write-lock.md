---
title: "ReentrantReadWriteLock"
sequence: "103"
---

[UP](/java-concurrency.html)


## 使用场景

当 Read 操作远远高于 Write 操作时，这时候使用 `ReadWriteLock` 让 “Read-Read” 可以并发，提高性能。

Most resources follow the principle of **frequent reads and few write operations**.
Since reading a variable is thread safe there's no need for a lock
unless we're in the process of writing to the variable.
This means **we can optimize reading to an extreme** while **making the write operations slightly slower**.

## API

### ReadWriteLock

```java
public interface ReadWriteLock {
    Lock readLock();
    Lock writeLock();
}
```

### ReentrantReadWriteLock

`ReentrantReadWriteLock` class implements the `ReadWriteLock` interface.

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
}
```

Let's see the rules for acquiring the `ReadLock` or `WriteLock` by a thread:

- **Read Lock** – If no thread acquired the write lock or requested for it, multiple threads can acquire the read lock.
- **Write Lock** – If no threads are reading or writing, only one thread can acquire the write lock.

## 示例

### Object

#### 数据容器

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Slf4j
class DataContainer {
    private Object data;
    private final ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();
    private final ReentrantReadWriteLock.ReadLock readLock = readWriteLock.readLock();
    private final ReentrantReadWriteLock.WriteLock writeLock = readWriteLock.writeLock();

    public Object read() {
        log.debug("尝试获取读锁...");
        readLock.lock();
        log.debug("获取读锁成功");
        try {
            sleep(1);
            log.debug("读取");
            return data;
        } finally {
            log.debug("释放读锁...");
            readLock.unlock();
        }
    }

    public void write() {
        log.debug("尝试获取写锁...");
        writeLock.lock();
        log.debug("获取写锁成功");
        try {
            sleep(1);
            log.debug("写入");
        } finally {
            log.debug("释放写锁...");
            writeLock.unlock();
        }
    }
}
```

#### 测试：读 - 读

测试 “读锁 - 读锁” 可以并发：

```text
public static void main(String[] args) {
    DataContainer dataContainer = new DataContainer();
    new Thread(() -> {
        dataContainer.read();
    }, "t1").start();

    new Thread(() -> {
        dataContainer.read();
    }, "t2").start();
}
```

输出：

```text
38.22.213 [t1] DEBUG 尝试获取读锁...
38.22.213 [t2] DEBUG 尝试获取读锁...
38.22.217 [t1] DEBUG 获取读锁成功
38.22.217 [t2] DEBUG 获取读锁成功
38.23.231 [t1] DEBUG 读取
38.23.231 [t2] DEBUG 读取
38.23.231 [t1] DEBUG 释放读锁...
38.23.231 [t2] DEBUG 释放读锁...
```

#### 测试：读 - 写

测试 “读锁 - 写锁” 相互阻塞：

```text
public static void main(String[] args) {
    DataContainer dataContainer = new DataContainer();
    new Thread(() -> {
        dataContainer.read();
    }, "t1").start();

    new Thread(() -> {
        dataContainer.write();
    }, "t2").start();
}
```

输出：

```text
42.51.551 [t1] DEBUG 尝试获取读锁...
42.51.551 [t2] DEBUG 尝试获取写锁...
42.51.556 [t1] DEBUG 获取读锁成功
42.52.568 [t1] DEBUG 读取
42.52.568 [t1] DEBUG 释放读锁...
42.52.568 [t2] DEBUG 获取写锁成功
42.53.571 [t2] DEBUG 写入
42.53.571 [t2] DEBUG 释放写锁...
```

### Map

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class SynchronizedHashMapWithReadWriteLock {

    // 第 1 步，定义数据字段
    private final Map<String, String> syncHashMap = new HashMap<>();

    // 第 2 步，获取锁
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final Lock readLock = lock.readLock();
    private final Lock writeLock = lock.writeLock();

    // 第 3 步，使用读锁
    public String get(String key) {
        try {
            readLock.lock();
            return syncHashMap.get(key);
        } finally {
            readLock.unlock();
        }
    }

    // 第 3 步，使用读锁
    public boolean containsKey(String key) {
        try {
            readLock.lock();
            return syncHashMap.containsKey(key);
        } finally {
            readLock.unlock();
        }
    }

    // 第 4 步，使用写锁
    public void put(String key, String value) {
        try {
            writeLock.lock();
            syncHashMap.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }

    // 第 4 步，使用写锁
    public String remove(String key) {
        try {
            writeLock.lock();
            return syncHashMap.remove(key);
        } finally {
            writeLock.unlock();
        }
    }

    public static void main(String[] args) {
        //...
    }
}
```

### RWDictionary

```java
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

class RWDictionary {
    private final Map<String, Data> m = new TreeMap<>();
    private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
    private final Lock r = rwl.readLock();
    private final Lock w = rwl.writeLock();

    public Data get(String key) {
        r.lock();
        try {
            return m.get(key);
        } finally {
            r.unlock();
        }
    }

    public String[] allKeys() {
        r.lock();
        try {
            return (String[]) m.keySet().toArray();
        } finally {
            r.unlock();
        }
    }

    public Data put(String key, Data value) {
        w.lock();
        try {
            return m.put(key, value);
        } finally {
            w.unlock();
        }
    }

    public void clear() {
        w.lock();
        try {
            m.clear();
        } finally {
            w.unlock();
        }
    }
}
```

## 注意事项

### 读锁：不支持条件变量

- 读锁：**不支持**条件变量
- 写锁：**支持**条件变量

```java
public class ReentrantReadWriteLock implements ReadWriteLock, Serializable {
    public static class ReadLock implements Lock, Serializable {
        public Condition newCondition() {
            throw new UnsupportedOperationException();
        }
    }

    public static class WriteLock implements Lock, Serializable {
        public Condition newCondition() {
            return sync.newCondition();
        }
    }
}
```

### 重入：读锁不能升级为写锁

重入时升级不支持：即持有读锁的情况下去获取写锁，会导致获取写锁永久等待

```text
r.lock();
try {
    // ...
    w.lock();
    try {
        // ...
    } finally{ 
        w.unlock();  
    }
} finally{ 
    r.unlock();
}
```

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Slf4j
public class HelloWorld {

    public static void main(String[] args) {
        ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
        ReentrantReadWriteLock.ReadLock readLock = lock.readLock();
        ReentrantReadWriteLock.WriteLock writeLock = lock.writeLock();

        log.info("尝试获取读锁...");
        readLock.lock();
        log.info("获取读锁成功");
        try {
            log.info("尝试获取写锁...");
            writeLock.lock();      // 阻塞
            log.info("获取写锁成功");
            try {
                log.info("do something");
            } finally {
                writeLock.unlock();
                log.info("释放写锁");
            }
        } finally {
            readLock.unlock();
            log.info("释放读锁");
        }
    }
}
```

```text
56.29.971 [main] INFO 尝试获取读锁...
56.29.973 [main] INFO 获取读锁成功
56.29.974 [main] INFO 尝试获取写锁...
```

### 重入：写锁可以降级为读锁

重入时降级支持：即持有写锁的情况下去获取读锁

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

class CachedData {
    Object data;
    // 是否有效，如果失效，需要重新计算 data
    volatile boolean cacheValid;
    final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();

    void processCachedData() {
        rwl.readLock().lock();
        if (!cacheValid) {
            // 获取写锁前必须释放读锁
            rwl.readLock().unlock();
            rwl.writeLock().lock();
            try {
                // 判断是否有其它线程已经获取了写锁、更新了缓存，避免重复更新（双重检查）
                if (!cacheValid) {
                    data = recalculate();
                    cacheValid = true;
                }
                // 降级为读锁，释放写锁，这样能够让其它线程读取缓存
                rwl.readLock().lock();
            } finally {
                rwl.writeLock().unlock();
            }
        }

        // 拿到读锁，自己用完数据，释放读锁（防止自己读的时候别人写）
        // ①数据没失效，拿到读锁，可以直接读
        // ②数据失效后，那就重新计算 data，然后释放写锁前拿到读锁，继续读
        try {
            use(data);
        } finally {
            rwl.readLock().unlock();
        }
    }

    private Object recalculate() {
        return null;
    }

    private void use(Object data) {
    }
}
```
