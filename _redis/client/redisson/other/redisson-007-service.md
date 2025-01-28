---
title: "Services"
sequence: "107"
---

Redisson exposes 4 types of distributed services:

- Remote Service
- Live Object Service
- Executor Service
- Scheduled Executor Service

## Remote Service

This service provides **Java remote method invocation facilitated by Redis**.

A Redisson remote service consists of a **server-side** (worker instance) and **client-side** implementation.
The server-side implementation executes a remote method invoked by the client.
Calls from a remote service can be synchronous or asynchronous.

The server side registers an interface for remote invocation:


```java
import java.util.List;

public interface UserService {
    List<String> getEntries(int count);
}
```

```java
import java.util.Arrays;
import java.util.List;

public class UserServiceImpl implements UserService {

    String[] returnArray = {"entry1", "entry2", "entry3"};

    @Override
    public List<String> getEntries(int count) {
        return Arrays.asList(returnArray);
    }
}
```

```java
import org.redisson.Redisson;
import org.redisson.api.RRemoteService;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_I_RemoteService_Server {
    public static void main(String[] args) throws InterruptedException {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，操作数据
        RRemoteService remoteService = client.getRemoteService();
        UserService userService = new UserServiceImpl();

        remoteService.register(UserService.class, userService);

        Thread.sleep(60000);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

```java
import org.redisson.Redisson;
import org.redisson.api.RRemoteService;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

import java.util.List;

public class Redisson_I_RemoteService_Client {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，操作数据
        RRemoteService remoteService = client.getRemoteService();
        UserService ledgerService = remoteService.get(UserService.class);

        List<String> entries = ledgerService.getEntries(10);
        entries.forEach(System.out::println);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

## Live Object Service

Redisson Live Objects extend the concept of
standard Java objects that could only be accessed from a single JVM to 
**enhanced Java objects that could be shared between different JVMs in different machines**.

This is accomplished by mapping an object's fields to a Redis hash.
This mapping is made through a runtime-constructed proxy class.
Field getters and setters are mapped to Redis `hget`/`hset` commands.

Redisson Live Objects support atomic field access as a result of Redis' single-threaded nature.

```java
import org.redisson.api.annotation.REntity;
import org.redisson.api.annotation.RId;

@REntity
public class UserLiveObject {
    @RId
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

We annotate our class with `@REntity` and a unique or identifying field with `@RId`.

- `@REntity`: Specifies that the class is a Live Object.
- `@RId`: Specifies that the field is a Live Object's id field. Only single field could be specified per class.


```java
import org.redisson.Redisson;
import org.redisson.api.RLiveObjectService;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_J_LiveObjectService_Client1 {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，存储数据
        RLiveObjectService service = client.getLiveObjectService();

        UserLiveObject user = new UserLiveObject();
        user.setName("Spike");

        user = service.persist(user);
        System.out.println("user = " + user.getName());

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

```java
import org.redisson.Redisson;
import org.redisson.api.RLiveObjectService;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_J_LiveObjectService_Client2 {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，读取数据
        RLiveObjectService service = client.getLiveObjectService();

        UserLiveObject returnUser = service.get(UserLiveObject.class, "Spike");
        String name = returnUser.getName();
        System.out.println("name = " + name);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```
