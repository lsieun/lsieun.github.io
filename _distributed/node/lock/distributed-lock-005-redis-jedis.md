---
title: "Redis 分布式锁（Jedis）"
sequence: "105"
---

## 方案一：SETNX + EXPIRE

提到 Redis 的分布式锁，很多小伙伴马上就会想到 setnx+ expire 命令。即先用 setnx 来抢锁，如果抢到之后，再用 expire 给锁设置一个过期时间，防止锁忘记了释放。

SETNX 是 SET IF NOT EXISTS 的简写.日常命令格式是 SETNX key value，如果 key 不存在，则 SETNX 成功返回 1，如果这个 key 已经存在了，则返回 0。

假设某电商网站的某商品做秒杀活动，key 可以设置为 key_resource_id，value 设置任意值，伪代码如下：

```text
if (jedis.setnx(key_resource_id, lock_value) == 1) { //加锁
    jedis.expire(key_resource_id, 100); //设置过期时间
    try {
        // do something
    } catch (Exception ex) {
        ex.printStackTrace();
    } finally {
        jedis.del(key_resource_id); //释放锁
    }
}
```

但是这个方案中，`setnx` 和 `expire` 两个命令分开了，**「不是原子操作」**。
如果执行完 `setnx` 加锁，正要执行 `expire` 设置过期时间时，进程 crash 或者要重启维护了，
那么这个锁就“长生不老”了，**「别的线程永远获取不到锁啦」**。

```java
import redis.clients.jedis.Jedis;

public class JedisLock_001_First {
    public static void main(String[] args) {
        // 第 1 步，创建 Jedis
        Jedis jedis = new Jedis(JedisConst.REDIS_STANDALONE_HOST, 6379);

        // 第 2 步，操作
        String key_resource_id = "my-resource-id";
        String lock_value = "some-value";
        if (jedis.setnx(key_resource_id, lock_value) == 1) { //加锁
            jedis.expire(key_resource_id, 100); //设置过期时间
            try {
                // do something
            } catch (Exception ex) {
                ex.printStackTrace();
            } finally {
                jedis.del(key_resource_id); //释放锁
            }
        }

        // 第 3 步，关闭 Jedis
        jedis.close();
    }
}
```

## 方案二：SETNX + value 值是(系统时间 + 过期时间)

为了解决方案一，「发生异常锁得不到释放的场景」，有小伙伴认为，可以把过期时间放到 setnx 的 value 值里面。如果加锁失败，再拿出 value 值校验一下即可。加锁代码如下：

## 方案三：使用 Lua 脚本(包含 SETNX + EXPIRE 两条指令)

## 方案四：SET 的扩展命令（SET EX PX NX）

除了使用，使用 Lua 脚本，保证 `SETNX + EXPIRE` 两条指令的原子性，我们还可以巧用 Redis 的 SET 指令扩展参数！
（`SET key value[EX seconds][PX milliseconds][NX|XX]`），它也是原子性的！

```text
SET key value [EX seconds][PX milliseconds][NX|XX]

- EX seconds：设定 key 的过期时间，时间单位是秒。
- PX milliseconds：设定 key 的过期时间，单位为毫秒
- NX：表示 key 不存在的时候，才能 set 成功，也即保证只有第一个客户端请求才能获得锁，而其他客户端请求只能等其释放锁，才能获取。
- XX: 仅当 key 存在时设置值
```


```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.SetParams;

public class JedisLock_003_SetNX_With_Atom {
    public static void main(String[] args) {
        // 第 1 步，创建 Jedis
        Jedis jedis = new Jedis(JedisConst.REDIS_STANDALONE_HOST, 6379);

        // 第 2 步，操作
        String key_resource_id = "my-resource-id";
        String lock_value = "some-value";

        String reply = jedis.set(
                key_resource_id, lock_value,
                SetParams.setParams().nx().ex(100)
        ); // 尝试加锁
        System.out.println("reply = " + reply);

        if (reply != null) {
            try {
                System.out.println("业务处理");
            } catch (Exception ex) {
                ex.printStackTrace();
            } finally {
                //jedis.del(key_resource_id); //释放锁
            }
        }

        // 第 3 步，关闭 Jedis
        jedis.close();
    }
}
```

但是呢，这个方案还是可能存在问题：

问题一：「锁过期释放了，业务还没执行完」。
假设线程a获取锁成功，一直在执行临界区的代码。但是100s过去后，它还没执行完。
但是，这时候锁已经过期了，此时线程b又请求过来。
显然线程b就可以获得锁成功，也开始执行临界区的代码。
那么问题就来了，临界区的业务代码都不是严格串行执行的啦。

问题二：「锁被别的线程误删」。假设线程a执行完后，去释放锁。
但是它不知道当前的锁可能是线程b持有的（线程a去释放锁时，有可能过期时间已经到了，此时线程b进来占有了锁）。
那线程a就把线程b的锁释放掉了，但是线程b临界区业务代码可能都还没执行完呢。

## 方案五：SET EX PX NX  + 校验唯一随机值,再删除

既然锁可能被别的线程误删，那我们给value值设置一个标记当前线程唯一的随机数，在删除的时候，校验一下，不就OK了嘛。

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.SetParams;

public class JedisLock_004_SetNX_With_Atom_And_Request {
    public static void main(String[] args) {
        // 第 1 步，创建 Jedis
        Jedis jedis = new Jedis(JedisConst.REDIS_STANDALONE_HOST, 6379);

        // 第 2 步，操作
        String key_resource_id = "my-resource-id";
        String unique_request_id = "my-request-id";

        String reply = jedis.set(
                key_resource_id, unique_request_id,
                SetParams.setParams().nx().ex(100)
        ); // 尝试加锁
        System.out.println("reply = " + reply);

        if (reply != null) {
            try {
                System.out.println("业务处理");
            } catch (Exception ex) {
                ex.printStackTrace();
            } finally {
                // 判断是不是当前线程加的锁，是才释放
                if (unique_request_id.equals(jedis.get(key_resource_id))) {
                    jedis.del(key_resource_id); // 释放锁
                }
            }
        }

        // 第 3 步，关闭 Jedis
        jedis.close();
    }
}
```

在这里，「判断是不是当前线程加的锁」和「释放锁」不是一个原子操作。
如果调用jedis.del()释放锁的时候，可能这把锁已经不属于当前客户端，会解除他人加的锁。

![](/assets/images/redis/jedis/not-atom-get-and-del.png)

为了更严谨，一般也是用lua脚本代替。lua脚本如下：

```text
if redis.call('get',KEYS[1]) == ARGV[1] then 
   return redis.call('del',KEYS[1]) 
else
   return 0
end;
```

