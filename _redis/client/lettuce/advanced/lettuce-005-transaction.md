---
title: "Transactions"
sequence: "105"
---

Transactions allow the execution of a set of commands in a single atomic step.
These commands are guaranteed to be executed in order and exclusively.
Commands from another user won't be executed until the transaction finishes.

Either all commands are executed, or none of them are.
**Redis will not perform a rollback if one of them fails.**
Once `exec()` is called, all commands are executed in the order specified.

```java
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisFuture;
import io.lettuce.core.TransactionResult;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.async.RedisAsyncCommands;

public class Lettuce_D_Transaction {
    public static void main(String[] args) throws Exception {
        String redisUri = "redis://str0ng_passw0rd@192.168.80.130:6379/";

        // 第 1 步，创建 Client 和 Connection
        RedisClient redisClient = RedisClient.create(redisUri);
        StatefulRedisConnection<String, String> connection = redisClient.connect();

        // 第 2 步，写入和读取数据
        RedisAsyncCommands<String, String> asyncCommands = connection.async();

        asyncCommands.multi();

        RedisFuture<String> result1 = asyncCommands.set("key1", "value1");
        RedisFuture<String> result2 = asyncCommands.set("key2", "value2");
        RedisFuture<String> result3 = asyncCommands.set("key3", "value3");


        RedisFuture<TransactionResult> execResult = asyncCommands.exec();

        TransactionResult transactionResult = execResult.get();

        String firstResult = transactionResult.get(0);
        String secondResult = transactionResult.get(0);
        String thirdResult = transactionResult.get(0);

        System.out.println("result1 = " + result1.get());
        System.out.println("result2 = " + result2.get());
        System.out.println("result3 = " + result3.get());

        System.out.println("firstResult = " + firstResult);
        System.out.println("secondResult = " + secondResult);
        System.out.println("thirdResult = " + thirdResult);

        // 第 3 步，关闭 Connection 和 Client
        connection.close();
        redisClient.close();
    }
}
```

The call to `multi` starts the transaction.
When a transaction is started, the subsequent commands are not executed until `exec()` is called.

In synchronous mode, the commands return `null`.
In asynchronous mode, the commands return `RedisFuture`.
The `exec()` method returns a `TransactionResult` which contains a list of responses.

Since the `RedisFuture`s also receive their results,
asynchronous API clients receive the transaction result in two places.
