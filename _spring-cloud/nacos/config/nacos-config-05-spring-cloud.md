---
title: "读取 Nacos 配置：Spring Cloud"
sequence: "105"
---

## pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>

    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
</dependencies>
```

## bootstrap.properties

```text
spring.cloud.nacos.server-addr=127.0.0.1:8848
```

```text
spring.application.name=mytest
spring.cloud.nacos.server-addr=127.0.0.1:8848
```

## Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NacosConfigSpringCloudApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosConfigSpringCloudApplication.class, args);
    }
}
```

## UserController

第一次，使用 `@NacosValue` 注解，获取到 `null` 值：

```java
import com.alibaba.nacos.api.config.annotation.NacosValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    // 使用 @NacosValue，会获取到 null
    @NacosValue(value = "${lsieun.database.username}", autoRefreshed = true)
    private String username;

    @NacosValue(value = "${lsieun.database.password}", autoRefreshed = true)
    private String password;

    @GetMapping("/test")
    public String test() {
        return String.format("%s: %s", username, password);
    }
}
```

## ConfigController

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope
@RequestMapping("/config")
public class ConfigController {
    @Value(value = "${lsieun.database.username}")
    private String username;

    @Value(value = "${lsieun.database.password}")
    private String password;

    @GetMapping("/get")
    public String get() {
        return String.format("%s: %s", username, password);
    }
}
```

