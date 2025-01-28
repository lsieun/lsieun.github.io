---
title: "Spring Boot + Lettuce"
sequence: "102"
---

## pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
    </dependency>
</dependencies>
```

## application.yml

### Standalone

```yaml
server:
  port: 8888
spring:
  data:
    redis:
      host: 192.168.80.130
      port: 6379
      password: str0ng_passw0rd
      # 设置默认访问的数据库
      database: 0
      # 设置超时时间
      connect-timeout: 2000
      lettuce:
        pool:
          # 最大允许连接数
          max-active: 100
          # 最小空闲连接数，最少准备 5 个可用连接在连接池候着
          min-idle: 5
          # 最大空闲连接数，空闲连接超过 10 个后自动释放
          max-idle: 10
          # 当连接池到达上限后，最多等待 30 秒尝试获取连接，超时报错
          max-wait: 30000
```

### Sentinel

```yaml
server:
  port: 8888
spring:
  data:
    redis:
      # Redis 哨兵配置
      sentinel:
        master: mymaster
        nodes: 192.168.80.231:26379,192.168.80.232:26379,192.168.80.233:26379
      password: str0ng_passw0rd
      # 设置默认访问的数据库
      database: 0
      # 设置超时时间
      connect-timeout: 2000
      lettuce:
        pool:
          # 最大允许连接数
          max-active: 100
          # 最小空闲连接数，最少准备 5 个可用连接在连接池候着
          min-idle: 5
          # 最大空闲连接数，空闲连接超过 10 个后自动释放
          max-idle: 10
          # 当连接池到达上限后，最多等待 30 秒尝试获取连接，超时报错
          max-wait: 30000
```

### Cluster

```yaml
server:
  port: 8888
spring:
  data:
    redis:
      # Redis 集群配置
      cluster:
        max-redirects: 3
        nodes: 192.168.80.131:6379,192.168.80.132:6379,192.168.80.133:6379,192.168.80.231:6379,192.168.80.232:6379,192.168.80.233:6379
      password: str0ng_passw0rd
      # 设置默认访问的数据库
      database: 0
      # 设置超时时间
      connect-timeout: 2000
      lettuce:
        pool:
          # 最大允许连接数
          max-active: 100
          # 最小空闲连接数，最少准备 5 个可用连接在连接池候着
          min-idle: 5
          # 最大空闲连接数，空闲连接超过 10 个后自动释放
          max-idle: 10
          # 当连接池到达上限后，最多等待 30 秒尝试获取连接，超时报错
          max-wait: 30000
```

## RedisTemplateTest

```java
package lsieun.redis;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@SpringBootTest
public class RedisTemplateTest {
    @Autowired
    private RedisTemplate<Object, Object> redisTemplate;

    @Test
    void testString() {
        redisTemplate.opsForValue().set("Hello", "Hello Redis");
        Object value = redisTemplate.opsForValue().get("Hello");
        System.out.println("value = " + value);
    }

    @Test
    void testHash() {
        redisTemplate.opsForHash().put("website", "google", "www.google.com");
        Object value = redisTemplate.opsForHash().get("website", "google");
        System.out.println("value = " + value);

        Map<String, String> map = new HashMap<>();
        map.put("name", "tomcat");
        map.put("age", "10");
        redisTemplate.opsForHash().putAll("tom", map);
        Map<Object, Object> tom = redisTemplate.opsForHash().entries("tom");
        System.out.println("tom = " + tom);
    }

    @Test
    void testList() {
        redisTemplate.opsForList().rightPushAll("it-companies", "google", "baidu");
        Long size = redisTemplate.opsForList().size("it-companies");
        System.out.println("size = " + size);

        List<Object> list = redisTemplate.opsForList().range("it-companies", 0, 3);
        list.forEach(System.out::println);
    }

    @Test
    public void testBasic() {
        redisTemplate.expire("employee", 30, TimeUnit.MINUTES);
        redisTemplate.delete("employee");
    }

    @Test
    public void testSet() {
        redisTemplate.opsForSet();
    }

    @Test
    public void testZSet() {
        redisTemplate.opsForZSet();
    }
}
```

## Reference

- [RedisTemplate 常用方法总结](https://blog.csdn.net/sinat_22797429/article/details/89196933)
