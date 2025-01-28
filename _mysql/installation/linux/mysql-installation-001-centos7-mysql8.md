---
title: "CentOS7 + MySQL8"
sequence: "101"
---

## Install MySQL 8.0 on CentOS 7

- [MySQL Yum Repository](https://dev.mysql.com/downloads/repo/yum/)

```text
sudo yum localinstall https://repo.mysql.com//mysql80-community-release-el7-7.noarch.rpm
```

```text
sudo yum install mysql-community-server
```

During the installation yum may prompt you to import the MySQL GPG key.
Type `y` and hit `Enter`.

安装客户端：

```text
$ sudo yum -y install mysql
```

安装服务端：

```text
$ sudo yum -y install mysql-server
```

## Starting MySQL

启动 MySQL 服务，并设置为开机启动：

```text
sudo systemctl enable mysqld
sudo systemctl start mysqld
```

检查 MySQL 服务的状态：

```text
systemctl status mysqld
```

## Securing MySQL

When the MySQL server is started for the first time,
a temporary password is generated for the MySQL root user.
You can find the password by running the following command:

```text
sudo grep 'temporary password' /var/log/mysqld.log
```

```text
$ sudo grep 'temporary password' /var/log/mysqld.log
2023-01-05T13:00:17.019355Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: iJjt)gOMT5w3
```

Make note of the password,
because the next command will ask you to enter the temporary root password.

Run the `mysql_secure_installation` command to improve the security of our MySQL installation:

```text
sudo mysql_secure_installation
```

```text
$ sudo mysql_secure_installation

Securing the MySQL server deployment.

Enter password for user root:
```

After entering the temporary password you will be asked to set a new password for user root.
The password needs to be at least 8-characters long and to contain at least one uppercase letter,
one lowercase letter, one number, and one special character.

```text
The existing password for the user account root has expired. Please set a new password.

New password: 2023@Mysql.com
```

The script will also ask you to remove the anonymous user,
restrict root user access to the local machine and remove the test database.
You should answer “Y” (yes) to all questions.

## Connecting to MySQL from the command line

To log in to the MySQL server as the root user type:

```text
mysql -u root -p
```

## Reference

- [MySQL Community Downloads](https://dev.mysql.com/downloads/)
  - [MySQL Yum Repository](https://dev.mysql.com/downloads/repo/yum/)
- [Install MySQL on CentOS 7](https://linuxize.com/post/install-mysql-on-centos-7/)
