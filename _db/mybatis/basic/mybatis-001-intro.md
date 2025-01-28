---
title: "MyBatis Intro"
sequence: "101"
---

## MyBatis 简介

MyBatis 最初是 Apache 的一个开源项目 iBatis。

- 2010 年 6 月这个项目由 Apache Software Foundation 迁移到了 Google Code。
- 随着开发团队转投 Google Code 旗下，iBatis3.x 正式更名为 MyBatis。
- 代码于 2013 年 11 月迁移到 Github

iBatis 一词来源于“internet”和“abatis”的组合，是一个基于 Java 的持久层框架。
iBatis 提供的持久层框架包括 SQL Maps 和 Data Access Objects（DAO）

> abatis: 【军】鹿砦,拒木,障碍物
> "barricade defense made of felled trees with the branches angled outward,"
> 1766, from French abatis, literally "things thrown down,"

## MyBatis 特性

MyBatis is a first class persistence framework with support for custom SQL, stored procedures and advanced mappings.
MyBatis eliminates almost all the JDBC code and manual setting of parameters and retrieval of results.
MyBatis can use simple XML or Annotations for configuration and map primitives,
Map interfaces and Java POJOs (Plain Old Java Objects) to database records.

1. MyBatis 是支持定制化 SQL、存储过程以及高级映射的优秀持久层框架
2. MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集
3. MyBatis 可以使用简单的**XML**或**注解**用于配置和原始映射，将接口和 Java 的 POJO（Plain Old Java Objects，普通的 Java 对象）映射成数据库中的记录
4. MyBatis 是一个**半自动**的 ORM（Object Relation Mapping）框架


关于“半自动”：

- JDBC 就是“全手动”
- MyBatis 是“半自动”，它把使用 JDBC 过程中的大部分功能都进行了封装，而写 SQL 语句还是需要我们自己来完成的，我们也可以处理对象与数据表之间的映射关系。
- Hibernate 就是一个“全自动”的持久层框架，SQL 语句也不用写，只要配置正确了，就可以正常使用。

## 和其它持久化层技术对比

- JDBC
  - SQL 夹杂在 Java 代码中耦合度高，导致硬编码内伤
  - 维护不易且实际开发需求中 SQL 有变化，频繁修改的情况多见
  - 代码冗长，开发效率低
- Hibernate 和 JPA
  - 操作简便，开发效率高
  - 程序中的长难复杂 SQL 需要绕过框架
  - 内部自动生产的 SQL，不容易做特殊优化
  - 基于全映射的全自动框架，大量字段的 POJO 进行部分映射时比较困难。
  - 反射操作太多，导致数据库性能下降
- MyBatis
  - 轻量级，性能出色
  - SQL 和 Java 编码分开，功能边界清晰。Java 代码专注业务、SQL 语句专注数据
  - 开发效率稍逊于 Hibernate，但是完全能够接受

## MyBatis 下载

- [Github: MyBatis 下载地址 ](https://github.com/mybatis/mybatis-3)
  - [mybatis-3/releases](https://github.com/mybatis/mybatis-3/releases)

下载其中的 zip 文件，解压之后，有相应的 mybatis 的 PDF 文档，可以进行参数。

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.10</version>
</dependency>
```

## Reference

- [mybatis](https://mybatis.org/mybatis-3/)
