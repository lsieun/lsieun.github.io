---
title: "Embedded Redis"
sequence: "104"
---

## Java

### pom.xml

```xml
<dependency>
    <groupId>it.ozimov</groupId>
    <artifactId>embedded-redis</artifactId>
</dependency>
```

### Main

```java
import redis.embedded.RedisServer;

import java.util.concurrent.TimeUnit;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        RedisServer redisServer = RedisServer.builder()
                .port(6379)
                .setting("maxmemory 128M")
                .build();
        redisServer.start();

        // do some work
        TimeUnit.SECONDS.sleep(600);

        redisServer.stop();
    }
}
```

## Spring Boot

### pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
        <exclusions>
            <exclusion>
                <groupId>ch.qos.logback</groupId>
                <artifactId>logback-classic</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>it.ozimov</groupId>
        <artifactId>embedded-redis</artifactId>
    </dependency>

</dependencies>
```

### Config

```java
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.context.annotation.Configuration;
import redis.embedded.RedisServer;

@Configuration
public class EmbeddedRedisConfig {
    private static RedisServer redisServer;

    @PostConstruct
    public void startRedis() {
        if (redisServer == null || !redisServer.isActive()) {
            redisServer = RedisServer.builder()
                    .port(6379)
                    .setting("maxmemory 128M")
                    .build();
            redisServer.start();
        }
    }

    @PreDestroy
    public void stopRedis() {
        if (redisServer != null) {
            redisServer.stop();
        }
    }
}
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RedisServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(RedisServerApplication.class);
    }
}
```

## Reference

- [Using Redis with Spring Boot](https://bhanuchaddha.github.io/using-redis-with-spring-boot/)
