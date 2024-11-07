---
title: "AOP 快速开始：XML + Anno 方式"
sequence: "101"
---

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

## 示例一：XML配置 + 注解

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
import org.springframework.stereotype.Service;

@Service("userService")
public class UserServiceImpl implements UserService {
    @Override
    public void show1() {
        System.out.println("show1...");
    }

    @Override
    public void show2() {
        System.out.println("show2...");
    }
}
```

```java
package lsieun.advice;

import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class Expert {
    @Before("execution(void lsieun.service.impl.*.*(..))")
    public void beforeAdvice() {
        System.out.println("before...");
    }

    @After("execution(void lsieun.service.impl.*.*(..))")
    public void afterAdvice() {
        System.out.println("after...");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop
       https://www.springframework.org/schema/aop/spring-aop.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 组件扫描 -->
    <context:component-scan base-package="lsieun"/>

    <!-- 使用注解配置 AOP，需要开启 AOP 自动代理 -->
    <aop:aspectj-autoproxy/>
</beans>
```

```java
package lsieun.run;

import lsieun.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        UserService userService = (UserService) applicationContext.getBean("userService");
        userService.show1();
        userService.show2();
    }
}
```

## 示例二

```java
package lsieun.spring.bean;

import org.springframework.stereotype.Component;

@Component
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

import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class UserProxy {
    @Pointcut(value = "execution(* lsieun.spring.bean.User.add(..))")
    public void myPointCut() {}

    @Before(value = "myPointCut()")
    public void before() {
        System.out.println("before...");
    }

    @After(value = "myPointCut()")
    public void after() {
        System.out.println("after...");
    }
}
```

```java
package lsieun.spring.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@ComponentScan(basePackages = {"lsieun.spring"})
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class SpringConfig {
}
```

```java
package lsieun;

import lsieun.spring.bean.User;
import lsieun.spring.config.SpringConfig;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Main {
    public static void main(String[] args) throws Exception {
        // 1. 加载spring配置文件
        ApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);

        // 2. 获取配置创建的对象
        User user = context.getBean("user", User.class);
        user.add();
    }
}
```

## 比较

![](/assets/images/spring/aop/spring-aop-compare-xml-vs-anno.png)

