---
title: "RedissonReadWriteLock"
sequence: "104"
---

Redisson's `RReadWriteLock` implements the `java.util.concurrent.locks.ReadWriteLock` interface.
In Java, read/write locks are actually a combination of two locks:
a read-only lock that can be owned by multiple threads simultaneously,
and a write lock that can only be owned by a single thread at once.

```java
public interface RReadWriteLock extends ReadWriteLock {
    RLock readLock();

    RLock writeLock();
}
```

```java
public class RedissonReadWriteLock extends RedissonExpirable implements RReadWriteLock {
}
```

The method of creating and initiating a `RReadWriteLock` is as follows:

```text
RReadWriteLock rwlock = redisson.getReadWriteLock("anyRWLock");

rwlock.readLock().lock();
try {
  ...
} finally {
  rwlock.readLock().lock();
}

rwlock.writeLock().lock();
try {
  ...
} finally {
  rwlock.writeLock().lock();
}
```
