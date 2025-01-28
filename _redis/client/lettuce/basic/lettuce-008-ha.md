---
title: "HA: Sentinel + Cluster"
sequence: "108"
---

## Master/Slave

Lettuce can connect to Master/Slave systems, query them for the topology,
and then select slaves for reading operations, which can improve throughput:

```java
import io.lettuce.core.ReadFrom;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.codec.StringCodec;
import io.lettuce.core.masterreplica.MasterReplica;
import io.lettuce.core.masterreplica.StatefulRedisMasterReplicaConnection;

public class Lettuce_G_MasterSlave {
    public static void main(String[] args) {
        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create();
        StatefulRedisMasterReplicaConnection<String, String> connection = MasterReplica.connect(
                redisClient,
                StringCodec.UTF8,
                RedisURI.create("redis://str0ng_passw0rd@192.168.80.131:6379/")
        );

        // 第 2 步，写入和读取数据
        connection.setReadFrom(ReadFrom.REPLICA);

        // 写入数据
        RedisCommands<String, String> commands1 = connection.sync();
        String value1 = commands1.set("mykey", "Hello Redis");
        System.out.println("value1 = " + value1);

        // 读取数据
        RedisCommands<String, String> commands2 = connection.sync();
        String value2 = commands2.get("mykey");
        System.out.println("value2 = " + value2);

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

## Sentinel

```java
import io.lettuce.core.ReadFrom;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.codec.StringCodec;
import io.lettuce.core.masterreplica.MasterReplica;
import io.lettuce.core.masterreplica.StatefulRedisMasterReplicaConnection;

public class Lettuce_H_Sentinel {
    public static void main(String[] args) {
        // Syntax: redis-sentinel://[password@]host[:port][,host2[:port2]][/databaseNumber]#sentinelMasterId
        String uri = "redis-sentinel://str0ng_passw0rd@192.168.80.231:26379,192.168.80.232:26379,192.168.80.233:26379/0#mymaster";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(uri);
        StatefulRedisMasterReplicaConnection<String, String> connection = MasterReplica.connect(
                redisClient,
                StringCodec.UTF8,
                RedisURI.create(uri)
        );
        connection.setReadFrom(ReadFrom.UPSTREAM_PREFERRED);

        System.out.println("Connected to Redis");

        // 第 2 步，写入和读取数据
        RedisCommands<String, String> commands = connection.sync();
        String value1 = commands.set("mykey", "Hello Sentinel");
        System.out.println("value1 = " + value1);

        String value2 = commands.get("mykey");
        System.out.println("value2 = " + value2);

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

public class Lettuce_H_Sentinel {
    public static void main(String[] args) {
        // Syntax: redis-sentinel://[password@]host[:port][,host2[:port2]][/databaseNumber]#sentinelMasterId
        String uri = "redis-sentinel://str0ng_passw0rd@192.168.80.231:26379,192.168.80.232:26379,192.168.80.233:26379,/0#mymaster";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(uri);
        StatefulRedisConnection<String, String> connection = redisClient.connect();

        // 第 2 步，写入和读取数据
        RedisCommands<String, String> commands = connection.sync();
        String value1 = commands.set("mykey", "Hello Sentinel");
        System.out.println("value1 = " + value1);

        String value2 = commands.get("mykey");
        System.out.println("value2 = " + value2);

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

public class Lettuce_H_Sentinel {
    public static void main(String[] args) {
        RedisURI redisUri = RedisURI.Builder
                .sentinel("192.168.80.231", "mymaster")
                .withSentinel("192.168.80.232")
                .withSentinel("192.168.80.233")
                .withPassword("str0ng_passw0rd".toCharArray())
                .build();

        try (
                RedisClient client = RedisClient.create(redisUri);
                StatefulRedisConnection<String, String> connection = client.connect();
        ) {
            RedisCommands<String, String> commands = connection.sync();
            String value1 = commands.set("mykey", "Hello Sentinel");
            System.out.println("value1 = " + value1);

            String value2 = commands.get("mykey");
            System.out.println("value2 = " + value2);
        }
    }
}
```

## Clusters

```java
import io.lettuce.core.cluster.RedisClusterClient;
import io.lettuce.core.cluster.api.StatefulRedisClusterConnection;
import io.lettuce.core.cluster.api.sync.RedisAdvancedClusterCommands;

public class Lettuce_I_Cluster {
    public static void main(String[] args) {
        // Syntax: redis://[password@]host[:port]
        // Syntax: redis://[username:password@]host[:port]
        String uri = "redis://str0ng_passw0rd@192.168.80.131:6379";

        // 第 1 步，创建 Client 和 Connection
        RedisClusterClient redisClient = RedisClusterClient.create(uri);
        StatefulRedisClusterConnection<String, String> connection = redisClient.connect();

        // 第 2 步，写入和读取数据
        RedisAdvancedClusterCommands<String, String> syncCommands = connection.sync();
        String value1 = syncCommands.set("mykey", "Hello Cluster");
        System.out.println("value1 = " + value1);

        String value2 = syncCommands.get("mykey");
        System.out.println("value2 = " + value2);

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

```java
import io.lettuce.core.RedisURI;
import io.lettuce.core.cluster.RedisClusterClient;
import io.lettuce.core.cluster.api.StatefulRedisClusterConnection;
import io.lettuce.core.cluster.api.sync.RedisAdvancedClusterCommands;

public class Lettuce_I_Cluster {
    public static void main(String[] args) {
        RedisURI redisUri = RedisURI.Builder
                .redis("192.168.80.131")
                .withPassword("str0ng_passw0rd".toCharArray())
                .build();
        try (
                RedisClusterClient clusterClient = RedisClusterClient.create(redisUri);
                StatefulRedisClusterConnection<String, String> connection = clusterClient.connect();
        ) {
            RedisAdvancedClusterCommands<String, String> syncCommands = connection.sync();

            String value = syncCommands.get("mykey");
            System.out.println("value = " + value);
        }
    }
}
```

`RedisAdvancedClusterCommands` holds the set of Redis commands supported by the cluster,
routing them to the instance that holds the key.

## Reference

- [ConnectToRedisUsingRedisSentinel](https://github.com/lettuce-io/lettuce-core/blob/6.3.0.RELEASE/src/test/java/io/lettuce/examples/ConnectToRedisUsingRedisSentinel.java)
- [ConnectToRedisCluster](https://github.com/lettuce-io/lettuce-core/blob/6.3.0.RELEASE/src/test/java/io/lettuce/examples/ConnectToRedisCluster.java)
- []()
