---
title: "BeanFactory 与 ApplicationContext 的关系"
sequence: "103"
---

```text
思路：出现时间 --> 继承关系 --> 核心功能（Bean初始化时机） --> 扩展功能
```

- 出现时间
- 继承关系
    - 核心功能：Bean初始化时机
    - 扩展功能

## 时间对比

- BeanFactory 是 Spring 的早期接口，称为 Spring 的 Bean 工厂
- ApplicationContext 是后期更高级接口，称之为 Spring 容器

具体位置：

- BeanFactory 位于 `spring-beans.jar` 中，`org.springframework.beans.factory.BeanFactory`
- ApplicationContext 位于 `spring-context.jar`中，`org.springframework.context.ApplicationContext`

## 继承关系

Bean 创建的主要逻辑和功能，都被封装在 BeanFactory 中，
ApplicationContext 不仅继承了 BeanFactory，而且 ApplicationContext 内部还维护着 BeanFactory 的引用，
所以，ApplicationContext 与 BeanFactory 既有继承关系，又有融合关系。

![](/assets/images/spring/context/application-context-class-hierarchy.png)

## Bean 初始化时机

- 原始 BeanFactory 是在首次调用 `getBean()` 时才进行 Bean 的创建；
- ApplicationContext 则是配置文件加载，容器一创建，就将 Bean 都实例化并初始化好。

## 功能对比

ApplicationContext 在 BeanFactory 基础上对功能进行了扩展。
例如：事件发布器（ApplicationEventPublisher）、资源解析器（ResourcesPatternResolver）、
监听功能、国际化（MessageSource）功能等。

- BeanFactory 的 API 更偏向底层
- ApplicationContext 的 API 大多数是对这些底层 API 的封装

![](/assets/images/spring/context/application-context-class-hierarchy.png)


## BeanFactory

```java
public interface BeanFactory {
    String FACTORY_BEAN_PREFIX = "&";
    
    Object getBean(String name) throws BeansException;
    <T> T getBean(String name, Class<T> requiredType) throws BeansException;
    Object getBean(String name, Object... args) throws BeansException;
    <T> T getBean(Class<T> requiredType) throws BeansException;
    <T> T getBean(Class<T> requiredType, Object... args) throws BeansException;
    
    <T> ObjectProvider<T> getBeanProvider(Class<T> requiredType);
    <T> ObjectProvider<T> getBeanProvider(ResolvableType requiredType);
    
    boolean containsBean(String name);
    
    boolean isSingleton(String name) throws NoSuchBeanDefinitionException;
    boolean isPrototype(String name) throws NoSuchBeanDefinitionException;
    boolean isTypeMatch(String name, ResolvableType typeToMatch) throws NoSuchBeanDefinitionException;
    boolean isTypeMatch(String name, Class<?> typeToMatch) throws NoSuchBeanDefinitionException;
    
    Class<?> getType(String name) throws NoSuchBeanDefinitionException;
    Class<?> getType(String name, boolean allowFactoryBeanInit) throws NoSuchBeanDefinitionException;
    
    String[] getAliases(String name);
}
```

## DefaultListableBeanFactory

![](/assets/images/spring/bean/default-listable-bean-factory-class-hierarchy.png)

```java
public class DefaultListableBeanFactory extends AbstractAutowireCapableBeanFactory
		implements ConfigurableListableBeanFactory, BeanDefinitionRegistry, Serializable {
    private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(256);
}
```

## ApplicationContext

只在 Spring 基础环境下，常用的三个 ApplicationContext 作用如下：

- `ClassPathXmlApplicationContext`：加载类路径下的 XML 配置的 ApplicationContext
- `FileSystemXmlApplicationContext`：加载磁盘路径下的 XML 配置的 ApplicationContext
- `AnnotationConfigApplicationContext`：加载注解配置类的 ApplicationContext

![](/assets/images/spring/context/application-context-sub-classes.png)
