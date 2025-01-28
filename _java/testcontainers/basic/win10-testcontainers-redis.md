---
title: "Windows 10 Docker Desktop + TestContainers + Redis"
sequence: "103"
---

## Windows 10 Docker Desktop

### 开启 Daemon

![](/assets/images/docker/docker-desktop-settings-general-expose-daemon.png)

### 进行配置

For advanced users, the Docker host connection can be configured via configuration in `~/.testcontainers.properties`.
Note that these settings require use of the `EnvironmentAndSystemPropertyClientProviderStrategy`.

File: `~/.testcontainers.properties`

```text
docker.client.strategy=org.testcontainers.dockerclient.NpipeSocketClientProviderStrategy
docker.host=tcp\://localhost\:2375     # Equivalent to the DOCKER_HOST environment variable. Colons should be escaped.
```

```text
docker.client.strategy=org.testcontainers.dockerclient.EnvironmentAndSystemPropertyClientProviderStrategy
docker.host=tcp\://localhost\:2375     # Equivalent to the DOCKER_HOST environment variable. Colons should be escaped.
```

## Project

### pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
    </dependency>

    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Log

File: `src/test/resources/logback-test.xml`

```xml
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="info">
        <appender-ref ref="STDOUT"/>
    </root>

    <logger name="org.testcontainers" level="INFO"/>
    <!-- The following logger can be used for containers logs since 1.18.0 -->
    <logger name="tc" level="INFO"/>
    <logger name="com.github.dockerjava" level="WARN"/>
    <logger name="com.github.dockerjava.zerodep.shaded.org.apache.hc.client5.http.wire" level="OFF"/>
</configuration>
```

### Test

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import redis.clients.jedis.Jedis;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
class RedisTest {
    private Jedis jedis;

    @Container
    public GenericContainer redis = new GenericContainer(DockerImageName.parse("redis:7.2.3"))
            .withExposedPorts(6379);

    @BeforeEach
    void setUp() {
        String address = redis.getHost();
        Integer port = redis.getFirstMappedPort();

        jedis = new Jedis(address, port);
    }

    @Test
    void testSimplePutAndGet() {
        jedis.set("username", "tomcat");

        String retrieved = jedis.get("username");
        assertEquals("tomcat", retrieved);
    }
}
```

