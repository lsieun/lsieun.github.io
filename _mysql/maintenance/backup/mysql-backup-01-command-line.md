---
title: "MySQL 命令行备份与还原"
sequence: "101"
---

## datadir

```text
mysql> show variables like '%datadir%';
+---------------+---------------------------------------------+
| Variable_name | Value                                       |
+---------------+---------------------------------------------+
| datadir       | C:\ProgramData\MySQL\MySQL Server 8.0\Data\ |
+---------------+---------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

每个数据库对应一个文件夹：

![](/assets/images/db/mysql/mysql-windows-data-dir.png)

## my.cnf/my.ini

- [mysql my.cnf 在哪里 _my.cnf 配置文件在哪 ](https://blog.csdn.net/weixin_39588983/article/details/113282892)

`my.cnf` 配置文件在 Linux 上是位于路径 `/etc/my.cnf` 下，在 Window 上则位于安装目录的根目录下；

可以使用命令 `mysql --help` 查看关于 MYSQL 对应配置文件 `my.cnf` 搜索顺序。

一般， Linux 上都放在 `/etc/my.cnf`，Window 上安装都是默认可能按照上面的路径还是没找到，
Window 上可以登录到 Mysql 中 使用 `show variables like '%data%'` 先找到 `datadir` 存放路径， 一般 `my.ini` 在 data 文件的上一级。

win 下的是 `my.ini`，一般会在安装目录的根目录。


```text
> mysql --help
...
Default options are read from the following files in the given order:
C:\Windows\my.ini C:\Windows\my.cnf C:\my.ini C:\my.cnf C:\Program Files\MySQL\MySQL Server 8.0\my.ini C:\Program Files\MySQL\MySQL Server 8.0\my.cnf
...
```

![](/assets/images/db/mysql/mysql-windows-mysql-ini-location.png)

![](/assets/images/db/mysql/mysql-windows-mysql-ini-datadir.png)

```text
mysql> show variables like 'collation%';
+----------------------+--------------------+
| Variable_name        | Value              |
+----------------------+--------------------+
| collation_connection | gbk_chinese_ci     |
| collation_database   | utf8mb4_0900_ai_ci |
| collation_server     | utf8mb4_0900_ai_ci |
+----------------------+--------------------+
3 rows in set, 1 warning (0.00 sec)
```

## 备份和还原一个表

备份：

```text
mysqldump -uroot -p"123456" my_batis_db t_user > C:\Users\1\t_user.sql
```

```text
mysqldump -ujinma -p"123456" jm_dma_db biz_district > E:\Data\mysql\biz_district.sql
```

还原：

```text
mysql -uroot -p123456 my_batis_db < C:\Users\1\t_user.sql
```

## 备份和还原多个表

```text
mysqldump -uroot -p"123456" mybatis_plus tablea tableb > C:\Users\1\t_tableab.sql
```

## 按条件备份

```text
mysqldump -uroot -p123456 my_batis_db t_user --where "username like '%y'" --no-create-info > E:\Data\mysql\t_user_2.sql
```

```text
mysqldump -uroot -p123456 my_batis_db t_user --where "username = 'jerry'" --no-create-info > E:\Data\mysql\t_user_3.sql
```

## 备份一个数据库

```text
mysqldump -uroot -p"123456" jm_dma_db > E:\Data\mysql\jm_dma_db_2023_01_05.sql
```

## 备份多个数据库

```text
mysqldump -uroot -p"123456" --databases my_batis_db mybatis_plus > E:\Data\mysql\two_db.sql
```

## 备份所有的数据库

备份：

```text
mysqldump -uroot -p"123456" --all-databases > E:\Data\mysql\all_db.sql
```

还原：

```text
mysql -uroot -p123456 < E:\Data\mysql\all_db.sql
```

## 远程备份和还原

```text
mysql -uroot -p123456 -h 192.168.80.22 mydb > E:\Data\mysql\mydb.sql
```

## options

Dumping structure and contents of MySQL databases and tables.

Usage: 

```text
mysqldump [OPTIONS] database [tables]
mysqldump [OPTIONS] --databases [OPTIONS] DB1 [DB2 DB3...]
mysqldump [OPTIONS] --all-databases [OPTIONS]
```


- `-B`, `--databases`: Dump several databases. Note the difference in usage; in
  this case no tables are given. All name arguments are regarded as database names. 'USE db_name;' will be
  included in the output.
- `-n`, `--no-create-db`: Suppress the `CREATE DATABASE ... IF EXISTS` statement
  that normally is output for each dumped database if `--all-databases` or `--databases` is given.


