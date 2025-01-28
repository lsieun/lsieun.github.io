---
title: "Show Profile"
sequence: "105"
---

Show Profile 是 MySQL 提供的可以用来分析当前查询 SQL 语句执行的资源消耗情况的工具，可用于 SQL 调优的测量。
在默认情况下，Show Profile 处于“关闭状态”，开启会消耗一定的性能，一般在 SQL 分析和优化的时候使用，只保存最近 15 次的运行结果。

## 命令参考

### 是否支持

查看当前 MySQL 版本对 profile 是否支持：如果是 `YES`，代表是支持的。

```text
SELECT @@have_profiling;
```

```text
mysql> SELECT @@have_profiling;
+------------------+
| @@have_profiling |
+------------------+
| YES              |
+------------------+
1 row in set, 1 warning (0.00 sec)
```

### 查看状态

默认该功能是关闭的，使用前需提前开启 Show Profile 功能。

```mysql
SHOW VARIABLES LIKE 'profiling';
```

```text
mysql> SHOW VARIABLES LIKE 'profiling';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| profiling     | OFF   |
+---------------+-------+
1 row in set (0.01 sec)
```

```text
SELECT @@profiling;
```

```text
mysql> SELECT @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+
1 row in set, 1 warning (0.00 sec)
```

### 设置

默认 show profiling 是关闭的，可以通过 set 命令设置 session 级别开启 profiling：

开启 profiling：设置 profiling 参数值为 1，默认是 0。

```text
SET profiling=on;
```

```text
mysql> SET profiling=on;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW VARIABLES LIKE 'profiling';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| profiling     | ON    |
+---------------+-------+
1 row in set (0.01 sec)
```

```text
mysql> SET profiling=1;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SELECT @@profiling;
+-------------+
| @@profiling |
+-------------+
|           1 |
+-------------+
1 row in set, 1 warning (0.00 sec)
```

```text
mysql> select count(*) from world.city;
+----------+
| count(*) |
+----------+
|     4079 |
+----------+
1 row in set (0.01 sec)
```

```text
mysql> show profiles;
+----------+------------+---------------------------------+
| Query_ID | Duration   | Query                           |
+----------+------------+---------------------------------+
|        1 | 0.00040625 | SELECT @@profiling              |
|        2 | 0.01080550 | select count(*) from world.city |
+----------+------------+---------------------------------+
2 rows in set, 1 warning (0.00 sec)
```

使用 `show profile for query` 语句可以查询到执行过程中线程更多信息：状态、消耗时间

示例：截取部分参数作为演示。

```text
mysql> show profile for query 2;
+--------------------------------+----------+
| Status                         | Duration |
+--------------------------------+----------+
| starting                       | 0.000309 |
| Executing hook on transaction  | 0.000079 |
| starting                       | 0.000015 |
| checking permissions           | 0.000009 |
| Opening tables                 | 0.000148 |
| init                           | 0.000013 |
| System lock                    | 0.000013 |
| optimizing                     | 0.000128 |
| statistics                     | 0.000102 |
| preparing                      | 0.000087 |
| executing                      | 0.009571 |
| end                            | 0.000038 |
| query end                      | 0.000042 |
| waiting for handler commit     | 0.000086 |
| closing tables                 | 0.000018 |
| freeing items                  | 0.000026 |
| cleaning up                    | 0.000122 |
+--------------------------------+----------+
17 rows in set, 1 warning (0.00 sec)
```

```text
mysql> show profile CPU for query 1;
+----------------------+----------+----------+------------+
| Status               | Duration | CPU_user | CPU_system |
+----------------------+----------+----------+------------+
| starting             | 0.000142 | 0.000046 |   0.000093 |
| checking permissions | 0.000049 | 0.000015 |   0.000032 |
| Opening tables       | 0.000020 | 0.000007 |   0.000012 |
| init                 | 0.000009 | 0.000002 |   0.000006 |
| optimizing           | 0.000013 | 0.000005 |   0.000008 |
| executing            | 0.000014 | 0.000004 |   0.000009 |
| end                  | 0.000043 | 0.000015 |   0.000030 |
| query end            | 0.000014 | 0.000004 |   0.000008 |
| closing tables       | 0.000006 | 0.000002 |   0.000004 |
| freeing items        | 0.000016 | 0.000005 |   0.000011 |
| cleaning up          | 0.000081 | 0.000084 |   0.000000 |
+----------------------+----------+----------+------------+
11 rows in set, 1 warning (0.00 sec)
```

## Reference

- [MySQL 优化流程：定位低效率 SQL、explain 分析、show profile 分析以及 trace 追踪](https://zhuanlan.zhihu.com/p/491081886)
