---
title: "Spring Boot"
sequence: "101"
---

## Overview

SpringBoot是由Pivotal团队提供的全新框架，其设计目的是**用来简化Spring应用的初始搭建以及开发过程**。

- Spring程序缺点
  - 依赖设置繁琐
  - 配置繁琐
- SpringBoot程序优点
  - 起步依赖（简化依赖配置）
  - 自动配置（简化常用工程相关配置）
  - 辅助功能（内置服务器，。。。）


## 内容

- Spring是什么？
  - 配置Web模块
  - @SpringBootApplication
  - @RequestMapping, @Request
  - 配置热重启: Spring Boot DevTools
- 配置如何写（yaml）
  - 修改服务端口
  - 修改banner
- 自动装配原理
  - pom.xml，parent配置，
  - 依赖的版本管理
    - Maven的depdencyManagerment管理
    - 是否使用了ASM
  - 启动器 （Spring会将所有的场景变成启动器）
    - spring-boot-starter
    - spring-boot-starter-web
    - spring-boot-starter-test
  - 代码
    - @SpringBootApplication 标注这个类是一个spring boot的应用
      - @SpringBootConfigration
        - @Configuration
        - @Component
      - @EnableAutoConfiguration
        - @AutoConfigrationPackage
        - @Import
    - SpringApplication.run()
    - spring-boot-autoconfigure
      - spring.factories 
- 集成Web开发
- 集成数据库：Druid
- 分布式开发：Dubbo+zookeeper
- swagger：接口文档
- 任务调度
- Spring Security/Shiro


源码解读

- Spring Boot如何启动的

引入一个新的变化：

- pom.xml
- config: application.properties, application.yaml
- source code (@Annotation)


