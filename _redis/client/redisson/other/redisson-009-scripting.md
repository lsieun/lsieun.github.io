---
title: "Scripting"
sequence: "109"
---

Redisson supports LUA scripting.
We can execute LUA scripts against Redis:

```java
import org.redisson.Redisson;
import org.redisson.api.RScript;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_L_Scripting {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://192.168.80.130:6379");

        // 第 1 步，创建 Client
        RedissonClient client = Redisson.create(config);

        // 第 2 步，批处理
        client.getBucket("foo").set("bar");
        String result = client.getScript().eval(
                RScript.Mode.READ_ONLY,
                "return redis.call('get', 'foo')",
                RScript.ReturnType.VALUE
        );
        System.out.println("result = " + result);

        // 第 3 步，关闭 Client
        client.shutdown();
    }
}
```
