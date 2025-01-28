---
title: "MySQL"
sequence: "101"
---

MySQL 权限控制通过两步控制：

- 第一步，能不能连接（验证用户身份）
- 第二步，能执行什么操作（验证用户权限）

验证用户身份，需要验证：连接 MySQL 的计算机的 IP 地址或计算机名称、用户账户和密码。

- 先验证客户端的 IP 地址
- 再验证客户端的用户名和密码

如果是 `192.168.80.%`，表示 `192.168.80` 网段的所有 IP 地址都可以访问。

## 常用 SQL 语句

```text
CREATE USER 'user-name'@'localhost' IDENTIFIED BY 'NEW_USER_PASSWORD';
FLUSH PRIVILEGES;
```

```text
create user '[USERNAME]'@'%' identified with mysql_native_password by '[PASSWORD]';
```

```text
GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';
```

