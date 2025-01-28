---
title: "AOP 原理剖析"
sequence: "105"
---

## 有三种方式

第 1 种方式，使用 XML 方式：

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

第 2 种方式，使用 XML + Annotation 的方式：

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

```text
<aop:aspectj-autoproxy/>
```

```text
http\://www.springframework.org/schema/aop=org.springframework.aop.config.AopNamespaceHandler
```

```java
public class AopNamespaceHandler extends NamespaceHandlerSupport {
    public void init() {
        registerBeanDefinitionParser("aspectj-autoproxy", new AspectJAutoProxyBeanDefinitionParser());
    }
}
```

第 3 种方式，使用 Java 代码配置的方式：

```java
package lsieun.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@ComponentScan(basePackages = "lsieun")
@EnableAspectJAutoProxy
public class SpringConfig {
}
```
