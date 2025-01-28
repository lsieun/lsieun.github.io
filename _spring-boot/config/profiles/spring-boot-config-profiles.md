---
title: "Profiles - 多种环境切换：开发环境|生产环境"
sequence: "301"
---

A **profile** is a set of configuration settings.
Spring Boot allows to define profile specific property files in the form of `application-{profile}.properties`.
It automatically loads the properties in an `application.properties` file for all profiles,
and the ones in profile-specific property files only for the specified profile.
The keys in the profile-specific property override the ones in the master property file.

>具体的 application-{profile}.properties 会覆盖 application.properties 的内容

Note: Spring Boot properties are loaded in a particular order.
If several profiles are specified, the last-wins strategy applies.

> properties 文件加载的顺序很重要

The `@Profile` annotation indicates that a component is eligible for registration
when the specified profile or profiles are active.
The default profile is called **default**;
all the beans that do not have a profile set belong to this profile.

> 可以配合注解一起使用

There are plenty of ways of defining active profiles in Spring Boot,
including **command line arguments**, **Maven settings**, **JVM system parameters**,
**environment variables**, `spring.profiles.active property`, and **SpringApplication methods**.

> 可以应用在不同的层面

In **integration tests**, profiles are activated with `@ActiveProfiles`.

> integration tests

p11

四个位置的文件有不同的顺序：

## 使用 profile

```text
spring.profiles.active=dev
```

不同的文件后缀：

- application.properties
- application-test.properties
- application-dev.properties

## 多文档模块

## 命令

```text
java -jar springboot-test2-0.0.1-SNAPSHOT.jar --spring.profiles.active=test
```

## Reference

- [Spring Boot Profiles](https://zetcode.com/springboot/profile/)
- [Spring Boot Profiles - Application Configuration made easy](https://www.springboottutorial.com/spring-boot-profiles)
