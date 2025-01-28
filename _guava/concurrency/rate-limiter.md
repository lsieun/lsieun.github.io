---
title: "RateLimiter"
sequence: "101"
---

```java
import com.google.common.util.concurrent.RateLimiter;

public class HelloWorld {
    public static void main(String[] args) {
        RateLimiter limiter = RateLimiter.create(2);

        long begin = System.currentTimeMillis();
        for (int i = 0; i < 20; i++) {
            limiter.acquire();
            System.out.println("i = " + i);
        }
        long end = System.currentTimeMillis();
        long elapsed = end - begin;
        System.out.println("elapsed = " + elapsed);
    }
}
```

## Reference

- [超详细的Guava RateLimiter限流原理解析](https://zhuanlan.zhihu.com/p/60979444)
- [Quick Guide to the Guava RateLimiter](https://www.baeldung.com/guava-rate-limiter)
