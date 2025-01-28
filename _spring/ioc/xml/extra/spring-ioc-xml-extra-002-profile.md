---
title: "profile"
sequence: "102"
---

## profile

`<beans>` 标签，除了经常用的作为根标签外，还可以嵌套在根标签内，使用 `profile` 属性切换开发环境：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 配置测试环境下，需要加载的 Bean 实例 -->
    <beans profile="test">

    </beans>

    <!-- 配置开发环境下，需要加载的 Bean 实例 -->
    <beans profile="dev">

    </beans>
</beans>
```

可以使用以下两种方式指定被激活的环境：

- 使用命令行动态参数，虚拟机参数位置加载 `-Dspring.profiles.active=test`
- 使用代码的方式设置环境变量 `System.setProperty("spring.profiles.active", "test")`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" autowire="byName"/>
    <bean id="user" class="lsieun.entity.User">
        <property name="username" value="Spike"/>
        <property name="age" value="11"/>
    </bean>

    <beans profile="dev">
        <bean id="user" class="lsieun.entity.User">
            <property name="username" value="Tom"/>
            <property name="age" value="10"/>
        </bean>
    </beans>

    <beans profile="test">
        <bean id="user" class="lsieun.entity.User">
            <property name="username" value="Jerry"/>
            <property name="age" value="9"/>
        </bean>
    </beans>

</beans>
```

```java
package lsieun.entity;

public class User {
    private String username;
    private int age;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("User {username='%s', age=%d}", username, age);
    }
}
```

```java
package lsieun.dao;

public interface UserDao {
}
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;
import lsieun.entity.User;

public class UserDaoImpl implements UserDao {

    private User user;

    public void setUser(User user) {
        System.out.println("user = " + user);
        this.user = user;
    }
}
```

```java
package lsieun.run;

import lsieun.dao.UserDao;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "test");

        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);
    }
}
```
