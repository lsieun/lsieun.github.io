---
title: "数据表（Table）"
sequence: "102"
---

```text
USE database_name;
SHOW TABLES;
```

```text
mysql> use mybatis_plus;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+------------------------+
| Tables_in_mybatis_plus |
+------------------------+
| product                |
| user                   |
+------------------------+
2 rows in set (0.00 sec)
```

The optional `FULL` modifier will show the table type as a second output column.

```text
SHOW FULL TABLES;
```

```text
mysql> show full tables;
+------------------------+------------+
| Tables_in_mybatis_plus | Table_type |
+------------------------+------------+
| product                | BASE TABLE |
| user                   | BASE TABLE |
+------------------------+------------+
2 rows in set (0.00 sec)
```

To get a list of the tables without switching to the database,
use either the `FROM` or `IN` clause followed by the database name:

```text
SHOW TABLES FROM database_name;
```

```text
mysql> show tables from mybatis_plus;
+------------------------+
| Tables_in_mybatis_plus |
+------------------------+
| product                |
| user                   |
+------------------------+
2 rows in set (0.01 sec)
```

The `LIKE` clause can be used to filter the output of the `SHOW TABLES` command according to a specific pattern.

```text
SHOW TABLES LIKE pattern;
```

```text
SHOW TABLES LIKE 'permissions%';
```

The percent sign (`%`) means zero, one, or multiple characters.

## Reference

- [List (Show) Tables in a MySQL Database](https://linuxize.com/post/show-tables-in-mysql-database/)
