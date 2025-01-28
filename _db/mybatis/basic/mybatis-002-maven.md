---
title: "Maven"
sequence: "102"
---

## 环境

- Java: 8
- MySQL: 8.0.30

## pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.10</version>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.30</version>
    </dependency>
</dependencies>
```

完整 `pom.xml` 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-java-mybatis</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.10</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.30</version>
        </dependency>
    </dependencies>

</project>
```

## 创建 MyBatis 的核心配置文件

在 MyBatis 中有两种类型的配置文件：

- 第一种，核心配置文件
- 第二种，映射配置文件

习惯上命名为 `mybatis-config.xml`，这个文件名仅仅只是建议，并非强制要求。
将来整合 Spring 之后，这个配置文件可以省略，所以大家操作时可以直接复制、粘贴。

- 核心配置文件主要用于**配置连接数据库的环境**以及**MyBatis 的全局配置信息**
- 核心配置文件存放的位置是 `src/main/resources` 目录下

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 设置连接数据库的环境 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/MyBatis"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 引入映射文件 -->
    <mappers>
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```

问题：如果写了 `UserMapper.xml` 文件，但是没有引入 `<mapper>` 内会出现什么问题呢？

## 实体类

```java
package lsieun.batis.entity;

public class User {
    private Integer id;
    private String username;
    private String password;
    private Integer age;
    private String sex;
    private String email;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", age=" + age +
                ", sex='" + sex + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
```

## 创建 mapper 接口

MyBatis 中的 mapper 接口相当于以前的 dao。但是区别在于，mapper 仅仅是接口，我们不需要提供实现类

```java
package lsieun.batis.mapper;

public interface UserMapper {
    int insertUser();
}
```

## 创建 MyBatis 的映射文件

- 相关概念：ORM（Object Relationship Mapping）对象关系映射。
    - 对象：Java 的实体类对象
    - 关系：关系型数据库
    - 映射：二者之间的对应关系

| Java 概念 | 数据库概念 |
|--------|-------|
| 类      | 表     |
| 属性     | 字段/列  |
| 对象     | 记录/行  |

- 映射文件的命名规则
    - 表所对应的实体类的类名 +Mapper.xml
    - 例如：表 `t_user`，映射的实体类为 `User`，所对应的映射文件为 `UserMapper.xml`

因此一个映射文件对应一个实体类，对应一张表的操作

- MyBatis 映射文件用于编写 SQL，访问以及操作表中的数据
- MyBatis 映射文件存放的位置是 `src/main/resources/mappers` 目录下

MyBatis 中可以面向接口操作数据，要保证两个一致

- mapper 接口的全类名和映射文件的命名空间（namespace）保持一致
- mapper 接口中方法的方法名和映射文件中编写 SQL 的标签的 `id` 属性保持一致


![](/assets/images/db/mybatis/mapper-classname-namespace-method-name-id.png)

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batis.mapper.UserMapper">
    <!--int insertUser();-->
    <insert id="insertUser">
        insert into t_user
        values (null, 'admin', '123456', 23, '女', 'admin@abc.com');
    </insert>
</mapper>
```
## 通过 Junit 测试功能

- `SqlSession`：代表 Java 程序和数据库之间的会话。（HttpSession 是 Java 程序和浏览器之间的会话）
- `SqlSessionFactory`：是“生产” SqlSession 的“工厂”
- 工厂模式：如果创建某一个对象，使用的过程基本固定，那么我们就可以把创建这个对象的相关代码封装到一个“工厂类”中，
  以后都使用这个工厂类来“生产”我们需要的对象

```java
package lsieun.batis.mapper;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserMapperTest {
    @Test
    void testInsert() throws IOException {
        //读取 MyBatis 的核心配置文件
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
        //获取 SqlSessionFactoryBuilder 对象
        SqlSessionFactoryBuilder factoryBuilder = new SqlSessionFactoryBuilder();
        //通过核心配置文件所对应的字节输入流创建工厂类 SqlSessionFactory，生产 SqlSession 对象
        SqlSessionFactory factory = factoryBuilder.build(is);
        //获取 sqlSession，此时通过 SqlSession 对象所操作的 sql 都必须手动提交或回滚事务
        SqlSession session = factory.openSession();

        //通过代理模式创建 UserMapper 接口的代理实现类对象
        UserMapper userMapper = session.getMapper(UserMapper.class);
        System.out.println(userMapper.getClass()); // class com.sun.proxy.$Proxy9
        //调用 UserMapper 接口中的方法，就可以根据 UserMapper 的全类名匹配元素文件，通过调用的方法名匹配映射文件中的 SQL 标签，并执行标签中的 SQL 语句
        int result = userMapper.insertUser();

        //提交事务（如果不进行提交，则无法存储到数据库）
        session.commit();
        System.out.println("result:" + result);
        assertEquals(1, result);
    }

    @Test
    void testInsert02() throws IOException {
        //读取 MyBatis 的核心配置文件
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
        //获取 SqlSessionFactoryBuilder 对象
        SqlSessionFactoryBuilder factoryBuilder = new SqlSessionFactoryBuilder();
        //通过核心配置文件所对应的字节输入流创建工厂类 SqlSessionFactory，生产 SqlSession 对象
        SqlSessionFactory factory = factoryBuilder.build(is);
        //创建 SqlSession 对象，此时通过 SqlSession 对象所操作的 sql 都会自动提交
        SqlSession session = factory.openSession(true);
        //通过代理模式创建 UserMapper 接口的代理实现类对象
        UserMapper userMapper = session.getMapper(UserMapper.class);
        //调用 UserMapper 接口中的方法，就可以根据 UserMapper 的全类名匹配元素文件，通过调用的方法名匹配映射文件中的 SQL 标签，并执行标签中的 SQL 语句
        int result = userMapper.insertUser();
        System.out.println("result:" + result);
    }
}
```

- 此时需要手动提交事务，如果要自动提交事务，则在获取 `sqlSession` 对象时，使用 `SqlSession sqlSession = sqlSessionFactory.openSession(true);`，传入一个 Boolean 类型的参数，值为 true，这样就可以自动提交

## 加入 log4j 日志功能

1. 加入依赖

```text
<!-- log4j 日志 -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.19.0</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.19.0</version>
</dependency>
```
2. 加入 log4j 的配置文件

- log4j 的配置文件名为 log4j.xml，存放的位置是 src/main/resources 目录下
- 日志的级别：FATAL(致命)>ERROR(错误)>WARN(警告)>INFO(信息)>DEBUG(调试) 从左到右打印的内容越来越详细

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
    <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
        <param name="Encoding" value="UTF-8" />
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS} %m (%F:%L) \n" />
        </layout>
    </appender>
    <logger name="java.sql">
        <level value="debug" />
    </logger>
    <logger name="org.apache.ibatis">
        <level value="info" />
    </logger>
    <root>
        <level value="debug" />
        <appender-ref ref="STDOUT" />
    </root>
</log4j:configuration>
```

