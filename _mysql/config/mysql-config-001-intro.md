---
title: "三种配置方式"
sequence: "101"
---

## 设置参数的三种方式

- 设置当前会话(连接)参数：`SET [session] 参数名 = 参数值;`
- 设置全局参数：`SET GLOBAL 参数名 = 参数值;`
- 设置应用配置文件
    - Window 存放到将 `my.ini` 应用程序根目录
    - Linux 保存在 `/etc/my.cnf`

## 配置文件

```text
[mysqld]
port=3307
max_connections=100
```

```text
SHOW VARIABLES LIKE '%connection%';
```

```text
mysql> SHOW VARIABLES LIKE '%connection%';
+-----------------------------------+----------------------+
| Variable_name                     | Value                |
+-----------------------------------+----------------------+
| character_set_connection          | gbk                  |
| collation_connection              | gbk_chinese_ci       |
| connection_memory_chunk_size      | 8192                 |
| connection_memory_limit           | 18446744073709551615 |
| global_connection_memory_limit    | 18446744073709551615 |
| global_connection_memory_tracking | OFF                  |
| max_connections                   | 100                  |
| max_user_connections              | 0                    |
| mysqlx_max_connections            | 100                  |
+-----------------------------------+----------------------+
9 rows in set (0.01 sec)
```

## SET GLOBAL

`SET GLOBAL` 在 MySQL 服务器支行过程中，会一直生效，直到 MySQL 关闭。

值得注意的是，部分参数在 `SET GLOBAL` 执行后，并不会立即生效，需要重新建立连接后才能生效。

```text
SET GLOBAL max_connections = 200;
SHOW VARIABLES LIKE '%connection%';
```

```text
mysql> SET GLOBAL max_connections = 200;
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW VARIABLES LIKE '%connection%';
+-----------------------------------+----------------------+
| Variable_name                     | Value                |
+-----------------------------------+----------------------+
| character_set_connection          | gbk                  |
| collation_connection              | gbk_chinese_ci       |
| connection_memory_chunk_size      | 8192                 |
| connection_memory_limit           | 18446744073709551615 |
| global_connection_memory_limit    | 18446744073709551615 |
| global_connection_memory_tracking | OFF                  |
| max_connections                   | 200                  |
| max_user_connections              | 0                    |
| mysqlx_max_connections            | 100                  |
+-----------------------------------+----------------------+
9 rows in set (0.00 sec)
```

## SET SESSION

`SET SESSION` 代表在当前会话（窗口/连接）才有效，关闭会话后自动失效。

## 参数设置的优先级

```text
SESSION > GLOBAL > 配置文件
```
