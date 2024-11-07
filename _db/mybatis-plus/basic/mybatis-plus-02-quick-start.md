---
title: "快速开始"
sequence: "102"
---

## 建库建表

- **建库建表**

```text
CREATE DATABASE `mybatis_plus` /*!40100 DEFAULT CHARACTER SET utf8mb4 */; 
use `mybatis_plus`;
DROP TABLE IF EXISTS user;
CREATE TABLE `user` ( 
    `id` bigint(20) NOT NULL COMMENT '主键ID', 
    `name` varchar(30) DEFAULT NULL COMMENT '姓名', 
    `age` int(11) DEFAULT NULL COMMENT '年龄', 
    `email` varchar(50) DEFAULT NULL COMMENT '邮箱', 
    PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

- **插入几条测试数据**

```text
INSERT INTO user (id, name, age, email) VALUES 
(1, 'Jone', 18, 'test1@baomidou.com'), 
(2, 'Jack', 20, 'test2@baomidou.com'), 
(3, 'Tom', 28, 'test3@baomidou.com'), 
(4, 'Sandy', 21, 'test4@baomidou.com'), 
(5, 'Billie', 24, 'test5@baomidou.com');
```

## 创建 Spring Boot

![](/assets/images/db/mybatis-plus/spring-boot/001.png)

![](/assets/images/db/mybatis-plus/spring-boot/002.png)

```xml
<dependencies>
    <!-- mybatis-plus -->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
    </dependency>

    <!-- h2 -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
    </dependency>
</dependencies>
```

完整 `pom.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>lsieun</groupId>
    <artifactId>learn-mybatis-plus</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>learn-mybatis-plus</name>
    <description>learn-mybatis-plus</description>
    <properties>
        <java.version>11</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <!-- mybatis-plus 启动器 -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.3.1</version>
        </dependency>

        <!-- mysql 驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- lombok 用于简化实体类开发 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

## 配置

### 第一种 application.properties

```text
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

`HikariDataSource` 是 Spring Boot 默认使用的数据源。

如果 `mysql-connector-java` 的版本是 8，就选择 `com.mysql.cj.jdbc.Driver`（多了一个 `cj`）；
如果是版本是 5，就选择 `com.mysql.jdbc.Driver`。

### 第二种 application.yml

```text
spring:
  # 配置数据源信息
  datasource:
    # 配置数据源类型
    type: com.zaxxer.hikari.HikariDataSource
    # 配置连接数据库的各个信息
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://192.168.80.130:3306/mybatis_plus?serverTimezone=GMT%2B8&characterEncoding=utf-8&useSSL=false
    username: root
    password: 123456
```

```text
jdbc:mysql://192.168.80.130:3306/mybatis_plus?serverTimezone=UTC
```

### 注意事项

1、驱动类 driver-class-name

- spring boot 2.0（内置 jdbc5 驱动），驱动类使用：`driver-class-name: com.mysql.jdbc.Driver`
- spring boot 2.1 及以上（内置 jdbc8 驱动），驱动类使用：`driver-class-name: com.mysql.cj.jdbc.Driver`

否则运行测试用例的时候会有 WARN 信息

2、连接地址 url

MySQL5.7 版本的 url：

```text
jdbc:mysql://localhost:3306/mybatis_plus?characterEncoding=utf-8&useSSL=false
```

MySQL8.0 版本的 url（设置时区信息）：

```text
jdbc:mysql://localhost:3306/mybatis_plus?serverTimezone=GMT%2B8&characterEncoding=utf-8&useSSL=false
```

如果没有设置时区信息（`serverTimezone=GMT%2B8`），运行报告如下错误：

```text
java.sql.SQLException: The server time zone value 'ÖÐ¹ú±ê×¼Ê±¼ä' is unrecognized or represents more
```

## 实体类

第一种写法：

```java
package lsieun.batisplus.entity;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```

第二种方式：

```java
package lsieun.batisplus.entity;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```

```text
@Data = @NoArgsConstructor + @Getter + @Setter + @EqualsAndHashCode + @ToString
```

## Mapper

```java
package lsieun.batisplus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

public interface UserMapper extends BaseMapper<User> {
}
```

## Application

在启动类（`LearnMybatisPlusApplication`）上，添加 `@MapperScan("lsieun.batisplus.mapper")` 注解：

```java
package lsieun.batisplus;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("lsieun.batisplus.mapper")
public class LearnMybatisPlusApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearnMybatisPlusApplication.class, args);
    }

}
```

## 测试

步骤：

- 第一步，在类层面添加 `@SpringBootTest` 注解
- 第二步，使用 `@Autowired` 注解 `UserMapper userMapper` 字段。
- 第三步，使用 `@Test` 编写测试方法

```java
package lsieun.batisplus.mapper;

import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelectList() {
        List<User> list = userMapper.selectList(null);
        assertNotNull(list);

        list.forEach(System.out::println);
    }
}
```

## 常见问题解决

### Could not autowire

使用 `@Autowired` 注解时，`userMapper` 下会标识红色波浪线：

![](/assets/images/db/mybatis-plus/spring-boot/003.png)

解决方法：为 `UserMapper` 接口添加 `@Repository` 注解

```java
package lsieun.batisplus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper extends BaseMapper<User> {
}
```

因为 `@Repository` 注解会将 `UserMapper` 标识为持久层组件。

### 打印 SQL 语句

在 `application.yml` 文件中添加如下内容：

```text
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

```text
logging:
  level:
    root: info
    lsieun.batisplus.mapper: debug
```

完整 `application.yml` 文件如下：

```text
spring:
  # 配置数据源信息
  datasource:
    # 配置数据源类型
    type: com.zaxxer.hikari.HikariDataSource
    # 配置连接数据库的各个信息
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://192.168.80.130:3306/mybatis_plus?serverTimezone=GMT%2B8&characterEncoding=utf-8&useSSL=false
    username: root
    password: 123456

logging:
  level:
    root: info
    lsieun.batisplus.mapper: debug
```

```text
spring:
  # 配置数据源信息
  datasource:
    # 配置数据源类型
    type: com.zaxxer.hikari.HikariDataSource
    # 配置连接数据库的各个信息
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://192.168.80.130:3306/mybatis_plus?serverTimezone=GMT%2B8&characterEncoding=utf-8&useSSL=false
    username: root
    password: 123456

#logging:
#  level:
#    root: info
#    lsieun.batisplus.mapper: debug
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

