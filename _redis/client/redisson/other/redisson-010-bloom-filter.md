---
title: "BloomFilter"
sequence: "110"
---

```java
import org.redisson.Redisson;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_M_BloomFilter {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer()
                .setAddress("redis://192.168.80.130:6379")
                .setPassword("str0ng_passw0rd");
        RedissonClient redisson = Redisson.create(config);

        // 创建布隆过滤器
        RBloomFilter<String> bloomFilter = redisson.getBloomFilter("myBloomFilter");
        // 初始化布隆过滤器并设置错误率为 0.03，预期插入元素数量为 1000
        bloomFilter.tryInit(1000, 0.03);
        // 将元素插入到布隆过滤器中
        bloomFilter.add("hello");
        bloomFilter.add("world");
        bloomFilter.add("redisson");
        // 判断元素是否存在于布隆过滤器中
        System.out.println(bloomFilter.contains("hello")); // true
        System.out.println(bloomFilter.contains("redis")); // false

        redisson.shutdown();
    }
}
```

```java
import org.redisson.Redisson;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;

public class Redisson_M_BloomFilter {
    public static void main(String[] args) {
        Config config = new Config();
        config.useSingleServer()
                .setAddress("redis://192.168.80.130:6379")
                .setPassword("str0ng_passw0rd");
        RedissonClient redisson = Redisson.create(config);

        RBloomFilter<String> bloomFilter = redisson.getBloomFilter("bloomFilter");
        bloomFilter.tryInit(100_000_000, 0.03);

        bloomFilter.add("a");
        bloomFilter.add("b");
        bloomFilter.add("c");
        bloomFilter.add("d");

        long expectedInsertions = bloomFilter.getExpectedInsertions();
        System.out.println("expectedInsertions = " + expectedInsertions);
        double falseProbability = bloomFilter.getFalseProbability();
        System.out.println("falseProbability = " + falseProbability);
        int hashIterations = bloomFilter.getHashIterations();
        System.out.println("hashIterations = " + hashIterations);

        boolean existA = bloomFilter.contains("a");
        System.out.println("existA = " + existA);

        long count = bloomFilter.count();
        System.out.println("count = " + count);

        redisson.shutdown();
    }
}
```

```text
expectedInsertions = 100000000
falseProbability = 0.03
hashIterations = 5
existA = true
count = 4
```

## Reference

- [BloomFilterExamples.java](https://github.com/redisson/redisson-examples/blob/master/objects-examples/src/main/java/org/redisson/example/objects/BloomFilterExamples.java)
