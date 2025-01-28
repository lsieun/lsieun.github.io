---
title: "Redis command"
sequence: "103"
---

Similar to Jedis, Lettuce provides a complete Redis command set in the form of methods.

However, Lettuce implements both **synchronous** and **asynchronous** versions.

## Synchronous Commands

**The Lettuce synchronous API uses the asynchronous API.**
**Blocking is done for us at the command level.**
This means that more than one client can share a synchronous connection.

After we create a connection, we use it to create a command set:

```text
RedisCommands<String, String> syncCommands = connection.sync();
```

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

import java.util.Map;

public class Lettuce_B_Cmd_Sync {
    public static void main(String[] args) {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(redisUri);
        StatefulRedisConnection<String, String> connection = redisClient.connect();

        // 第 2 步，写入和读取数据
        RedisCommands<String, String> syncCommands = connection.sync();

        syncCommands.set("key", "Hello, Redis!");
        String value = syncCommands.get("key");
        System.out.println("value = " + value);

        syncCommands.hset("recordName", "FirstName", "John");
        syncCommands.hset("recordName", "LastName", "Smith");
        Map<String, String> record = syncCommands.hgetall("recordName");
        System.out.println("record = " + record);

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

## Asynchronous Commands

Let's take a look at the asynchronous commands:

```text
RedisAsyncCommands<String, String> asyncCommands = connection.async();
```

We retrieve a set of `RedisAsyncCommands` from the connection, similar to how we retrieved the synchronous set.
These commands return a `RedisFuture` (which is a `CompletableFuture` internally):

```text
RedisFuture<String> result = asyncCommands.get("key");
```

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisFuture;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisAsyncCommands;

public class Lettuce_B_Cmd_Async {
    public static void main(String[] args) throws Exception {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(redisUri);
        StatefulRedisConnection<String, String> connection = redisClient.connect();

        // 第 2 步，写入和读取数据
        RedisAsyncCommands<String, String> asyncCommands = connection.async();
        RedisFuture<String> result = asyncCommands.get("key");
        String value = result.get();
        System.out.println("value = " + value);

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

## Reactive API

Finally, let's see how to work with non-blocking reactive API:

```text
RedisStringReactiveCommands<String, String> reactiveCommands = connection.reactive();
```