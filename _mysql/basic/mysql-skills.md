---
title: "MySQL 常用技巧"
sequence: "116"
---

## 数据库执行脚本生成实体类信息

## 获取汉字首拼音（包含特殊符号）函数

## MySQL 生成数据字典

```text
USE information_schema;

SELECT
  c.COLUMN_NAME AS '字段名',
  c.COLUMN_TYPE AS '数据类型',
  c.IS_NULLABLE AS '允许为空',
  c.COLUMN_DEFAULT AS '默认值',
  c.EXTRA AS 'PK',
  c.COLUMN_COMMENT AS '字段说明'
FROM COLUMNS c
  INNER JOIN TABLES t
    ON c.TABLE_SCHEMA = t.TABLE_SCHEMA
    AND t.TABLE_NAME = t.TABLE_NAME
WHERE t.TABLE_SCHEMA = 'db_name'
AND t.TABLE_NAME = 'table_name';
```

## Excel 生成 insert 语句


