---
title: "Hash 索引"
sequence: "103"
---

## Hash 索引

- Hash索引（hash index）基于哈希表实现
- 精确匹配索引所有列的查询才有效
- Hash索引为为每条数据生成一个HashCode

## Hash索引的特点

- Hash 索引只包含哈希值和行指针
- 应用场景：只支持**精准匹配**,不支持范围查询,模糊查询及排序
- 性能：Hash 取值速度非常快，但索引选择性很低时不建议使用.
- 存储引擎：MySQL 目前只有 Memory 显示支持 Hash 索引

## InnoDB中的Hash索引

- InnoDB 存储引擎只支持显示创建 BTree 索引
- 数据精准匹配时 MySQL 会自动生成 HashCode，存入缓存

## 实践

```mysql
CREATE TABLE test_hash
(
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL
) ENGINE = MEMORY;
```

```mysql
INSERT INTO `test_hash`(first_name, last_name) VALUE ('Arjen', 'Lentz');
INSERT INTO `test_hash`(first_name, last_name) VALUE ('Baron', 'Schwartz');
INSERT INTO `test_hash`(first_name, last_name) VALUE ('Peter', 'Zaitsev');
INSERT INTO `test_hash`(first_name, last_name) VALUE ('Vadim', 'Tkachenko');
```

```text
mysql> SELECT * FROM `test_hash`;
+------------+-----------+
| first_name | last_name |
+------------+-----------+
| Arjen      | Lentz     |
| Baron      | Schwartz  |
| Peter      | Zaitsev   |
| Vadim      | Tkachenko |
+------------+-----------+
4 rows in set (0.00 sec)
```

```text
CREATE INDEX `idx_first_name` ON test_hash(first_name);
```

```text
mysql> CREATE INDEX `idx_first_name` ON test_hash(first_name);
Query OK, 4 rows affected (0.03 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> SHOW INDEX FROM test_hash;
+-----------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table     | Non_unique | Key_name       | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-----------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| test_hash |          1 | idx_first_name |            1 | first_name  | NULL      |           2 |     NULL |   NULL |      | HASH       |
+-----------+------------+----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
1 row in set (0.00 sec)
```

```text
mysql> SELECT last_name FROM test_hash WHERE first_name = 'Peter';
+-----------+
| last_name |
+-----------+
| Zaitsev   |
+-----------+
1 row in set (0.00 sec)

mysql> EXPLAIN SELECT last_name FROM test_hash WHERE first_name = 'Peter';
+----+-------------+-----------+------------+------+----------------+----------------+---------+-------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys  | key            | key_len | ref   | rows | filtered | Extra |
+----+-------------+-----------+------------+------+----------------+----------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | test_hash | NULL       | ref  | idx_first_name | idx_first_name | 202     | const |    2 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+----------------+----------------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```
