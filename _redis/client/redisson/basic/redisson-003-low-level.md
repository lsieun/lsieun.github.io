---
title: "Redisson Low Level"
sequence: "103"
---

## pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.redisson</groupId>
        <artifactId>redisson</artifactId>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
    </dependency>

    <dependency>
        <groupId>io.netty</groupId>
        <artifactId>netty-transport-native-epoll</artifactId>
    </dependency>
    <dependency>
        <groupId>io.netty</groupId>
        <artifactId>netty-transport-native-kqueue</artifactId>
    </dependency>
</dependencies>
```

## Code

```java
import org.redisson.client.RedisClient;
import org.redisson.client.RedisClientConfig;
import org.redisson.client.RedisConnection;
import org.redisson.client.codec.StringCodec;
import org.redisson.client.protocol.RedisCommands;

public class Redisson_B_LowLevel {
    public static void main(String[] args) {
        RedisClientConfig redisClientConfig = new RedisClientConfig();
        redisClientConfig.setAddress("192.168.80.130", 6379);

        // 第 1 步，创建 Client 和 Connection
        RedisClient client = RedisClient.create(redisClientConfig);
        RedisConnection connection = client.connect();

        // 第 2 步，写入和读取数据
        Object value1 = connection.sync(StringCodec.INSTANCE, RedisCommands.SET, "test", "Hello Redisson");
        System.out.println("value1 = " + value1);

        Object value2 = connection.sync(StringCodec.INSTANCE, RedisCommands.GET, "test");
        System.out.println("value2 = " + value2);

        // 第 3 步，关闭 Connection 和 Client
        connection.closeAsync();
        client.shutdown();
    }
}
```