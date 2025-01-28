---
title: "RedissonFairLock"
sequence: "103"
---

## RedissonFairLock

Like its cousin `RLock`, `RedissonFairLock` also implements the `java.util.concurrent.locks.Lock` interface.
By using a `RedissonFairLock`, you can guarantee that threads will acquire a resource in the same order
that they requested it (i.e. a "first in, first out" queue).
Redisson gives threads that have died five seconds to restart
before the resource is unlocked for the next thread in the queue.

```java
public class RedissonFairLock extends RedissonLock implements RLock {
}
```

## 使用方法

As with `RLock`s, creating and initiating a `FairLock` is a straightforward process:

```text
RLock lock = redisson.getFairLock("anyLock");
lock.lock();
try {
  ...
} catch {
  lock.unlock();
}
```

