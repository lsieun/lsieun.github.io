---
title: "MyBatis 工作原理"
sequence: "104"
---

MyBatis 是一个 ORM 框架。

原理：

- MyBatis 框架的初始化操作
- 处理 SQL 请求的流程

MyBatis 的工作原理：

- 第 1 步，MyBatis 根据配置文件中的数据库连接、数据源、事务管理等环境信息创建 `SqlSessionFactory` 对象。
- 第 2 步，通过 `SqlSessionFactory` 对象打开 `SqlSession` 对象，`SqlSession` 对象内部封装了 JDBC 的 `Connection`，并提供了 CRUD 的操作方法。
- 第 3 步，`Executor` 对象负责执行 CRUD 的操作方法，根据 SQL 语句的 id 查找映射文件中的 SQL 语句，并委托 `StatementHandler` 对象对 SQL 语句进行预编译。
- 第 4 步，`StatementHandler` 对象根据映射文件中 SQL 语句的输入映射定义，将**需要的参数**传入到 SQL 语句中（参数赋值），并执行最终的 SQL 语句。

![](/assets/images/db/mybatis/mybatis-process.png)

## Reference

- [打造你自己的 MyBatis 插件](https://h2cone.github.io/post/2020/02/your-own-mybatis-interceptor/)
