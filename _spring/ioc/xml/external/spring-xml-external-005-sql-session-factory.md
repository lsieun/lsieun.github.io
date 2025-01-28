---
title: "实例工厂方式：配置 SqlSessionFactory"
sequence: "105"
---

配置 MyBatis 的 `SqlSessionFactory` 交由 Spring 管理

导入 `Batis` 的相关坐标：

```xml
<!-- MySQL 驱动 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.2.0</version>
</dependency>
```

```xml
<!-- MyBatis 驱动 -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.14</version>
</dependency>
```

File: `mybatis-config.xml`

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/testdb"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
</configuration>
```

```java
package lsieun.db;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.InputStream;

public class MyBatisRun {
    public static void main(String[] args) throws Exception {
        // 静态工厂方法
        InputStream in = Resources.getResourceAsStream("mybatis-config.xml");
        // 无参构造实例化
        SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
        // 实例工厂方法
        SqlSessionFactory factory = builder.build(in);

        System.out.println(factory);
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 静态工厂方法 -->
    <bean id="in" class="org.apache.ibatis.io.Resources" factory-method="getResourceAsStream">
        <constructor-arg name="resource" value="mybatis-config.xml"/>
    </bean>

    <!-- 无参构造实例化 -->
    <bean id="builder" class="org.apache.ibatis.session.SqlSessionFactoryBuilder"/>

    <!-- 实例工厂方法 -->
    <bean id="factory" factory-bean="builder" factory-method="build">
        <constructor-arg name="inputStream" ref="in"/>
    </bean>

</beans>
```

```java
package lsieun.run;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        SqlSessionFactory factory = (SqlSessionFactory) applicationContext.getBean("factory");
        System.out.println(factory);

        SqlSession sqlSession = factory.openSession();
        System.out.println(sqlSession);
    }
}
```
