---
title: "init-method+destroy-method：Bean 的初始化和销毁方法"
sequence: "105"
---

在 `<bean>` 里可以设置 `init-method` 和 `destroy-method` 属性：

- `init-method`：Bean 在实例化后，可以执行指定的初始化方法完成一些初始化的操作；
- `destroy-method`：Bean 在销毁之前，也可以执行指定的销毁方法完成一些操作。

```xml
<bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" init-method="init" destroy-method="destroy"/>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" init-method="init" destroy-method="destroy"/>
</beans>
```

```java
package lsieun.dao;

public interface UserDao {
}
```

```java
import lsieun.dao.UserDao;

public class UserDaoImpl implements UserDao {
    public UserDaoImpl() {
        System.out.println("UserDaoImpl创建了...");
    }

    public void init() {
        System.out.println("初始化方法...");
    }

    public void destroy() {
        System.out.println("销毁方法...");
    }
}
```

```java
package lsieun.run;

import lsieun.dao.UserDao;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ConfigurableApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);

        // 第 3 步，关闭 ApplicationContext
        applicationContext.close();
    }
}
```

```text
UserDaoImpl创建了...
初始化方法...
lsieun.dao.impl.UserDaoImpl@192b07fd
销毁方法...
```
