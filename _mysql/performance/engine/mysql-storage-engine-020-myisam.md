---
title: "MyISAM 存储引擎"
sequence: "120"
---

## MyISAM 特点

- 事务：不支持事务
- 锁：表级锁，混合读写性能不佳，并发性差
- 性能：紧密存储，顺序读性能很好
- 全文检查：支持全文检索，支持text支持前缀索引
- 数据压缩：支持数据压缩

## 数据存储

存储引擎是 MyISAM，在 `data` 目录下会看到 3 类文件：`.frm`、`.myi`、`.myd`

- `*.frm`：表定义，是描述表结构的文件。
- `*.MYD`："D"数据信息文件，是表的数据文件。
- `*.MYI`："I"索引信息文件，是表数据文件中任何索引的数据树

![](/assets/images/db/mysql/storage/windows-storage-data-directory-myisam.png)


### 实践

第 1 步，创建数据表：

```text
CREATE TABLE myisam_test(id int, name VARCHAR(16)) ENGINE MYISAM;
```

第 2 步，添加数据：

```mysql
BEGIN;
INSERT INTO myisam_test(id, name) VALUE (1, '张三');
ROLLBACK;
```

注意：MyIASM 是不支持事务的，所以 `ROLLBACK` 是不成功的。

第 3 步，查询数据：

```text
SELECT * FROM myisam_test;
```

```text
mysql> use testdb;
Database changed
mysql> SELECT * FROM myisam_test;
+------+--------+
| id   | name   |
+------+--------+
|    1 | 张三   |
+------+--------+
1 row in set (0.00 sec)
```

## MyISAM 应用场景

- **非事务应用**，例如，保存日志
- **只读类应用**，报表数据，字典数据
- 空间类应用，开发GIS系统(5.7版本以前)
- 系统临时表，SQL查询，分组的临时表引擎
