---
title: "scope：Bean 的范围配置"
sequence: "103"
---

在默认情况下，单纯的 Spring 环境 Bean 的作用范围有两个：singleton 和 prototype。

- singleton：单例，默认值，Spring 容器创建的时候，就会进行 Bean 的实例化，并存储到容器内部的单例池中，
  每次 getBean 时，都是从单例池中获取相同的 Bean 实例。
- prototype：原型，Spring 容器初始化时不会创建 Bean 实例，当调用 getBean 时才会实例化 Bean，
  每次 getBean 都会创建一个新的 Bean 实例。

## singleton

```xml
<bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" scope="singleton"/>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" scope="singleton"/>
</beans>
```

```java
import lsieun.dao.UserDao;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserDao userDao1 = (UserDao) applicationContext.getBean("userDao");
        UserDao userDao2 = (UserDao) applicationContext.getBean("userDao");
        UserDao userDao3 = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao1);
        System.out.println(userDao2);
        System.out.println(userDao3);
    }
}
```

```text
lsieun.dao.impl.UserDaoImpl@3159c4b8    # 是同一个对象
lsieun.dao.impl.UserDaoImpl@3159c4b8
lsieun.dao.impl.UserDaoImpl@3159c4b8
```

## prototype

```xml
<bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" scope="prototype"/>
```

```text
lsieun.dao.impl.UserDaoImpl@13805618    # 是不同的对象
lsieun.dao.impl.UserDaoImpl@56ef9176
lsieun.dao.impl.UserDaoImpl@4566e5bd
```

## 引入 spring-webmvc

如果我们引入 `spring-webmvc`：

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>${spring.version}</version>
</dependency>
```

那么，`<bean>` 的 `scope` 属性会增加 `request` 和 `session` 的额外选项：

![](/assets/images/spring/bean/bean-scope-web-mvc-request-session.png)
