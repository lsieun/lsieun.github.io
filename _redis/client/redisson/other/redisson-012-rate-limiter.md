---
title: "RateLimiter"
sequence: "112"
---

```java
import java.util.concurrent.CountDownLatch;

import org.redisson.Redisson;
import org.redisson.api.RRateLimiter;
import org.redisson.api.RateIntervalUnit;
import org.redisson.api.RateType;
import org.redisson.api.RedissonClient;

public class RateLimiterExamples {

    public static void main(String[] args) throws InterruptedException {
        // connects to 127.0.0.1:6379 by default
        RedissonClient redisson = Redisson.create();

        RRateLimiter limiter = redisson.getRateLimiter("myLimiter");
        // one permit per 2 seconds
        limiter.trySetRate(RateType.OVERALL, 1, 2, RateIntervalUnit.SECONDS);
        
        CountDownLatch latch = new CountDownLatch(2);
        limiter.acquire(1);
        latch.countDown();

        Thread t = new Thread(() -> {
            limiter.acquire(1);
            
            latch.countDown();
        });
        t.start();
        t.join();
        
        latch.await();
        
        redisson.shutdown();
    }
    
}
```

## Reference

- [RateLimiterExamples.java](https://github.com/redisson/redisson-examples/blob/master/objects-examples/src/main/java/org/redisson/example/objects/RateLimiterExamples.java)
