---
title: "Connection（连接数）"
sequence: "102"
---

## 连接数

### 正在进行的连接

查看当前 MySQL 在进行的线程：

```text
SHOW PROCESSLIST;
```

输出结果中，包括线程状态、是否锁表、实时查看 SQL 执行状态 等信息：

```text
mysql> SHOW PROCESSLIST;
+----+-----------------+----------------------+-------+---------+------+------------------------+------------------+
| Id | User            | Host                 | db    | Command | Time | State                  | Info             |
+----+-----------------+----------------------+-------+---------+------+------------------------+------------------+
|  5 | event_scheduler | localhost            | NULL  | Daemon  | 5190 | Waiting on empty queue | NULL             |
| 13 | root            | localhost            | mysql | Query   |    0 | init                   | SHOW PROCESSLIST |
| 15 | root            | nexus.lsieun.cn:6011 | world | Sleep   |  449 |                        | NULL             |
| 16 | root            | nexus.lsieun.cn:6274 | world | Sleep   | 2909 |                        | NULL             |
| 17 | root            | nexus.lsieun.cn:6275 | world | Sleep   | 3152 |                        | NULL             |
| 18 | root            | nexus.lsieun.cn:6282 | world | Sleep   | 3152 |                        | NULL             |
+----+-----------------+----------------------+-------+---------+------+------------------------+------------------+
6 rows in set, 1 warning (0.00 sec)
```

参数说明：

- `Id`：线程id，可以通过kill命令杀掉；
- `User`：连接的用户名；
- `Host`：连接的主机地址；
- `db`：连接的数据库名；
- `Command`：当前命令状态信息；
    - `Sleep`：线程正在等待客户端发送数据；
    - `Query`：连接线程正在执行查询；
    - `Locked`：线程正在等待表锁的释放；
    - `Sorting result`：线程正在对结果进行排序；
    - `Sending data`：向请求端返回数据。
- `Time`：连接时间；
- `State`：状态信息；
- `Info`：命令信息。

### 最大允许连接数

#### 查看

`max_connections` 代表数据库同时允许的最大允许连接数：

```text
SHOW VARIABLES LIKE 'max_connections';
```

示例：

```text
mysql> SHOW VARIABLES LIKE 'max_connections';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_connections | 200   |
+-----------------+-------+
1 row in set (0.00 sec)
```

连接有两种常见状态：sleep 和 query

- sleep 代表连接处于闲置状态
- query 代表连接正处于处理任务的状态

sleep + query 连接的总量不能超过 `max_connections` 的设置值；
否则，会出现经典错误："ERROR 1040：Too many connections"。

#### 设置

```text
SET GLOBAL max_connections=300;
```

```text
mysql> SHOW VARIABLES LIKE 'max_connections';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_connections | 200   |
+-----------------+-------+
1 row in set (0.00 sec)

mysql> SET GLOBAL max_connections=300;
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW VARIABLES LIKE 'max_connections';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_connections | 300   |
+-----------------+-------+
1 row in set (0.00 sec)
```

### 历史最大连接数

MySQL 历史运行过程中最大连接数的数量及具体时间：

```text
SHOW STATUS LIKE 'Max_used_connections%';
```

示例：

```text
mysql> SHOW STATUS LIKE 'Max_used_connections%';
+---------------------------+---------------------+
| Variable_name             | Value               |
+---------------------------+---------------------+
| Max_used_connections      | 1                   |
| Max_used_connections_time | 2023-11-16 22:14:02 |
+---------------------------+---------------------+
2 rows in set (0.00 sec)
```

### 查看连接的状态

```text
SHOW STATUS LIKE 'Threads%';
```

```text
mysql> SHOW STATUS LIKE 'Threads%';
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| Threads_cached    | 0     |
| Threads_connected | 1     |
| Threads_created   | 1     |
| Threads_running   | 2     |
+-------------------+-------+
4 rows in set (0.00 sec)
```

- `Threads_connected` 代表当前已经有多少连接(Sleep+Query)
- `Threads_created` 代表历史总共创建过多少个数据库连接 （正在工作的 + 已经销毁的）
- `Threads_running` 代表有几个连接正处于"工作"状态,也是目前的并发数
- `Threads_cached` 共缓存过多少连接。
  如果我们在MySQL服务器配置文件中设置了 `thread_cache_size`，
  当客户端断开之后，服务器处理此客户的线程将会缓存起来以响应下一个客户而不是销毁(前提是缓存数未达上限)。

```text
SET GLOBAL thread_cache_size=80;
```

```text
mysql> SHOW VARIABLES LIKE 'thread_cache_size';
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| thread_cache_size | 9     |
+-------------------+-------+
1 row in set (0.00 sec)

mysql> SET GLOBAL thread_cache_size=80;
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW VARIABLES LIKE 'thread_cache_size';
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| thread_cache_size | 80    |
+-------------------+-------+
1 row in set (0.00 sec)
```

### 连接超时

`wait_timeout` 和 `interactive_timeout`
这两个参数都是至超过一段时间后,数据库连接自动关闭(默认28800秒,即8小时)

- `interactive_timeout` 针对交互式连接
- `wait_timeout` 针对非交互式连接。

说得直白一点，通过 MySQL 客户端连接数据库是交互式连接，通过 JDBC 连接数据库是非交互式连接。

```text
SHOW VARIABLES LIKE 'wait_timeout';
SHOW VARIABLES LIKE 'interactive_timeout';
```

```text
mysql> SHOW VARIABLES LIKE 'wait_timeout';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| wait_timeout  | 28800 |
+---------------+-------+
1 row in set (0.00 sec)

mysql> SHOW VARIABLES LIKE 'interactive_timeout';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| interactive_timeout | 28800 |
+---------------------+-------+
1 row in set (0.00 sec)
```

## back_Log

`back_log` 设置保存多少数据库请求到堆栈(缓冲区)中。

也就是说，如果 MySql 的连接数达到 max_connections 时，新来的请求将会被存在堆栈中，
以等待某一连接释放资源，该堆栈的数量即 `back_log`，
如果等待连接的数量超过 `back_log`，将不被授予连接资源。将会报错：

```text
unauthenticated user | xxx.xxx.xxx.xxx | NULL | Connect | NULL | login | NULL 的待连接进程时.
```

```text
SHOW VARIABLES LIKE 'back_log';
```

```text
mysql> SHOW VARIABLES LIKE 'back_log';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| back_log      | 100   |
+---------------+-------+
1 row in set (0.00 sec)
```


