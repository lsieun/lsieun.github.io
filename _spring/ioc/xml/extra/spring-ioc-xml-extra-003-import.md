---
title: "import"
sequence: "103"
---

## import 标签

`<import>` 标签，用于导入其它配置文件。
项目变大后，就会导致一个配置文件内容过多，可以将一个配置文件根据业务块进行拆分；
拆分后，最终通过 `<import>` 标签导入到一个主配置文件中，
项目加载主配置文件就连同 `<import>` 导入的文件一并加载了。

- business functions: `business-beans.xml`
- utility beans: `util-beans.xml`
- data access beans: `dao-beans.xml`


```xml
<beans>
    <!-- 导入用户模块配置文件 -->
    <import resource="classpath:user-beans.xml"/>

    <!-- 导入商品模块配置文件 -->
    <import resource="classpath:product-beans.xml"/>
</beans>
```

File: `entity-beans.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="lsieun.entity.User">
        <property name="username" value="Spike"/>
        <property name="age" value="11"/>
    </bean>

</beans>
```

File: `dao-beans.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" autowire="byName"/>

</beans>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <import resource="classpath:dao-beans.xml"/>
    <import resource="classpath:entity-beans.xml"/>

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
