---
title: "Memory 存储引擎"
sequence: "130"
---

## Memory 存储引擎的特点

- 事务：不支持事务
- 存储：内存读写，临时存储
- 性能：超高的读写效率，比 MyISAM 高一个量级
- 锁粒度：表级锁，并发性差

## Memory 应用场景

- 读多写少的静态数据，例如省市县的对应表
- 充当缓存使用，保存高频访问静态数据
- 系统临时表


## 实践

```mysql
CREATE TABLE memory_test(id int, name VARCHAR(16)) ENGINE MEMORY;
```

```text
INSERT INTO memory_test(id, name) VALUE (1, '张三');
```

```text
SELECT * FROM memory_test;
```

```text
mysql> SELECT * FROM memory_test;
+------+--------+
| id   | name   |
+------+--------+
|    1 | 张三   |
+------+--------+
1 row in set (0.00 sec)
```

![](/assets/images/db/mysql/storage/windows-storage-data-directory-memory.png)

## Memory 关键参数

- 设置 `max_heap_table_size` 控制内存表大小(字节)
- 设置 `tmp_table_size` 设置内存临时表最大值(字节)

```mysql
SHOW VARIABLES LIKE 'max_heap_table_size';
SHOW VARIABLES LIKE 'tmp_table_size';
```

```text
mysql> SHOW VARIABLES LIKE 'max_heap_table_size';
+---------------------+----------+
| Variable_name       | Value    |
+---------------------+----------+
| max_heap_table_size | 16777216 |
+---------------------+----------+
1 row in set, 1 warning (0.01 sec)

mysql> SHOW VARIABLES LIKE 'tmp_table_size';
+----------------+----------+
| Variable_name  | Value    |
+----------------+----------+
| tmp_table_size | 60817408 |
+----------------+----------+
1 row in set, 1 warning (0.01 sec)
```

```mysql
# 2G，内存表最大长度由业务和硬件来决定，数据超过上限，就会报错
# SET GLOBAL ，只会对当前 MySQL 实例生效，重启后会失效
# 修改之后，没有生效，可以断开连接，重新连接，再进行查询
SET GLOBAL max_heap_table_size = 2147483648;
```


如果要进行永久修改，需要修改配置文件：

```text
vi /etc/my.cnf
```

```text
[mysqld]
max_heap_table_size = 2048M
```

