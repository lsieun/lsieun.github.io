---
title: "MySQL 8"
sequence: "103"
---

## Docker

To run the MySQL 8.0 container using the official image, simply run the following command:

```text
mkdir /tmp/mysql-data
docker run --name basic-mysql --rm -v /tmp/mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=testing -p 3306:3306 -it mysql:8.3.0
```

```text
docker run --name basic-mysql --rm \
-v /tmp/mysql-data:/var/lib/mysql \
-v /etc/timezone:/etc/timezone:ro \
-v /etc/localtime:/etc/localtime:ro \
-e MYSQL_ROOT_PASSWORD=123456 \
-e MYSQL_DATABASE=testing \
-p 3306:3306 -it mysql:8.3.0
```

```text
docker run --name basic-mysql --rm -v /tmp/mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=testing -p 3306:3306 -d mysql:8.0
```

Let's analyze the command we just ran to run MySQL with docker.
First, we created a directory called `mysql-data` in `/tmp` to store the data of MySQL.
Then we ran a docker run command with:

- `--name` to name the container basic-mysql
- `--rm` to remove the container when it is stopped
- `-v /tmp/mysql-data:/var/lib/mysql` is added to retain the data when the container restarts, it will vanish when the host machine restarts as it is in `/tmp`
- `-e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=testing` for setting the root user's password and initializing a database named `testing`
- `-p 3306:3306` maps host port `3306` to container port `3306`, the port `3306` is MySQL's default port.
- `-it mysql:8.0` - -it will show all logs, and we are using the official MySQL image version 8.0 which will run the Debian flavor.

As the MySQL server is running we can execute the MySQL command inside the container with:

```text
docker exec -it basic-mysql /bin/bash
#once inside the container 
mysql -uroot -p
#put/paste the password, and once inside MySQL CLI run
show databases;
```

We can stop the container with `docker stop basic-mysql`.



## Docker Compose

### 无存储

File: `compose.yaml`

```text
services:
  mysql:
    container_name: mysql8
    image: mysql:8.3.0
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      TZ: Asia/Shanghai
    restart: always
    ports:
      - 3306:3306
```

### 有存储

```text
mkdir /opt/mysql-data
```

File: `compose.yaml`

```text
services:
  mysql:
    container_name: mysql8
    image: mysql:8.3.0
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      TZ: Asia/Shanghai
    restart: always
    ports:
      - 3306:3306
    volumes:
      - /opt/mysql-data:/var/lib/mysql
```

```text
services:
  mysql:
    container_name: mysql8
    image: mysql:8.3.0
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_USER: liusen
      MYSQL_PASSWORD: abc123
      MYSQL_DATABASE: testing
      TZ: Asia/Shanghai
    restart: always
    ports:
      - 3306:3306
    volumes:
      - /opt/mysql-data:/var/lib/mysql
```

```text
services:
  mysql:
    container_name: mysql8
    image: mysql:8.3.0
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_USER=liusen
      - MYSQL_PASSWORD=abc123
      - MYSQL_DATABASE=testing
      - TZ=Asia/Shanghai
    restart: always
    ports:
      - 3306:3306
    volumes:
      - /opt/mysql-data:/var/lib/mysql
```

## 测试

```text
create database testing;
use testing;
create table user (id int, name varchar(32), dob datetime default current_timestamp);
insert into user (id, name) values (1, 'liusen');
```

```text
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| performance_schema |
| testing            |
+--------------------+
3 rows in set (0.01 sec)

mysql> use testing;
Database changed
mysql> create table user(
    -> id int,
    -> name varchar(32),
    -> dob datetime default current_timestamp
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql> insert into user (id, name) values (1, 'liusen');
Query OK, 1 row affected (0.00 sec)

mysql> select * from user;
+------+--------+---------------------+
| id   | name   | dob                 |
+------+--------+---------------------+
|    1 | liusen | 2023-02-11 09:31:05 |
+------+--------+---------------------+
1 row in set (0.00 sec)

mysql> exit
```
