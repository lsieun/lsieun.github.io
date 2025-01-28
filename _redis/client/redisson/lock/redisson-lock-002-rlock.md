---
title: "RLock"
sequence: "102"
---


## Lock

Redisson's `RLock` implements `java.util.concurrent.locks.Lock` interface.

```java
public interface RLock extends Lock, RLockAsync {
}
```

## 基本使用

### 第一版

```java
import org.redisson.Redisson;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class RedissonLock_001_RLock_A_Basic {
    public static void main(String[] args) {
        Config config = RedissonUtils.getConfig();

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，使用锁
        RLock lock = client.getLock("lock");

        // 第 2.1 步，加锁
        lock.lock();

        // 第 2.2 步，处理业务逻辑
        System.out.println("Hello Redisson Lock");

        // 第 2.3 步，解锁
        lock.unlock();

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

### 第二版（推荐）

```java
import org.redisson.Redisson;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class RedissonLock_001_RLock_B_TryWithResource {
    public static void main(String[] args) {
        Config config = RedissonUtils.getConfig();

        // 第 1 步，创建 Client
        RedissonClient redisson = Redisson.create(config);

        // 第 2 步，使用锁
        RLock lock = redisson.getLock("anyLock");

        // 第 2.1 步，加锁
        lock.lock();

        try {
            // 第 2.2 步，处理业务逻辑
            System.out.println("Hello Redisson Lock");
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            // 第 2.3 步，解锁
            lock.unlock();
        }

        // 第 3 步，关闭 Client
        redisson.shutdown();
    }
}
```

## WatchDog

需要注意的是：

- watchDog 只有在未显示指定锁自动释放时间（leaseTime）时才会生效。（这点很重要）
- lockWatchdogTimeout设定的时间不要太小 ，比如我之前设置的是 100毫秒，由于网络直接导致加锁完后，watchdog去延期时，这个key在redis中已经被删除了。

### 带有 WatchDog

```java
import org.redisson.Redisson;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class RedissonLock_001_RLock_C_WatchDog {
    public static void main(String[] args) {
        Config config = RedissonUtils.getConfig();
        long lockWatchdogTimeout = config.getLockWatchdogTimeout();
        System.out.println("lockWatchdogTimeout = " + lockWatchdogTimeout);

        // 第 1 步，创建 Client
        RedissonClient redisson = Redisson.create(config);

        // 第 2 步，使用锁
        RLock lock = redisson.getLock("anyLock");

        // 第 2.1 步，加锁
        lock.lock();
        try {
            // 第 2.2 步，处理业务逻辑
            System.out.println("start: " + new Date());
            TimeUnit.SECONDS.sleep(50);
            System.out.println("stop: " + new Date());
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            // 第 2.3 步，解锁
            lock.unlock();
        }

        // 第 3 步，关闭 Client
        redisson.shutdown();
    }
}
```

### 不带有 WatchDog

```java
import org.redisson.Redisson;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class RedissonLock_001_RLock_D_Without_WatchDog {
    public static void main(String[] args) {
        Config config = RedissonUtils.getConfig();

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，使用锁
        RLock lock = client.getLock("anyLock");

        // 第 2.1 步，加锁
        lock.lock(30, TimeUnit.SECONDS);
        try {
            // 第 2.2 步，处理业务逻辑
            System.out.println("start: " + new Date());
            TimeUnit.SECONDS.sleep(50);
            System.out.println("stop: " + new Date());
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            // 第 2.3 步，解锁
            boolean locked = lock.isLocked();
            boolean isHeldByCurrentThread = lock.isHeldByCurrentThread();
            if (locked && isHeldByCurrentThread) {
                lock.unlock();
            }
        }

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

```java
import org.redisson.client.RedisClient;
import org.redisson.client.RedisClientConfig;
import org.redisson.client.RedisConnection;
import org.redisson.client.codec.StringCodec;
import org.redisson.client.protocol.RedisCommands;

import java.util.concurrent.TimeUnit;

public class RedissonLock_001_RLock_Z_TTL {
    public static void main(String[] args) throws InterruptedException {
        RedisClientConfig redisClientConfig = new RedisClientConfig();
        redisClientConfig.setAddress("server0", 6379);

        // 第 1 步，创建 Client 和 Connection
        RedisClient client = RedisClient.create(redisClientConfig);
        RedisConnection connection = client.connect();

        // 第 2 步，查看过期时间
        String key = "anyLock";
        Boolean exists = connection.sync(StringCodec.INSTANCE, RedisCommands.EXISTS, key);
        System.out.println("exists = " + exists);
        if (exists) {
            Long ttl = connection.sync(StringCodec.INSTANCE, RedisCommands.PTTL, key);
            while (ttl != null && ttl > 0) {
                System.out.println("ttl = " + ttl / 1000);
                Object value = connection.sync(StringCodec.INSTANCE, RedisCommands.HGETALL, key);
                System.out.println("value = " + value);
                TimeUnit.SECONDS.sleep(1);
                ttl = connection.sync(StringCodec.INSTANCE, RedisCommands.PTTL, key);
            }
        }


        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

### 如何启动 Redisson 的看门狗机制

如果我们想让 Redisson 启动看门狗机制，就不能自己在获取锁的时候，定义超时释放锁的时间。
无论，你是通过lock() （void lock(long leaseTime, TimeUnit unit);）还是通过tryLock获取锁，只要在参数中，不传入releastime，就会开启看门狗机制，
就是这两个方法不要用： boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException
和void lock(long leaseTime, TimeUnit unit);，因为它俩都传release

```java
package java.util.concurrent.locks;

public interface Lock {
    void lock();

    boolean tryLock();

    boolean tryLock(long time, TimeUnit unit);

    void unlock();
}
```

```java
package org.redisson.api;

public interface RLock extends Lock, RLockAsync {
    void lock(long leaseTime, TimeUnit unit);

    boolean tryLock(long waitTime, long leaseTime, TimeUnit unit);

    boolean forceUnlock();
}
```



## 总结

<table>
    <thead>
    <tr>
        <th></th>
        <th>带 WatchDog</th>
        <th>无 WatchDog</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>阻塞</td>
        <td><code>lock()</code></td>
        <td><code>lock(long leaseTime, TimeUnit unit)</code></td>
    </tr>
    <tr>
        <td>非阻塞</td>
        <td><code>lock.tryLock()</code><br/><code>tryLock(long time, TimeUnit unit)</code></td>
        <td><code>tryLock(long waitTime, long leaseTime, TimeUnit unit)</code></td>
    </tr>
    </tbody>
</table>
