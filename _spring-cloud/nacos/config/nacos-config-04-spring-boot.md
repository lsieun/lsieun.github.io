---
title: "读取 Nacos 配置：Spring Boot"
sequence: "104"
---

## pom.xml

```xml
<dependencies>
    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>${spring.boot.version}</version>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.13.4.2</version>
    </dependency>

    <dependency>
        <groupId>com.alibaba.boot</groupId>
        <artifactId>nacos-config-spring-boot-starter</artifactId>
        <version>0.2.12</version>
    </dependency>
</dependencies>
```

### nacos-config-spring-boot-starter

Note: Version `0.2.x.RELEASE` is compatible with the Spring Boot `2.0.x` line.
Version `0.1.x.RELEASE` is compatible with the Spring Boot `1.x` line.

## 第一种方式

### application.properties

```text
nacos.config.server-addr=127.0.0.1:8848
```

### NacosConfigApplication

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NacosConfigApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosConfigApplication.class, args);
    }
}
```

### MyConfig

```java
import com.alibaba.nacos.spring.context.annotation.config.NacosPropertySource;
import org.springframework.context.annotation.Configuration;

@Configuration
@NacosPropertySource(dataId = "mytest", autoRefreshed = true)
public class MyConfig {
}
```

### UserController

```java
import com.alibaba.nacos.api.config.annotation.NacosValue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Value("${lsieun.database.username}")
    private String username;

    @NacosValue(value = "${lsieun.database.password}", autoRefreshed = true)
    private String password;

    @RequestMapping("/test")
    public String test() {
        return String.format("%s: %s", username, password);
    }
}
```

### 访问

```text
http://localhost:8080/test
```

## 第二种方式

### application.properties

通过 `application.properties` 的配置内容来代替 `MyConfig.java` 文件：

```text
nacos.config.server-addr=127.0.0.1:8848
nacos.config.data-id=mytest
nacos.config.auto-refresh=true
nacos.config.bootstrap.enable=true
```

注意：一定要把 `nacos.config.bootstrap.enable` 设置为 `true`；
否则，配置项是不能进行自动刷新（auto-refresh）。

