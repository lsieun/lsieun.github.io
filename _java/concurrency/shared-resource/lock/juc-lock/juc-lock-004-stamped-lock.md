---
title: "StampedLock"
sequence: "104"
---

[UP](/java-concurrency.html)


## 介绍

The first thing we need to understand about **`StampedLock` is that it isn't reentrant.**

`StampedLock` also supports both read and write locks.


- 时间：Java 8
- 目的：为了进一步优化读性能。`ReentrantReadWriteLock`，在进行“读”操作时，仍然需要更新“高 16 位”来记录读锁的状态；而 StampedLock 通过“乐观锁”，尽量避免变成“读锁”。
- 特点：在使用读锁、写锁时都必须配合『戳』使用。

## 如何使用

读锁

```text
long stamp = lock.readLock();
lock.unlockRead(stamp);
```

写锁

```text
long stamp = lock.writeLock();
lock.unlockWrite(stamp);
```

However, lock acquisition methods return a stamp
that is used to release a lock or to check if the lock is still valid:

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.StampedLock;

public class StampedLockDemo {
    private final Map<String,String> map = new HashMap<>();
    private final StampedLock lock = new StampedLock();

    public void put(String key, String value){
        long stamp = lock.writeLock();
        try {
            map.put(key, value);
        } finally {
            lock.unlockWrite(stamp);
        }
    }

    public String get(String key) {
        long stamp = lock.readLock();
        try {
            return map.get(key);
        } finally {
            lock.unlockRead(stamp);
        }
    }
}
```

## 乐观锁

乐观读，StampedLock 支持 tryOptimisticRead() 方法（乐观读），读取完毕后需要做一次 戳校验。
如果校验通过，表示这期间确实没有写操作，数据可以安全使用；如果校验没通过，需要重新获取读锁，保证数据安全。

```text
long stamp = lock.tryOptimisticRead();
// 验戳
if(!lock.validate(stamp)){
    // 锁升级
}
```

Another feature provided by `StampedLock` is **optimistic locking**.
Most of the time, read operations don't need to wait for write operation completion,
and as a result of this, the full-fledged read lock isn't required.

Instead, we can upgrade to read lock:

```text
public String readWithOptimisticLock(String key) {
    long stamp = lock.tryOptimisticRead();
    String value = map.get(key);

    if(!lock.validate(stamp)) {
        stamp = lock.readLock();
        try {
            return map.get(key);
        } finally {
            lock.unlock(stamp);               
        }
    }
    return value;
}
```

## 示例

### 示例一

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.StampedLock;

public class StampedLockDemo {
    private final Map<String, String> map = new HashMap<>();
    private final StampedLock lock = new StampedLock();

    public void put(String key, String value) {
        long stamp = lock.writeLock();
        try {
            map.put(key, value);
        } finally {
            lock.unlockWrite(stamp);
        }
    }

    public String get(String key) {
        long stamp = lock.readLock();
        try {
            return map.get(key);
        } finally {
            lock.unlockRead(stamp);
        }
    }

    public String readWithOptimisticLock(String key) {
        long stamp = lock.tryOptimisticRead();
        String value = map.get(key);

        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
            try {
                return map.get(key);
            } finally {
                lock.unlock(stamp);
            }
        }
        return value;
    }
}
```

### 示例二

```java
import java.util.concurrent.locks.StampedLock;

import static lsieun.concurrent.utils.SleepUtils.sleep;

@Slf4j
class DataContainerStamped {
    private int data;
    private final StampedLock lock = new StampedLock();

    public DataContainerStamped(int data) {
        this.data = data;
    }

    public int read(int readTime) {
        long stamp = lock.tryOptimisticRead();
        log.debug("optimistic read locking...{}", stamp);
        sleep(readTime);
        if (lock.validate(stamp)) {
            log.debug("read finish...{}, data:{}", stamp, data);
            return data;
        }

        // 锁升级 - 读锁
        log.debug("updating to read lock... {}", stamp);
        try {
            stamp = lock.readLock();
            log.debug("read lock {}", stamp);
            sleep(readTime);
            log.debug("read finish...{}, data:{}", stamp, data);
            return data;
        } finally {
            log.debug("read unlock {}", stamp);
            lock.unlockRead(stamp);
        }
    }

    public void write(int newData) {
        long stamp = lock.writeLock();
        log.debug("write lock {}", stamp);
        try {
            sleep(2);
            this.data = newData;
        } finally {
            log.debug("write unlock {}", stamp);
            lock.unlockWrite(stamp);
        }
    }
}
```

测试 读 - 读 可以优化：

```java
public class Test {
    public static void main(String[] args) {
        DataContainerStamped dataContainer = new DataContainerStamped(1);
        new Thread(() -> {
            dataContainer.read(2);
        }, "t1").start();

        sleep(1);

        new Thread(() -> {
            dataContainer.read(0);
        }, "t2").start();
    }
}
```

```text
45.06.081 [t1] DEBUG optimistic read locking...256
45.07.086 [t2] DEBUG optimistic read locking...256
45.07.086 [t2] DEBUG read finish...256, data:1
45.08.096 [t1] DEBUG read finish...256, data:1
```

测试 读 - 写 时优化读补加读锁

```java
public class Test {
    public static void main(String[] args) {
        DataContainerStamped dataContainer = new DataContainerStamped(1);
        new Thread(() -> {
            dataContainer.read(2);
        }, "t1").start();

        sleep(1);

        new Thread(() -> {
            dataContainer.write(100);
        }, "t2").start();
    }
}
```

```text
46.45.135 [t1] DEBUG optimistic read locking...256
46.46.137 [t2] DEBUG write lock 384
46.47.143 [t1] DEBUG updating to read lock... 256
46.48.151 [t2] DEBUG write unlock 384
46.48.151 [t1] DEBUG read lock 513
46.50.156 [t1] DEBUG read finish...513, data:100
46.50.156 [t1] DEBUG read unlock 513
```

## 注意事项

- StampedLock 不支持条件变量
- StampedLock 不支持可重入

## Reference

- [Relearning Java Thread Primitives](https://debugagent.com/relearning-java-thread-primitives) 关于 StampLock，我没有看懂
