---
title: "lazy-init：Bean 延迟加载"
sequence: "104"
---

当 `lazy-init` 设置为 `true` 时为延迟加载。
也就是，当 Spring 容器创建的时候，不会立即创建 Bean 实例，等待用到时，再创建 Bean 实例并存储到单例池中去，
后续在使用该 Bean 直接从单例池获取即可，本质上该 Bean 还是单例。

注意：

- `lazy-init` 对于 BeanFactory 无效，因为它本来就是延迟加载的；
- `lazy-init` 对于 ApplicationContext 是有效的

```xml
<bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" lazy-init="true"/>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" lazy-init="true"/>
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
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);
    }
}
```
