---
title: "H2 Intro"
sequence: "101"
---

H2 database is a lightweight and open-source database with no commercial support.

H2 Database 是一个开源的嵌入式数据库引擎，采用 Java 语言编写，不受平台的限制；
同时，H2 Database 提供了一个十分方便的 web 控制台用于操作和管理数据库内容。

## 应用场景

在 H2 应用方面，可以应用在如下场景：

- H2 可以作为嵌入式数据库，数据库读性能要优于 SQLite，H2 官方提供的一个建议：可以在需要时使用时替换 SQLite。
- 此外由于 H2 支持内存模式，因此在进行单元测试的时候非常适合内存数据库。
- 另外由于 H2 文件体积非常小，安装、启动非常简单，且支持全文检索等高级特性，因此在一些简单场景下使用 H2 也能够快速建立起应用。

什么是“嵌入式”？

- 服务器模式： 必须 启动 服务进程。
- 嵌入模式： import jar 即可

## What Is H2?

**The H2 database engine is a Java-based database that is both SQL and JDBC compliant.**
It has a number of features that set it apart from other relational databases:

- Persistence: it can operate as a purely in-memory database or using a file system.
- Mode: runs as a stand-alone server or embedded inside another application.

Both of these characteristics make H2 a great choice for development and testing purposes.
However, because of its transient nature, it can also present some challenges.

## 运行模式

We can use it in various modes:

- server mode – for remote connections using JDBC or ODBC over TCP/IP
- embedded mode – for local connections that use JDBC
- mixed-mode – this means that we can use H2 for both local and remote connections

H2 can be configured to run as an in-memory database,
but it can also be persistent, e.g., its data will be stored on disk.



```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
  h2:
    console:
      enabled: true
```

## Reference

- [H2 Database Engine](https://www.h2database.com/html/main.html)
- [Baeldung Tag: H2](https://www.baeldung.com/tag/h2)
  - [Spring Boot With H2 Database](https://www.baeldung.com/spring-boot-h2-database)
  - [Quick Guide on Loading Initial Data with Spring Boot](https://www.baeldung.com/spring-boot-data-sql-and-schema-sql)
- [H2 Database](https://docs.payara.fish/community/docs/documentation/payara-server/h2/h2.html)
