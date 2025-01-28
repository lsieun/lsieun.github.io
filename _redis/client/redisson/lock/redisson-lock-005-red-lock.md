---
title: "RedissonReadWriteLock"
sequence: "105"
---

The `RedissonRedLock` object implements the [Redlock][distributed-locks-url] locking algorithm
for using distributed locks with Redis:

```text
RLock lock1 = redissonInstance1.getLock("lock1");

RLock lock2 = redissonInstance2.getLock("lock2");

RLock lock3 = redissonInstance3.getLock("lock3");

RedissonRedLock lock = new RedissonRedLock(lock1, lock2, lock3);

lock.lock();
try {
  ...
} finally {
   lock.unlock();
}
```

In the Redlock algorithm, we have a number of independent Redis master nodes
located on separate computers or virtual machines.
The algorithm attempts to acquire the lock in each of these instances sequentially,
using the same key name and random value.
The lock is only acquired if the client was able to acquire the lock
from the majority of the instances quicker than the total time for which the lock is valid.

[distributed-locks-url]: https://redis.io/docs/manual/patterns/distributed-locks/
