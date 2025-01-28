---
title: "InnoDB 存储引擎"
sequence: "110"
---

## 简单介绍

- 版本支持：在 MySQL 5.5.8 之后，`InnoDB` 是默认存储引擎
- 存储方式：`InnoDB` 采用”表空间”保存文件
- 事务支持：`InnoDB` 支持事务处理

## InnoDB 表空间

### 两种表空间

InnoDB 表空间有两种形式：

- 第 1 种方式，使用系统表空间 `ibdataN`
    - 在 Windows 上，文件位置：`C:\ProgramData\MySQL\MySQL Server 8.0\Data\ibdata1`
- 第 2 种方式，使用独立表空间：`tablename.ibd` (推荐)
    - 在 Windows 上，文件位置：`C:\ProgramData\MySQL\MySQL Server 8.0\Data\testdb\innodb_test1.ibd`

为什么推荐独立表空间？

- 系统表空间
    - 管理：系统表空间all in one 不利于管理
    - 性能：系统表空间，所有数据存在于一个文件中，会产生 IO 瓶颈
    - 空间回收：系统表空间很难回收存储空间
- 独立表空间
    - 空间回收：使用 optimize table 命令回收存储空间

### 查看和设置表空间

通过 `innodb_file_per_table` 参数来查看和设置表空间模式。

首先，查看表空间模式：

```mysql
SHOW VARIABLES LIKE 'innodb_file_per_table';
```

```text
mysql> SHOW VARIABLES LIKE 'innodb_file_per_table';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| innodb_file_per_table | ON    |   // ON 表示使用“独立表空间”保存数据
+-----------------------+-------+
1 row in set, 1 warning (0.01 sec)
```

其次，设置表空间模式：

```text
SET GLOBAL innodb_file_per_table=off;
SET GLOBAL innodb_file_per_table=on;
```

### 实践

第 1 步，创建数据库：

```text
CREATE DATABASE `testdb`
    DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

第 2 步，创建数据表：

```mysql
# 使用 ENGINE 指定使用哪一个存储引擎
CREATE TABLE `innodb_test1`
(
    id   int,
    name VARCHAR(16)
) ENGINE INNODB;

# 在 5.5.8 之后，默认使用 InnoDB 存储引擎
CREATE TABLE `innodb_test2`
(
    id   int,
    name VARCHAR(16)
);
```

第 3 步，添加数据：

```mysql
INSERT INTO `innodb_test1`(id, name) VALUE (1, '张三');
INSERT INTO `innodb_test1`(id, name) VALUE (2, '李四');
```

第 4 步，查看 MySQL 数据库的数据存储位置：

- Linux: `/var/lib/mysql/`
- Windows: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\` (Win7)

其中，

- `*.frm`：表结构的文件，例如字段名称、字段类型。
- `*.ibd`：表数据和索引的文件。该表的索引(B+树)的每个非叶子节点存储索引，叶子节点存储索引和索引对应的数据。

![](/assets/images/db/mysql/storage/windows-storage-data-directory-innodb.png)

## InnoDB 的事务

InnoDB 的事务特性：

- InnoDB 支持事务
- InnoDB 默认使用**行级锁**
- InnoDB 具备良好的高并发特性

## InnoDB 的使用场景

- InnoDB 存储引擎适用于绝大多数场景
- MySQL 5.7 以后 InnoDB 也支持全文索引与空间函数
- 5.5 版本以前默认是 MyISAM
