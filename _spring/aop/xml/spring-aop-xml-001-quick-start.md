---
title: "AOP 快速开始：XML 方式"
sequence: "101"
---

XML 方式配置 AOP 的步骤：

- 1、导入 AOP 相关坐标
- 2、准备目标类、增强类，并配置给 Spring 管理
- 3、配置切点表达式（哪些方法被增强）
- 4、配置织入（切点被哪些通知方法增强，是前置增强，还是后置增强）

## pom.xml

```xml
<properties>
    <!-- resource -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

    <!-- JDK -->
    <java.version>8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>

    <!-- spring -->
    <spring.version>5.3.31</spring.version>
</properties>
```

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aspects</artifactId>
        <version>${spring.version}</version>
    </dependency>
</dependencies>
```

## 示例一

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop
       https://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- 目标类 -->
    <bean id="userService" class="lsieun.service.impl.UserServiceImpl"/>

    <!-- 通知类 -->
    <bean id="expert" class="lsieun.profession.Expert"/>

    <!-- AOP 配置 -->
    <aop:config>
        <!-- 配置 PointCut（切点）表达式，目的是指定哪些方法需要被增强 -->
        <aop:pointcut id="myPointCut" expression="execution(void lsieun.service.impl.UserServiceImpl.show1())"/>

        <!-- 配置织入，目的是要执行哪些切点与哪些通知进行结合 -->
        <aop:aspect ref="expert">
            <aop:before method="beforeAdvice" pointcut-ref="myPointCut"/>
            <aop:after method="afterAdvice" pointcut-ref="myPointCut"/>
        </aop:aspect>
    </aop:config>

</beans>
```

```java
package lsieun.service;

public interface UserService {

    void show1();

    void show2();

}
```

```java
package lsieun.service.impl;

import lsieun.service.UserService;

public class UserServiceImpl implements UserService {

    @Override
    public void show1() {
        System.out.println("show 1 ...");
    }

    @Override
    public void show2() {
        System.out.println("show 2 ...");
    }
}
```

```java
package lsieun.profession;

public class Expert {
    public void beforeAdvice() {
        System.out.println("before...");
    }

    public void afterAdvice() {
        System.out.println("after...");
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
        userService.show1();
        userService.show2();
    }
}
```

```text
before...
show 1 ...
after...
show 2 ...
```

## 示例二

```java
package lsieun.spring.bean;

public class User {
    public void add() {
        System.out.println("user add...");
    }

    public void sub() {
        System.out.println("user sub...");
    }
}
```

```java
package lsieun.spring.bean;

public class UserProxy {
    public void before() {
        System.out.println("before...");
    }

    public void after() {
        System.out.println("after...");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

    <bean id="user" class="lsieun.spring.bean.User"/>
    <bean id="userProxy" class="lsieun.spring.bean.UserProxy"/>

    <aop:config>
        <!-- 切入点 -->
        <aop:pointcut id="myPointcut" expression="execution(* lsieun.spring.bean.User.add(..))"/>

        <!-- 切面 -->
        <aop:aspect ref="userProxy">
            <aop:before method="before" pointcut-ref="myPointcut"/>
            <aop:after method="after" pointcut-ref="myPointcut"/>
        </aop:aspect>
    </aop:config>
</beans>
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
        user.add();
    }
}
```
