---
title: "Collections"
sequence: "105"
---

Distributed collections provided by Redisson include:

- Map
- Multimap
- Set
- SortedSet
- ScoredSortedSet
- LexSortedSet
- List
- Queue
- Deque
- BlockingQueue
- BoundedBlockingQueue
- BlockingDeque
- BlockingFairQueue
- DelayedQueue
- PriorityQueue
- PriorityDeque

## Map

Redisson-based maps implement the `java.util.concurrent.ConcurrentMap` and `java.util.Map` interfaces.
Redisson has four map implementations.
These are `RMap`, `RMapCache`, `RLocalCachedMap` and `RClusteredMap`.

```java
import org.redisson.Redisson;
import org.redisson.api.RMap;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_G_Collection {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，操作数据
        RMap<String, User> map = client.getMap("myMap");
        String name = "tom";
        User user = map.get(name);
        if (user != null) {
            System.out.println("user = " + user);
        } else {
            user = new User(name, 9);
            map.put(name, user);
            System.out.println("add " + name);
        }

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

`RMapCache` supports map entry eviction.
`RLocalCachedMap` allows local caching of map entries.
`RClusteredMap` allows data from a single map to be split across Redis cluster master nodes.

## Set

Redisson-based Set implements the `java.util.Set` interface.

Redisson has three Set implementations, `RSet`, `RSetCache`, and `RClusteredSet`
with similar functionality as their map counterparts.

```java
import org.redisson.Redisson;
import org.redisson.api.RSet;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_G_Collection {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，操作数据
        RSet<User> set = client.getSet("mySet");
        User tom = new User("tom", 10);
        User jerry = new User("jerry", 10);
        set.add(tom);
        set.add(jerry);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```

## List

Redisson-based Lists implement the `java.util.List` interface.

```java
import org.redisson.Redisson;
import org.redisson.api.RList;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_G_Collection {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，操作数据
        RList<User> list = client.getList("myList");
        User tom = new User("tom", 10);
        User jerry = new User("jerry", 10);
        list.add(tom);
        list.add(jerry);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```
