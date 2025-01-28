---
title: "基于注解（Annotation）"
sequence: "105"
---

使用注解目的：简化XML配置。

Spring针对Bean管理中**创建对象**提供的注解：

- @Component
- @Service
- @Controller
- @Repository

上面四个注解的功能是一样的，都可以用来创建Bean实例。


## 创建对象

第一步，需要引入`aop`的依赖

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aop</artifactId>
    <version>${spring.version}</version>
</dependency>
```

第二步，开启组件扫描

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <context:component-scan base-package="lsieun.spring"/>
</beans>
```

如果有多个包需要扫描，可以使用`,`分隔：

```xml
<context:component-scan base-package="lsieun.spring.bean,lsieun.spring.dao"/>
```

如果有多个包需要扫描，可以写父包名：

```xml
<context:component-scan base-package="lsieun.spring"/>
```

```java
package lsieun.spring.bean;

import org.springframework.stereotype.Component;

@Component(value = "user")
public class User {
    private String name;
    private int age;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("User {name='%s', age=%d}", name, age);
    }
}
```

```java
package lsieun;

import lsieun.spring.bean.User;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 2. 获取配置创建的对象
        User user = context.getBean("user", User.class);
        System.out.println(user);
    }
}
```

## 注解扫描

默认情况下，会扫描以下四种注解：

- @Component
- @Service
- @Controller
- @Repository

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <context:component-scan base-package="lsieun.spring"/>
</beans>
```

只扫描带有`@Component`注解的类：

```xml
<context:component-scan base-package="lsieun.spring.bean" use-default-filters="false">
    <context:include-filter type="annotation" expression="org.springframework.stereotype.Component"/>
</context:component-scan>
```

排除带有`@Controller`注解的类：

```xml
<context:component-scan base-package="lsieun.spring.bean">
    <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
```

## 属性注入

Spring针对Bean管理中**属性注入**提供的注解：

- `@Autowired`: 根据属性类型进行注入 
- `@Qualifier`:根据属性名称进行注入，要和`@Autowired`属性一起使用
- `@Resource`:可以根据类型注入，也可以根据名称注入
- `@Value`:注入普通数据类型（`String`、`int`）

### Autowired

```java
package lsieun.spring.dao;

public interface UserDao {
    void update();
}
```

```java
package lsieun.spring.dao;

import org.springframework.stereotype.Repository;

@Repository(value = "userDao")
public class UserDaoImpl implements UserDao {
    @Override
    public void update() {
        System.out.println("UserDaoImpl update");
    }
}
```

```java
package lsieun.spring.service;

import lsieun.spring.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component(value = "userService")
public class UserService {

    @Autowired
    private UserDao userDao;

    public void add() {
        System.out.println("UserService add...");
        userDao.update();
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <context:component-scan base-package="lsieun.spring"/>
</beans>
```

```java
package lsieun;

import lsieun.spring.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 2. 获取配置创建的对象
        UserService userService = context.getBean("userService", UserService.class);
        userService.add();
    }
}
```

### Qualifier

注意：`@Autowired`和`@Qualifier`要一起使用

```java
package lsieun.spring.service;

import lsieun.spring.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component(value = "userService")
public class UserService {

    @Autowired
    @Qualifier(value = "userDao")
    private UserDao userDao;

    public void add() {
        System.out.println("UserService add...");
        userDao.update();
    }
}
```

### Resource

注意：`@Resource`的完整类名是`javax.annotation.Resource`。

```java
package lsieun.spring.service;

import lsieun.spring.dao.UserDao;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component(value = "userService")
public class UserService {

    @Resource
    private UserDao userDao;

    public void add() {
        System.out.println("UserService add...");
        userDao.update();
    }
}
```

```text
@Resource(name = "userDao")
```

```text
@Resource(type = UserDao.class)
```

### Value

```java
package lsieun.spring.bean;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component(value = "user")
public class User {
    @Value(value = "tom")
    private String name;
    @Value(value = "10")
    private int age;

    @Override
    public String toString() {
        return String.format("User {name='%s', age=%d}", name, age);
    }
}
```

```java
package lsieun;

import lsieun.spring.bean.User;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 2. 获取配置创建的对象
        User user = context.getBean("user", User.class);
        System.out.println(user);
    }
}
```

## 完全注解

第一步，创建配置类，来替代原来的XML配置文件

```java
package lsieun.spring.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

// （1）这是一个配置类
@Configuration
// （2）扫描包下的类
@ComponentScan(basePackages = {"lsieun.spring"})
public class SpringConfig {
}
```

第二步，使用`AnnotationConfigApplicationContext`实现。

```java
package lsieun;

import lsieun.spring.bean.User;
import lsieun.spring.config.SpringConfig;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);

        // 2. 获取配置创建的对象
        User user = context.getBean("user", User.class);
        System.out.println(user);
    }
}
```



