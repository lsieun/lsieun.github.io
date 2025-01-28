---
title: "Redis Client: Jedis"
sequence: "103"
---

## 示例

### pom.xml

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
```

### String

```java
import redis.clients.jedis.Jedis;

public class Main01String {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            jedis.set("events/city/rome", "32,15,223,828");
            String cachedResponse = jedis.get("events/city/rome");
            System.out.println(cachedResponse);
        }
    }
}
```

### List

```java
import redis.clients.jedis.Jedis;

public class Main02List {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            jedis.lpush("queue#tasks", "firstTask");
            jedis.lpush("queue#tasks", "secondTask");

            String task = jedis.rpop("queue#tasks");
            System.out.println(task);
        }
    }
}
```

### Set

```java
import redis.clients.jedis.Jedis;

import java.util.Set;

public class Main03Set {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            jedis.sadd("nicknames", "nickname#1");
            jedis.sadd("nicknames", "nickname#2");
            jedis.sadd("nicknames", "nickname#1");

            Set<String> nicknames = jedis.smembers("nicknames");
            System.out.println(nicknames);

            boolean exists = jedis.sismember("nicknames", "nickname#1");
            System.out.println(exists);
        }
    }
}
```

### Hash

```java
import redis.clients.jedis.Jedis;

import java.util.Map;

public class Main04Hash {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            jedis.hset("user#1", "name", "Peter");
            jedis.hset("user#1", "job", "politician");

            String name = jedis.hget("user#1", "name");
            System.out.println(name);

            Map<String, String> fields = jedis.hgetAll("user#1");
            String job = fields.get("job");
            System.out.println(job);
        }
    }
}
```

### Sorted Set

```java
import redis.clients.jedis.Jedis;

import java.util.HashMap;
import java.util.Map;

public class Main05SortedSet {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            Map<String, Double> scores = new HashMap<>();

            scores.put("PlayerOne", 3000.0);
            scores.put("PlayerTwo", 1500.0);
            scores.put("PlayerThree", 8200.0);

            String key = "ranking";
            scores.entrySet().forEach(playerScore -> {
                jedis.zadd(key, playerScore.getValue(), playerScore.getKey());
            });

            String player = jedis.zrevrange("ranking", 0, 1).iterator().next();
            System.out.println(player);

            long rank = jedis.zrevrank("ranking", "PlayerOne");
            System.out.println(rank);
        }
    }
}
```

### Transaction

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Transaction;

import java.util.Set;

public class Main06Transaction {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            String friendsPrefix = "friends#";
            String userOneId = "4352523";
            String userTwoId = "5552321";

            Transaction t = jedis.multi();
            t.sadd(friendsPrefix + userOneId, userTwoId);
            t.sadd(friendsPrefix + userTwoId, userOneId);
            t.exec();

            Set<String> nicknames = jedis.smembers(friendsPrefix + userOneId);
            System.out.println(nicknames);

            jedis.watch("friends#deleted#" + userOneId);
        }
    }
}
```

### Pipelining

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;

import java.util.List;

public class Main07Pipelining {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            String userOneId = "4352523";
            String userTwoId = "4849888";

            Pipeline p = jedis.pipelined();
            p.sadd("searched#" + userOneId, "paris");
            p.zadd("ranking", 126, userOneId);
            p.zadd("ranking", 325, userTwoId);
            Response<Boolean> pipeExists = p.sismember("searched#" + userOneId, "paris");

            Response<List<String>> pipeRanking = p.zrange("ranking", 0, -1);
            p.sync();

            Boolean exists = pipeExists.get();
            List<String> ranking = pipeRanking.get();

            System.out.println(exists);
            System.out.println(ranking);
        }
    }
}
```

### Publish/Subscribe

#### Subscriber

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

public class Main08Subscriber {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            jedis.subscribe(new JedisPubSub() {
                @Override
                public void onMessage(String channel, String message) {
                    // handle message
                    String msg = String.format("%s - %s", channel, message);
                    System.out.println(msg);
                }
            }, "channel");
        }
    }
}
```

#### Publisher

```java
import redis.clients.jedis.Jedis;

public class Main08Publisher {
    public static void main(String[] args) {
        try (Jedis jedis = new Jedis()) {
            jedis.publish("channel", "test message");
        }
    }
}
```

### Connection Pooling

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.time.Duration;
import java.util.Set;

public class Main09ConnectionPooling {
    public static void main(String[] args) {
        final JedisPoolConfig poolConfig = buildPoolConfig();

        try (
                JedisPool jedisPool = new JedisPool(poolConfig, "localhost");
                Jedis jedis = jedisPool.getResource()
        ) {
            // do operations with jedis resource
            Set<String> keys = jedis.keys("*");
            System.out.println(keys);
        }
    }

    private static JedisPoolConfig buildPoolConfig() {
        final JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(128);
        poolConfig.setMaxIdle(128);
        poolConfig.setMinIdle(16);
        poolConfig.setTestOnBorrow(true);
        poolConfig.setTestOnReturn(true);
        poolConfig.setTestWhileIdle(true);
        poolConfig.setMinEvictableIdleTimeMillis(Duration.ofSeconds(60).toMillis());
        poolConfig.setTimeBetweenEvictionRunsMillis(Duration.ofSeconds(30).toMillis());
        poolConfig.setNumTestsPerEvictionRun(3);
        poolConfig.setBlockWhenExhausted(true);
        return poolConfig;
    }
}
```

### Redis Cluster

```java
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;

public class Main10RedisCluster {
    public static void main(String[] args) {
        try (JedisCluster jedisCluster = new JedisCluster(new HostAndPort("localhost", 6379))) {
            // use the jedisCluster resource as if it was a normal Jedis resource
        }
    }
}
```

## Reference

- [Intro to Jedis – the Java Redis Client Library](https://www.baeldung.com/jedis-java-redis-client-library)
