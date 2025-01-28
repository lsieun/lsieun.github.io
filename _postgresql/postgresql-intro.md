---
title: "PostgreSQL"
sequence: "101"
---

连接到PostgreSQL服务器：

```text
psql -h localhost -U postgres
```

```text
-- 查看pgsql版本
SELECT version();

-- 查看用户名和密码
SELECT * FROM pg_authid;

-- 获取服务器上所有数据库信息
SELECT * FROM pg_database ORDER BY datname;

-- 得到当前db中所有表的信息（pg_tables是系统视图）
SELECT * FROM pg_tables ORDER BY schemaname;
```

```text
CREATE DATABASE testdb;
```

```text
DROP DATABASE testdb;
```

## Table

```text
CREATE TABLE COMPANY(
   ID INT PRIMARY KEY     NOT NULL,
   NAME           TEXT    NOT NULL,
   AGE            INT     NOT NULL,
   ADDRESS        CHAR(50),
   SALARY         REAL
);
```

How to show all available tables in PostgreSQL?

To show the list of tables with the corresponding schema name, run this statement:

```text
SELECT * FROM information_schema.tables;
```

or in a particular schema:

```text
SELECT * FROM information_schema.tables WHERE table_schema = 'schema_name';
```


