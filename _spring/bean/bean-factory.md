---
title: "BeanFactory"
sequence: "101"
---

The root interface for accessing a Spring bean container.

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

```text
                                 ┌─── setParentName(String parentName)
                  ┌─── parent ───┤
                  │              └─── getParentName()
                  │
                  │              ┌─── setBeanClassName(String beanClassName)
                  ├─── name ─────┤
                  │              └─── getBeanClassName()
                  │
                  ├─── type ─────┼─── getResolvableType()
                  │
                  │                                                       ┌─── hasConstructorArgumentValues()
                  │                                   ┌─── constructor ───┤
                  │                                   │                   └─── getConstructorArgumentValues()
                  │                                   │
                  │                                   │                   ┌─── hasPropertyValues()
                  │                                   ├─── property ──────┤
                  │                                   │                   └─── getPropertyValues()
                  │                                   │
                  │              ┌─── explicit ───────┤                   ┌─── setDependsOn(String... dependsOn)
                  │              │                    ├─── depend ────────┤
                  │              │                    │                   └─── getDependsOn()
                  │              │                    │
                  │              │                    │                   ┌─── setFactoryBeanName(String factoryBeanName)
                  │              │                    │                   │
                  │              │                    │                   ├─── getFactoryBeanName()
                  │              │                    └─── factory ───────┤
                  │              │                                        ├─── setFactoryMethodName(String factoryMethodName)
                  │              │                                        │
                  │              │                                        └─── getFactoryMethodName()
                  │              │
                  │              │                                     ┌─── setAutowireCandidate(boolean autowireCandidate)
                  │              │                    ┌─── autowire ───┤
BeanDefinition ───┼─── object ───┤                    │                └─── isAutowireCandidate()
                  │              ├─── auto inject ────┤
                  │              │                    │                ┌─── setPrimary(boolean primary)
                  │              │                    └─── primary ────┤
                  │              │                                     └─── isPrimary()
                  │              │
                  │              │                    ┌─── setScope(String scope)
                  │              │                    │
                  │              │                    ├─── getScope()
                  │              ├─── scope: space ───┤
                  │              │                    ├─── isSingleton()
                  │              │                    │
                  │              │                    └─── isPrototype()
                  │              │
                  │              │                    ┌─── setLazyInit(boolean lazyInit)
                  │              └─── lazy: time ─────┤
                  │                                   └─── isLazyInit()
                  │
                  │                              ┌─── setInitMethodName(String initMethodName)
                  │              ┌─── init ──────┤
                  │              │               └─── getInitMethodName()
                  ├─── hook ─────┤
                  │              │               ┌─── setDestroyMethodName(String destroyMethodName)
                  │              └─── destroy ───┤
                  │                              └─── getDestroyMethodName()
                  │
                  │                                  ┌─── setRole(int role)
                  │              ┌─── role ──────────┤
                  │              │                   └─── getRole()
                  │              │
                  │              │                   ┌─── setDescription(String description)
                  │              │                   │
                  └─── other ────┼─── description ───┼─── getDescription()
                                 │                   │
                                 │                   └─── getResourceDescription()
                                 │
                                 │                   ┌─── isAbstract()
                                 └─── xxx ───────────┤
                                                     └─── getOriginatingBeanDefinition()
```

![](/assets/images/spring/ioc/default-listable-bean-factory.png)

![](/assets/images/spring/ioc/spring-resource.png)

