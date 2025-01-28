---
title: "RedissonLock(3.15.0)"
sequence: "111"
---

```java
public class RedissonLock extends RedissonBaseLock {
}
```

基于 `SETNX` 实现的分布式锁存在以下问题：

- 不可重入：同一个线程无法多次获取同一把锁
- 不可重试：获取锁只尝试一次就返回 false，没有重试机制
- 超时释放：锁超时释放，虽然可以避免死锁，但如果是业务执行耗时较长，也会导致锁释放，存在安全隐患
- 主从一致性：如果 Redis 提供了主从集群，主从同步存在延迟，当主服务器（Master）宕机时，如果从服务器（Slave）同步主服务器（Master）锁数据，则会出现锁失效的问题。

Redisson 分布式锁原理：

- **可重入**：利用 Hash 结构记录线程 ID 和重入次数
- **可重试**：利用信号量和 PubSub 功能实现等待、唤醒、获取锁失败的重试机制
- **超时续期**：利用 WatchDog，每隔一段时间（`internalLockLeaseTime/3`），重置超时时间

![](/assets/images/redis/redisson/redisson-lock-aquire-and-release-logic.png)

不可重入 Redis 分布式锁：

- 原理：利用 `SETNX` 的互斥性；利用 `EX` 避免死锁；释放锁时，判断线程标识
- 缺陷：不可重入、无法重试、锁超时失效

可重入的 Redis 分布式锁：

- 原理：利用 Hash 结构，记录线程标识和重入次数；利用 WatchDog 延续锁时间；利用信号量控制锁重试等待
- 缺陷：Redis 宕机引起锁失效问题

Redisson 的 MultiLock：

- 原理：多个独立的 Redis 节点，必须在所有节点都获取重入锁，才算获取锁成功
- 缺陷：运维成本高、实现复杂

## 重入

### 获取锁

```java
public class RedissonLock extends RedissonBaseLock {
}
```

### 释放锁

```java
public class RedissonLock extends RedissonBaseLock {
    // step 1
    public void unlock() {
        // step 2
        get(unlockAsync(Thread.currentThread().getId()));
    }

    // step 2
    public RFuture<Void> unlockAsync(long threadId) {
        RPromise<Void> result = new RedissonPromise<>();
        RFuture<Boolean> future = unlockInnerAsync(threadId);

        future.onComplete((opStatus, e) -> {
            // step 3
            cancelExpirationRenewal(threadId);

            result.trySuccess(null);
        });

        return result;
    }

    protected RFuture<Boolean> unlockInnerAsync(long threadId) {
        return evalWriteAsync(getName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
                "if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then " +
                        "return nil;" +
                        "end; " +
                        "local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1); " +
                        "if (counter > 0) then " +
                        "redis.call('pexpire', KEYS[1], ARGV[2]); " +
                        "return 0; " +
                        "else " +
                        "redis.call('del', KEYS[1]); " +
                        "redis.call('publish', KEYS[2], ARGV[1]); " +
                        "return 1; " +
                        "end; " +
                        "return nil;",
                Arrays.asList(
                        getName(),       // KEYS[1]
                        getChannelName() // KEYS[2]
                ),
                LockPubSub.UNLOCK_MESSAGE, // ARGV[1]
                internalLockLeaseTime,     // ARGV[2]
                getLockName(threadId)      // ARGV[3]
        );
    }
}
```

```lua
if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then
    return nil;
end;

local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1);
if (counter > 0) then
    redis.call('pexpire', KEYS[1], ARGV[2]);
    return 0;
else
    redis.call('del', KEYS[1]);
    redis.call('publish', KEYS[2], ARGV[1]);
    return 1;
end;

return nil;
```

## 重试

### 获取锁

## 超时续期

### 获取锁

```java
public class RedissonLock extends RedissonBaseLock {
    // step 1
    public boolean tryLock(long waitTime, TimeUnit unit) throws InterruptedException {
        // step 2
        return tryLock(waitTime, -1, unit);
    }

    // step 2
    public boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException {
        long time = unit.toMillis(waitTime);
        long current = System.currentTimeMillis();
        long threadId = Thread.currentThread().getId();
        
        // step 3
        Long ttl = tryAcquire(waitTime, leaseTime, unit, threadId);
        
        // ...
    }

    // step 3
    private Long tryAcquire(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
        // step 4
        return get(tryAcquireAsync(waitTime, leaseTime, unit, threadId));
    }

    // step 4
    private <T> RFuture<Long> tryAcquireAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
        if (leaseTime != -1) {
            return tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_LONG);
        }
        RFuture<Long> ttlRemainingFuture = tryLockInnerAsync(
                waitTime,
                internalLockLeaseTime,
                TimeUnit.MILLISECONDS,
                threadId,
                RedisCommands.EVAL_LONG
        );
        ttlRemainingFuture.onComplete((ttlRemaining, e) -> {
            if (e != null) {
                return;
            }

            // lock acquired
            if (ttlRemaining == null) {
                // step 5
                scheduleExpirationRenewal(threadId);
            }
        });
        return ttlRemainingFuture;
    }

    // step 5
    protected void scheduleExpirationRenewal(long threadId) {
        ExpirationEntry entry = new ExpirationEntry();
        ExpirationEntry oldEntry = EXPIRATION_RENEWAL_MAP.putIfAbsent(getEntryName(), entry);
        if (oldEntry != null) {
            oldEntry.addThreadId(threadId);
        } else {
            entry.addThreadId(threadId);
            // step 6
            renewExpiration();
        }
    }

    // step 6
    private void renewExpiration() {
        ExpirationEntry ee = EXPIRATION_RENEWAL_MAP.get(getEntryName());
        if (ee == null) {
            return;
        }

        // step 7
        Timeout task = commandExecutor.getConnectionManager().newTimeout(new TimerTask() {
            @Override
            public void run(Timeout timeout) throws Exception {
                ExpirationEntry ent = EXPIRATION_RENEWAL_MAP.get(getEntryName());
                if (ent == null) {
                    return;
                }
                Long threadId = ent.getFirstThreadId();
                if (threadId == null) {
                    return;
                }

                RFuture<Boolean> future = renewExpirationAsync(threadId);
                future.onComplete((res, e) -> {
                    if (e != null) {
                        log.error("Can't update lock " + getName() + " expiration", e);
                        EXPIRATION_RENEWAL_MAP.remove(getEntryName());
                        return;
                    }

                    if (res) {
                        // step 8
                        // reschedule itself
                        renewExpiration();
                    }
                });
            }
        }, internalLockLeaseTime / 3, TimeUnit.MILLISECONDS);

        ee.setTimeout(task);
    }
}
```

### 释放锁

```java
public class RedissonLock extends RedissonBaseLock {
    // step 1
    public void unlock() {
        // step 2
        get(unlockAsync(Thread.currentThread().getId()));
    }

    // step 2
    public RFuture<Void> unlockAsync(long threadId) {
        RPromise<Void> result = new RedissonPromise<>();
        RFuture<Boolean> future = unlockInnerAsync(threadId);

        future.onComplete((opStatus, e) -> {
            // step 3
            cancelExpirationRenewal(threadId);

            result.trySuccess(null);
        });

        return result;
    }

    // step 3
    protected void cancelExpirationRenewal(Long threadId) {
        ExpirationEntry task = EXPIRATION_RENEWAL_MAP.get(getEntryName());
        if (task == null) {
            return;
        }

        if (threadId != null) {
            task.removeThreadId(threadId);
        }

        if (threadId == null || task.hasNoThreads()) {
            Timeout timeout = task.getTimeout();
            if (timeout != null) {
                // step 4
                timeout.cancel();
            }
            EXPIRATION_RENEWAL_MAP.remove(getEntryName());
        }
    }
}
```

```java
public class RedissonLock extends RedissonBaseLock {
    public boolean tryLock(long waitTime, TimeUnit unit) throws InterruptedException {
        return tryLock(waitTime, -1, unit);
    }

    public boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException {
        long time = unit.toMillis(waitTime);
        long current = System.currentTimeMillis();
        long threadId = Thread.currentThread().getId();
        Long ttl = tryAcquire(waitTime, leaseTime, unit, threadId);
        // lock acquired
        if (ttl == null) {
            return true;
        }

        time -= System.currentTimeMillis() - current;
        if (time <= 0) {
            acquireFailed(waitTime, unit, threadId);
            return false;
        }

        current = System.currentTimeMillis();
        RFuture<RedissonLockEntry> subscribeFuture = subscribe(threadId);
        if (!subscribeFuture.await(time, TimeUnit.MILLISECONDS)) {
            if (!subscribeFuture.cancel(false)) {
                subscribeFuture.onComplete((res, e) -> {
                    if (e == null) {
                        unsubscribe(subscribeFuture, threadId);
                    }
                });
            }
            acquireFailed(waitTime, unit, threadId);
            return false;
        }

        try {
            time -= System.currentTimeMillis() - current;
            if (time <= 0) {
                acquireFailed(waitTime, unit, threadId);
                return false;
            }

            while (true) {
                long currentTime = System.currentTimeMillis();
                ttl = tryAcquire(waitTime, leaseTime, unit, threadId);
                // lock acquired
                if (ttl == null) {
                    return true;
                }

                time -= System.currentTimeMillis() - currentTime;
                if (time <= 0) {
                    acquireFailed(waitTime, unit, threadId);
                    return false;
                }

                // waiting for message
                currentTime = System.currentTimeMillis();
                if (ttl >= 0 && ttl < time) {
                    subscribeFuture.getNow().getLatch().tryAcquire(ttl, TimeUnit.MILLISECONDS);
                } else {
                    subscribeFuture.getNow().getLatch().tryAcquire(time, TimeUnit.MILLISECONDS);
                }

                time -= System.currentTimeMillis() - currentTime;
                if (time <= 0) {
                    acquireFailed(waitTime, unit, threadId);
                    return false;
                }
            }
        } finally {
            unsubscribe(subscribeFuture, threadId);
        }
    }

    private Long tryAcquire(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
        return get(tryAcquireAsync(waitTime, leaseTime, unit, threadId));
    }

    private <T> RFuture<Long> tryAcquireAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
        // 第 1 种情况，如果 leaseTime 不是 -1，则不会开启 WatchDog
        if (leaseTime != -1) {
            return tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_LONG);
        }
        
        // 第 2 种情况，如果 leaseTime 是 -1，则会开启 WatchDog
        RFuture<Long> ttlRemainingFuture = tryLockInnerAsync(
                waitTime,
                internalLockLeaseTime,
                TimeUnit.MILLISECONDS,
                threadId,
                RedisCommands.EVAL_LONG
        );
        ttlRemainingFuture.onComplete((ttlRemaining, e) -> {
            if (e != null) {
                return;
            }

            // lock acquired
            if (ttlRemaining == null) {
                // 进行续期
                scheduleExpirationRenewal(threadId);
            }
        });
        return ttlRemainingFuture;
    }

    protected void scheduleExpirationRenewal(long threadId) {
        ExpirationEntry entry = new ExpirationEntry();
        ExpirationEntry oldEntry = EXPIRATION_RENEWAL_MAP.putIfAbsent(getEntryName(), entry);
        if (oldEntry != null) {
            oldEntry.addThreadId(threadId);
        } else {
            entry.addThreadId(threadId);
            renewExpiration();
        }
    }

    private void renewExpiration() {
        ExpirationEntry ee = EXPIRATION_RENEWAL_MAP.get(getEntryName());
        if (ee == null) {
            return;
        }

        Timeout task = commandExecutor.getConnectionManager().newTimeout(new TimerTask() {
            @Override
            public void run(Timeout timeout) throws Exception {
                ExpirationEntry ent = EXPIRATION_RENEWAL_MAP.get(getEntryName());
                if (ent == null) {
                    return;
                }
                Long threadId = ent.getFirstThreadId();
                if (threadId == null) {
                    return;
                }

                RFuture<Boolean> future = renewExpirationAsync(threadId);
                future.onComplete((res, e) -> {
                    if (e != null) {
                        log.error("Can't update lock " + getName() + " expiration", e);
                        EXPIRATION_RENEWAL_MAP.remove(getEntryName());
                        return;
                    }

                    if (res) {
                        // reschedule itself
                        renewExpiration();
                    }
                });
            }
        }, internalLockLeaseTime / 3, TimeUnit.MILLISECONDS);

        ee.setTimeout(task);
    }

    protected RFuture<Boolean> renewExpirationAsync(long threadId) {
        return evalWriteAsync(getName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
                "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                        "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                        "return 1; " +
                        "end; " +
                        "return 0;",
                Collections.singletonList(getName()), // KEYS
                internalLockLeaseTime, // ARGV[1]
                getLockName(threadId)  // ARGV[2]
        );
    }
}
```
