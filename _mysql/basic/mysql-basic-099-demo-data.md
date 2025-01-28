---
title: "MySQL 官方示例数据库"
sequence: "199"
---

## world-db

只是用于用于简单测试学习，建议使用 `world-db`

`world-db` 数据库，包含三张表：`city`、`country`、`countrylanguage`。

```text
https://downloads.mysql.com/docs/world-db.zip
```

使用：

- 第 1 步，登录 MySQL 之后，创建数据库

```text
> CREATE DATABASE `world` DEFAULT CHARACTER SET utf8mb4;
```

- 第 2 步，退出 MySQL，然后导入数据

```text
$ mysql -u root -p world < world.sql
```

## sakila-db

```text
https://downloads.mysql.com/docs/sakila-db.zip
```

sakila-db数据库一个非常完整的示例。包含：视图、函数、触发器以及存储过程，当然也存在使用外键。

sakila-db 数据库包含三个文件，便于大家获取与使用：

- `sakila-schema.sql`：数据库表结构；
- `sakila-data.sql`：数据库示例模拟数据；
- `sakila.mwb`：数据库物理模型，在 MySQL workbench 中可以打开查看。


