---
title: "五种通知类型"
sequence: "103"
---

## 五种类型

AspectJ 的通知由以下五种类型：

- 前置通知：`<aop:before>`，目标方法执行之前执行
- 后置通知：`<aop:after>`，不管目标方法是否有异常，最终都会执行
    - 正常退出通知：`<aop:after-returning>`，目标方法执行之后执行，目标方法异常时，不再执行
    - 异常退出通知：`<aop:after-throwing>`，目标方法抛出异常时执行
- 环绕通知：`<aop:round>`，目标方法执行前后执行，目标方法异常时，环绕后方法不再执行

## 方法参数

通知方法在被调用时，Spring 可以为其传递一些必要的参数：

- `JoinPoint`：连接点对象，任何通知都可使用，可以获得当前目标对象、目标方法参数等信息
- `ProceedingJoinPoint`：`JoinPoint` 子类对象，主要是在环绕通知中执行 `proceed()`，进而执行目标方法
- `Throwable`：异常对象，使用在异常通知中，需要在配置文件中指出异常对象名称

`JoinPoint` 对象：

```text
public void 通知方法名称(JoinPoint joinPoint) {
    // 获得目标方法的参数
    System.out.println(joinPoint.getArgs());
    // 获得目标对象
    System.out.println(joinPoint.getTarget());
    // 获得精确的切点表达式信息
    System.out.println(joinPoint.getStaticPart());
}
```

`ProceedingJoinPoint` 对象：

```text
public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
    System.out.println(joinPoint.getArgs());          // 获得目标方法的参数 
    System.out.println(joinPoint.getTarget());        // 获得目标对象
    System.out.println(joinPoint.getStaticPart());    // 获得精确的切点表达式信息
    Object result = joinPoint.proceed(); // 执行目标方法
    return result; // 返回目标方法返回值
}
```

`Throwable` 对象：

```text
public void afterThrowing(JoinPoint joinPoint, Throwable th) {
    // 获得异常信息
    System.out.println("异常对象是：" + th + "，异常信息是：" + th.getMessage());
}
```

```xml
<aop:after-throwing method="afterThrowing" pointcut-ref="myPointCut" throwing="th"/>
```

## 示例

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

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;

public class Expert {
    public void beforeAdvice(JoinPoint joinPoint) {
        Object target = joinPoint.getTarget();
        JoinPoint.StaticPart staticPart = joinPoint.getStaticPart();
        System.out.println("before - Target: " + target);
        System.out.println("before - StaticPart: " + staticPart);
    }

    public void afterAdvice() {
        System.out.println("after...");
    }

    public void afterReturningAdvice() {
        System.out.println("after returning");
    }

    public void afterThrowing(Throwable th) {
        System.out.println("after throwing: " + th.getMessage());
    }

    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        // 环绕目标方法
        System.out.println("环绕前的增强...");
        Object result = pjp.proceed();
        System.out.println("环绕后的增强...");
        return result;
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
        <!-- 配置 PointCut（切点）表达式，目的是指定哪些方法需要被增强 -->
        <aop:pointcut id="myPointCut" expression="execution(void lsieun.service.impl.*.*(..))"/>

        <!-- 配置织入，目的是要执行哪些切点与哪些通知进行结合 -->
        <aop:aspect ref="expert">
            <aop:before method="beforeAdvice" pointcut-ref="myPointCut"/>
            <aop:after method="afterAdvice" pointcut-ref="myPointCut"/>
            <aop:after-returning method="afterReturningAdvice" pointcut-ref="myPointCut"/>
            <aop:after-throwing method="afterThrowing" pointcut-ref="myPointCut" throwing="th"/>
            <aop:around method="around" pointcut-ref="myPointCut"/>
        </aop:aspect>
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

```text
before - Target: lsieun.service.impl.UserServiceImpl@6ce139a4
before - StaticPart: execution(void lsieun.service.UserService.show1())
环绕前的增强...
show 1 ...
环绕后的增强...
after returning
after...

before - Target: lsieun.service.impl.UserServiceImpl@6ce139a4
before - StaticPart: execution(void lsieun.service.UserService.show2())
环绕前的增强...
show 2 ...
after throwing: / by zero
after...
```
