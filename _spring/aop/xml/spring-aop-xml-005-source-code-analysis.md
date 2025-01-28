---
title: "AOP 的 XML 原理剖析"
sequence: "105"
---

## 注册 BeanDefinition

### XML 配置文件

通过 XML 方式配置 AOP 时，我们引入 AOP 的命名空间：

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

### Jar: spring.handlers

找 `spring-aop` 包下的 `META-INF` 中的 `spring.handlers`：

![](/assets/images/spring/aop/spring-aop-jar-meta-inf-spring-handlers.png)

```text
http\://www.springframework.org/schema/aop=org.springframework.aop.config.AopNamespaceHandler
```

### 代码追踪

#### AopNamespaceHandler

```java
public class AopNamespaceHandler extends NamespaceHandlerSupport {
    @Override
    public void init() {
        // 为每一个标签注册一个解析器
        registerBeanDefinitionParser("config", new ConfigBeanDefinitionParser()); // aop:config 标签对应这个解析器
        registerBeanDefinitionParser("aspectj-autoproxy", new AspectJAutoProxyBeanDefinitionParser());
        registerBeanDefinitionDecorator("scoped-proxy", new ScopedProxyBeanDefinitionDecorator());

        registerBeanDefinitionParser("spring-configured", new SpringConfiguredBeanDefinitionParser());
    }
}
```

#### ConfigBeanDefinitionParser

```java
public interface BeanDefinitionParser {
    BeanDefinition parse(Element element, ParserContext parserContext);
}
```

```java
class ConfigBeanDefinitionParser implements BeanDefinitionParser {
    // step 1. 
    public BeanDefinition parse(Element element, ParserContext parserContext) {
        // ...

        // step 2.
        configureAutoProxyCreator(parserContext, element);
        
        // ...
    }

    // step 2.
    private void configureAutoProxyCreator(ParserContext parserContext, Element element) {
        // step 3.
        AopNamespaceUtils.registerAspectJAutoProxyCreatorIfNecessary(parserContext, element);
    }
}
```

#### AopNamespaceUtils

```java
public abstract class AopNamespaceUtils {
    // step 3.
    public static void registerAspectJAutoProxyCreatorIfNecessary(ParserContext parserContext, Element sourceElement) {
        // step 4.
        BeanDefinition beanDefinition = AopConfigUtils.registerAspectJAutoProxyCreatorIfNecessary(
                parserContext.getRegistry(),
                parserContext.extractSource(sourceElement)
        );
    }
}
```

#### AopConfigUtils

```java
public abstract class AopConfigUtils {
    public static final String AUTO_PROXY_CREATOR_BEAN_NAME =
            "org.springframework.aop.config.internalAutoProxyCreator";
    
    // step 4.
    public static BeanDefinition registerAspectJAutoProxyCreatorIfNecessary(
            BeanDefinitionRegistry registry, Object source
    ) {
        // step 5.
        return registerOrEscalateApcAsRequired(AspectJAwareAdvisorAutoProxyCreator.class, registry, source);
    }
    
    // step 5.
    private static BeanDefinition registerOrEscalateApcAsRequired(
            Class<?> cls, // org.springframework.aop.aspectj.autoproxy.AspectJAwareAdvisorAutoProxyCreator
            BeanDefinitionRegistry registry, // org.springframework.beans.factory.support.DefaultListableBeanFactory
            Object source // null
    ) {
        // step 6. registry.beanDefinitionMap { userService, expert }
        if (registry.containsBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME)) {
            // ... 这里不会执行
            return null;
        }

        // step 7. 在 registry 中注册 beanDefinition
        RootBeanDefinition beanDefinition = new RootBeanDefinition(cls);
        beanDefinition.setSource(source);
        beanDefinition.getPropertyValues().add("order", Ordered.HIGHEST_PRECEDENCE);
        beanDefinition.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
        registry.registerBeanDefinition(AUTO_PROXY_CREATOR_BEAN_NAME, beanDefinition);
        return beanDefinition;
    }
}
```

执行 `step 6` 时，`registry.beanDefinitionMap` 内容如下：

![](/assets/images/spring/aop/spring-aop-source-code-analysis-registry-bean-definition-map-001.png)

执行 `step 7` 之后，`registry.beanDefinitionMap` 内容如下：

![](/assets/images/spring/aop/spring-aop-source-code-analysis-registry-bean-definition-map-002.png)

### 小总结

结论：注册了一个 `AspectJAwareAdvisorAutoProxyCreator` 类型的 BeanDefinition。

## 生成代理对象

### AspectJAwareAdvisorAutoProxyCreator

![](/assets/images/spring/aop/aspectj-aware-advisor-auto-proxy-creator-class-hierarchy.png)

```java
public interface BeanPostProcessor {
    default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
}
```

### AbstractAutoProxyCreator

```java
public abstract class AbstractAutoProxyCreator extends ProxyProcessorSupport
		implements SmartInstantiationAwareBeanPostProcessor, BeanFactoryAware {
    
    // step 1.
    @Override
    public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
        if (bean != null) {
            Object cacheKey = getCacheKey(bean.getClass(), beanName);
            if (this.earlyProxyReferences.remove(cacheKey) != bean) {
                // step 2.
                return wrapIfNecessary(bean, beanName, cacheKey);
            }
        }
        return bean;
    }

    // step 2.
    protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
        // ...

        // Create proxy if we have advice.
        Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);
        if (specificInterceptors != DO_NOT_PROXY) {
            this.advisedBeans.put(cacheKey, Boolean.TRUE);
            
            // step 3.
            Object proxy = createProxy(
                    bean.getClass(),
                    beanName,
                    specificInterceptors,
                    new SingletonTargetSource(bean)
            );
            this.proxyTypes.put(cacheKey, proxy.getClass());
            return proxy;
        }

        this.advisedBeans.put(cacheKey, Boolean.FALSE);
        return bean;
    }

    // step 3.
    protected Object createProxy(
            Class<?> beanClass, // lsieun.service.impl.UserServiceImpl
            String beanName, // userService
            Object[] specificInterceptors,
            TargetSource targetSource
    ) {
        // ...

        // step 4.
        return proxyFactory.getProxy(classLoader);
    }
}
```

### ProxyFactory

```java
public class ProxyFactory extends ProxyCreatorSupport {
    // step 4.
    public Object getProxy(@Nullable ClassLoader classLoader) {
        // step 5.
        return createAopProxy().getProxy(classLoader);
    }
}
```

![](/assets/images/spring/aop/proxy-factory-create-aop-proxy-jdk-dynamic-aop-proxy.png)

```java
public interface AopProxy {
    Object getProxy(ClassLoader classLoader);
}
```

![](/assets/images/spring/aop/aop-proxy-class-hierarchy.png)

### JdkDynamicAopProxy

```java
final class JdkDynamicAopProxy implements AopProxy, InvocationHandler, Serializable {
    // step 5.
    @Override
    public Object getProxy(@Nullable ClassLoader classLoader) {
        if (logger.isTraceEnabled()) {
            logger.trace("Creating JDK dynamic proxy: " + this.advised.getTargetSource());
        }
        
        // step 6.
        return Proxy.newProxyInstance(
                determineClassLoader(classLoader),
                this.proxiedInterfaces,
                this
        );
    }

    // step 6.
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // ...
    }
}
```

### Main

在 `ApplicationContext.beanFactory.singleObjects` 中，`userService` 代表的 Bean 是生成的代理对象：

![](/assets/images/spring/aop/application-context-user-service-jdk-proxy-obj.png)

