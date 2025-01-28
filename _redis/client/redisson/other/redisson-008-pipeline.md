---
title: "Pipelining"
sequence: "108"
---

Redisson supports pipelining.
**Multiple operations can be batched as a single atomic operation.**
This is facilitated by the `RBatch` class.
Multiple commands are aggregated against an `RBatch` object instance before they are executed:

```java
import org.redisson.Redisson;
import org.redisson.api.BatchResult;
import org.redisson.api.RBatch;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

import java.util.List;

public class Redisson_K_Pipeline {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，批处理
        RBatch batch = client.createBatch();
        batch.getMap("userMap").fastPutAsync("tom", "Tomcat");
        batch.getMap("userMap").putAsync("jerry", "JerryMouse");
        BatchResult<?> batchResult = batch.execute();

        List<?> responses = batchResult.getResponses();
        responses.forEach(System.out::println);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```
