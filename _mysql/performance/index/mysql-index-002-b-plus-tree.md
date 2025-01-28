---
title: "B+Tree 索引"
sequence: "102"
---

- 在 MySQL 中，InnoDB 与 MyISAM 采用的是 B+Tree 索引
- B+Tree 索引采用树形链表结构建立数据”目录”

```text
SELECT * FROM t_content WHERE content_id = 17076710;
```

使用 `EXPLAIN` 来查看查询语句是否使用了索引：

```text
# explain 是解释计划，说明 SQL 的执行情况
EXPLAIN SELECT * FROM t_content WHERE content_id = 17076710;
```

```text
mysql> EXPLAIN SELECT * FROM t_content WHERE content_id = 17076710;
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | t_content | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
                                             A. type 为 const
                                                                      B. key 为 PRIMARY
```

```text
SELECT * FROM t_content WHERE uid = 16940130;
EXPLAIN SELECT * FROM t_content WHERE uid = 16940130;
```

```text
mysql> EXPLAIN SELECT * FROM t_content WHERE uid = 16940130;
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |    10.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
                                             A. type 变成了 ALL，代表“全表扫描”
                                                                     B. key 变成了 NULL
```

在 `t_content` 为 `uid` 列添加索引，名为 `idx_uid`：

```text
CREATE INDEX idx_uid ON t_content(uid);
DROP INDEX idx_uid ON t_content;
```

```text
mysql> CREATE INDEX idx_uid ON t_content(uid);
Query OK, 0 rows affected (0.24 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

```text
mysql> EXPLAIN SELECT * FROM t_content WHERE uid = 16940130;
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | t_content | NULL       | ref  | idx_uid       | idx_uid | 9       | const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
                                              A. type 为 ref
                                                                    B. key 为 idx_uid
                                                                                                C. rows 为 1 表示影响的行数，
                                                                                                   值越小越好
```

```text
mysql> DROP INDEX idx_uid ON t_content;
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> EXPLAIN SELECT * FROM t_content WHERE uid = 16940130;
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |    10.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

```text
SHOW INDEX FROM table_name;
SHOW INDEX FROM t_content;
```

```text
mysql> SHOW INDEX FROM t_content;
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table     | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| t_content |          0 | PRIMARY  |            1 | content_id  | A         |       14840 |     NULL |   NULL |      | BTREE      |
| t_content |          1 | idx_uid  |            1 | uid         | A         |        1879 |     NULL |   NULL | YES  | BTREE      |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
                                                                                                                        A. Index_type 为 BTREE
```

可以查看结果集中 `Key_type` 列的值。常见的索引类型包括：

- `BTREE`：使用B树算法的索引。这是MySQL中最常用的索引类型。
- `HASH`：使用哈希算法的索引。这种类型的索引在精确查找时非常高效，但在范围查找和排序方面可能不如B树索引高效。
- `RTREE`：使用 `RTree` 算法的索引。这种类型的索引通常用于空间数据类型的查询。

通过查看Key_type列，你可以确定索引的类型并了解其在查询性能方面的优势和适用场景。

## 范围匹配和精准匹配

```text
DROP INDEX idx_uid ON t_content;
CREATE INDEX idx_uid ON t_content(uid);
# 精准匹配，允许使用 BTree 索引
EXPLAIN SELECT * FROM t_content WHERE uid = 16940130;
# 范围匹配，允许使用 BTree 索引
EXPLAIN SELECT * FROM t_content WHERE uid > 1260000 and uid < 12610000;
# 查询优化器会自动进行类型转换，但仍然建议使用与定义相符的类型
EXPLAIN SELECT * FROM t_content WHERE uid = '16940130';
# 不会使用索引，要进行全表扫描
EXPLAIN SELECT * FROM t_content WHERE uid LIKE '1694%';
```

```text
mysql> EXPLAIN SELECT * FROM t_content WHERE uid = 16940130;
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | t_content | NULL       | ref  | idx_uid       | idx_uid | 9       | const |    1 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid > 1260000 and uid < 12610000;
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | t_content | NULL       | range | idx_uid       | idx_uid | 9       | NULL |  825 |   100.00 | Using index condition |
+----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid = '16940130';
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-----------------------+
| id | select_type | table     | partitions | type | possible_keys | key     | key_len | ref   | rows | filtered | Extra                 |
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-----------------------+
|  1 | SIMPLE      | t_content | NULL       | ref  | idx_uid       | idx_uid | 9       | const |    1 |   100.00 | Using index condition |
+----+-------------+-----------+------------+------+---------------+---------+---------+-------+------+----------+-----------------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE uid LIKE '1694%';
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | idx_uid       | NULL | NULL    | NULL | 14840 |    11.11 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

## LIKE 模糊查询

```text
DROP INDEX idx_share_url ON t_content;
CREATE INDEX idx_share_url ON t_content(share_url);
# 字符串字段 BTree 索引允许进行"前缀查询"
EXPLAIN SELECT * FROM t_content WHERE share_url LIKE 'http://a.f.budejie.com/share/17076710%';
# 这个不能利用索引，数据量太多
EXPLAIN SELECT * FROM t_content WHERE share_url LIKE 'http://a.f.budejie.com/share/%';
# 后缀查询与模糊匹配 BTree均不支持
EXPLAIN SELECT * FROM t_content WHERE share_url LIKE '%http://a.f.budejie.com/share/17076710';
EXPLAIN SELECT * FROM t_content WHERE share_url LIKE '%http://a.f.budejie.com/share/17076710%';
```

```text
mysql> SHOW INDEX FROM t_content;
+-----------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table     | Non_unique | Key_name      | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-----------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| t_content |          0 | PRIMARY       |            1 | content_id  | A         |       14840 |     NULL |   NULL |      | BTREE      |
| t_content |          1 | idx_uid       |            1 | uid         | A         |        1879 |     NULL |   NULL | YES  | BTREE      |
| t_content |          1 | idx_share_url |            1 | share_url   | A         |       14818 |     NULL |   NULL | YES  | BTREE      |
+-----------+------------+---------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
3 rows in set (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE share_url LIKE 'http://a.f.budejie.com/share/17076710%';
+----+-------------+-----------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+
| id | select_type | table     | partitions | type  | possible_keys | key           | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+-----------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | t_content | NULL       | range | idx_share_url | idx_share_url | 3075    | NULL |    1 |   100.00 | Using index condition |
+----+-------------+-----------+------------+-------+---------------+---------------+---------+------+------+----------+-----------------------+
1 row in set, 1 warning (0.01 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE share_url LIKE 'http://a.f.budejie.com/share/%';
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | idx_share_url | NULL | NULL    | NULL | 14840 |    50.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.01 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE share_url LIKE '%http://a.f.budejie.com/share/17076710';
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |    11.11 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE share_url LIKE '%http://a.f.budejie.com/share/17076710%';
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |    11.11 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

## 复合索引

```text
DROP INDEX idx_uid_sid ON t_content;
CREATE INDEX idx_uid_sid ON t_content(uid, source_id);
# 复合索引查询条件必须包含左侧列
EXPLAIN SELECT * FROM t_content WHERE uid = 14206986;
# 直接书写右侧列将导致数据无法查询
EXPLAIN SELECT * FROM t_content WHERE uid=14206986 and source_id = 13054;
EXPLAIN SELECT * FROM t_content WHERE source_id = 13054 and uid=14206986;
EXPLAIN SELECT * FROM t_content WHERE source_id = 13054;
# <>与not in会导致不使用索引
EXPLAIN SELECT * FROM t_content WHERE source_id <> 13054;
EXPLAIN SELECT * FROM t_content WHERE source_id <=13053 or source_id >=13055;
```

```text
mysql> SHOW INDEX FROM t_content;
+-----------+------------+-------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table     | Non_unique | Key_name    | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-----------+------------+-------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| t_content |          0 | PRIMARY     |            1 | content_id  | A         |       14840 |     NULL |   NULL |      | BTREE      |
| t_content |          1 | idx_uid_sid |            1 | uid         | A         |        1879 |     NULL |   NULL | YES  | BTREE      |
| t_content |          1 | idx_uid_sid |            2 | source_id   | A         |       14193 |     NULL |   NULL | YES  | BTREE      |
+-----------+------------+-------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
3 rows in set (0.00 sec)

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

mysql> EXPLAIN SELECT * FROM t_content WHERE source_id = 13054 and uid=14206986;
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

mysql> EXPLAIN SELECT * FROM t_content WHERE source_id <> 13054;
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |    90.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM t_content WHERE source_id <=13053 or source_id >=13055;
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows  | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
|  1 | SIMPLE      | t_content | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 14840 |    55.55 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```
