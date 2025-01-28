---
title: "Jedis 连接（Standalone/Sentinel/Cluster）"
sequence: "102"
---

## 单节点

```java
import redis.clients.jedis.Jedis;

public class JedisType_001_String {
    public static void main(String[] args) {
        // 第 1 步，创建
        Jedis client = new Jedis("192.168.80.130", 6379);

        // 第 2 步，操作
        client.set("greeting", "Hello Redis");
        String cachedResponse = client.get("greeting");
        System.out.println(cachedResponse);

        // 第 3 步，关闭
        client.close();
    }
}
```

## Sentinel

第 1 种方式：

```java
import java.util.HashSet;
import java.util.Set;

public class JedisSentinelRunner {

    public static void main(String[] args) {
        String masterName = "mymaster";
        // password 是主节点的密码，而不是 redis sentinel 的密码
        String password = "str0ng_passw0rd";
        Set<String> sentinels = new HashSet<>();
        sentinels.add("192.168.80.231:26379");
        sentinels.add("192.168.80.232:26379");
        sentinels.add("192.168.80.233:26379");

        try (
                JedisSentinelPool pool = new JedisSentinelPool(masterName, sentinels, password);
                Jedis jedis = pool.getResource();
        ) {
            String result = jedis.get("mykey");
            System.out.println(result);
        }

    }
}
```

第 2 种方式：

```java
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisSentinelPool;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

public class JedisSentinelRunner {

    //可用连接实例的最大数目，默认为8；
    //如果赋值为-1，则表示不限制，如果pool已经分配了maxActive个jedis实例，则此时pool的状态为exhausted(耗尽)
    private static final int MAX_TOTAL = 1024;

    //控制一个pool最多有多少个状态为idle(空闲)的jedis实例，默认值是8
    private static final int MAX_IDLE = 200;

    //等待可用连接的最大时间，单位是毫秒，默认值为-1，表示永不超时。
    //如果超过等待时间，则直接抛出JedisConnectionException
    private static final int MAX_WAIT_MILLIS = 10000;

    //客户端超时时间配置
    private static final int TIMEOUT = 10000;

    //在borrow(用)一个jedis实例时，是否提前进行validate(验证)操作；
    //如果为true，则得到的jedis实例均是可用的
    private static final boolean TEST_ON_BORROW = true;

    //在空闲时检查有效性, 默认false
    private static final boolean TEST_WHILE_IDLE = true;

    //是否进行有效性检查
    private static final boolean TEST_ON_RETURN = true;

    public static void main(String[] args) {
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxTotal(MAX_TOTAL);
        config.setMaxIdle(MAX_IDLE);
        config.setMaxWait(Duration.of(MAX_WAIT_MILLIS, ChronoUnit.MILLIS));
        config.setTestOnBorrow(TEST_ON_BORROW);
        config.setTestWhileIdle(TEST_WHILE_IDLE);
        config.setTestOnReturn(TEST_ON_RETURN);

        String masterName = "mymaster";
        // password 是主节点的密码，而不是 redis sentinel 的密码
        String password = "str0ng_passw0rd";
        Set<String> sentinels = new HashSet<>();
        sentinels.add(new HostAndPort("192.168.80.231", 26379).toString());
        sentinels.add(new HostAndPort("192.168.80.232", 26379).toString());
        sentinels.add(new HostAndPort("192.168.80.233", 26379).toString());

        try (
                JedisSentinelPool pool = new JedisSentinelPool(masterName, sentinels, config, TIMEOUT, password);
                Jedis jedis = pool.getResource();
        ) {
            String result = jedis.get("mykey");
            System.out.println(result);
        }

    }
}
```

## Cluster

```java
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;

import java.util.HashSet;
import java.util.Set;

public class JedisConnection_010_Cluster {
    public static void main(String[] args) {
        Set<HostAndPort> nodes = new HashSet<>();
        nodes.add(new HostAndPort("server1", 6379));
        nodes.add(new HostAndPort("server2", 6379));
        nodes.add(new HostAndPort("server3", 6379));
        nodes.add(new HostAndPort("server4", 6379));
        nodes.add(new HostAndPort("server5", 6379));
        nodes.add(new HostAndPort("server6", 6379));

        // 第 1 步，创建
        JedisCluster client = new JedisCluster(nodes, "default", "str0ng_passw0rd");

        // 第 2 步，使用
        client.set("hello", "world");
        String result = client.get("hello");
        System.out.println("result = " + result);

        // 第 3 步，关闭
        client.close();
    }
}
```
