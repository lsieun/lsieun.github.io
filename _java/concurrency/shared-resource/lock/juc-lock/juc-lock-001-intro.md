---
title: "JUC Lock"
sequence: "101"
---

[UP](/java-concurrency.html)


Simply put, a lock is a more flexible and sophisticated **thread synchronization mechanism**
than the standard `synchronized` block.

The `Lock` interface has been around since Java 1.5.
It's defined inside the `java.util.concurrent.lock` package, and it provides extensive operations for locking.

## Lock 接口

### Lock API

Let's take a look at the methods in the `Lock` interface:

- `void lock()` – Acquire the lock if it's available.
  If the lock isn't available, a thread gets blocked until the lock is released.
- `void lockInterruptibly()` – This is similar to the `lock()`,
  but it allows the blocked thread to be interrupted and
  resume the execution through a thrown `java.lang.InterruptedException`.
- `boolean tryLock()` – This is a nonblocking version of `lock()` method.
  It attempts to acquire the lock immediately, return `true` if locking succeeds.
- `boolean tryLock(long timeout, TimeUnit timeUnit)` – This is similar to `tryLock()`,
  except it waits up the given timeout before giving up trying to acquire the Lock.
- `void unlock()` unlocks the `Lock` instance.

```java

```

```text
                       ┌─── lock()
                       │
                       ├─── lockInterruptibly()
        ┌─── lock ─────┤
        │              ├─── tryLock()
        │              │
Lock ───┤              └─── tryLock(long time, TimeUnit unit)
        │
        ├─── unlock ───┼─── unlock()
        │
        └─── other ────┼─── newCondition()
```

### 如何使用

**A locked instance should always be unlocked to avoid deadlock condition.**

A recommended code block to use the lock should contain a `try/catch` and `finally` block:

```text
Lock lock = ...; 
lock.lock();
try {
    // access to the shared resource
} finally {
    lock.unlock();
}
```

```text
Lock lock = ...;
if (lock.tryLock()) {
    try {
        // manipulate protected state
    } finally {
        lock.unlock();
    }
} else {
    // perform alternative actions
}
```

## ReadWriteLock

In addition to the `Lock` interface, we have a `ReadWriteLock` interface that maintains a pair of locks,
one for read-only operations and one for the write operation.
The read lock may be simultaneously held by multiple threads as long as there is no write.

```java
public interface ReadWriteLock {
    Lock readLock();

    Lock writeLock();
}
```

`ReadWriteLock` declares methods to acquire read or write locks:

- `Lock readLock()` returns the lock that's used for reading.
- `Lock writeLock()` returns the lock that's used for writing.
