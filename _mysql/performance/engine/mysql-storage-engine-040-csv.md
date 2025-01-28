---
title: "CSV 存储引擎"
sequence: "140"
---

## CSV 存储引擎特点

- 存储：纯文本保存
- 事务：不支持事务
- 索引：不支持索引

## CSV 应用场景

- 数据交换/数据迁移
- 不依赖MySQL环境

## 实践

错误示例：

```mysql
CREATE TABLE csv_test(id int, name VARCHAR(16)) ENGINE CSV;
```

报错信息如下：

```text
mysql> CREATE TABLE csv_test(id int, name VARCHAR(16)) ENGINE CSV;
ERROR 1178 (42000): The storage engine for the table doesn't support nullable columns
```

正确示例：

```text
CREATE TABLE csv_test(id int NOT NULL, name VARCHAR(16) NOT NULL) ENGINE CSV;
```

```mysql
INSERT INTO csv_test(id, name) VALUE (1, '张三');
```

```mysql
SELECT * FROM csv_test;
```

```text
mysql> SELECT * FROM csv_test;
+----+--------+
| id | name   |
+----+--------+
|  1 | 张三   |
+----+--------+
1 row in set (0.00 sec)
```

![](/assets/images/db/mysql/storage/windows-storage-data-directory-csv.png)
