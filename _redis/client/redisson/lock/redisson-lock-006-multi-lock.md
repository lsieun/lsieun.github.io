---
title: "MultiLock"
sequence: "109"
---

## MultiLock

Redisson's `RedissonMultiLock` groups multiple `RLock` objects and treats them as a single lock:

```text
RLock lock1 = redissonInstance1.getLock("lock1");

RLock lock2 = redissonInstance2.getLock("lock2");

RLock lock3 = redissonInstance3.getLock("lock3");

RedissonMultiLock lock = new RedissonMultiLock(lock1, lock2, lock3);

lock.lock();
try {
  ...
} finally {
  lock.unlock();
}
```

```java
import org.redisson.Redisson;
import org.redisson.RedissonMultiLock;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_H_Lock {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client1 = Redisson.create(config);
        RedissonClient client2 = Redisson.create(config);
        RedissonClient client3 = Redisson.create(config);

        // 第 2 步，操作数据
        RLock lock1 = client1.getLock("lock1");
        RLock lock2 = client2.getLock("lock2");
        RLock lock3 = client3.getLock("lock3");

        RedissonMultiLock lock = new RedissonMultiLock(lock1, lock2, lock3);
        lock.lock();

        // perform long running operation...
        System.out.println("Hello Lock");

        lock.unlock();

        // 第 3 步，关闭 Client
        client1.shutdown();
        client2.shutdown();
        client3.shutdown();
    }
}
```
