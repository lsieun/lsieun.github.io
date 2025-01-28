---
title: "创建 Lettuce 连接"
sequence: "102"
---

## 如何使用

使用步骤：

- 第 1 步，准备 Redis URI
- 第 2 步，使用 Redis URI 创建 `RedisClient`
- 第 3 步，建立 Redis Connection
- 第 4 步，使用 Redis Connection 发送 RedisCommands

```text
RedisClient redisClient = RedisClient.create("redis://password@localhost:6379/");
StatefulRedisConnection<String, String> connection = redisClient.connect();
```

A `StatefulRedisConnection` is what it sounds like;
a thread-safe connection to a Redis server that will maintain its connection to the server and reconnect if needed.
Once we have a connection, we can use it to execute Redis commands either synchronously or asynchronously.

`RedisClient` uses substantial system resources, as it holds Netty resources for communicating with the Redis server.
Applications that require multiple connections should use a single `RedisClient`.

```text
RedisClient 与 Connection 的比例关系为 1:N
```

## 创建连接

### Redis URIs

Lettuce leverages a custom syntax for Redis URIs. This is the schema:

```text
redis :// [password@] host [: port] [/ database]
  [? [timeout=timeout[d|h|m|s|ms|us|ns]]
  [&_database=database_]]
```

There are four URI schemes:

- `redis` – a standalone Redis server
- `rediss` – a standalone Redis server via an SSL connection
- `redis-socket` – a standalone Redis server via a Unix domain socket
- `redis-sentinel` – a Redis Sentinel server

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

public class Lettuce_A_Connection {
    public static void main(String[] args) {
        // Syntax: redis://[password@]host[:port][/databaseNumber]
        // Syntax: redis://[username:password@]host[:port][/databaseNumber]
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/0";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(redisUri);
        StatefulRedisConnection<String, String> connection = redisClient.connect();

        // 第 2 步，写入和读取数据
        RedisCommands<String, String> syncCommands = connection.sync();
        String value1 = syncCommands.set("mykey", "Hello Redis Connection");
        System.out.println("value1 = " + value1);

        String value2 = syncCommands.get("mykey");
        System.out.println("value2 = " + value2);

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```


### 使用 Builder

Lettuce also has a `RedisURI` class for building connections. It offers the Builder pattern:

```text
RedisURI.Builder
  .redis("localhost", 6379).auth("password")
  .database(1).build();
```

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

public class Lettuce_A_Connection {
    public static void main(String[] args) {
        String password = "str0ng_passw0rd";
        RedisURI redisUri = RedisURI.Builder
                .redis("192.168.80.130", 6379)
                .withPassword(password.toCharArray())
                .withDatabase(0)
                .build();
        try (RedisClient redisClient = RedisClient.create(redisUri)) {
            StatefulRedisConnection<String, String> connection = redisClient.connect();
            RedisCommands<String, String> syncCommands = connection.sync();
            String result = syncCommands.get("mykey");
            System.out.println("result = " + result);
        }
    }
}
```

