---
title: "MySQL 存储引擎"
sequence: "101"
---

## 什么是存储引擎

MySQL 中的数据是用各种不同的技术存储在文件中，每一种技术都使用不同的**存储机制**、**索引技巧**、**锁定水平**，并最终提供不同的功能和能力，
这些不同的技术以及配套的功能在 MySQL 中称为**存储引擎**。

存储引擎只针对**表**，每一种表只能有一种存储引擎；
在同一个数据库中，因为有多个不同的表，因此允许出现不同的引擎。

## MySQL 有哪些存储引擎

常见的存储引擎有：

- InnoDB：绝大多数情况下，使用的存储引擎
- MyISAM：MySQL 早期使用的存储引擎
- XtraDB
- CSV
- Memory：内存表的存储引擎
- Archive
- Federated
- ...

其中，MyISAM 和 InnoDB 是比较常用的两种。

MyISAM 的主要特点是拥有较高的插入，查询速度，但不支持事务，支持表锁（即使操作一条记录也会锁住整个表，不适合高并发的操作）；

InnoDB 引擎提供对数据库事务的支持，并且还提供了行级锁和外键的约束（操作时只锁某一行，不对其它行有影响，适合高并发的操作），
InnoDB 也是 MySQL5.5 版本后默认数据库存储引擎。

## 查询当前数据的存储引擎

查询数据库支持的存储引擎：

```text
SHOW ENGINES;
```

```text
mysql> SHOW ENGINES;
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| Engine             | Support | Comment                                                        | Transactions | XA   | Savepoints |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
| ndbcluster         | NO      | Clustered, fault-tolerant tables                               | NULL         | NULL | NULL       |
| FEDERATED          | NO      | Federated MySQL storage engine                                 | NULL         | NULL | NULL       |
| MEMORY             | YES     | Hash based, stored in memory, useful for temporary tables      | NO           | NO   | NO         |
| InnoDB             | DEFAULT | Supports transactions, row-level locking, and foreign keys     | YES          | YES  | YES        |
| PERFORMANCE_SCHEMA | YES     | Performance Schema                                             | NO           | NO   | NO         |
| MyISAM             | YES     | MyISAM storage engine                                          | NO           | NO   | NO         |
| ndbinfo            | NO      | MySQL Cluster system information storage engine                | NULL         | NULL | NULL       |
| MRG_MYISAM         | YES     | Collection of identical MyISAM tables                          | NO           | NO   | NO         |
| BLACKHOLE          | YES     | /dev/null storage engine (anything you write to it disappears) | NO           | NO   | NO         |
| CSV                | YES     | CSV storage engine                                             | NO           | NO   | NO         |
| ARCHIVE            | YES     | Archive storage engine                                         | NO           | NO   | NO         |
+--------------------+---------+----------------------------------------------------------------+--------------+------+------------+
11 rows in set (0.00 sec)
```

查询默认的存储引擎：

```text
SHOW VARIABLES LIKE '%storage_engine%';
```

```text
mysql> SHOW VARIABLES LIKE '%storage_engine%';
+---------------------------------+-----------+
| Variable_name                   | Value     |
+---------------------------------+-----------+
| default_storage_engine          | InnoDB    |
| default_tmp_storage_engine      | InnoDB    |
| disabled_storage_engines        |           |
| internal_tmp_mem_storage_engine | TempTable |
+---------------------------------+-----------+
4 rows in set (0.01 sec)
```
