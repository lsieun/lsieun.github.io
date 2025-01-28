---
title: "Spring 类的树状结构"
sequence: "109"
---

先有 `BeanDefinition`，后有 `Bean`，在考虑一个类的时候，看看它是与 `BeanDefinition` 相关的，还是与 Bean 相关的。

```text
BeanDefinition --> Bean
```

## BeanDefinition

### BeanDefinition

```text
                                                               ┌─── setParentName(String parentName)
                                           ┌─── parent ────────┤
                                           │                   └─── getParentName()
                                           │
                                           │                   ┌─── setBeanClassName(String beanClassName)
                  ┌─── basic ──────────────┼─── name ──────────┤
                  │                        │                   └─── getBeanClassName()
                  │                        │
                  │                        │                   ┌─── setDescription(String description)
                  │                        └─── description ───┤
                  │                                            └─── getDescription()
                  │
                  ├─── type ───────────────┼─── getResolvableType()
                  │
                  ├─── object
                  │
                  ├─── explicit
                  │
                  │                                            ┌─── hasConstructorArgumentValues()
                  │                        ┌─── constructor ───┤
                  │                        │                   └─── getConstructorArgumentValues()
                  │                        │
                  │                        │                   ┌─── hasPropertyValues()
                  │                        ├─── property ──────┤
                  │                        │                   └─── getPropertyValues()
                  │                        │
                  ├─── instance ───────────┤                   ┌─── setDependsOn(String... dependsOn)
                  │                        ├─── depend ────────┤
                  │                        │                   └─── getDependsOn()
                  │                        │
                  │                        │                   ┌─── setFactoryBeanName(String factoryBeanName)
                  │                        │                   │
                  │                        │                   ├─── getFactoryBeanName()
                  │                        └─── factory ───────┤
                  │                                            ├─── setFactoryMethodName(String factoryMethodName)
                  │                                            │
                  │                                            └─── getFactoryMethodName()
BeanDefinition ───┤
                  │                                         ┌─── setAutowireCandidate(boolean autowireCandidate)
                  │                        ┌─── autowire ───┤
                  │                        │                └─── isAutowireCandidate()
                  ├─── inject: relation ───┤
                  │                        │                ┌─── setPrimary(boolean primary)
                  │                        └─── primary ────┤
                  │                                         └─── isPrimary()
                  │
                  │                        ┌─── setScope(String scope)
                  │                        │
                  │                        ├─── getScope()
                  ├─── scope: space ───────┤
                  │                        ├─── isSingleton()
                  │                        │
                  │                        └─── isPrototype()
                  │
                  │                        ┌─── setLazyInit(boolean lazyInit)
                  ├─── lazy: time ─────────┤
                  │                        └─── isLazyInit()
                  │
                  │                                        ┌─── setInitMethodName(String initMethodName)
                  │                        ┌─── init ──────┤
                  │                        │               └─── getInitMethodName()
                  ├─── hook ───────────────┤
                  │                        │               ┌─── setDestroyMethodName(String destroyMethodName)
                  │                        └─── destroy ───┤
                  │                                        └─── getDestroyMethodName()
                  │
                  │                                            ┌─── setRole(int role)
                  │                        ┌─── role ──────────┤
                  │                        │                   └─── getRole()
                  │                        │
                  └─── other ──────────────┼─── description ───┼─── getResourceDescription()
                                           │
                                           │                   ┌─── isAbstract()
                                           └─── xxx ───────────┤
                                                               └─── getOriginatingBeanDefinition()
```

### BeanDefinitionRegistry

```java
public interface BeanDefinitionRegistry extends AliasRegistry {
}
```

```text
                                                         ┌─── containsBeanDefinition(String beanName)
                                           ┌─── exist ───┤
                                           │             └─── isBeanNameInUse(String beanName)
                          ┌─── single ─────┤
                          │                │             ┌─── registerBeanDefinition(String beanName, BeanDefinition beanDefinition): Create
                          │                │             │
                          │                └─── CRUD ────┼─── removeBeanDefinition(String beanName)                                 : Delete
BeanDefinitionRegistry ───┤                              │
                          │                              └─── getBeanDefinition(String beanName)                                    : Read
                          │
                          │                ┌─── getBeanDefinitionNames()
                          └─── multiple ───┤
                                           └─── getBeanDefinitionCount()
```

## Bean

### BeanFactory

```text
                                ┌─── exist ──────┼─── containsBean(String name)
                                │
                                ├─── name ───────┼─── getAliases(String name)
                                │
                                │                ┌─── isTypeMatch(String name, Class<?> typeToMatch)
                                │                │
                                │                ├─── isTypeMatch(String name, ResolvableType typeToMatch)
                                ├─── type ───────┤
                                │                ├─── getType(String name)
                                │                │
                                │                └─── getType(String name, boolean allowFactoryBeanInit)
               ┌─── bean ───────┤
               │                │                ┌─── getBean(String name)
               │                │                │
               │                │                ├─── getBean(Class<T> requiredType)
               │                │                │
               │                ├─── instance ───┼─── getBean(String name, Class<T> requiredType)
               │                │                │
               │                │                ├─── getBean(String name, Object... args)
BeanFactory ───┤                │                │
               │                │                └─── getBean(Class<T> requiredType, Object... args)
               │                │
               │                │                ┌─── isSingleton(String name)
               │                └─── scope ──────┤
               │                                 └─── isPrototype(String name)
               │
               │                ┌─── getBeanProvider(Class<T> requiredType)
               └─── provider ───┤
                                └─── getBeanProvider(ResolvableType requiredType)
```

### HierarchicalBeanFactory

```java
public interface HierarchicalBeanFactory extends BeanFactory {
    BeanFactory getParentBeanFactory();
    boolean containsLocalBean(String name);
}
```

```text
                           ┌─── parent ───┼─── getParentBeanFactory()
HierarchicalBeanFactory ───┤
                           └─── bean ─────┼─── containsLocalBean(String name)
```

### ListableBeanFactory

```java
public interface ListableBeanFactory extends BeanFactory {
    
}
```

```text
                                          ┌─── containsBeanDefinition(String beanName)
                                          │
                       ┌─── definition ───┼─── getBeanDefinitionCount()
                       │                  │
                       │                  └─── getBeanDefinitionNames()
                       │
                       │                                                        ┌─── getBeanNamesForType(Class<?> type)
                       │                                                        │
                       │                                                        ├─── getBeanNamesForType(Class<?> type, boolean includeNonSingletons, boolean allowEagerInit)
                       │                                     ┌─── type ─────────┤
                       │                                     │                  ├─── getBeanNamesForType(ResolvableType type)
                       │                                     │                  │
                       │                  ┌─── name ─────────┤                  └─── getBeanNamesForType(ResolvableType type, boolean includeNonSingletons, boolean allowEagerInit)
                       │                  │                  │
ListableBeanFactory ───┤                  │                  │                  ┌─── getBeanNamesForAnnotation(Class<? extends Annotation> annotationType)
                       │                  │                  └─── annotation ───┤
                       │                  │                                     └─── getBeansWithAnnotation(Class<? extends Annotation> annotationType)
                       ├─── bean ─────────┤
                       │                  │                  ┌─── getBeansOfType(Class<T> type)
                       │                  ├─── instance ─────┤
                       │                  │                  └─── getBeansOfType(Class<T> type, boolean includeNonSingletons, boolean allowEagerInit)
                       │                  │
                       │                  │                  ┌─── findAnnotationOnBean(String beanName, Class<A> annotationType)
                       │                  └─── annotation ───┤
                       │                                     └─── findAnnotationOnBean(String beanName, Class<A> annotationType, boolean allowFactoryBeanInit)
                       │
                       │                  ┌─── getBeanProvider(Class<T> requiredType, boolean allowEagerInit)
                       └─── provider ─────┤
                                          └─── getBeanProvider(ResolvableType requiredType, boolean allowEagerInit)

```

### SingletonBeanRegistry

```java
public interface SingletonBeanRegistry {
}
```

```text
                                                        ┌─── registerSingleton(String beanName, Object singletonObject)
                                          ┌─── crud ────┤
                                          │             └─── Object getSingleton(String beanName);
                         ┌─── single ─────┤
                         │                ├─── exist ───┼─── boolean containsSingleton(String beanName);
                         │                │
SingletonBeanRegistry ───┤                └─── mutex ───┼─── Object getSingletonMutex()
                         │
                         │                ┌─── String[] getSingletonNames();
                         └─── multiple ───┤
                                          └─── int getSingletonCount();
```
