---
title: "MyBatis SpringBoot"
sequence: "102"
---

## 创建 Spring Boot 项目

第一步，引入依赖

```text
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.1</version>
</dependency>
```

注意：不需要再引入 `mybatis` 依赖，只引入这一个即可，当然数据库相关的驱动还得显式引入。

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
</dependency>
```

第二步，在入口类加入注解：

```java
package com.jm.dma;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.jm.dma.dao")
public class DMAApplication {

    public static void main(String[] args) {
        SpringApplication.run(DMAApplication.class, args);
    }

}
```

第三步，开发实体类：

```java
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Accessors(chain = true)
@TableName("t_basic_user")
public class BasicUser {
    private String id;
    private String loginName;
    private String password;
    private Integer isDelete;
    private Long createTime;
}
```

第四步，开发 Mapper 通用实现

```java
package com.jm.dma.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.jm.dma.domain.BasicUser;

public interface UserDAO extends BaseMapper<BasicUser> {
}
```

第五步，测试

```java
import com.jm.dma.domain.BasicUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    void test() {
        List<BasicUser> userList = userDAO.selectList(null);
        System.out.println(userList);
    }

}
```
