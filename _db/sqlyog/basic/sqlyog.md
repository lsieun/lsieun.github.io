---
title: "SQLyog"
sequence: "101"
---

- In MySQL 5.7, the default authentication plugin is `mysql_native_password`.
- As of MySQL 8.0, the default authentication plugin is changed to `caching_sha2_password`.

```text
create user '[USERNAME]'@'%' identified with mysql_native_password by '[PASSWORD]';
```

```text
create user 'liusen'@'%' identified with mysql_native_password by '123456';
```

If you want to keep the "fancy" caching_sha2_password credential plugin,
you may upgrade (if you are able) your SQLyog to 13.1.3 or later.


