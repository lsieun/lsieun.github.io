---
title: "分区表（Partition）"
sequence: "102"
---

## 什么是分区表

分区表，就是把大表按条件单独存储到不同的”物理小表”中,在构建出的完整”逻辑表”。


## 分区表的优点

- 更少的数据检索范围
- 拆分超级大的表，将部分数据加载至内存
- 分区表的数据更容易维护
- 分区表数据文件可以分布在不同的硬盘上，并发IO
- 减少锁的范围，避免大表锁表
- 可独立备份，恢复分区数据

## 实践

### 不使用分区表

第 1 步，创建数据库：

```mysql
CREATE DATABASE `testdb`
    DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

第 2 步，创建数据表：

```mysql
USE testdb;
DROP TABLE IF EXISTS test_partition;
CREATE TABLE test_partition
(
    id          int(11)  NOT NULL,
    create_time DATETIME NOT NULL,
    cyear       int,
    PRIMARY KEY (id, create_time, cyear)
) ENGINE = InnoDB;
```

第 3 步，添加数据：

```mysql
INSERT INTO test_partition VALUES(1, '20130722000000', 2013);
INSERT INTO test_partition VALUES(2, '20140722000000', 2014);
INSERT INTO test_partition VALUES(3, '20150722000000', 2015);
INSERT INTO test_partition VALUES(4, '20160722000000', 2016);
INSERT INTO test_partition VALUES(5, '20170722000000', 2017);
INSERT INTO test_partition VALUES(6, '20180722000000', 2018);
INSERT INTO test_partition VALUES(7, '20190722000000', 2019);
INSERT INTO test_partition VALUES(8, '20200722000000', 2020);
INSERT INTO test_partition VALUES(9, '20210722000000', 2021);
INSERT INTO test_partition VALUES(10, '20220722000000', 2022);
```

第 4 步，查看执行计划：

```mysql
EXPLAIN SELECT * FROM test_partition WHERE cyear > 2016;
```

```text
mysql> EXPLAIN SELECT * FROM test_partition WHERE cyear > 2016;
+----+-------------+----------------+------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
| id | select_type | table          | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+----------------+------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | test_partition | NULL       | index | PRIMARY       | PRIMARY | 13      | NULL |   10 |    33.33 | Using where; Using index |
+----+-------------+----------------+------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

```mysql
CREATE INDEX idx_cyear ON test_partition(cyear);
EXPLAIN SELECT * FROM test_partition WHERE cyear > 2016;
```

```text
mysql> CREATE INDEX idx_cyear ON test_partition(cyear);
Query OK, 0 rows affected (0.05 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> EXPLAIN SELECT * FROM test_partition WHERE cyear > 2016;
+----+-------------+----------------+------------+-------+-------------------+-----------+---------+------+------+----------+--------------------------+
| id | select_type | table          | partitions | type  | possible_keys     | key       | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+----------------+------------+-------+-------------------+-----------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | test_partition | NULL       | range | PRIMARY,idx_cyear | idx_cyear | 4       | NULL |    6 |   100.00 | Using where; Using index |
+----+-------------+----------------+------------+-------+-------------------+-----------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

### 使用分区表

第 2 步，创建数据表：

```mysql
DROP TABLE IF EXISTS test_partition;
CREATE TABLE test_partition
(
    id          int(11)  NOT NULL,
    create_time DATETIME NOT NULL,
    cyear       int,
    PRIMARY KEY (id, create_time, cyear)
) ENGINE = InnoDB DEFAULT CHARSET=UTF8
PARTITION BY RANGE (cyear)
(
    PARTITION y14before VALUES LESS THAN (2014),
    PARTITION y14_15 VALUES LESS THAN (2015),
    PARTITION y15_16 VALUES LESS THAN (2016),
    PARTITION y16_17 VALUES LESS THAN (2017),
    PARTITION y17_18 VALUES LESS THAN (2018),
    PARTITION y18_19 VALUES LESS THAN (2019),
    PARTITION y19_20 VALUES LESS THAN (2020),
    PARTITION y20after VALUES LESS THAN maxvalue ENGINE = InnoDB
);
```

![](/assets/images/db/mysql/maintenance/test-partition-ibd-files.png)

第 3 步，添加数据：

```mysql
INSERT INTO test_partition VALUES(1, '20130722000000', 2013);
INSERT INTO test_partition VALUES(2, '20140722000000', 2014);
INSERT INTO test_partition VALUES(3, '20150722000000', 2015);
INSERT INTO test_partition VALUES(4, '20160722000000', 2016);
INSERT INTO test_partition VALUES(5, '20170722000000', 2017);
INSERT INTO test_partition VALUES(6, '20180722000000', 2018);
INSERT INTO test_partition VALUES(7, '20190722000000', 2019);
INSERT INTO test_partition VALUES(8, '20200722000000', 2020);
INSERT INTO test_partition VALUES(9, '20210722000000', 2021);
INSERT INTO test_partition VALUES(10, '20220722000000', 2022);
```

第 4 步，查看执行计划：

```mysql
EXPLAIN SELECT * FROM test_partition WHERE cyear > 2016;
```

输出结果：

```text
mysql> EXPLAIN SELECT * FROM test_partition WHERE cyear > 2016;
+----+-------------+----------------+-------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
| id | select_type | table          | partitions                    | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+----------------+-------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | test_partition | y17_18,y18_19,y19_20,y20after | index | PRIMARY       | PRIMARY | 13      | NULL |    6 |    33.33 | Using where; Using index |
+----+-------------+----------------+-------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

在上面的输出结果中，注意 `partitions` 列有值：`y17_18,y18_19,y19_20,y20after`，
这意味着在物理层面（文件）上减少了扫描数据的范围。

第 5 步，查看各个分区表的数据量：

```mysql
SELECT PARTITION_NAME, TABLE_ROWS
FROM information_schema.partitions
where table_schema = 'testdb' and table_name = 'test_partition';
```

输出结果：

```text
mysql> SELECT PARTITION_NAME, TABLE_ROWS
    -> FROM information_schema.partitions
    -> where table_schema = 'testdb' and table_name = 'test_partition';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| y14_15         |          1 |
| y14before      |          1 |
| y15_16         |          1 |
| y16_17         |          1 |
| y17_18         |          1 |
| y18_19         |          1 |
| y19_20         |          1 |
| y20after       |          3 |
+----------------+------------+
8 rows in set (0.00 sec)
```

## 分区表的使用限制

- 查询必须包含分区列，不允许对分区列进行计算
- 分区列必须是数字类型
- 分区表不支持建立外键索引
- 建表时主键必须包含所有的列
- 最多 1024 个分区

不允许对分区列进行计算：

```mysql
# 不能对分区进行选择，因为对分区列进行了计算
EXPLAIN SELECT * FROM test_partition WHERE cyear + 1 > 2016;
    
# 换一下书写方式，就可以对分区进行选择了
EXPLAIN SELECT * FROM test_partition WHERE cyear > 2016 - 1;
```

```text
mysql> EXPLAIN SELECT * FROM test_partition WHERE cyear + 1 > 2016;
+----+-------------+----------------+--------------------------------------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
| id | select_type | table          | partitions                                                   | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+----------------+--------------------------------------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | test_partition | y14before,y14_15,y15_16,y16_17,y17_18,y18_19,y19_20,y20after | index | NULL          | PRIMARY | 13      | NULL |   10 |   100.00 | Using where; Using index |
+----+-------------+----------------+--------------------------------------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM test_partition WHERE cyear > 2016 - 1;
+----+-------------+----------------+--------------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
| id | select_type | table          | partitions                           | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+----------------+--------------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | test_partition | y16_17,y17_18,y18_19,y19_20,y20after | index | PRIMARY       | PRIMARY | 13      | NULL |    7 |    33.33 | Using where; Using index |
+----+-------------+----------------+--------------------------------------+-------+---------------+---------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

