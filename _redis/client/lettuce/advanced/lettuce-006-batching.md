---
title: "Batching"
sequence: "106"
---

Under normal conditions, Lettuce executes commands as soon as they are called by an API client.

This is what most normal applications want,
especially if they rely on receiving command results serially.

However, this behavior isn't efficient
if applications don't need results immediately or if large amounts of data are being uploaded in bulk.

Asynchronous applications can override this behavior:

```java
import io.lettuce.core.LettuceFutures;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisFuture;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisAsyncCommands;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class Lettuce_E_Batching {
    public static void main(String[] args) {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(redisUri);
        StatefulRedisConnection<String, String> connection = redisClient.connect();
        
        // 第 2 步，写入和读取数据
        connection.setAutoFlushCommands(false);
        RedisAsyncCommands<String, String> asyncCommands = connection.async();

        List<RedisFuture<?>> futures = new ArrayList<>();
        int iterations = 100;
        for (int i = 0; i < iterations; i++) {
            futures.add(asyncCommands.set("key-" + i, "value-" + i));
        }
        connection.flushCommands();

        boolean result = LettuceFutures.awaitAll(5, TimeUnit.SECONDS,
                futures.toArray(new RedisFuture[0]));
        System.out.println("result = " + result);


        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

With `setAutoFlushCommands` set to `false`, the application must call `flushCommands` manually.
In this example, we queued multiple set commands and then flushed the channel.
`AwaitAll` waits for all of the `RedisFutures` to complete.

This state is set on a per-connection basis and affects all threads that use the connection.
This feature isn't applicable to synchronous commands.
