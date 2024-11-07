---
title: "Spring Intro: Ioc、DI和AOP"
sequence: "101"
---

## IoC、DI 和 AOP 思想提出

**IoC** 思想：**Inversion of Control**，控制反转，
强调的是原来在程序中创建 Bean 的权力反转给第三方。

**DI** 思想：**Dependency Injection**，依赖注入，
强调的 Bean 之间的关系，这种关系由第三方负责去设置。

**AOP** 思想：**Aspect Oriented Programming**，面向切面编程，
功能的横向提取，主要的实现方式就是 Proxy。

## Spring 官网

### 文档

CURRENT(6.x):

```text
https://docs.spring.io/spring-framework/reference/index.html
```

5.2.25.RELEASE:

```text
https://docs.spring.io/spring-framework/docs/5.2.25.RELEASE/spring-framework-reference/
```

### 架构

![](/assets/images/spring/spring-overview.png)
