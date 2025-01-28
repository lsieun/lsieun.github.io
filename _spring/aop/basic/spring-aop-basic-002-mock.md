---
title: "模拟 AOP 思想实现方案"
sequence: "102"
---

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
package lsieun.processor;

import lsieun.profession.Expert;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import java.lang.reflect.Proxy;

public class MockAopBeanPostProcessor implements BeanPostProcessor, ApplicationContextAware {
    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // 目的：对 UserServiceImpl 中的 show1 和 show2 方法进行增强，增强方法存在于 Expert 中
        // 问题 1：筛选 service.impl 包下的所有的类的所有方法都可以进行增强？
        // 问题 2：Expert 怎么获取到？解决方案：从 Spring 容器中获得 Expert

        Package pkg = bean.getClass().getPackage();
        String pkgName = pkg.getName();

        if (pkgName.equals("lsieun.service.impl")) {
            // 生成当前 Bean 的 Proxy 对象
            Object proxyObj = Proxy.newProxyInstance(
                    bean.getClass().getClassLoader(),
                    bean.getClass().getInterfaces(),
                    ((proxy, method, args) -> {
                        // 执行增强对象的 before 方法
                        Expert expert = applicationContext.getBean(Expert.class);
                        expert.beforeAdvice();

                        // 执行目标对象的目标方法
                        Object result = method.invoke(bean, args);

                        // 执行增强对象的 after 方法
                        expert.afterAdvice();

                        return result;
                    })
            );

            return proxyObj;
        }

        return bean;
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="lsieun.service.impl.UserServiceImpl"/>
    <bean id="expert" class="lsieun.profession.Expert"/>
    <bean class="lsieun.processor.MockAopBeanPostProcessor"/>

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
before...
show 1 ...
after...
before...
show 2 ...
after...
```
