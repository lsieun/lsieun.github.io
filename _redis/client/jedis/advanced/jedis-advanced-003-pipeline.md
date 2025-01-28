---
title: "Jedis Pipeline"
sequence: "103"
---

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;

public class JedisPipeline_001_Basic {
    public static void main(String[] args) {
        // 第 1 步，创建
        Jedis client = new Jedis(RedisConst.REDIS_STANDALONE_HOST, 6379);

        // 第 2 步，使用
        // 第 2.1 步，创建 Pipeline
        Pipeline pipeline = client.pipelined();

        // 第 2.2 步，添加 commands 到 pipeline
        pipeline.set("mykey", "Hello Pipeline");
        pipeline.sadd("myset", "Tom", "Jerry", "Spike");
        Response<String> myValue = pipeline.get("mykey");
        Response<Long> mySetSize = pipeline.scard("myset");

        // 第 2.3 步，发送 commands
        pipeline.sync();

        // 第 2.4 步，处理 response
        LogUtils.log("mykey = {}", myValue.get());
        LogUtils.log("Number of Elements in set: {}", mySetSize.get());

        // 第 3 步，关闭
        client.close();
    }
}
```
