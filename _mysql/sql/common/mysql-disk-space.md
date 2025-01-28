---
title: "Disk Space 数据占用的空间大小"
sequence: "102"
---

切换数据库

```text
use information_schema;
```

查看数据库使用大小

```text
select concat(round(sum(data_length/1024/1024),2),'MB') as data from tables where table_schema='DB_Name';
```

查看表使用大小

```text
SELECT
	concat(ROUND(SUM(data_length / 1024 / 1024), 2), 'MB') AS data
FROM
	tables
WHERE
	table_schema = 'DB_Name'
	AND table_name = 'Table_Name';
```

查看指定数据库各表容量大小

```text
SELECT table_schema AS '数据库', table_name AS '表名', table_rows AS '记录数',
TRUNCATE(data_length / 1024 / 1024, 2) AS '数据容量(MB)',
TRUNCATE
	(index_length / 1024 / 1024, 2) AS '索引容量(MB)'
FROM
	information_schema.tables
WHERE
	table_schema = 'DB_Name'
ORDER BY
	data_length DESC,
	index_length DESC;
```

## Reference

- [MySQL查看表占用空间大小](https://blog.csdn.net/wwd0501/article/details/112617034)
- [MySQL查看数据库、表占用磁盘大小](https://www.cnblogs.com/xiaoxi-jinchen/p/16967024.html)
