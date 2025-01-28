---
title: "Jedis 分布式锁"
sequence: "102"
---

```java
public interface ILock {
    boolean tryLock(long seconds);

    void unlock();
}
```

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.SetParams;

public class SimpleRedisLock1 implements ILock {

    private static final String KEY_PREFIX = "lock:";

    private static final String THREAD_PREFIX = "thread:";

    private final Jedis jedis;

    private final String bizId;

    public SimpleRedisLock1(Jedis jedis, String bizId) {
        this.jedis = jedis;
        this.bizId = bizId;
    }

    @Override
    public boolean tryLock(long seconds) {
        String key = getRedisKey();
        String value = getThreadValue();

        String result = jedis.set(key, value, SetParams.setParams().nx().ex(seconds));

        return "OK".equalsIgnoreCase(result);
    }

    @Override
    public void unlock() {
        String key = getRedisKey();
        jedis.del(key);
    }

    private String getRedisKey() {
        return KEY_PREFIX + bizId;
    }

    private String getThreadValue() {
        return THREAD_PREFIX + Thread.currentThread().getId();
    }
}
```
