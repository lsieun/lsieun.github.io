---
title: "AOP 底层两种实现方式：CgLib 和 JDK Dynamic"
sequence: "106"
---

动态代理的实现的选择，在调用 `getProxy()` 方法时，我们可选用 `AopProxy` 接口有两个实现类：
一种是基于 JDK 的，另一种是基于 Cglib 的，两者都是动态生成代理对象的方式。

```java
public interface AopProxy {
    Object getProxy(ClassLoader classLoader);
}
```

![](/assets/images/spring/aop/aop-proxy-class-hierarchy.png)

<table>
    <thead>
    <tr>
        <th>代理技术</th>
        <th>JDK 动态代理技术</th>
        <th>Cglib 动态代理技术</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>使用条件</td>
        <td>目标类有接口，是基于接口动态生成实现类的代理对象</td>
        <td>目标类无接口，且不能使用 final 修饰，是基于被“代理对象”动态生成“子对象”为代理对象</td>
    </tr>
    <tr>
        <td>配置方式</td>
        <td>目标类有接口的情况下，默认方式</td>
        <td>目标类无接口时，默认使用该方式；目标类有接口时，需要手动配置</td>
    </tr>
    </tbody>
</table>

手动配置，强制使用 Cglib 方式：

```text
<aop:config proxy-target-class="true">
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
    <aop:config proxy-target-class="true">
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

## 使用 Cglib 生成超类的动态代理

```text
Target target = new Target(); // 目标对象
Advices advices = new Advices(); // 通知对象
Enhancer enhancer = new Enhancer(); // 增强器对象
enhancer.setSuperclass(Target.class); // 增强器设置父类

// 增强器设置回调
enhancer.setCallback(
    (MethodInterceptor) (o, method, objects, methodProxy) -> {
        advices.before();
        Object result = method.invoke(target, objects);
        advices.afterReturning();
        return result;
    }
);

// 创建代理对象
Target targetProxy = (Target) enhancer.create();

// 测试
String result = targetProxy.show("hello");
```

```java
public class Target {
    public void show() {
        System.out.println("show...");
    }
}
```

```java
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
import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class CglibRun {
    public static void main(String[] args) {
        // 1. 目标对象
        Target target = new Target();

        // 2. 专家对象
        Expert expert = new Expert();

        // 3. 增强器对象
        Enhancer enhancer = new Enhancer();
        // 设置父类
        enhancer.setSuperclass(Target.class);
        // 设置回调
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                expert.beforeAdvice();
                Object result = method.invoke(target, objects);
                expert.afterAdvice();
                return result;
            }
        });

        // 4. 创建代理对象
        Target targetProxy = (Target) enhancer.create();
        
        // 5. 测试
        targetProxy.show();
    }
}
```

