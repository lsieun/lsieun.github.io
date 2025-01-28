---
title: "Publish/Subscribe"
sequence: "107"
---

Redis offers a simple publish/subscribe messaging system.
Subscribers consume messages from channels with the `subscribe` command.
Messages aren't persisted; they are only delivered to users when they are subscribed to a channel.

Redis uses the pub/sub system for notifications about the Redis dataset,
giving clients the ability to receive events about keys being set, deleted, expired, etc.

## Subscriber

A `RedisPubSubListener` receives pub/sub-messages.

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.pubsub.StatefulRedisPubSubConnection;
import io.lettuce.core.pubsub.api.async.RedisPubSubAsyncCommands;

public class Lettuce_F_Pub {
    public static void main(String[] args) {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(redisUri);
        StatefulRedisPubSubConnection<String, String> connection = redisClient.connectPubSub();

        // 第 2 步，发布数据
        RedisPubSubAsyncCommands<String, String> commands = connection.async();
        commands.publish("lsieun", "Hello, Pub/Sub");

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.pubsub.StatefulRedisPubSubConnection;
import io.lettuce.core.pubsub.api.async.RedisPubSubAsyncCommands;

public class Lettuce_F_Sub {
    public static void main(String[] args) {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";
        try (RedisClient redisClient = RedisClient.create(redisUri)) {
            StatefulRedisPubSubConnection<String, String> connection = redisClient.connectPubSub();
            connection.addListener(new Listener());

            RedisPubSubAsyncCommands<String, String> async = connection.async();
            async.subscribe("channel");

            Thread.sleep(10000);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```
