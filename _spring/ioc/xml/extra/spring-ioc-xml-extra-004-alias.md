---
title: "alias"
sequence: "104"
---

## alias 标签

`<alias>` 标签是为某个 Bean 添加别名，与在 `<bean>` 标签上使用 `name` 属性添加别名的方式一样

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl"/>

    <alias name="userDao" alias="aaa"/>
    <alias name="userDao" alias="bbb"/>
    <alias name="userDao" alias="xxx"/>
    <alias name="userDao" alias="yyy"/>

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
package lsieun.run;

import lsieun.dao.UserDao;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        UserDao userDao1 = (UserDao) applicationContext.getBean("aaa");
        UserDao userDao2 = (UserDao) applicationContext.getBean("bbb");
        UserDao userDao3 = (UserDao) applicationContext.getBean("xxx");
        UserDao userDao4 = (UserDao) applicationContext.getBean("yyy");
        System.out.println(userDao);
        System.out.println(userDao1);
        System.out.println(userDao2);
        System.out.println(userDao3);
        System.out.println(userDao4);
    }
}
```

![](/assets/images/spring/bean/bean-alias-map.png)
