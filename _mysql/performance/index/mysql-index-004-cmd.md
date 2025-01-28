---
title: "索引的相关命令"
sequence: "104"
---


## 查看索引

```text
SHOW INDEX FROM <table_name>;
```

## 创建索引



在 MySQL 中，可以使用 `CREATE INDEX` 语句来创建索引。

```text
CREATE INDEX <index_name> ON <table_name>(<column_name>);
```

```text
CREATE TABLE users (
    id INT PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    age INT,
    email VARCHAR(100)
);
```

```text
INSERT INTO users (id, firstname, lastname, age, email) VALUES
(1, 'Alice', 'Smith', 25, 'alice.smith@example.com'),
(2, 'Bob', 'Johnson', 30, 'bob.johnson@example.com'),
(3, 'Charlie', 'Williams', 28, 'charlie.williams@example.com'),
(4, 'David', 'Jones', 35, 'david.jones@example.com'),
(5, 'Emma', 'Brown', 27, 'emma.brown@example.com'),
(6, 'Frank', 'Davis', 32, 'frank.davis@example.com'),
(7, 'Grace', 'Martinez', 29, 'grace.martinez@example.com'),
(8, 'Henry', 'Garcia', 31, 'henry.garcia@example.com'),
(9, 'Isabella', 'Rodriguez', 26, 'isabella.rodriguez@example.com'),
(10, 'Jack', 'Lopez', 33, 'jack.lopez@example.com'),
(11, 'Kevin', 'Perez', 28, 'kevin.perez@example.com'),
(12, 'Linda', 'Lee', 30, 'linda.lee@example.com'),
(13, 'Michael', 'Scott', 34, 'michael.scott@example.com'),
(14, 'Nancy', 'Nguyen', 29, 'nancy.nguyen@example.com'),
(15, 'Olivia', 'Adams', 27, 'olivia.adams@example.com'),
(16, 'Peter', 'Chen', 31, 'peter.chen@example.com'),
(17, 'Rachel', 'Wang', 26, 'rachel.wang@example.com'),
(18, 'Samuel', 'Kim', 32, 'samuel.kim@example.com'),
(19, 'Tina', 'Singh', 28, 'tina.singh@example.com'),
(20, 'Victor', 'Zhang', 33, 'victor.zhang@example.com'),
(21, 'Sophia', 'Hernandez', 30, 'sophia.hernandez@example.com'),
(22, 'William', 'Gonzalez', 27, 'william.gonzalez@example.com'),
(23, 'Abigail', 'Lopez', 31, 'abigail.lopez@example.com'),
(24, 'Alexander', 'Smith', 26, 'alexander.smith@example.com'),
(25, 'Ava', 'Johnson', 32, 'ava.johnson@example.com'),
(26, 'Benjamin', 'Williams', 28, 'benjamin.williams@example.com'),
(27, 'Charlotte', 'Jones', 33, 'charlotte.jones@example.com'),
(28, 'Daniel', 'Brown', 29, 'daniel.brown@example.com'),
(29, 'Elizabeth', 'Davis', 35, 'elizabeth.davis@example.com'),
(30, 'Ethan', 'Martinez', 27, 'ethan.martinez@example.com'),
(31, 'Emily', 'Garcia', 31, 'emily.garcia@example.com'),
(32, 'Grace', 'Rodriguez', 26, 'grace.rodriguez@example.com'),
(33, 'Henry', 'Lopez', 32, 'henry.lopez@example.com'),
(34, 'Isabella', 'Perez', 28, 'isabella.perez@example.com'),
(35, 'Jacob', 'Lee', 33, 'jacob.lee@example.com'),
(36, 'James', 'Scott', 29, 'james.scott@example.com'),
(37, 'Liam', 'Nguyen', 35, 'liam.nguyen@example.com'),
(38, 'Mia', 'Adams', 27, 'mia.adams@example.com'),
(39, 'Michael', 'Chen', 31, 'michael.chen@example.com'),
(40, 'Olivia', 'Wang', 26, 'olivia.wang@example.com'),
(41, 'Noah', 'Kim', 32, 'noah.kim@example.com'),
(42, 'William', 'Singh', 28, 'william.singh@example.com'),
(43, 'Sophia', 'Zhang', 33, 'sophia.zhang@example.com'),
(44, 'Alexander', 'Hernandez', 30, 'alexander.hernandez@example.com'),
(45, 'Ava', 'Gonzalez', 27, 'ava.gonzalez@example.com'),
(46, 'Benjamin', 'Lopez', 31, 'benjamin.lopez@example.com'),
(47, 'Charlotte', 'Smith', 26, 'charlotte.smith@example.com'),
(48, 'Daniel', 'Johnson', 32, 'daniel.johnson@example.com'),
(49, 'Elizabeth', 'Williams', 28, 'elizabeth.williams@example.com'),
(50, 'Ethan', 'Brown', 33, 'ethan.brown@example.com');
```

### 创建唯一索引

```text
CREATE UNIQUE INDEX idx_unique_column ON table_name (column_name);
```

这将在表 `table_name` 的列 `column_name` 上创建一个唯一索引，确保该列的值是唯一的。

例如，创建一个名为 `idx_unique_email` 的唯一索引，用于确保 `users` 表中的 `email` 列的值是唯一的：

```text
CREATE UNIQUE INDEX idx_unique_email ON users (email);
```

### 创建普通索引

```text
CREATE INDEX idx_column ON table_name (column_name);
```

这将在表 `table_name` 的列 `column_name` 上创建一个普通索引，可以加快对该列的查询速度。

例如，创建一个名为 `idx_age` 的普通索引，用于加快 `users` 表中的 `age` 列的查询速度：

```text
CREATE INDEX idx_age ON users (age);
```

### 创建联合索引

```text
CREATE INDEX idx_column1_column2 ON table_name (column1, column2);
```

这将在表 `table_name` 的列 `column1` 和 `column2` 上创建一个联合索引，可以加快根据这两列进行筛选的查询速度。

例如，创建一个名为 `idx_name_age` 的联合索引，用于加快 `users` 表中根据 `name` 和 `age` 进行筛选的查询速度：

```text
CREATE INDEX idx_union_name ON users (firstname, lastname);
```

需要注意的是，创建索引可能会占用额外的存储空间，并对插入、更新和删除操作的性能产生一定影响。因此，在创建索引时应仔细考虑实际需求和查询模式。

## 删除索引

```text
DROP INDEX <index_name> ON <table_name>;
```
