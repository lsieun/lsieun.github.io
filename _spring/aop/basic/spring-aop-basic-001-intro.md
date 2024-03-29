---
title: "Spring AOP"
sequence: "101"
---

AOP： 全称是 Aspect Oriented Programming 即： 面向切面编程

## AOP 的相关概念

- 目标对象（Target）：被增强的方法所在的对象
- 代理对象（Proxy）：对目标对象进行增强后的对象，客户端实际调用的对象
- 连接点（JoinPoint）：目标对象中可以被增强的方法
- 切入点（PointCut）：目标对象中实际被增强的方法
- 通知/增强（Advice）：增强部分的代码逻辑
- 切面（Aspect）：增强和切入点的组合
- 织入（Weaving）：将通知和切入点动态组合的过程

## AOP 配置方式

### XML 方式

通过配置文件的方式：

- 配置哪些包、哪些类、哪些方法，需要被增强
- 配置目标方法，要被哪些通知方法所增强，在目标方法执行之前，还是之后增强？

## AOP 的实现方式




