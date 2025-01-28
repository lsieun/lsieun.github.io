---
title: "MySQL Cluster"
sequence: "105"
---

## MySQL - Master

第 1 步，新建 Master 容器实例 3307：

```text
docker run -p 3307:3306 --name mysql-master \
-v /opt/mysql-master/log:/var/log/mysql \
-v /opt/mysql-master/data:/var/lib/mysql \
-v /opt/mysql-master/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
```

第 2 步，进入 `/opt/mysql-master/conf` 目录，新建 `my.cnf` 文件：

```text
cd /opt/mysql-master/conf
vi my.cnf
```

```text
[mysqld]
## 设置 server_id，同一局域网中需要唯一
server_id=101
## 指定不需要同步的数据库名称
binlog-ignore-db=mysql
## 开启二进制日志功能
log-bin=mall-mysql-bin
## 设置二进制日志使用内存大小（事务）
binlog_cache_size=1M
## 设置使用的二进制日志格式（mixed，statement，row）
binlog_format=mixed
## 二进制日志过期清理时间。默认值为 0，表示不自动清理
expire_logs_days=7
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免Slave端复制中断
## 如：1062错误是指一些主键重复，1032错误是因为主从数据不一致
slave_skip_errors=1062
```

第 3 步，修改完配置后重启 `mysql-master` 实例

```text
docker restart mysql-master
```

第 4 步，进入` mysql-master` 容器

```text
docker exec -it mysql-master /bin/bash
```

验证是否可以登录成功：

```text
mysql -u root -p root
```

第 5 步，在 `mysql-master` 容器实例内，创建数据同步用户

```text
# 创建用户
CREATE USER 'slave'@'% IDENTIFIED BY '123456';

# 授予权限
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'slave'@'%';
```

## MySQL - Slave

第 1 步，新建 `mysql-slave` 容器实例 3308

```text
docker run -p 3308:3306 --name mysql-slave \
-v /opt/mysql-slave/log:/var/log/mysql \
-v /opt/mysql-slave/data:/var/lib/mysql \
-v /opt/mysql-slave/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
```

第 2 步，进入 `/opt/mysql-master/conf` 目录，新建 `my.cnf` 文件：

```text
cd /opt/mysql-master/conf
vi my.cnf
```

```text
[mysqld]
## 设置 server_id，同一局域网中需要唯一
server_id=102
## 指定不需要同步的数据库名称
binlog-ignore-db=mysql
## 开启二进制日志功能
log-bin=mall-mysql-slave1-bin
## 设置二进制日志使用内存大小（事务）
binlog_cache_size=1M
## 设置使用的二进制日志格式（mixed，statement，row）
binlog_format=mixed
## 二进制日志过期清理时间。默认值为 0，表示不自动清理
expire_logs_days=7
## 跳过主从复制中遇到的所有错误或指定类型的错误，避免Slave端复制中断
## 如：1062错误是指一些主键重复，1032错误是因为主从数据不一致
slave_skip_errors=1062
## relay_log 配置中断日志
relay_log=mall-mysql-relay-bin
## log_slave_updates 表示 slave 将复制事件写进自己的二进制日志
log_slave_updates=1
## slave 设置为只读 （具有 super 权限的用户除外）
read_only=1
```

第 3 步，修改完配置后重启 `mysql-slave` 实例

```text
docker restart mysql-slave
```

第 4 步，在 `mysql-master` 数据库中查看主从同步状态

```text
mysql> show master status
```

第 5 步，进入 `mysql-slave` 容器

```text
docker exec -it mysql-slave /bin/bash
```

验证是否可以登录成功：

```text
mysql -u root -p root
```

第 6 步，在 `mysql-slave` 数据库中配置主从复制

```text
mysql > change master to master_host='192.168.111.163', master_user='slave', master_password='123456',
master_port=3307, master_log_file='mall-mysql-bin.000001', master_log_pos=617, master_connect_retry=30;
```

第 7 步，在 `mysql-slave` 数据库中查看主从同步状态

```text
show slave status;
```

或

```text
show slave status \G;
```

第 8 步，在 `mysql-slave` 数据库中开启主从同步

```text
mysql> start slave;
```

第 9 步，查看 `mysql-slave` 数据库状态，发现已经同步

```text
show slave status \G;
```

第 10 步，主从复制测试
