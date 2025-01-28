---
title: "慢 SQL 日志"
sequence: "107"
---

## 查看慢 SQL 参数

```mysql
SHOW VARIABLES LIKE '%query%';
```

```text
mysql> SHOW VARIABLES LIKE '%query%';
+------------------------------+---------------------+
| Variable_name                | Value               |
+------------------------------+---------------------+
| binlog_rows_query_log_events | OFF                 |
| ft_query_expansion_limit     | 20                  |
| have_query_cache             | NO                  |
| long_query_time              | 10.000000           |
| query_alloc_block_size       | 8192                |
| query_prealloc_size          | 8192                |
| slow_query_log               | ON                  |
| slow_query_log_file          | LENOVOWIN7-slow.log |
+------------------------------+---------------------+
8 rows in set, 1 warning (0.00 sec)
```

## 设置慢 SQL 日志

### 命令设置

```text
# 开启慢SQL日志功能
SET GLOBAL slow_query_log=on;

# 指定慢SQL文件名为slow-sql，慢SQL日志保存在 mysql/data 目录下
SET GLOBAL slow_query_log_file="slow-sql.log";

# 慢SQL执行时间阈值，单位(秒) ,1毫秒=0.001
# 不建议超过 300ms，最终结果视情况而定
SET GLOBAL long_query_time=0.001;

# 是否记录没有使用索引的SQL语句
SET GLOBAL log_queries_not_using_indexes=on;
```

```text
mysql> SET GLOBAL slow_query_log=on;
Query OK, 0 rows affected (0.00 sec)

mysql> SET GLOBAL slow_query_log_file="slow-sql.log";
Query OK, 0 rows affected (0.01 sec)

mysql> SET GLOBAL long_query_time=0.001;
Query OK, 0 rows affected (0.00 sec)
```

注意：`SET GLOBAL` 命令设置完成之后，下次连接才会生效，因此需要**重新连接**。

```text
mysql> SHOW VARIABLES LIKE '%query%';
+------------------------------+--------------+
| Variable_name                | Value        |
+------------------------------+--------------+
| binlog_rows_query_log_events | OFF          |
| ft_query_expansion_limit     | 20           |
| have_query_cache             | NO           |
| long_query_time              | 0.001000     |    # 时间阈值
| query_alloc_block_size       | 8192         |
| query_prealloc_size          | 8192         |
| slow_query_log               | ON           |    # 开启
| slow_query_log_file          | slow-sql.log |    # 日志文件
+------------------------------+--------------+
8 rows in set, 1 warning (0.00 sec)

mysql> use babytun;
Database changed
```

```text
EXPLAIN
SELECT gc.*, g.title
FROM t_goods g,
     t_goods_cover gc
WHERE g.goods_id = gc.goods_id
  AND g.goods_id > 60;
```

```text
mysql> EXPLAIN
    -> SELECT gc.*, g.title
    -> FROM t_goods g,
    ->      t_goods_cover gc
    -> WHERE g.goods_id = gc.goods_id
    ->   AND g.goods_id > 60;
+----+-------------+-------+------------+-------+---------------+--------------+---------+--------------------+------+----------+-------------+
| id | select_type | table | partitions | type  | possible_keys | key          | key_len | ref                | rows | filtered | Extra       |
+----+-------------+-------+------------+-------+---------------+--------------+---------+--------------------+------+----------+-------------+
|  1 | SIMPLE      | g     | NULL       | range | PRIMARY       | PRIMARY      | 4       | NULL               |  974 |   100.00 | Using where |
|  1 | SIMPLE      | gc    | NULL       | ref   | idx_goods_id  | idx_goods_id | 4       | babytun.g.goods_id |    4 |   100.00 | NULL        |
+----+-------------+-------+------------+-------+---------------+--------------+---------+--------------------+------+----------+-------------+
2 rows in set, 1 warning (0.00 sec)
```

打开如下文件：

```text
C:\ProgramData\MySQL\MySQL Server 8.0\Data\slow-sql.log
```

文件内容：

```text
C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe, Version: 8.0.31 (MySQL Community Server - GPL). started with:
TCP Port: 3306, Named Pipe: MySQL
Time                 Id Command    Argument
# Time: 2023-11-15T07:17:10.361406Z - 执行时间
# User@Host: root[root] @ localhost [::1]  Id:    15 - 环境信息（用户名+主机）
# Query_time: 0.002000 - 查询时间（重要的参数）
# Lock_time: 0.000000  - 资源锁定时间
# Rows_sent: 8         - 查询结果的总行数
# Rows_examined: 8     - 扫描的总行数（重要的参数）
use babytun;
SET timestamp=1700032630; - 时间戳
SHOW VARIABLES LIKE '%query%';

# Time: 2023-11-15T07:21:49.593406Z - 执行时间
# User@Host: root[root] @ localhost [::1]  Id:    15 - 环境信息（用户名+主机）
# Query_time: 0.002000 - 查询时间（重要的参数）
# Lock_time: 0.000000  - 资源锁定时间
# Rows_sent: 2         - 查询结果的总行数 
# Rows_examined: 0     - 扫描的总行数（重要的参数）
SET timestamp=1700032909; - 时间戳
EXPLAIN
SELECT gc.*, g.title
FROM t_goods g,
     t_goods_cover gc
WHERE g.goods_id = gc.goods_id
  AND g.goods_id > 60;
```

### 配置文件

修改 `my.cnf` 文件：

```text

```

## 记录没有使用索引的查询

```text
mysql> SHOW VARIABLES LIKE 'log_queries%';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| log_queries_not_using_indexes | OFF   |
+-------------------------------+-------+
1 row in set, 1 warning (0.01 sec)
```

```text
mysql> SET GLOBAL log_queries_not_using_indexes=on;
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW VARIABLES LIKE 'log_queries%';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| log_queries_not_using_indexes | ON    |
+-------------------------------+-------+
1 row in set, 1 warning (0.00 sec)
```

```text
SELECT * FROM t_goods WHERE goods_id <> 10;
```

打开如下文件：

```text
C:\ProgramData\MySQL\MySQL Server 8.0\Data\slow-sql.log
```

文件内容：

```text
# Time: 2023-11-15T07:42:26.594406Z - 执行时间
# User@Host: root[root] @ localhost [::1]  Id:    15 - 环境信息（用户名+主机）
# Query_time: 0.027000 - 查询时间（重要的参数）
# Lock_time: 0.000000  - 资源锁定时间
# Rows_sent: 1969      - 查询结果的总行数 
# Rows_examined: 1969  - 扫描的总行数（重要的参数）
SET timestamp=1700034146; - 时间戳
SELECT * FROM t_goods WHERE goods_id <> 10;
```
