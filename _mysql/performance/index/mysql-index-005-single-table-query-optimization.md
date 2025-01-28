---
title: "索引的优化策略"
sequence: "105"
---

- SQL 语句
    - where
        - 使用“索引”列查询，选择性差
        - 使用“复合索引”
        - 使用 LIKE 模糊查询
    - order by
- 索引
    - 查看索引的使用情况
    - 添加新索引
    - 删除冗余索引


## SQL 语句

### where

什么情况下不会用到索引

- 索引**选择性太差**
- `<>`/`not in` 无法使用索引
- `is null` 会使用索引，`is not null` 不会使用索引
- `where` 子句跳过左侧索引列，直接查询右侧索引字段
- 对索引列进行计算或者使用函数

在进行查询时，把 `where` 子句中筛选粒度最大的条件，放在最右侧；因为最右侧的 where 子句是优先被执行的。

#### 单一索引

```text
CREATE INDEX idx_forum ON t_content(forum_id);
# 索引选择性好，使用索引
EXPLAIN SELECT * FROM t_content WHERE forum_id = 407;
# 索引选择性差，全表扫描
EXPLAIN SELECT * FROM t_content WHERE forum_id > 407;
# <>/not in 无法使用索引
EXPLAIN SELECT * FROM t_content WHERE forum_id <> 407;
```

```text
mysql> CREATE INDEX idx_forum ON t_content(forum_id);
Query OK, 0 rows affected (0.25 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW INDEX FROM t_content;
+-----------+------------+-----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table     | Non_unique | Key_name  | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-----------+------------+-----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| t_content |          0 | PRIMARY   |            1 | content_id  | A         |       14840 |     NULL |   NULL |      | BTREE      |
| t_content |          1 | idx_forum |            1 | forum_id    | A         |         104 |     NULL |   NULL | YES  | BTREE      |
+-----------+------------+-----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
2 rows in set (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE forum_id = 407;
+----+-------------+-----------+------------+------+---------------+-----------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key       | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+-----------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | t_content | NULL       | ref  | idx_forum     | idx_forum | 9       | const |  925 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+-----------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE forum_id > 407;
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | idx_forum     | NULL | NULL    | NULL | 14840 |    50.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE forum_id <> 407;
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | idx_forum     | NULL | NULL    | NULL | 14840 |    59.58 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

#### 复合索引

```text
# where 子句跳过左侧索引列，直接查询右侧索引字段
DROP INDEX idx_uid_sid ON t_content;
CREATE INDEX idx_uid_sid ON t_content(uid, source_id);

# 复合索引查询条件，必须包含左侧列
EXPLAIN SELECT * FROM t_content WHERE uid = 14206986;
EXPLAIN SELECT * FROM t_content WHERE uid=14206986 and source_id = 13054;

# 直接书写右侧列，将导致数据无法利用复合索引查询
EXPLAIN SELECT * FROM t_content WHERE source_id = 13054;
```

```text
mysql> CREATE INDEX idx_uid_sid ON t_content(uid, source_id);
Query OK, 0 rows affected (0.26 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW INDEX FROM t_content;
+-----------+------------+-------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table     | Non_unique | Key_name    | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-----------+------------+-------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| t_content |          0 | PRIMARY     |            1 | content_id  | A         |       14840 |     NULL |   NULL |      | BTREE      |
| t_content |          1 | idx_uid_sid |            1 | uid         | A         |        1879 |     NULL |   NULL | YES  | BTREE      |
| t_content |          1 | idx_uid_sid |            2 | source_id   | A         |       14193 |     NULL |   NULL | YES  | BTREE      |
+-----------+------------+-------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+

mysql> EXPLAIN SELECT * FROM t_content WHERE uid = 14206986;
+----+-------------+-----------+------------+------+---------------+-------------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key         | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+-------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | t_content | NULL       | ref  | idx_uid_sid   | idx_uid_sid | 9       | const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+-------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid=14206986 and source_id = 13054;
+----+-------------+-----------+------------+------+---------------+-------------+---------+-------------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key         | key_len | ref         | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+-------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | t_content | NULL       | ref  | idx_uid_sid   | idx_uid_sid | 18      | const,const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+-------------+---------+-------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE source_id = 13054;
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |    10.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

#### 使用函数或计算

```text
#对索引列进行计算或者使用函数,将会使索引失效
EXPLAIN SELECT * FROM t_content WHERE uid + 1 = 14206987;
EXPLAIN SELECT * FROM t_content WHERE uid = 14206987 - 1;
EXPLAIN SELECT * FROM t_content WHERE CAST(uid as CHAR) = '14206986';
```

```text
mysql> CREATE INDEX idx_uid ON t_content(uid);
Query OK, 0 rows affected (0.22 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW INDEX FROM t_content;
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table     | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| t_content |          0 | PRIMARY  |            1 | content_id  | A         |       14840 |     NULL |   NULL |      | BTREE      |
| t_content |          1 | idx_uid  |            1 | uid         | A         |        1879 |     NULL |   NULL | YES  | BTREE      |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
2 rows in set (0.01 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid + 1 = 14206987;
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid  = 14206987 - 1;
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-----------------------+
| id | select_type | table     | partitions | type | possible_keys | key     | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | t_content | NULL       | ref  | idx_uid       | idx_uid | 9       | const |    1 |   100.00 | Using index condition |
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE CAST(uid as CHAR) = '14206986';
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

### Order By

使用索引优化排序

- 当 Order By 字段与索引字段**顺序**/**排序**方向相同时
- 索引可优化排序速度

```text
#当排序出现了索引左侧列,则允许使用索引排序
#左侧字段单字段排序时,索引支持升降序
EXPLAIN SELECT * FROM t_content WHERE uid < 14206986 ORDER BY uid asc;
EXPLAIN SELECT * FROM t_content WHERE uid < 14206986 ORDER BY uid desc;
EXPLAIN SELECT * FROM t_content WHERE uid < 14206986 ORDER BY source_id;

#在多字段情况下,左侧字段必须是升序,且顺序不允许打乱
EXPLAIN SELECT * FROM t_content WHERE uid < 14206986 ORDER BY uid,source_id;
```

```text
mysql> SHOW INDEX FROM t_content;
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table     | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| t_content |          0 | PRIMARY  |            1 | content_id  | A         |       14840 |     NULL |   NULL |      | BTREE      |
| t_content |          1 | idx_uid  |            1 | uid         | A         |        1879 |     NULL |   NULL | YES  | BTREE      |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
2 rows in set (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid < 14206986 ORDER BY uid asc;
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | t_content | NULL       | range | idx_uid       | idx_uid | 9       | NULL | 1149 |   100.00 | Using index condition |
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid < 14206986 ORDER BY uid desc;
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+--------------------------------------------+
| id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                                      |
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+--------------------------------------------+
|  1 | SIMPLE      | t_content | NULL       | range | idx_uid       | idx_uid | 9       | NULL | 1149 |   100.00 | Using index condition; Backward index scan |
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+--------------------------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid < 14206986 ORDER BY source_id;
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+---------------------------------------+
| id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                                 |
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+---------------------------------------+
|  1 | SIMPLE      | t_content | NULL       | range | idx_uid       | idx_uid | 9       | NULL | 1149 |   100.00 | Using index condition; Using filesort |
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+---------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

## 索引

### 删除冗余索引

- `pt-duplicate-key-checker` 是 `percona-toolkit` 工具包中的实用组件
- 它可以帮助你检测表中重复的索引或者主键

### 查看索引使用状况

```mysql
SELECT object_type,
       object_schema,
       object_name,
       index_name,
       count_read,
       count_fetch,
       count_insert,
       count_update,
       count_delete
FROM performance_schema.table_io_waits_summary_by_index_usage
ORDER BY sum_timer_wait desc;
```

```text
mysql> SELECT object_type,
    ->        object_schema,
    ->        object_name,
    ->        index_name,
    ->        count_read,
    ->        count_fetch,
    ->        count_insert,
    ->        count_update,
    ->        count_delete
    -> FROM performance_schema.table_io_waits_summary_by_index_usage
    -> ORDER BY sum_timer_wait desc;
+-------------+--------------------+--------------+-----------------+------------+-------------+--------------+--------------+--------------+
| object_type | object_schema      | object_name  | index_name      | count_read | count_fetch | count_insert | count_update | count_delete |
+-------------+--------------------+--------------+-----------------+------------+-------------+--------------+--------------+--------------+
| TABLE       | testdb             | test_hash    | idx_first_name  |          2 |           2 |            0 |            0 |            0 |
```

### 减少表与索引碎片

- analyze table 表名;
- optimize table 表名;

```text
#索引重新统计
analyze table t_content;

#optimize 优化表空间，释放表空间
#锁表，一定要在维护期间，否则会造成IO阻塞
optimize table t_content;
```

```text
mysql> analyze table t_content;
+------------------+---------+----------+----------+
| Table            | Op      | Msg_type | Msg_text |
+------------------+---------+----------+----------+
| testdb.t_content | analyze | status   | OK       |
+------------------+---------+----------+----------+
1 row in set (0.02 sec)

mysql> optimize table t_content;
+------------------+----------+----------+-------------------------------------------------------------------+
| Table            | Op       | Msg_type | Msg_text                                                          |
+------------------+----------+----------+-------------------------------------------------------------------+
| testdb.t_content | optimize | note     | Table does not support optimize, doing recreate + analyze instead |
| testdb.t_content | optimize | status   | OK                                                                |
+------------------+----------+----------+-------------------------------------------------------------------+
2 rows in set (1.90 sec)
```
