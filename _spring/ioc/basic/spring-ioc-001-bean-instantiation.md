---
title: "Spring Bean 实例化的基本流程"
sequence: "101"
---

## Bean 实例化的基本流程

Spring 容器在进行初始化时，会将 XML 配置的 `<bean>` 的信息封装成一个 `BeanDefinition` 对象，
所有的 `BeanDifinition` 存储到一个名为 `beanDefinitionMap` 的 Map 集合中去，
Spring 框架在对该 Map 进行遍历，使用反射创建 Bean 实例对象，
创建好的 Bean 对象存储在一个名为 `singletonObjects` 的 Map 集合中，
当调用 `getBean` 方法时，则最终从该 Map 集合中取出 Bean 实例对象返回。

```text
XML:<bean> --> beanDefinitionMap:BeanDefinition --> singletonObjects:Bean
```

### beanDefinitionMap

`DefaultListableBeanFactory` 对象内部维护着一个 Map 用于存储封装好的 `BeanDefinitionMap`：

```text
public class DefaultListableBeanFactory extends ... implements ... {
    // 存储 <bean> 标签对应的 BeanDefinition 对象
    // key 是 Bean 的 beanName，value 是 Bean 定义对象 BeanDefinition
    private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(256);
}
```

Spring 框架会取出 `beanDefinitionMap` 中的每个 `BeanDefinition` 信息，反射构造方法或调用指定的工厂方法生成 Bean 实例对象，
所以只要将 BeanDefinition 注册到 `beanDefinitionMap` 这个 Map 中，Spring 就会进行对应的 Bean 的实例化操作。

### singletonObjects

`beanDefinitionMap` 中的 BeanDefinition 会被转化成对应的 Bean 实例对象，存储到单例池 `singletonObjects` 中去。

在 `DefaultListableBeanFactory` 的上四级父类 `DefaultSingletonBeanRegistry` 中，维护着 `singletonObjects`：

```text
public class DefaultSingletonBeanRegistry extends ... implements ... {
    // 存储 Bean 实例的单例池
    // key 是 Bean 的 beanName，value 是 Bean 的实例对象
    private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);
}
```

### Bean 实例化的基本流程

- 加载 XML 配置文件，解析获取配置中的每个 `<bean>` 的信息，封装成一个个的 `BeanDefinition` 对象；
- 将 BeanDefinition 存储在一个名为 `beanDefinitionMap` 的 `Map<String, BeanDefinition>` 中；
- `ApplicationContext` 底层遍历 `beanDefinitionMap`，创建 Bean 实例对象；
- 创建好的 Bean 实例对象，被存储到一个名为 `singletonObjects` 的 `Map<String, Object>` 中；
- 当执行 `applicationContext.getBean(beanName)` 时，从 `singletonObjects` 去匹配 Bean 实例返回。

## order

The order of creation is important for Spring.
After digesting the configuration meta-data,
Spring creates a plan (it allocates certain priorities to each bean) with the order of beans
that needs to be created to satisfy dependencies.
If Spring encounters any exception while creating an object, it will fail fast and quit.
It does not create any further beans and lets the developer know why it won't progress further.

![](/assets/images/spring/spring-overview.png)

## Reference

- [Spring Framework Documentation](https://docs.spring.io/spring-framework/docs/current/reference/html/)
