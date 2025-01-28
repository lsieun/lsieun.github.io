---
title: "InnoDB 引擎参数"
sequence: "111"
---

Buffer Pool 是内存中的一块区域，当我们想查询一条数据，首先会在磁盘中找到存放这条数据的某一页。
然后将这一页的数据复制到Buffer Pool中。
如果接下来另一个客户端也是查询这条数据的话，那么就会直接在 Buffer Pool 中获取。

如果是修改语句，也是先将一页数据从磁盘中复制出来至 Buffer Pool 中，然后对 Buffer Pool 中的数据进行修改，然后再将修改后的数据同步至磁盘。

Buffer Pool 默认是 128MB 大小。

刚开始Buffer Pool是空的，经过了几条查询语句之后，会复制一些页到Buffer Pool中；
然后Buffer Pool的中间这个页进行了一些修改操作，然后过了一会儿就会将修改后的数据同步到磁盘中，然后这个位置就会空出来。

## 页（Page）和缓存池（Buffer Pool）

### 页

InnoDB 每页的长度：

```text
SHOW GLOBAL STATUS LIKE 'Innodb_page_size';
```

```text
mysql> SHOW GLOBAL STATUS LIKE 'Innodb_page_size';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| Innodb_page_size | 16384 |    # 1024 * 16 = 16384
+------------------+-------+
1 row in set (0.00 sec)
```

### 缓存池

```text
SHOW GLOBAL VARIABLES like 'innodb_buffer_pool_size';
```

```text
mysql> SHOW GLOBAL VARIABLES like 'innodb_buffer_pool_size';
+-------------------------+-----------+
| Variable_name           | Value     |
+-------------------------+-----------+
| innodb_buffer_pool_size | 134217728 |    # 134217728 byte = 128M(默认值)
+-------------------------+-----------+
1 row in set (0.00 sec)
```

### 已经的缓存数量

Innodb 已使用的缓存"页Page"数量

```text
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_pages_data';
```

```text
mysql> SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_pages_data';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| Innodb_buffer_pool_pages_data | 961   |
+-------------------------------+-------+
1 row in set (0.00 sec)
```

### 全部缓存页数量

InnoDB 全部缓存页数量

```text
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_pages_total';
```

```text
mysql> SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_pages_total';
+--------------------------------+-------+
| Variable_name                  | Value |
+--------------------------------+-------+
| Innodb_buffer_pool_pages_total | 8192  |
+--------------------------------+-------+
1 row in set (0.00 sec)
```

### 页面使用率

页面使用率：

```text
result = Innodb_buffer_pool_pages_data / Innodb_buffer_pool_pages_total * 100%
```

- val > 95% 则考虑增大 innodb_buffer_pool_size， 建议使用物理内存的75%
- val < 95% 则考虑减小 innodb_buffer_pool_size， 建议设置为：
    - Innodb_buffer_pool_pages_data * Innodb_page_size * 1.05 / (1024*1024*1024)

```text
SET GLOBAL innodb_buffer_pool_size = 10244444;
```

## innodb_flush_log_at_trx_commit

在事务控制中，存在"事务区"来保证事务完整性，在事务提交以后，这些事务区的数据会写入到硬盘上；
同时，事务操作日志(log)，也需要向硬盘中写入。

这个 `innodb_flush_log_at_trx_commit` 参数就是用来控制何时写日志数据的：

- `0`：log buffer 将每秒一次地写入 log file 中，并且 log file 的flush(刷到磁盘)操作同时进行。
  该模式下在事务提交的时候，不会主动触发写入磁盘的操作。
- `1`：每次事务提交时，MySQL 都会把 log buffer 的数据写入 log file，并且flush(刷到磁盘)中去，该模式为系统默认。
- `2`：每次事务提交时，MySQL 都会把 log buffer 的数据写入 log file，但是flush(刷到磁盘)操作并不会同时进行。
  该模式下，MySQL会每秒执行一次flush(刷到磁盘)操作。

三者比较：

- 当设置为 `0`，该模式速度最快，但不太安全，mysqld 进程的崩溃会导致上一秒钟所有事务数据的丢失。
- 当设置为 `1`，该模式是最安全的，但也是最慢的一种方式。
  在 `mysqld` 服务崩溃或者服务器主机crash的情况下，binary log 只有可能丢失最多一个语句或者一个事务。。
- 当设置为 `2`，该模式速度较快，也比 `0` 安全，只有在操作系统崩溃或者系统断电的情况下，上一秒钟所有事务数据才可能丢失。

实际测试发现，该值对插入数据的速度影响非常大，设置为 `2` 时插入 10000 条记录只需要两秒，
设置为 `0` 时，只需要一秒，
设置为 `1` 时，则需要 229 秒。
因此，MySQL 手册也建议尽量将插入操作合并成一个事务，这样可以大幅度提高速度。

## innodb_doublewrite 双写操作

同一份数据写入两次,保证数据存在一个副本,预防数据因为介质问题产生丢失

```text
SHOW GLOBAL VARIABLES LIKE 'innodb_doublewrite';
```

```text
mysql> SHOW GLOBAL VARIABLES LIKE 'innodb_doublewrite';
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| innodb_doublewrite | ON    |
+--------------------+-------+
1 row in set (0.00 sec)
```

## innodb_file_per_table=1

设置独立表空间文件 `xxx.ibd`

```text
SHOW VARIABLES LIKE 'innodb_file_per_table';
```

```text
mysql> SHOW VARIABLES LIKE 'innodb_file_per_table';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| innodb_file_per_table | ON    |
+-----------------------+-------+
1 row in set (0.00 sec)
```

## innodb_thread_concurrency

设置 InnoDB 线程的并发数，默认值为 `0` 表示不被限制；
若要设置，则与服务器的 CPU 核心数相同或是 CPU 的核心数的 2 倍。

```text
SHOW GLOBAL VARIABLES LIKE 'innodb_thread_concurrency';
```

```text
mysql> SHOW GLOBAL VARIABLES LIKE 'innodb_thread_concurrency';
+---------------------------+-------+
| Variable_name             | Value |
+---------------------------+-------+
| innodb_thread_concurrency | 0     |
+---------------------------+-------+
1 row in set (0.00 sec)
```
