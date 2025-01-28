---
title: "Spring Boot + Mybatis Plus + H2"
sequence: "103-mybatis-plus"
---

## 示例

### pom.xml

```xml
<dependencies>
    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- mybatis-plus -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.5.3.1</version>
    </dependency>

    <!-- h2 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### application.yml

```yaml
server:
  port: 80

spring:
  h2:
    console:
      enabled: true
      path: /h2
  datasource:
    url: jdbc:h2:file:~/test
    driver-class-name: org.h2.Driver
    username: sa
    password: 123456

mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### Entity

```java
package lsieun.springboot.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@TableName("tbl_user")
public class User {
    private Long id;
    private String username;
    private String password;
}
```

### Mapper

```java
package lsieun.springboot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import lsieun.springboot.entity.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper extends BaseMapper<User> {
}
```

### Config

```java
package lsieun.springboot.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("lsieun.springboot.mapper")
public class MybatisPlusConfig {
}
```

### Application

```java
package lsieun.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class H2Application {
    public static void main(String[] args) {
        SpringApplication.run(H2Application.class);
    }
}
```

### Test

```java
package lsieun.springboot.mapper;

import lsieun.springboot.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserMapperTest {
    @Autowired
    UserMapper mapper;

    @Test
    void testSelectList() {
        List<User> list = mapper.selectList(null);
        list.forEach(System.out::println);
    }
}
```
