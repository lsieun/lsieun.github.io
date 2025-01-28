---
title: "Spring"
sequence: "101"
---

## IOC

- [ ] Spring 容器启动流程是怎样的？https://www.bilibili.com/video/BV1EN411e77V?p=62
- [ ] ApplicationContext和BeanFactory有什么区别？https://www.bilibili.com/video/BV1EN411e77V?p=61
- [ ] @Configuration 注解的作用？https://www.bilibili.com/video/BV1EN411e77V?p=79
- [ ] Spring为什么要用三级缓存解决循环依赖？https://www.bilibili.com/video/BV1EN411e77V?p=80

## Bean

- [ ] Spring Bean创建的生命周期（*****） https://www.bilibili.com/video/BV1EN411e77V?p=59
    - Bean 创建的生命周期
        - 实例化
            - 推断构造方法
            - 实例化
            - 填充属性（也就是，依赖注入）
            - 处理 AWare 回调
        - 初始化
            - 初始化前，处理 @PostConstruct 注解
            - 初始化，处理 InitializingBean 接口
            - 初始化后，进行 AOP
- [ ] Spring 如何创建一个Bean 对象 https://www.bilibili.com/video/BV1EN411e77V?p=68
- [ ] 单例Bean是单例模式吗？ https://www.bilibili.com/video/BV1EN411e77V/?p=53
- [ ] 什么是单例池？https://www.bilibili.com/video/BV1EN411e77V?p=69
- [ ] Bean的实例化和Bean的初始化有什么区别？https://www.bilibili.com/video/BV1EN411e77V?p=54
    - https://www.bilibili.com/video/BV1EN411e77V?p=73
    - Bean 的实例化，就是创建对象的过程；Bean 的初始化，具体是调用 invokeInitMethods 方法
    - 执行顺序：先有实例化，再有初始化
- [ ] @PostConstruct注解是如何生效的？https://www.bilibili.com/video/BV1EN411e77V?p=71
- [ ] Bean的初始化是如何工作的？https://www.bilibili.com/video/BV1EN411e77V?p=
- [ ] 什么是初始化后？https://www.bilibili.com/video/BV1EN411e77V?p=74
- [ ] 推断构造方法是什么意思？https://www.bilibili.com/video/BV1EN411e77V?p=75
- [ ] 什么是先byType再byName？https://www.bilibili.com/video/BV1EN411e77V?p=76
- [ ] Spring AOP底层是怎么工作的？https://www.bilibili.com/video/BV1EN411e77V/?p=77
- [ ] Spring 事务到底是如何工作的？https://www.bilibili.com/video/BV1EN411e77V?p=78
- [ ] BeanPostProcessor
- [ ] 线程视角
    - [ ] Spring 中 Bean 是线程安全的吗？https://www.bilibili.com/video/BV1EN411e77V?p=60

## AOP

- [ ] Spring AOP是如何实现的？https://www.bilibili.com/video/BV1EN411e77V?p=55
- [ ] Spring 事务
    - [ ] Spring中的事务是如何实现的？https://www.bilibili.com/video/BV1EN411e77V?p=56
    - [ ] 如何理解Spring事务的传播机制？https://www.bilibili.com/video/BV1EN411e77V?p=57
    - [ ] 哪些情况下会导致Spring事务失效？https://www.bilibili.com/video/BV1EN411e77V?p=58

- [ ] 史上最完整的AOP底层原理 https://www.bilibili.com/video/BV1SY41117zq/
- [ ] Spring AOP底层原理揭秘 https://www.bilibili.com/video/BV1Zk4y1p7M4/
- [ ] 请谈谈对Spring AOP的理解 https://www.bilibili.com/video/BV12F411E7LW/

## FAQ

### 对 Spring 的看法

这是一个开放性问题，只要是与 Spring 相关就行，我的思路是：

- 第 1 步，Spring 解决了什么问题？
    - Spring 的主要思路是 IoC、DI和AOP
- 第 2 步，Spring 的进一步发展，形成了一个生态
    - Spring Boot 是为了解决 Spring 配置繁琐的问题，例如，配置文件混乱、冗余、难以管理的问题，简化开发流程。
    - Spring Cloud 主要是解决（Spring Boot）微服务之间的问题，例如，服务调用（通信）、配置，注册与发现、负载均衡、服务保护（熔断、网关）等问题。
