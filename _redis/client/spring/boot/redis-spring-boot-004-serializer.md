---
title: "Serializers"
sequence: "104"
---

多种可选择策略：

- `JdkSerializationRedisSerializer`：使用 JDK 本身序列化机制，默认机制。
  `ObjectInputStream` 和 `ObjectOutputStream` 进行序列化操作。
- `StringRedisSerializer`：key 和 value 为字符串
- `Jackson2JsonRedisSerializer`
- `GenericJackson2JsonRedisSerializer`

## pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
    </dependency>
</dependencies>
```

## RedisConfig

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisSerializer<String> stringRedisSerializer = RedisSerializer.string();
        RedisSerializer<Object> jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();

        RedisTemplate<Object, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(factory);

        // 设置 key 和 value 的序列化规则
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setValueSerializer(jsonRedisSerializer);

        // 设置 hashKey 和 hashValue 的序列化规则
        redisTemplate.setHashKeySerializer(stringRedisSerializer);
        redisTemplate.setHashValueSerializer(jsonRedisSerializer);

        return redisTemplate;
    }
}
```

## Reference

- [Working with Objects through RedisTemplate](https://docs.spring.io/spring-data/redis/reference/redis/template.html)
