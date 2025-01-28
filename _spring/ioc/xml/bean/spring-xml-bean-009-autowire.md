---
title: "autowire：Bean 的自动装配方式"
sequence: "109"
---

如果被注入的属性类型是 Bean 引用的话，那么可以在 `<bean>` 标签中使用 `autowire` 属性去配置自动注入方式，
其属性值有两个：

- `byName`：通过属性名自动装备，即去匹配 `setXxx` 与 `id="xxx"` （`name="xxx"`）是否一致；
- `byType`：通过 Bean 的类型从容器中匹配，匹配出多个相同 Bean 类型时，会报错

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="lsieun.service.impl.UserServiceImpl" autowire="byType"/>
    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl"/>
</beans>
```

```java
package lsieun.dao;

public interface UserDao {
}
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;

public class UserDaoImpl implements UserDao {
}
```

```java
package lsieun.service;

public interface UserService {
}
```

```java
package lsieun.service.impl;

import lsieun.dao.UserDao;
import lsieun.service.UserService;

public class UserServiceImpl implements UserService {
    public void setUserDao(UserDao userDao) {
        System.out.println("Spring 容器进行 DI 注入：" + userDao);
    }
}
```

```java
package lsieun.run;

import lsieun.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserService userService = (UserService) applicationContext.getBean("userService");
        System.out.println(userService);
    }
}
```
