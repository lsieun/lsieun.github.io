---
title: "Objects"
sequence: "104"
---

An individual instance of a **Redisson object is serialized and
stored in any of the available Redis nodes backing Redisson**.
These objects could be distributed in a cluster across multiple nodes and
can be accessed by a single application or multiple applications/servers.

These distributed objects follow specifications from the `java.util.concurrent.atomic` package.
**They support lock-free, thread-safe and atomic operations on objects stored in Redis.**
Data consistency between applications/servers is ensured as values are not updated
while another application is reading the object.

Distributed objects provided by Redisson include:

- ObjectHolder
- BinaryStreamHolder
- GeospatialHolder
- BitSet
- AtomicLong
- AtomicDouble
- Topic
- BloomFilter
- HyperLogLog

## Keys

Redisson objects are bound to Redis keys.
We can manage these keys through the `RKeys` interface.
And then, we access our Redisson objects using these keys.

There are several options we may use to get the Redis keys.

We can simply get all the keys:

```text
RKeys keys = client.getKeys();
```

Alternatively, we can extract only the names:

```text
Iterable<String> allKeys = keys.getKeys();
```

And finally, we're able to get the keys conforming to a pattern:

```text
Iterable<String> keysByPattern = keys.getKeysByPattern("key*")
```

The `RKeys` interface also allows deleting keys, deleting keys by pattern and other useful key-based operations
that we could use to manage our keys and objects.

## Object Holder

Represented by the `RBucket` class, this object can hold any type of object.
This object has a maximum size of 512MB:

```text
RBucket<Ledger> bucket = client.getBucket("ledger");
bucket.set(new Ledger());
Ledger ledger = bucket.get();
```

The `RBucket` object can perform atomic operations such as `compareAndSet` and `getAndSet` on objects it holds.

```java
import lsieun.redisson.entity.User;
import org.redisson.Redisson;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_D_Object {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，存储和读取数据
        RBucket<Object> bucket = client.getBucket("tom");
        User tom = new User("Tom", 10);
        bucket.set(tom);

        Object obj = bucket.get();
        System.out.println(obj);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

## AtomicLong

Represented by the `RAtomicLong` class,
this object closely resembles the `java.util.concurrent.atomic.AtomicLong` class and
represents a long value that can be updated atomically:

```java
import org.redisson.Redisson;
import org.redisson.api.RAtomicLong;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_D_Object {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，存储和读取数据
        RAtomicLong atomicLong = client.getAtomicLong("myAtomicLong");
        atomicLong.set(5);
        atomicLong.incrementAndGet();
        long value = atomicLong.get();
        System.out.println("value = " + value);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

## Topic

The Topic object supports Redis "publish and subscribe" mechanism.

```java
import java.io.Serializable;

public class CustomMessage implements Serializable {
    private String message;

    public CustomMessage() {
    }

    public CustomMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
```

```java
import org.redisson.api.listener.MessageListener;

public class MyMessageListener implements MessageListener<CustomMessage> {
    @Override
    public void onMessage(CharSequence channel, CustomMessage msg) {
        String info = String.format("channel = %s, msg = %s", channel, msg.getMessage());
        System.out.println(info);
    }
}
```

```java
import org.redisson.Redisson;
import org.redisson.api.RTopic;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_F_Pub {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，发布 Topic
        RTopic publishTopic = client.getTopic("lsieun");
        long clientsReceivedMessage = publishTopic.publish(new CustomMessage("This is a message"));
        System.out.println("clientsReceivedMessage = " + clientsReceivedMessage);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

```java
import org.redisson.Redisson;
import org.redisson.api.RTopic;
import org.redisson.api.RedissonClient;
import org.redisson.api.listener.MessageListener;
import org.redisson.config.Config;

public class Redisson_F_Sub {
    public static void main(String[] args) throws Exception {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，订阅 Topic
        RTopic subscribeTopic = client.getTopic("lsieun");
        MessageListener<CustomMessage> listener = new MyMessageListener();
        subscribeTopic.addListener(CustomMessage.class, listener);

        Thread.sleep(20000);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

