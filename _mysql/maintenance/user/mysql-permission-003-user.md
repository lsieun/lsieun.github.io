---
title: "MySQL：用户管理"
sequence: "103"
---


## 查看用户账户

查看当前用户的身份：

```mysql
SELECT USER();
```

```text
mysql> select user();
+----------------+
| user()         |
+----------------+
| root@localhost |
+----------------+
1 row in set (0.00 sec)
```

```text
mysql> select current_user();
+----------------+
| current_user() |
+----------------+
| root@localhost |
+----------------+
1 row in set (0.00 sec)
```

- `user()` 函数返回 MySQL 连接的当前用户名和主机名，即用来显示当前登陆的用户名与它对应的 host。
- `currrent_user()` 是用来显示当前登陆用户对应在 user 表中的哪一个。

需要说明一点的是，`user()` 是一个函数，不是 SQL 语句的一部分（意味着到其他数据库中是无法使用的）。

```text
mysql> select user();
+-----------------+
| user()          |
+-----------------+
| jinma@localhost |
+-----------------+
1 row in set (0.00 sec)

mysql> select current_user();
+----------------+
| current_user() |
+----------------+
| jinma@%        |
+----------------+
1 row in set (0.00 sec)
```

```mysql
USE mysql;
SELECT `User`,`Host` FROM `user`;
```

```text
mysql> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> select user,host from user;
+------------------+-----------+
| user             | host      |
+------------------+-----------+
| liusen           | %         |
| root             | %         |
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
+------------------+-----------+
6 rows in set (0.00 sec)
```

这里需要注意，下面两条数据是属于不同的账号，它们可以各自的密码：

```text
| root             | %         |
| root             | localhost |
```

## 用户账号

In MySQL, a user account consists of a **user name** and **hostname** parts.
`jabba@localhost` and `jabba@10.10.8.8` are different user accounts.

## 创建 MySQL 账号

```text
use mysql;
create user tom@'192.168.80.%';
```

```text
mysql> use mysql;
Database changed
mysql> create user tom@'192.168.80.%';
Query OK, 0 rows affected (0.02 sec)

mysql> select user,host from user;
+------------------+--------------+
| user             | host         |
+------------------+--------------+
| liusen           | %            |
| root             | %            |
| tom              | 192.168.80.% |
| mysql.infoschema | localhost    |
| mysql.session    | localhost    |
| mysql.sys        | localhost    |
| root             | localhost    |
+------------------+--------------+
7 rows in set (0.01 sec)
```

如果创建用户时，使用 `create user 用户名`，那么这个用户可以在任意的 IP 地址登录：

```text
mysql> create user wang;
Query OK, 0 rows affected (0.01 sec)

mysql> select user,host from user;
+------------------+--------------+
| user             | host         |
+------------------+--------------+
| liusen           | %            |
| root             | %            |
| wang             | %            |
| tom              | 192.168.80.% |
| mysql.infoschema | localhost    |
| mysql.session    | localhost    |
| mysql.sys        | localhost    |
| root             | localhost    |
+------------------+--------------+
8 rows in set (0.00 sec)
```

这里只是创建了新的 MySQL 用户，而没有设置密码，因此只需要输入用户名就可以登录，不需要输入密码。

## 设置用户密码

Type the following commands if you have MySQL 5.7.6 and later or MariaDB 10.1.20 and later:

```text
ALTER USER 'user-name'@'localhost' IDENTIFIED BY 'NEW_USER_PASSWORD';
FLUSH PRIVILEGES;
```

```text
ALTER USER 'tom'@'192.168.80.%' IDENTIFIED BY '123456';
FLUSH PRIVILEGES;
```

If `ALTER USER` statement doesn't work for you, you can modify the user table directly:

```text
UPDATE mysql.user SET authentication_string = PASSWORD('NEW_USER_PASSWORD')
WHERE User = 'user-name' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

Type the following commands if you have MySQL 5.7.5 and earlier or MariaDB 10.1.20 and earlier:

```text
SET PASSWORD FOR 'user-name'@'localhost' = PASSWORD('NEW_USER_PASSWORD');
FLUSH PRIVILEGES;
```

```text
set password for 'tom'@'192.168.80.%'=password('123456');
```

## 创建用户时指定密码

```text
create user jerry@'192.168.80.%' identified by '123456';
```

```text
mysql> create user jerry@'192.168.80.%' identified by '123456';
Query OK, 0 rows affected (0.02 sec)

mysql> select user,host from user;
+------------------+--------------+
| user             | host         |
+------------------+--------------+
| liusen           | %            |
| root             | %            |
| wang             | %            |
| jerry            | 192.168.80.% |
| tom              | 192.168.80.% |
| mysql.infoschema | localhost    |
| mysql.session    | localhost    |
| mysql.sys        | localhost    |
| root             | localhost    |
+------------------+--------------+
9 rows in set (0.00 sec)
```

## grant 方式创建用户

```text
grant select on mybatis_plus.* to chen@'192.168.80.%' identified by '123456';
```

```text
insert into mysql.user(user,host,password) values ('luo', '192.168.80.%', password('123456');
```

## 匿名账号

删除匿名账号：

```text
use mysql;
select user,host from user;
delete from user where user='';
```

注意：删除匿名账号之后，发现还能登录，是因为 MySQL 一开始就读取了所有信息，需要重启一个 MySQL 服务：

```text
service mysqld restart
```





## Reference

- [How to Delete MySQL Users Accounts](https://linuxize.com/post/how-to-delete-mysql-user-accounts/)
