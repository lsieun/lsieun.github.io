---
title: "root 用户"
sequence: "102"
---

## ROOT

```text
-- 创建用户
CREATE USER 'root'@'%' IDENTIFIED BY '2023@Mysql.com';
-- 授权
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;
```
