---
title: "Redis Data Structures"
sequence: "104"
---

## Lists

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisFuture;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisAsyncCommands;

import java.util.concurrent.ExecutionException;

public class Lettuce_C_DataStructure {
    public static void main(String[] args) {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";
        try (RedisClient redisClient = RedisClient.create(redisUri)) {
            StatefulRedisConnection<String, String> connection = redisClient.connect();
            RedisAsyncCommands<String, String> asyncCommands = connection.async();

            asyncCommands.lpush("tasks", "firstTask");
            asyncCommands.lpush("tasks", "secondTask");
            RedisFuture<String> redisFuture = asyncCommands.rpop("tasks");

            String result1 = redisFuture.get();
            System.out.println("result1 = " + result1);

            asyncCommands.del("tasks");
            asyncCommands.lpush("tasks", "firstTask");
            asyncCommands.lpush("tasks", "secondTask");
            redisFuture = asyncCommands.lpop("tasks");

            String result2 = redisFuture.get();
            System.out.println("result2 = " + result2);
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## Sets

Redis Sets are unordered collections of Strings similar to Java Sets; there are no duplicate elements:

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisFuture;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisAsyncCommands;

import java.util.Set;
import java.util.concurrent.ExecutionException;

public class Lettuce_C_DataStructure {
    public static void main(String[] args) {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";
        try (RedisClient redisClient = RedisClient.create(redisUri)) {
            StatefulRedisConnection<String, String> connection = redisClient.connect();
            RedisAsyncCommands<String, String> asyncCommands = connection.async();

            asyncCommands.sadd("pets", "dog");
            asyncCommands.sadd("pets", "cat");
            asyncCommands.sadd("pets", "cat");

            RedisFuture<Set<String>> pets = asyncCommands.smembers("pets");
            System.out.println("pets = " + pets.get());

            RedisFuture<Boolean> exists = asyncCommands.sismember("pets", "dog");
            System.out.println("exists = " + exists.get());
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## Hashes

Redis Hashes are records with String fields and values.
Each record also has a key in the primary index:

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisFuture;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisAsyncCommands;

import java.util.Map;
import java.util.concurrent.ExecutionException;

public class Lettuce_C_DataStructure {
    public static void main(String[] args) {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";
        try (RedisClient redisClient = RedisClient.create(redisUri)) {
            StatefulRedisConnection<String, String> connection = redisClient.connect();
            RedisAsyncCommands<String, String> asyncCommands = connection.async();

            asyncCommands.hset("recordName", "FirstName", "John");
            asyncCommands.hset("recordName", "LastName", "Smith");

            RedisFuture<String> lastName = asyncCommands.hget("recordName", "LastName");
            System.out.println("lastName = " + lastName.get());

            RedisFuture<Map<String, String>> record = asyncCommands.hgetall("recordName");
            System.out.println("record = " + record.get());
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## Sorted Sets

Sorted Sets contain values and a rank, by which they are sorted.
The rank is 64-bit floating point value.

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisFuture;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisAsyncCommands;

import java.util.List;

public class Lettuce_C_DataStructure {
    public static void main(String[] args) throws Exception {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(redisUri);
        StatefulRedisConnection<String, String> connection = redisClient.connect();

        // 第 2 步，写入和读取数据
        RedisAsyncCommands<String, String> asyncCommands = connection.async();

        asyncCommands.zadd("sortedset", 1, "one");
        asyncCommands.zadd("sortedset", 4, "zero");
        asyncCommands.zadd("sortedset", 2, "two");

        RedisFuture<List<String>> valuesForward = asyncCommands.zrange("sortedset", 0, 3);
        System.out.println("valuesForward = " + valuesForward.get());
        RedisFuture<List<String>> valuesReverse = asyncCommands.zrevrange("sortedset", 0, 3);
        System.out.println("valuesReverse = " + valuesReverse.get());

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```


