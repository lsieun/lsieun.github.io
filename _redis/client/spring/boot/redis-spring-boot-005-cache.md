---
title: "Cache"
sequence: "105"
---

## 环境准备

### pom.xml

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

### application.yml

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
  cache:
    redis:
      cache-null-values: true
```

### RedisConfig

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

### CachingConfig

```java
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CachingConfig {
}
```

### User

```java
import java.io.Serializable;

public class User implements Serializable {
    private Integer userId;
    private String username;

    public User() {
    }

    public User(Integer userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return String.format("User {userId = %d, username='%s'}", userId, username);
    }
}
```

### UserDao

```java
import lsieun.redis.entity.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserDao {
    private static final List<User> userList = new ArrayList<>();

    static {
        userList.add(new User(101, "Tom"));
        userList.add(new User(102, "Jerry"));
        userList.add(new User(103, "Spike"));
    }

    public User findById(Integer userId) {
        System.out.println("执行了 findById 方法，userId = " + userId);
        for (User user : userList) {
            if (user.getUserId().equals(userId)) {
                return user;
            }
        }
        return null;
    }

    public List<User> findList() {
        System.out.println("执行 findList 方法");
        return userList;
    }

    public User insert(User user) {
        int maxUserId = 0;
        for (User item : userList) {
            Integer userId = item.getUserId();
            if (userId > maxUserId) {
                maxUserId = userId;
            }
        }

        int userId = maxUserId + 1;
        System.out.println("正在创建" + userId + "员工信息");
        user.setUserId(userId);
        return user;
    }

    public User update(User user) {
        System.out.println("正在更新" + user.getUserId() + "员工信息");
        Integer userId = user.getUserId();
        int size = userList.size();
        for (int i = 0; i < size; i++) {
            User item = userList.get(i);
            if (item.getUserId().equals(userId)) {
                userList.set(i, user);
            }
        }
        return user;
    }

    public void delete(Integer userId) {
        System.out.println("删除" + userId + "员工信息");
        int size = userList.size();
        for (int i = size - 1; i >= 0; i--) {
            User user = userList.get(i);
            if (user.getUserId().equals(userId)) {
                userList.remove(i);
            }
        }
    }
}
```

### UserService

```java
import jakarta.annotation.Resource;
import lsieun.redis.dao.UserDao;
import lsieun.redis.entity.User;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Resource
    private UserDao userDao;

    @Cacheable(value = "user:rank:id")
    public List<User> getUserRank() {
        return userDao.findList();
    }

    // @Cacheable(value = "user", key="#a0") // 成功
    // @Cacheable(value = "user", key="#p0") // 成功
    // @Cacheable(value = "user", key="#userId") // 没有测试成功
    @Cacheable(value = "user", key="#p0", condition = "#p0 != 100")
    public User findById(Integer userId) {
        return userDao.findById(userId);
    }


    // @CachePut 更新缓存，没有 key 则创建
    @CachePut(value = "user", key = "#p0.userId")
    public User create(User user) {
        return userDao.insert(user);
    }

    @CachePut(value = "user", key="#p0.userId")
    public User update(User user) {
        return userDao.update(user);
    }

    @CacheEvict(value = "user", key = "#p0")
    public void delete(Integer userId) {
        userDao.delete(userId);
    }
}
```

### SpringCacheTest

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class SpringCacheTest {
    @Autowired
    private UserService userService;

    @Test
    void testGetUserRank() {
        List<User> list = userService.getUserRank();
        list = userService.getUserRank();
        for (User user : list) {
            System.out.println(user);
        }
    }

    @Test
    void testFindById() {
        User user = userService.findById(101);
        user = userService.findById(101);
        user = userService.findById(101);
        System.out.println(user.getUsername());

        user = userService.findById(102);
        user = userService.findById(102);
        user = userService.findById(102);
        System.out.println(user.getUsername());
    }

    @Test
    void testCreate() {
        userService.create(new User(0, "NewUser1"));
        userService.create(new User(0, "NewUser2"));
        userService.create(new User(0, "NewUser3"));
    }

    @Test
    void testUpdate() {
        userService.update(new User(102, "Jerry1"));
        userService.update(new User(102, "Jerry2"));
        userService.update(new User(102, "Jerry3"));
    }

    @Test
    void testDelete() {
        userService.delete(102);
        User user = userService.findById(102);
        System.out.println("user = " + user);
    }
}
```

## 解决一些问题

在使用 Spring Cache 的时候有三个问题：

- 第 1 个问题，在默认情况下，Spring Cache 采用 `::`（两个冒号）分割数据，并不是约定俗称的 `:`（一个冒号）分割。
- 第 2 个问题，在默认情况下，使用 JDK 序列化。JDK 序列化的，有一些安全问题，也不适合 human-readable，希望修改 JSON 序列化。
- 第 3 个问题，在默认情况下，Spring Cache 注解（`@Cacheable`等）是不支持 Expire 过期的，但这是日常开发中必然会用到的特性。

### CacheConfig

```java
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        // 加载默认的 Spring Cache 配置信息
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1)) // 设置有效期为 1 小时
                .computePrefixWith(cacheName -> cacheName + ":") // 缓存 key 使用单冒号
                .serializeKeysWith(
                        // Redis Key 采用 String 直接存储
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(RedisSerializer.string())
                )
                .serializeValuesWith(
                        // Redis Value 将对象采用 JSON 形式存储
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(RedisSerializer.json())
                )
                // 不缓存 Null 值对象
                .disableCachingNullValues();

        // 实例化 CacheManager 缓存管理器
        RedisCacheManager cacheManager = RedisCacheManager.RedisCacheManagerBuilder
                // 绑定 Redis 连接工厂
                .fromConnectionFactory(factory)
                // 绑定配置对象
                .cacheDefaults(config)
                // 与声明式事务注解 @Transactional 进行兼容
                .transactionAware()
                .build();
        return cacheManager;
    }

    @Bean
    public CacheManager cacheManager1m(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(1))
                .computePrefixWith(cacheName -> cacheName + ":")
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(RedisSerializer.string())
                )
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(RedisSerializer.json())
                )
                .disableCachingNullValues();

        RedisCacheManager cacheManager = RedisCacheManager.RedisCacheManagerBuilder
                .fromConnectionFactory(factory)
                .cacheDefaults(config)
                .transactionAware()
                .build();
        return cacheManager;
    }
}
```

查看 `RedisCacheConfiguration.defaultCacheConfig()` 方法的注释文档：

```text
Default RedisCacheConfiguration using the following:

- key expiration: eternal
- cache null values: yes
- prefix cache keys: yes
- default prefix: [the actual cache name]
- key serializer: org.springframework.data.redis.serializer.StringRedisSerializer
- value serializer: org.springframework.data.redis.serializer.JdkSerializationRedisSerializer
- conversion service: DefaultFormattingConversionService with default cache key converters
```

### UserService

在上面的 `CacheConfig` 代码中，提供了两个 `CacheManager`，它们只是过期时间不同：1 小时 和 1 分钟。

在 `@Cacheable` 注解时，

- 如果不设置 `cacheManager` 属性，就会使用带有 `@Primary` 的 `CacheManager` 对象，它的过期时间为 1 小进；
- 如果不设置 `cacheManager` 属性，并指定为 `cacheManager1m` 对象，它的过期时间为 1 分钟。

```java
public class UserService {
    @Cacheable(value = "user", key="#p0", condition = "#p0 != 100")
    public User findById1h(Integer userId) {
        return userDao.findById(userId);
    }
    
    @Cacheable(value = "user", key="#p0", condition = "#p0 != 100", cacheManager = "cacheManager1m")
    public User findById1m(Integer userId) {
        return userDao.findById(userId);
    }
}
```

### SpringCacheTest

```java
@SpringBootTest
public class SpringCacheTest {
    @Autowired
    private UserService userService;

    @Test
    void testFindByIdExpire() {
        User user1 = userService.findById1h(102);
        System.out.println("user1 = " + user1);

        User user2 = userService.findById1m(103);
        System.out.println("user2 = " + user2);
    }
}
```

## Reference

- [解决 Null key returned for cache operation](https://blog.csdn.net/f641385712/article/details/95169002)
