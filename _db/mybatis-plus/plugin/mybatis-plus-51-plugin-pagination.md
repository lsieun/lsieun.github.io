---
title: "Wrapper: 分页插件"
sequence: "151"
---

MyBatis Plus 自带分页插件，只要简单的配置即可实现分页功能。

## 添加配置类

```java
package lsieun.batisplus.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("lsieun.batisplus.mapper") // 可以将主类中的注解移到此处
public class MyBatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

```java
package lsieun.batisplus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// 这里不再需要 @MapperScan 注解
@SpringBootApplication
public class LearnMybatisPlusApplication {

    public static void main(String[] args) {
        SpringApplication.run(LearnMybatisPlusApplication.class, args);
    }

}
```

## 测试

```java
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testPage() {
        // 设置分页参数
        Page<User> page = new Page<>(1, 2);
        userMapper.selectPage(page, null);

        // 获取分页数据
        List<User> userList = page.getRecords();

        assertNotNull(userList);
        userList.forEach(System.out::println);
        System.out.println("当前页：" + page.getCurrent());
        System.out.println("每页显示的条数：" + page.getSize());
        System.out.println("总记录数：" + page.getTotal());
        System.out.println("总页数：" + page.getPages());
        System.out.println("是否有上一页：" + page.hasPrevious());
        System.out.println("是否有下一页：" + page.hasNext());
    }
}
```

```text
==>  Preparing: SELECT COUNT(*) AS total FROM user WHERE is_deleted = 0
==> Parameters: 
<==    Columns: total
<==        Row: 5
<==      Total: 1
==>  Preparing: SELECT id,user_name AS name,age,email,is_deleted FROM user WHERE is_deleted=0 LIMIT ?
==> Parameters: 2(Long)
<==    Columns: id, name, age, email, is_deleted
<==        Row: 1, Jone, 18, jone@example.com, 0
<==        Row: 3, Tom, 28, tom@example.com, 0
<==      Total: 2
Closing non transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@501957bf]
User(id=1, name=Jone, age=18, email=jone@example.com, isDeleted=0)
User(id=3, name=Tom, age=28, email=tom@example.com, isDeleted=0)
当前页：1
每页显示的条数：2
总记录数：5
总页数：3
是否有上一页：false
是否有下一页：true
```

## 自定义分页功能

### DAO

```java
package lsieun.batisplus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lsieun.batisplus.entity.User;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper extends BaseMapper<User> {
    /**
     * 根据年龄查询用户列表，分页显示
     * @param page 分页对象，XML 中可以从里面进行取值，传递参数 Page，即自动分页，必须放在第一位
     * @param age 年龄
     * @return 分页结果
     */
    Page<User> selectPageVo(@Param("page") Page<User> page,@Param("age") Integer age);
}
```

## mapper

第一个版本：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batisplus.mapper.UserMapper">
    <select id="selectPageVo" resultType="lsieun.batisplus.entity.User">
        select id, user_name, age, email from user where age > #{age}
    </select>
</mapper>
```

第二个版本：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batisplus.mapper.UserMapper">
    <select id="selectPageVo" resultType="User">    <!-- 需要在 appliaction.yml 中配置 -->
        select id, user_name, age, email from user where age > #{age}
    </select>
</mapper>
```

第三个版本：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batisplus.mapper.UserMapper">
    <sql id="BaseColumns">id, user_name, age, email</sql>
    <select id="selectPageVo" resultType="User">    <!-- 需要在 appliaction.yml 中配置 -->
        select <include refid="BaseColumns"></include> from user where age > #{age}
    </select>
</mapper>
```

### yaml

在 `UserMapper.xml` 文件中，有以下内容：

```text
<select id="selectPageVo" resultType="User">
```

为了能够找到 `resultType="User"` 中的 `User`，需要在 `application.yml` 中配置如下内容：

```yaml
mybatis-plus:
  type-aliases-package: lsieun.batisplus.entity
```

完整 `application.yml`：

```yaml
spring:
  # 配置数据源信息
  datasource:
    # 配置数据源类型
    type: com.zaxxer.hikari.HikariDataSource
    # 配置连接数据库的各个信息
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://192.168.80.128:3306/mybatis_plus?serverTimezone=GMT%2B8&characterEncoding=utf-8&useSSL=false
    username: root
    password: 123456

mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  type-aliases-package: lsieun.batisplus.entity
```

### Test

```java
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testPage() {
        // 设置分页参数
        Page<User> page = new Page<>(2, 2);
        userMapper.selectPageVo(page, 20);

        // 获取分页数据
        List<User> userList = page.getRecords();

        assertNotNull(userList);
        userList.forEach(System.out::println);
        System.out.println("当前页：" + page.getCurrent());
        System.out.println("每页显示的条数：" + page.getSize());
        System.out.println("总记录数：" + page.getTotal());
        System.out.println("总页数：" + page.getPages());
        System.out.println("是否有上一页：" + page.hasPrevious());
        System.out.println("是否有下一页：" + page.hasNext());
    }
}
```

```text
==>  Preparing: SELECT COUNT(*) AS total FROM user WHERE age > ?
==> Parameters: 20(Integer)
<==    Columns: total
<==        Row: 4
<==      Total: 1
==>  Preparing: select id, user_name, age, email from user where age > ? LIMIT ?,?
==> Parameters: 20(Integer), 2(Long), 2(Long)
<==    Columns: id, user_name, age, email
<==        Row: 5, Billie, 24, billie@example.com
<==        Row: 6, Jerry, 27, null
<==      Total: 2
```
