---
title: "Explain 执行计划"
sequence: "104"
---

```text
mysql> EXPLAIN select * from sakila.city\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: city
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 600
     filtered: 100.00
        Extra: NULL
1 row in set, 1 warning (0.00 sec)

mysql> desc world.city;
+-------------+----------+------+-----+---------+----------------+
| Field       | Type     | Null | Key | Default | Extra          |
+-------------+----------+------+-----+---------+----------------+
| ID          | int      | NO   | PRI | NULL    | auto_increment |
| Name        | char(35) | NO   |     |         |                |
| CountryCode | char(3)  | NO   | MUL |         |                |
| District    | char(20) | NO   |     |         |                |
| Population  | int      | NO   |     | 0       |                |
+-------------+----------+------+-----+---------+----------------+
5 rows in set (0.01 sec)
```

## 环境准备

第 1 步，创建数据库：

```mysql
CREATE DATABASE `explain_test`
    DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

第 2 步，使用 `explain_test` 数据库：

```mysql
USE `explain_test`;
```

第 3 步，创建数据表，并添加数据：

```mysql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for actor
-- ----------------------------
DROP TABLE IF EXISTS `actor`;
CREATE TABLE `actor`  (
  `id` int(11) NOT NULL,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `update_time` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of actor
-- ----------------------------
INSERT INTO `actor` VALUES (1, 'a', '2017-12-22 15:27:18');
INSERT INTO `actor` VALUES (2, 'b', '2017-12-22 15:27:18');
INSERT INTO `actor` VALUES (3, 'c', '2017-12-22 15:27:18');

-- ----------------------------
-- Table structure for film
-- ----------------------------
DROP TABLE IF EXISTS `film`;
CREATE TABLE `film`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of film
-- ----------------------------
INSERT INTO `film` VALUES (3, 'film0');
INSERT INTO `film` VALUES (1, 'film1');
INSERT INTO `film` VALUES (2, 'film2');

-- ----------------------------
-- Table structure for film_actor
-- ----------------------------
DROP TABLE IF EXISTS `film_actor`;
CREATE TABLE `film_actor`  (
  `id` int(11) NOT NULL,
  `film_id` int(11) NOT NULL,
  `actor_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_film_actor_id`(`film_id`, `actor_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of film_actor
-- ----------------------------
INSERT INTO `film_actor` VALUES (1, 1, 1);
INSERT INTO `film_actor` VALUES (2, 1, 2);
INSERT INTO `film_actor` VALUES (3, 2, 1);

SET FOREIGN_KEY_CHECKS = 1;
```

第 4 步，查看索引信息：

```text
mysql> SHOW INDEX FROM actor;
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| actor |          0 | PRIMARY  |            1 | id          | A         |           2 |     NULL |   NULL |      | BTREE      |
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
1 row in set (0.00 sec)

mysql> SHOW INDEX FROM film;
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| film  |          0 | PRIMARY  |            1 | id          | A         |           2 |     NULL |   NULL |      | BTREE      |
| film  |          1 | idx_name |            1 | name        | A         |           2 |     NULL |   NULL | YES  | BTREE      |
+-------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
2 rows in set (0.01 sec)

mysql> SHOW INDEX FROM film_actor;
+------------+------------+-------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| Table      | Non_unique | Key_name          | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type |
+------------+------------+-------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
| film_actor |          0 | PRIMARY           |            1 | id          | A         |           2 |     NULL |   NULL |      | BTREE      |
| film_actor |          1 | idx_film_actor_id |            1 | film_id     | A         |           1 |     NULL |   NULL |      | BTREE      |
| film_actor |          1 | idx_film_actor_id |            2 | actor_id    | A         |           2 |     NULL |   NULL |      | BTREE      |
+------------+------------+-------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+
3 rows in set (0.00 sec)
```

## Explain

```mysql
EXPLAIN
SELECT (SELECT 1 FROM actor WHERE id = 1)
FROM (SELECT * FROM film WHERE id = 1) der;
```



```text
mysql> USE explain_test;
Database changed

mysql> SELECT 1 FROM actor WHERE id = 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0.00 sec)

mysql> SELECT * FROM film WHERE id = 1;
+----+-------+
| id | name  |
+----+-------+
|  1 | film1 |
+----+-------+
1 row in set (0.00 sec)

mysql> SELECT (SELECT 1 FROM actor WHERE id = 1)
    -> FROM (SELECT * FROM film WHERE id = 1) der;
+------------------------------------+
| (SELECT 1 FROM actor WHERE id = 1) |
+------------------------------------+
|                                  1 |
+------------------------------------+
1 row in set (0.00 sec)

mysql> EXPLAIN
    -> SELECT (SELECT 1 FROM actor WHERE id = 1)
    -> FROM (SELECT * FROM film WHERE id = 1) der;
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
|  1 | PRIMARY     | film  | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | Using index |
|  2 | SUBQUERY    | actor | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
2 rows in set, 1 warning (0.00 sec)
```

### id

`id` 列的编号是 `SELECT` 的序列号，有几个 `SELECT` 就有几个 id，并且 id 的顺序是按 `SELECT` 出现的顺序增长的。

`id` 为 `1` 的表就是“驱动表”。

### select_type

`select_type` 是查询类型，说明了查询的种类。

第 1 个，`simple` 简单查询，不包含子查询和 union

```mysql
EXPLAIN SELECT * FROM film WHERE id = 2;
```

```text
mysql> EXPLAIN SELECT * FROM film WHERE id = 2;
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | film  | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

第 2 个，`primary`，是复杂查询中最外层的 `SELECT` 语句。

```mysql
EXPLAIN
SELECT (
    SELECT 1 FROM actor WHERE id = 1
)
FROM (
    SELECT * FROM film WHERE id = 1
    UNION
    SELECT * FROM film WHERE id = 1
) der;
```

```text
mysql> EXPLAIN
    -> SELECT (                                # 1. PRIMARY
    ->     SELECT 1 FROM actor WHERE id = 1    # 2. SUBQUERY
    -> )
    -> FROM (                                  # 5. UNION RESULT
    ->     SELECT * FROM film WHERE id = 1     # 3. DERIVED
    ->     UNION
    ->     SELECT * FROM film WHERE id = 1     # 4. UNION
    -> ) der;
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
| id | select_type  | table      | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra           |
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
|  1 | PRIMARY      | <derived3> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL  |    2 |   100.00 | NULL            |
|  3 | DERIVED      | film       | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL            |
|  4 | UNION        | film       | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL            |
|  5 | UNION RESULT | <union3,4> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL  | NULL |     NULL | Using temporary |
|  2 | SUBQUERY     | actor      | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | Using index     |
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
5 rows in set, 1 warning (0.00 sec)
```

第 3 个，derived：包含在 from 子句中的子查询。MySQL 会将结果存放在一个临时表中，也称为派生表（derived 的英文含义）

第 4 个，union：在 union 中的第二个和随后的 select

第 5 个，union result：从 union 临时表检索结果的 select

```mysql
EXPLAIN
SELECT (
    SELECT 1 FROM actor WHERE id = 1
)
FROM (
    SELECT * FROM film WHERE id = 1
    UNION ALL
    SELECT * FROM film WHERE id = 1
) der;
```

```text
mysql> EXPLAIN
    -> SELECT (                                # 1. PRIMARY
    ->     SELECT 1 FROM actor WHERE id = 1    # 2. SUBQUERY
    -> )
    -> FROM (
    ->     SELECT * FROM film WHERE id = 1     # 3. DERIVED
    ->     UNION ALL                           # 注意：这里是 UNION ALL，不是 UNION
    ->     SELECT * FROM film WHERE id = 1     # 4. UNION
    -> ) der;
+----+-------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
| id | select_type | table      | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra       |
+----+-------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
|  1 | PRIMARY     | <derived3> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL  |    2 |   100.00 | NULL        |
|  3 | DERIVED     | film       | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL        |
|  4 | UNION       | film       | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL        |
|  2 | SUBQUERY    | actor      | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | Using index |
+----+-------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-------------+
4 rows in set, 1 warning (0.00 sec)
```

第 6 个，subquery：包含在 select 中的子查询（不在 from 子句中）


### table

`table` 这一列表示 explain 的一行正在访问哪个表。

### partitions

partitions 说明查询作用在哪个分区表上

### type

`type` 这一列表示关联类型或访问类型，即 MySQL 决定如何查找表中的行。

执行效率排序，从高到低：

- system
- const              （常用）
- eq_ref             （常用）
- ref                （常用）
- fulltext
- ref_or_null        （常用）
- index_merge
- unique_subquery
- index_subquery
- range              （常用）
- index              （常用）
- ALL                （常用）

`const`：MySQL 能对查询的某部分进行优化并将其转化成一个常量。
用于 primary key 或 unique key 的所有列与常数比较时，所以表最多有一个匹配行，读取 1 次，速度比较快。

```mysql
EXPLAIN SELECT * FROM (SELECT * FROM film WHERE id = 1) tmp;
```

```text
mysql> EXPLAIN SELECT * FROM (SELECT * FROM film WHERE id = 1) tmp;
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | film  | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
+----+-------------+-------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

`eq_ref`：primary key 或 unique key 索引的所有部分被连接使用，最多只会返回一条符合条件的记录。
这可能是在 `const` 之外最好的联接类型了，简单的 select 查询不会出现这种 type。

```mysql
EXPLAIN SELECT * FROM film_actor LEFT JOIN film ON film_actor.film_id = film.id;
```

```text
mysql> EXPLAIN SELECT * FROM film_actor LEFT JOIN film ON film_actor.film_id = film.id;
+----+-------------+------------+------------+--------+---------------+-------------------+---------+---------------------------------+------+----------+-------------+
| id | select_type | table      | partitions | type   | possible_keys | key               | key_len | ref                             | rows | filtered | Extra       |
+----+-------------+------------+------------+--------+---------------+-------------------+---------+---------------------------------+------+----------+-------------+
|  1 | SIMPLE      | film_actor | NULL       | index  | NULL          | idx_film_actor_id | 8       | NULL                            |    3 |   100.00 | Using index |
|  1 | SIMPLE      | film       | NULL       | eq_ref | PRIMARY       | PRIMARY           | 4       | explain_test.film_actor.film_id |    1 |   100.00 | NULL        |
+----+-------------+------------+------------+--------+---------------+-------------------+---------+---------------------------------+------+----------+-------------+
2 rows in set, 1 warning (0.00 sec)
```

`ref`：相比 `eq_ref`，不使用唯一索引，而是使用普通索引或者唯一性索引的部分前缀，索引要和某个值相比较，可能会找到多个符合条件的行。

```mysql
EXPLAIN SELECT * FROM film WHERE name = 'film1';
```

```text
mysql> EXPLAIN SELECT * FROM film WHERE name = 'film1';
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
| id | select_type | table | partitions | type | possible_keys | key      | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | film  | NULL       | ref  | idx_name      | idx_name | 33      | const |    1 |   100.00 | Using index |
+----+-------------+-------+------------+------+---------------+----------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

`ref_or_null`：类似 `ref`，但是可以搜索值为 `NULL` 的行。

```mysql
EXPLAIN SELECT * FROM film WHERE name = 'film1' OR name IS NULL;
```

```text
mysql> EXPLAIN SELECT * FROM film WHERE name = 'film1' OR name IS NULL;
+----+-------------+-------+------------+-------------+---------------+----------+---------+-------+------+----------+--------------------------+
| id | select_type | table | partitions | type        | possible_keys | key      | key_len | ref   | rows | filtered | Extra                    |
+----+-------------+-------+------------+-------------+---------------+----------+---------+-------+------+----------+--------------------------+
|  1 | SIMPLE      | film  | NULL       | ref_or_null | idx_name      | idx_name | 33      | const |    2 |   100.00 | Using where; Using index |
+----+-------------+-------+------------+-------------+---------------+----------+---------+-------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```


`range`：范围扫描通常出现在 `in()`、`between`、`>`、`<`、`>=` 等操作中。
使用一个索引来检索给定范围的行。

```mysql
EXPLAIN SELECT * FROM actor WHERE id > 1;
```

```text
mysql> EXPLAIN SELECT * FROM actor WHERE id > 1;
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | actor | NULL       | range | PRIMARY       | PRIMARY | 4       | NULL |    2 |   100.00 | Using where |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

`index`：和 `ALL` 一样，不同就是 MySQL 只需扫描索引树，这通常比 `ALL` 快一些。

```mysql
EXPLAIN SELECT COUNT(*) FROM film;
```

```text
mysql> EXPLAIN SELECT COUNT(*) FROM film;
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key      | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | film  | NULL       | index | NULL          | idx_name | 33      | NULL |    3 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

`ALL`：即全表扫描，意味着 MySQL 需要从头到尾去查找所需要的行。通常情况下这需要增加索引来进行优化了

```mysql
EXPLAIN SELECT * FROM actor;
```

```text
mysql> EXPLAIN SELECT * FROM actor;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
|  1 | SIMPLE      | actor | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |   100.00 | NULL  |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

```text
mysql> explain select * from world.city\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: city
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4046
     filtered: 100.00
        Extra: NULL
1 row in set, 1 warning (0.00 sec)
```

### possible_keys

`possible_keys` 这一列显示查询可能使用哪些索引来查找。

```mysql
EXPLAIN SELECT * FROM actor WHERE id > 1;
```

```text
mysql> EXPLAIN SELECT * FROM actor WHERE id > 1;
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | actor | NULL       | range | PRIMARY       | PRIMARY | 4       | NULL |    2 |   100.00 | Using where |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

### key

`key` 这一列显示 MySQL 实际采用哪个索引来优化对该表的访问。

### key_len

`key_len` 这一列显示了 MySQL 在索引里使用的字节数，通过这个值可以算出具体使用了索引中的哪些列。

### ref

`ref` 这一列显示了在 `key` 列记录的索引中，表查找值所用到的列或常量，
常见的有：`const`（常量），`func`，`NULL`，字段名（例：`film.id`）

### rows

`rows` 这一列是 MySQL 估计要读取并检测的行数，注意这个不是结果集里的行数。

### filtered

`filtered` 列,是一个百分比的值，代表 (rows * filtered) / 100 ,这个结果将于前表产生交互

```mysql
EXPLAIN
SELECT (
    SELECT 1 FROM actor WHERE id = 1
)
FROM (
    SELECT * FROM film WHERE id = 1
    UNION
    SELECT * FROM film WHERE id = 1
) der;
```

```text
mysql> EXPLAIN
    -> SELECT (                                # 1. PRIMARY
    ->     SELECT 1 FROM actor WHERE id = 1    # 2. SUBQUERY
    -> )
    -> FROM (                                  # 5. UNION RESULT
    ->     SELECT * FROM film WHERE id = 1     # 3. DERIVED
    ->     UNION
    ->     SELECT * FROM film WHERE id = 1     # 4. UNION
    -> ) der;
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
| id | select_type  | table      | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra           |
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
|  1 | PRIMARY      | <derived3> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL  |    2 |   100.00 | NULL            |
|  3 | DERIVED      | film       | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL            |
|  4 | UNION        | film       | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL            |
|  5 | UNION RESULT | <union3,4> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL  | NULL |     NULL | Using temporary |
|  2 | SUBQUERY     | actor      | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | Using index     |
+----+--------------+------------+------------+-------+---------------+---------+---------+-------+------+----------+-----------------+
5 rows in set, 1 warning (0.00 sec)
```

### Extra

`Extra` 这一列展示的是额外信息：

- `distinct`
- `Using index`
- `Using where`
- `Using temporary`
- `Using filesort`

`distinct`: 一旦 MySQL 找到了与行相联合匹配的行，就不再搜索了

```mysql
EXPLAIN SELECT DISTINCT name FROM film LEFT JOIN film_actor ON film.id = film_actor.film_id;
```

```text
mysql> EXPLAIN SELECT DISTINCT name FROM film LEFT JOIN film_actor ON film.id = film_actor.film_id;
+----+-------------+------------+------------+-------+-------------------+-------------------+---------+----------------------+------+----------+------------------------------+
| id | select_type | table      | partitions | type  | possible_keys     | key               | key_len | ref                  | rows | filtered | Extra                        |
+----+-------------+------------+------------+-------+-------------------+-------------------+---------+----------------------+------+----------+------------------------------+
|  1 | SIMPLE      | film       | NULL       | index | idx_name          | idx_name          | 33      | NULL                 |    3 |   100.00 | Using index; Using temporary |
|  1 | SIMPLE      | film_actor | NULL       | ref   | idx_film_actor_id | idx_film_actor_id | 4       | explain_test.film.id |    3 |   100.00 | Using index; Distinct        |
+----+-------------+------------+------------+-------+-------------------+-------------------+---------+----------------------+------+----------+------------------------------+
2 rows in set, 1 warning (0.00 sec)
```

`Using index`：这发生在对表的请求列都是同一索引的部分的时候，返回的列数据只使用了索引中的信息，
而没有再去访问表中的行记录。是性能高的表现。

`using index` 也叫**索引覆盖**。

```mysql
EXPLAIN SELECT id FROM film ORDER BY id;
EXPLAIN SELECT id, name FROM film ORDER BY id;
```

```text
mysql> EXPLAIN SELECT id FROM film ORDER BY id;
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | film  | NULL       | index | NULL          | PRIMARY | 4       | NULL |    3 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT id,name FROM film ORDER BY id;
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------+
| id | select_type | table | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------+
|  1 | SIMPLE      | film  | NULL       | index | NULL          | PRIMARY | 4       | NULL |    3 |   100.00 | NULL  |
+----+-------------+-------+------------+-------+---------------+---------+---------+------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

`Using where`：MySQL 服务器将在存储引擎检索行后再进行过滤。
就是先读取整行数据，再按 where 条件进行检查，符合就留下，不符合就丢弃。

```mysql
EXPLAIN SELECT * FROM film WHERE id > 1;
```

```text
mysql> EXPLAIN SELECT * FROM film WHERE id > 1;
+----+-------------+-------+------------+-------+------------------+----------+---------+------+------+----------+--------------------------+
| id | select_type | table | partitions | type  | possible_keys    | key      | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+-------+------------+-------+------------------+----------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | film  | NULL       | index | PRIMARY,idx_name | idx_name | 33      | NULL |    3 |    66.67 | Using where; Using index |
+----+-------------+-------+------------+-------+------------------+----------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

`Using temporary`：MySQL 需要创建一张临时表来处理查询。
出现这种情况一般是要进行优化的，首先是想到用索引来优化。

```mysql
EXPLAIN SELECT DISTINCT name FROM actor;
CREATE INDEX idx_name ON actor(name);
EXPLAIN SELECT DISTINCT name FROM actor;
```

```text
mysql> EXPLAIN SELECT DISTINCT name FROM actor;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra           |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
|  1 | SIMPLE      | actor | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |   100.00 | Using temporary |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+-----------------+
1 row in set, 1 warning (0.00 sec)

mysql> CREATE INDEX idx_name ON actor(name);
Query OK, 0 rows affected (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> EXPLAIN SELECT DISTINCT name FROM actor;
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key      | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | actor | NULL       | index | idx_name      | idx_name | 138     | NULL |    3 |   100.00 | Using index |
+----+-------------+-------+------------+-------+---------------+----------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

`Using filesort`：采用文件扫描对结果进行计算排序，效率很差

对于排序来说，只有 `SELECT` 之后的字段 与 `ORDER BY` 之后的字段，都被索引覆盖时，才允许使用 Using Index。

```mysql
EXPLAIN SELECT name FROM actor ORDER BY name;
EXPLAIN SELECT name, update_time FROM actor ORDER BY update_time, name;

CREATE INDEX idx_name_ut ON actor(name, update_time);
EXPLAIN SELECT name, update_time FROM actor ORDER BY update_time, name;
```

```text
mysql> EXPLAIN SELECT name FROM actor ORDER BY name;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
|  1 | SIMPLE      | actor | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |   100.00 | Using filesort |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT name, update_time FROM actor ORDER BY update_time, name;
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
| id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra          |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
|  1 | SIMPLE      | actor | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |   100.00 | Using filesort |
+----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+----------------+
1 row in set, 1 warning (0.00 sec)

mysql> CREATE INDEX idx_name_ut ON actor(name, update_time);
Query OK, 0 rows affected (0.04 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> EXPLAIN SELECT name, update_time FROM actor ORDER BY update_time, name;
+----+-------------+-------+------------+-------+---------------+-------------+---------+------+------+----------+-----------------------------+
| id | select_type | table | partitions | type  | possible_keys | key         | key_len | ref  | rows | filtered | Extra                       |
+----+-------------+-------+------------+-------+---------------+-------------+---------+------+------+----------+-----------------------------+
|  1 | SIMPLE      | actor | NULL       | index | NULL          | idx_name_ut | 144     | NULL |    3 |   100.00 | Using index; Using filesort |
+----+-------------+-------+------------+-------+---------------+-------------+---------+------+------+----------+-----------------------------+
1 row in set, 1 warning (0.00 sec)
```
