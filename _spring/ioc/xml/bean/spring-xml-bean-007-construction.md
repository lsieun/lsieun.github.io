---
title: "Bean 的实例化配置"
sequence: "107"
---

Spring 的实例化方式主要有两种：

- 构造方式实例化：底层通过构造方法对 Bean 进行实例化
- 工厂方式实例化：底层通过调用自定义的工厂方法对 Bean 进行实例化

## 构造方式

### 有参构造

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl">
        <constructor-arg name="username" value="tomcat"/>
    </bean>
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
    public UserDaoImpl(String username) {
        System.out.println("UserDaoImpl有参构造方法：" + username);
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
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);
    }
}
```

## 工厂方式

工厂方式实例化 Bean，又分为如下三种：

- 静态工厂方法实例化 Bean
- 实例工厂方法实例化 Bean
- 实现 FactoryBean 规范延迟实例化 Bean

### 静态工厂方法

#### 无参

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.factory.MyStaticBeanFactory" factory-method="userDao" />
</beans>
```

```java
package lsieun.factory;

import lsieun.dao.UserDao;
import lsieun.dao.impl.UserDaoImpl;

public class MyStaticBeanFactory {
    public static UserDao userDao() {
        return new UserDaoImpl();
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
        System.out.println(userDao);
    }
}
```

#### 有参

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.factory.MyStaticBeanFactory" factory-method="userDao">
        <constructor-arg name="username" value="tomcat"/>
        <constructor-arg name="age" value="10"/>
    </bean>
</beans>
```

```java
package lsieun.factory;

import lsieun.dao.UserDao;
import lsieun.dao.impl.UserDaoImpl;

public class MyStaticBeanFactory {
    public static UserDao userDao(String username, int age) {
        return new UserDaoImpl();
    }
}
```

### 实例工厂方法

#### 无参

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="myInstanceBeanFactory" class="lsieun.factory.MyInstanceBeanFactory"/>
    <bean id="userDao" factory-bean="myInstanceBeanFactory" factory-method="userDao"/>
</beans>
```

```java
package lsieun.factory;

import lsieun.dao.UserDao;
import lsieun.dao.impl.UserDaoImpl;

public class MyInstanceBeanFactory {
    public UserDao userDao() {
        return new UserDaoImpl();
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
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);
    }
}
```

### FactoryBean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.factory.MyUserDaoFactoryBean"/>
</beans>
```

```java
package lsieun.factory;

import lsieun.dao.UserDao;
import lsieun.dao.impl.UserDaoImpl;
import org.springframework.beans.factory.FactoryBean;

public class MyUserDaoFactoryBean implements FactoryBean<UserDao> {
    @Override
    public UserDao getObject() throws Exception {
        return new UserDaoImpl();
    }

    @Override
    public Class<?> getObjectType() {
        return UserDao.class;
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
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);
    }
}
```

在调用 `applicationContext.getBean("userDao")` 之前：

![](/assets/images/spring/bean/factory-bean-before-get-bean.png)

在调用 `applicationContext.getBean("userDao")` 之后：

![](/assets/images/spring/bean/factory-bean-after-get-bean.png)

