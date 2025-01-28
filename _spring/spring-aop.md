---
title: "AOP"
sequence: "111"
---

什么是AOP？ 面向切面编程（Aspect Oriented Programming）

AOP底层原理

- 有两种情况实现动态代理
  - 第一种情况，有接口情况，使用JDK动态代理
  - 第二种情况，没有接口情况，使用CGLIB动态代理


## JDK动态代理

使用JDK动态代理，使用`java.lang.reflect.Proxy`类里的方法创建代理对象：

- 调用newProxyInstance方法

## CGLIB



## AOP术语

- 连接点：类里面哪些方法可以被增强，这些方法称为连接点
- 切入点：实际被真正增强的方法，称为切入点。
- 通知（增强）：
  - 实际增强的逻辑部分就称为通知（增强）
  - 通知有多种类型
    - 前置通知
    - 后置通知
    - 环绕通知
    - 异常通知 catch
    - 最终通知 finally
- 切面
  - 是动作，把通知应用到切入点的过程

- An important term in AOP is **advice**. It is the action taken by an aspect at a particular **join-point**.
- **Joinpoint** is a point of execution of the program, such as the execution of a method or the handling of an exception. In Spring AOP, a **joinpoint** always represents a method execution.
- **Pointcut** is a predicate or expression that matches join points.
- **Advice** is associated with a pointcut expression and runs at any join point matched by the pointcut.
- Spring uses the AspectJ pointcut expression language by default.

There are five types of **advice** in spring AOP.

- **Before advice**: Advice that executes before a join point, but which does not have the ability to prevent execution flow proceeding to the join point (unless it throws an exception).
- **After returning advice**: Advice to be executed after a join point completes normally: for example, if a method returns without throwing an exception.
- **After throwing advice**: Advice to be executed if a method exits by throwing an exception.
- **After advice**: Advice to be executed regardless of the means by which a join point exits (normal or exceptional return).
- **Around advice**: Advice that surrounds a join point such as a method invocation. This is the most powerful kind of advice. Around advice can perform custom behavior before and after the method invocation. It is also responsible for choosing whether to proceed to the join point or to shortcut the advised method execution by returning its own return value or throwing an exception.

## AOP操作

- Spring框架一般都是基于AspectJ实现AOP

什么是AspectJ？

AspectJ不是Spring组成部分，独立于AOP框架。一般把AspectJ和Spring框架一起使用，进行AOP操作。

基于AspectJ实现AOP操作：

- 基于XML配置文件实现
- 基于注解方式实现

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-aspects</artifactId>
    <version>${spring.version}</version>
</dependency>
```

## 切入点表达式

- 切入点表达式作用：知道对哪个类里面的哪个方法进行增强

语法结构：

```text
execution([权限修饰符][返回类型][类全路径][方法名称]([参数列表])
```

```text
# 对UserDao类里的add方法增强
execute(* lsieun.spring.dao.UserDao.add(..))

# 对UserDao类里的所有方法进行增强
execute(* lsieun.spring.dao.UserDao.*(..))

# 对包里所有类的所有方法进行增强
execute(* lsieun.spring.dao.*.*(..))
```

## 基于注解

```java
package lsieun.spring.bean;

import org.springframework.stereotype.Component;

@Component(value = "user")
public class User {
    public void add() {
        System.out.println("user add...");
    }
}
```

```java
package lsieun.spring.bean;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class UserProxy {
    @Before(value = "execution(* lsieun.spring.bean.User.add(..))")
    public void before() {
        System.out.println("before...");
    }

    @After(value = "execution(* lsieun.spring.bean.User.add(..))")
    public void after() {
        System.out.println("after...");
    }

    @AfterReturning(value = "execution(* lsieun.spring.bean.User.add(..))")
    public void afterReturning() {
        System.out.println("after Returning...");
    }

    @AfterThrowing(value = "execution(* lsieun.spring.bean.User.add(..))")
    public void afterThrowing() {
        System.out.println("after Throwing...");
    }

    @Around(value = "execution(* lsieun.spring.bean.User.add(..))")
    public void around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        System.out.println("around enter...");
        Object result = proceedingJoinPoint.proceed();
        System.out.println(result);
        System.out.println("around exit...");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
                           http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">
    <context:component-scan base-package="lsieun.spring.bean"/>

    <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
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

在Spring配置文件中，开启注解扫描

使用注解创建User和UserProxy对象

在增强类上面添加注解@Aspect

在Spring配置文件中开启生成代理对象

配置不同类型通知

## 相同的切入点抽取

```java
package lsieun.spring.bean;

import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class UserProxy {
    @Pointcut(value="execution(* lsieun.spring.bean.User.add(..))")
    public void pointdemo() {
    }

    @Before(value = "pointdemo()")
    public void before() {
        System.out.println("before...");
    }

    @After(value = "pointdemo()")
    public void after() {
        System.out.println("after...");
    }
}
```

## 设置优先级

在增强类上面添加注解`@Order`(数字类型值)，数字值越小，优先级越高

## 基于XML


