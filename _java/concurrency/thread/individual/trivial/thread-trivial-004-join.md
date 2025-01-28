---
title: "join"
sequence: "104"
---

[UP](/java-concurrency.html)


## Join a Thread Means Wait for Its Termination

There are three versions of the thread join methods: `join()`, `join(long millis)`, `join(long millis, int nanos)`.
The ones with the parameters specify the time to wait before the join methods return.
If `join()` is called with no parameter or the parameters are set to zero, the wait time is forever.
The join methods return either when the wait time has passed or when the target thread has ended,
whichever occurs earlier.

## 实现原理

Internally in the implementation,
the `join` methods call the `wait` methods and the `isAlive` methods of the thread instances in a loop
where `wait` waits for the `isAlive` condition.

```java
public class Thread implements Runnable {
    public final void join() throws InterruptedException {
        join(0);
    }

    public final synchronized void join(final long millis) throws InterruptedException {
        if (millis > 0) {
            if (isAlive()) {
                final long startTime = System.nanoTime();
                long delay = millis;
                do {
                    wait(delay);
                } while (isAlive() && (delay = millis -
                        TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startTime)) > 0);
            }
        } else if (millis == 0) {
            while (isAlive()) {
                wait(0);
            }
        } else {
            throw new IllegalArgumentException("timeout value is negative");
        }
    }
}
```

Therefore, applications are not recommended to use `wait`, `notify`, `notifyAll` methods on **thread instances**.
