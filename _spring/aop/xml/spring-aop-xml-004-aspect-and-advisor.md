---
title: "AOP 的 XML 两种配置方式"
sequence: "104"
---

## 介绍

AOP 的 XML 有两种配置方式：

- 使用 `<advisor>` 配置切面
- 使用 `<aspect>` 配置切面

Spring 定义了一个 `Advice` 接口，实现了该接口的类，都可以作为通知类出现：

```java
package org.aopalliance.aop;

public interface Advice {
}
```

使用 `advisor` 配置示例：

```xml
<aop:config>
    <aop:pointcut id="myPointCut" expression="execution(void lsieun.service.impl.*.*(..))"/>
    <aop:advisor advice-ref="expert" pointcut-ref="myPointCut"/>
</aop:config>
```

使用 `advisor` 配置示例：

```xml
<aop:config>
    <aop:pointcut id="myPointCut" expression="execution(void lsieun.service.impl.*.*(..))"/>

    <aop:aspect ref="expert">
        <aop:before method="beforeAdvice" pointcut-ref="myPointCut"/>
        <aop:after method="afterAdvice" pointcut-ref="myPointCut"/>
        <aop:after-returning method="afterReturningAdvice" pointcut-ref="myPointCut"/>
        <aop:after-throwing method="afterThrowing" pointcut-ref="myPointCut" throwing="th"/>
        <aop:around method="around" pointcut-ref="myPointCut"/>
    </aop:aspect>
</aop:config>
```

### 比较

AOP 配置的两种语法形式不同：

- advisor 是通过实现接口来确认通知的类型
- aspect 是通过配置确认通知的类型，更加灵活

可以配置的切面数量不同：

- 一个 advisor 只能配置一个固定通知和一个切点表达式
- 一个 aspect 可以配置多个通知和多个切点表达式任意组合

使用场景不同：

- 允许随意搭配情况下可以使用 aspect 进行配置
- 如果通知类型单一、切面单一的情况下，可以使用 advisor 进行配置
- 在通知类型已经固定，不用人为指定通知类型时，可以使用 advisor 进行配置，例如 Spring 事务控制的配置

## 示例：advisor

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
        int result = 1 / 0;
    }
}
```

```java
package lsieun.profession;

import org.springframework.aop.AfterReturningAdvice;
import org.springframework.aop.MethodBeforeAdvice;

import java.lang.reflect.Method;

public class Expert implements MethodBeforeAdvice, AfterReturningAdvice {
    @Override
    public void before(Method method, Object[] args, Object target) throws Throwable {
        System.out.println("前置通知...");
    }

    @Override
    public void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable {
        System.out.println("后置通知...");
    }
}
```

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
        <aop:pointcut id="myPointCut" expression="execution(void lsieun.service.impl.*.*(..))"/>
        <aop:advisor advice-ref="expert" pointcut-ref="myPointCut"/>
    </aop:config>

</beans>
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

### 更多

```java
package lsieun.profession;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;

public class Expert implements MethodInterceptor {


    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        System.out.println("环绕前...");
        Object result = invocation.getMethod().invoke(
                invocation.getThis(),
                invocation.getArguments()
        );
        System.out.println("环绕后...");
        return result;
    }
}
```
