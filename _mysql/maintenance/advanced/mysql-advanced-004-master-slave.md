---
title: "主从数据同步（Master-Slave）"
sequence: "104"
---

## 准备环境

### Master 数据库

第 1 步，添加 `my.ini` 文件：

```text
[mysqld]
port=3310
server-id=1000
log-bin=mysql-bin
```

第 2 步，启动 MySQL：

```text
> mysqld --console
```

### Slave 数据库

第 1 步，添加 `my.ini` 文件：

```text
[mysqld]
port=3311
server-id=1001
log-bin=mysql-bin
```

第 2 步，启动 MySQL：

```text
> mysqld --console
```

## 配置主从关系

### Master 数据库

第 1 步，登录 Master 数据库：

```text
>mysql -u root -p --port 3310
```

第 2 步，创建 `devops` 用户，并分配权限：

```text
# 创建一个 devops 用户，% 是 Slave 服务器的 IP 地址
CREATE USER 'devops'@'%' IDENTIFIED BY '123456';

# 为 devops 用户授予主从复制的权限
GRANT replication SLAVE ON *.* to 'devops'@'%';

# 激活权限
FLUSH PRIVILEGES;
```

```text
mysql> CREATE USER 'devops'@'%' IDENTIFIED BY '123456';
Query OK, 0 rows affected (0.03 sec)

mysql> GRANT replication SLAVE ON *.* to 'devops'@'%';
Query OK, 0 rows affected (0.01 sec)

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.01 sec)
```

第 3 步，查看 Master 数据库的状态：

```text
SHOW MASTER STATUS;
```

```text
mysql> SHOW MASTER STATUS;
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000001 |      860 |              |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
1 row in set, 1 warning (0.00 sec)
```

在上面的输出结果中，

- `mysql-bin.000001` 是保存的日志文件
- `Position` 为 `860`，则表示偏移量

![](/assets/images/db/mysql/maintenance/master-slave/data-mysql-bin-000001.png)

第 4 步，查看日志文件里记录的事件：

```mysql
SHOW BINLOG EVENTS IN 'mysql-bin.000001';
```

```text
mysql> SHOW BINLOG EVENTS IN 'mysql-bin.000001';
+------------------+-----+----------------+-----------+-------------+---------------------------------
| Log_name         | Pos | Event_type     | Server_id | End_log_pos | Info                            
+------------------+-----+----------------+-----------+-------------+---------------------------------
| mysql-bin.000001 |   4 | Format_desc    |      1000 |         126 | Server ver: 8.2.0, Binlog ver: 4
| mysql-bin.000001 | 126 | Previous_gtids |      1000 |         157 |                                 
| mysql-bin.000001 | 157 | Anonymous_Gtid |      1000 |         236 | SET @@SESSION.GTID_NEXT= 'ANONYM...
| mysql-bin.000001 | 236 | Query          |      1000 |         471 | CREATE USER 'devops'@'%' IDENTIF...
| mysql-bin.000001 | 471 | Anonymous_Gtid |      1000 |         548 | SET @@SESSION.GTID_NEXT= 'ANONYM...
| mysql-bin.000001 | 548 | Query          |      1000 |         693 | GRANT REPLICATION SLAVE ON *.* T...
| mysql-bin.000001 | 693 | Anonymous_Gtid |      1000 |         770 | SET @@SESSION.GTID_NEXT= 'ANONYM...
| mysql-bin.000001 | 770 | Query          |      1000 |         860 | FLUSH PRIVILEGES                
+------------------+-----+----------------+-----------+-------------+---------------------------------
8 rows in set (0.00 sec)
```

第 5 步，创建一个 `testdb` 数据库，查看日志事件 和 状态的变化：

```text
CREATE DATABASE `testdb`;
SHOW BINLOG EVENTS IN 'mysql-bin.000001';
SHOW MASTER STATUS;
```

```text
mysql> CREATE DATABASE `testdb`;
Query OK, 1 row affected (0.01 sec)

mysql> SHOW BINLOG EVENTS IN 'mysql-bin.000001';
+------------------+-----+----------------+-----------+-------------+---------------------------------
| Log_name         | Pos | Event_type     | Server_id | End_log_pos | Info                            
+------------------+-----+----------------+-----------+-------------+---------------------------------
| mysql-bin.000001 |   4 | Format_desc    |      1000 |         126 | Server ver: 8.2.0, Binlog ver: 4
| mysql-bin.000001 | 126 | Previous_gtids |      1000 |         157 |                                 
| mysql-bin.000001 | 157 | Anonymous_Gtid |      1000 |         236 | SET @@SESSION.GTID_NEXT= 'ANONYM...
| mysql-bin.000001 | 236 | Query          |      1000 |         471 | CREATE USER 'devops'@'%' IDENTIF...
| mysql-bin.000001 | 471 | Anonymous_Gtid |      1000 |         548 | SET @@SESSION.GTID_NEXT= 'ANONYM...
| mysql-bin.000001 | 548 | Query          |      1000 |         693 | GRANT REPLICATION SLAVE ON *.* T...
| mysql-bin.000001 | 693 | Anonymous_Gtid |      1000 |         770 | SET @@SESSION.GTID_NEXT= 'ANONYM...
| mysql-bin.000001 | 770 | Query          |      1000 |         860 | FLUSH PRIVILEGES                
| mysql-bin.000001 | 860 | Anonymous_Gtid |      1000 |         937 | SET @@SESSION.GTID_NEXT= 'ANONYM...
| mysql-bin.000001 | 937 | Query          |      1000 |        1053 | CREATE DATABASE `testdb` /* xid=...
+------------------+-----+----------------+-----------+-------------+---------------------------------
10 rows in set (0.00 sec)

mysql> SHOW MASTER STATUS;
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000001 |     1053 |              |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
1 row in set, 1 warning (0.00 sec)
```

### Slave 数据库

第 1 步，连接数据库：

```text
mysql -u root -p --port 3311
```

第 2 步，建立与 Master 之间的关系：

```text
CHANGE MASTER TO
MASTER_HOST='127.0.0.1',
MASTER_PORT=3310,
MASTER_USER='devops',
MASTER_PASSWORD='123456',
MASTER_LOG_FILE='mysql-bin.000001',
MASTER_LOG_POS=862;
```

```text
mysql> CHANGE MASTER TO
    -> MASTER_HOST='192.168.1.100',
    -> MASTER_PORT=3310,
    -> MASTER_USER='devops',
    -> MASTER_PASSWORD='123456',
    -> MASTER_LOG_FILE='mysql-bin.000001',
    -> MASTER_LOG_POS=860;
Query OK, 0 rows affected, 8 warnings (0.04 sec)
```

第 3 步，开始主从复制：

```mysql
START SLAVE;
```

```text
mysql> START SLAVE;
Query OK, 0 rows affected, 1 warning (0.02 sec)
```

第 4 步，查看 Slave 服务器的状态：

```mysql
SHOW SLAVE STATUS;
```
