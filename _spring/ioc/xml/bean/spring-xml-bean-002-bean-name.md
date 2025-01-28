---
title: "id+name：beanName 别名配置"
sequence: "102"
---

## Bean 的基础配置

### 配置 id

例如，配置 `UserDaoIMpl` 由 Spring 容器负责管理：

```xml
<bean id="userDao" class="lsieun.dao.impl.UserDaoImpl"/>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl"/>
</beans>
```

此时，存储到 Spring 容器（singleObjects 单例池）中的 Bean 的 beanName 是 `userDao`，
值是 `UserDaoImpl` 对象，可以根据 `beanName` 获取 Bean 实例：

```text
applicationContext.getBean("userDao");
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
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);
    }
}
```

### 不配置 id

如果不配置 `id`：

```xml
<bean class="lsieun.dao.impl.UserDaoImpl"/>
```

则 Spring 会把当前 Bean 实例的全限定名作为 beanName：

```text
String beanName = "lsieun.dao.impl.UserDaoImpl";
applicationContext.getBean(beanName);
```

## Bean 的别名配置

在 `<bean>` 可以设置 `name` 为当前 Bean 指定多个别名，根据别名也可以获取 Bean 对象：

```xml
<bean id="userDao" name="aaa,bbb" class="lsieun.dao.impl.UserDaoImpl"/>
```

此时，多个名称都可以获得 UserDaoImpl 实例对象：

```text
UserDao userDao1 = (UserDao) applicationContext.getBean("userDao");
UserDao userDao2 = (UserDao) applicationContext.getBean("aaa");
UserDao userDao3 = (UserDao) applicationContext.getBean("bbb");
```

![](/assets/images/spring/bean/bean-factory-singleton-objects-and-alias-map.png)

