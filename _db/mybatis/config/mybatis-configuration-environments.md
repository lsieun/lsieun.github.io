---
title: "environments"
sequence: "107"
---

## environments

## environment

### transactionManager

`transactionManager` 用来设置事务的管理方式：

- `type`:
  - `JDBC`：表示当前环境中，执行 SQL 时，使用的是 JDBC 中原生的事务管理方式（事务的提交或回溯，需要手动处理）
  - `MANAGED`：被管理，例如 Spring

### dataSource

`dataSource`：配置数据源

- `type`：设置数据源的类型
  - `POOLED`：使用数据库连接池来缓存数据库连接
  - `UNPOOLED`：不使用数据库连接池
  - `JNDI`：表示使用上下文中的数据源

