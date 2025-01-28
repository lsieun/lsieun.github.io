---
title: "Gateway Intro"
sequence: "101"
---

- 什么是Spring Cloud Gateway
    - 核心概念
    - 工作原理
- Spring Cloud Gateway快速开始
    - 环境搭建：只要按照网关地址/微服务/接口的格式去访问，就可以得到成功响应
    - 路由断言（Route Predicate Factories）配置
        - 时间匹配
        - Cookie匹配
        - Header匹配
        - 路径匹配
        - 自定义路由断言工厂

作用：

- 关注稳定与安全
    - 全局性流控
    - 日志统计
    - 防止SQL注入
    - 防止Web攻击
    - 屏蔽工具扫描
    - 黑白IP名单
    - 证书/加密解密处理
- 提供更好的服务
    - 服务级别流控
    - 服务降级与熔断
    - 路由与负载均衡、灰度策略
    - 服务过滤、聚合与发现
    - 权限验证与用户等级策略
    - 业务规格与参数校验
    - 多级缓存策略

## 什么是Spring Cloud Gateway

网关作为流量的入口，常用的功能包括路由转发、权限检验、限流等。

Spring Cloud Gateway是Spring Cloud官方推出的第二代网关框架，定位于取代Netfix Zuul 1.0。
相比Zuul来说，Spring Cloud Gateway提供更优秀的性能，更强大的有功能。

Spring Cloud Gateway是由WebFlux + Netty + Reactor实现的响应式API。
**它不能在传统的servlet中工作，也不能构建成war包。**

Spring Cloud Gateway旨在为微服务架构提供一种简单有效的API路由的管理方式，
并基于Filter的方式提供网关的基本功能，例如说安全认证、监控、限流等等。

## 其它的网关组件

在Spring Cloud微服务体系中，有个很重要的组件就是网关。
在1.x版本中，都是采用Zuul网关；但在2.x版本中，Zuul升级一直跳票。
Spring Cloud最后自己研发了一个网关替代Zuul，那就是Spring Cloud Gateway。

网上很多地方都是说Zuul是阻塞的，Gateway是非阻塞的，这么说是不严谨的。
准确地讲，Zuul 1.x是阻塞的，而在2.x的版本中，Zuul也是基于Netty的，也是非阻塞的。
如果一定要说性能，其实这个没有太大差距。

## Spring Cloud Gateway功能特征

- 基于Spring Framework 5，Project Reactor和Spring Boot 2.0进行构建
- 动态路由：能够匹配任何请求属性
- 支持路径重写
- 集成Spring Cloud服务发现功能（Nacos、Eureca）
- 可集成流控降级功能（Sentinel、Hystrix）
- 可以对路由指定易于编写的Predicate（断言）和Filter（过滤器）

## 核心概念

- 路由（route）：
    - 路由是网关中最基础的部分，路由信息包括一个ID、一个目的URI、一组断言工厂、一组Filter组成。
    - 如果断言为真，则说明请求的URL和配置的路由匹配。
- 断言（Predicates）：
    - Java 8中的断言函数，Spring Cloud Gateway中的断言函数类型是Spring 5.0框架中的ServerWebExchange。
    - 断言函数，允许开发者去定义匹配Http request中的任何信息，比如请求头和参数等。
- 过滤器（Filter）：
    - Spring Cloud Gateway中的filter分为Gateway Filter和Global Filter。Filter可以对请求和响应进行处理。

## 工作原理

Spring Cloud Gateway的工作原理跟Zuul的差不多，最大的区别就是Gateway的Filter只有pre和post两种。

## Reference

Baeldung

- [Exploring the New Spring Cloud Gateway](https://www.baeldung.com/spring-cloud-gateway)
- [Tag: Spring Cloud Gateway](https://www.baeldung.com/tag/spring-cloud-gateway)



