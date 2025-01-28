---
title: "Spring Boot 源码"
sequence: "101"
---

Spring Boot 本身并不提供 Spring 的核心功能，而是作为 Spring 的脚手架框架，
以达到快速构建项目、预置三方配置、开箱即用的目的。

Spring Boot 不是为已解决的问题提供新的解决方案，而是为平台和开发者带来一种全新的体验：
整合成熟技术框架、屏蔽系统复杂性、简化已有技术的使用，从而降低软件的使用门槛，提供软件开发和运维的效率。

疑问：

- starter 是什么？我们如何去使用这些 starter？
- 为什么包扫描，只会扫描核心启动类所在的包及其子包？
- 在 Spring Boot 启动的过程中，是如何完成自动装配的？
- 内嵌 Tomcat 是如何被创建及启动的？
- 使用了 Web 场景对应的 Starter，Spring MVC 是如何自动装配的？

## Reference

视频：

- [2021最新版 SpringBoot 源码剖析全集](https://www.bilibili.com/video/BV1Jo4y1m7hY/)

文章：

- [spring-framework 源码解析](https://github.com/shiyujun/spring-framework)
- [Spring源码分析：全集整理](https://blog.csdn.net/qq_36882793/article/details/106440723)
