---
title: "MySQL：variables"
sequence: "105"
---

```text
show variables;
```

## 版本

```text
SELECT @@version;
```

```text
mysql> SELECT @@version;
+-----------+
| @@version |
+-----------+
| 8.0.31    |
+-----------+
1 row in set (0.00 sec)
```

## 字符

```text
SHOW VARIABLES LIKE 'character%';
```

使用 GBK 编码的客户端：

```text
mysql> SHOW VARIABLES LIKE 'character%';
+--------------------------+---------------------------------------------------------+
| Variable_name            | Value                                                   |
+--------------------------+---------------------------------------------------------+
| character_set_client     | gbk                                                     |
| character_set_connection | gbk                                                     |
| character_set_database   | utf8mb4                                                 |
| character_set_filesystem | binary                                                  |
| character_set_results    | gbk                                                     |
| character_set_server     | utf8mb4                                                 |
| character_set_system     | utf8mb3                                                 |
| character_sets_dir       | C:\Program Files\MySQL\MySQL Server 8.0\share\charsets\ |
+--------------------------+---------------------------------------------------------+
8 rows in set, 1 warning (0.00 sec)
```

使用 Unicode 编码的客户端：

```text
mysql> SHOW VARIABLES LIKE 'character%';
+--------------------------+---------------------------------------------------------+
| Variable_name            | Value                                                   |
+--------------------------+---------------------------------------------------------+
| character_set_client     | utf8mb4                                                 |
| character_set_connection | utf8mb4                                                 |
| character_set_database   | utf8mb4                                                 |
| character_set_filesystem | binary                                                  |
| character_set_results    | utf8mb4                                                 |
| character_set_server     | utf8mb4                                                 |
| character_set_system     | utf8mb3                                                 |
| character_sets_dir       | C:\Program Files\MySQL\MySQL Server 8.0\share\charsets\ |
+--------------------------+---------------------------------------------------------+
8 rows in set, 1 warning (0.00 sec)
```

## 时间

### 时区

```text
SELECT @@global.system_time_zone, @@global.time_zone;
```

```text
mysql> SELECT @@global.system_time_zone, @@global.time_zone;
+---------------------------+--------------------+
| @@global.system_time_zone | @@global.time_zone |
+---------------------------+--------------------+
| UTC                       | SYSTEM             |
+---------------------------+--------------------+
1 row in set (0.00 sec)
```

```text
SELECT sysdate();
```

```text
mysql> SELECT sysdate();
+---------------------+
| sysdate()           |
+---------------------+
| 2023-01-12 09:04:39 |
+---------------------+
1 row in set (0.00 sec)
```

### NOW()

```text
mysql> SELECT NOW();
+---------------------+
| NOW()               |
+---------------------+
| 2023-01-12 09:03:59 |
+---------------------+
1 row in set (0.00 sec)
```
