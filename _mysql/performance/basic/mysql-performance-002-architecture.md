---
title: "MySQL 体系结构"
sequence: "102"
---

## MySQL 体系结构

- 客户端：JDBC、ODBC
- MySQL
    - 服务层：
        - 连接管理器：对于客户端的连接进行统一管理
        - 查询缓存
        - 查询解析器：这是最重要的，接收的 SQL 语句就是纯文本，查询解析器会对 SQL 语句的结构进行解释，对里面的“组件“进行提取
        - 查询优化器：对 SQL 语句在执行过程中进行优化
    - 存储引擎层：MyISAM、InnoDB

![](/assets/images/db/mysql/mysql-architecture.png)


