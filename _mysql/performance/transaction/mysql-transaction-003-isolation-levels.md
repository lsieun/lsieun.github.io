---
title: "事务的隔离级别"
sequence: "103"
---

## X读

- dirty read
- non-repeatable read
- phantom read

### 脏读

脏读，是指事务读取到其它事务没提交的数据。

dirty read

An operation that retrieves unreliable data, data that was updated by another transaction but not yet committed.
It is only possible with the isolation level known as **read uncommitted**.

### 不可重复读

不可重复读，是指在同一次事务中，前后询不一致的问题。

non-repeatable read

The situation when a query retrieves data, and a later query within the same transaction retrieves what should be the
same data, but the queries return different results (changed by another transaction committing in the meantime).

### 幻读

幻读，是一次事务中，前后数据量发生变化，用户产生不可预料的问题。

phantom read

A row that appears in the result set of a query, but not in the result set of an earlier query. For example, if a query
is run twice within a transaction, and in the meantime, another transaction commits after inserting a new row or
updating a row so that it matches the WHERE clause of the query.

### 小总结

- 脏读，容易理解，就是读取了未提交的事务的数据。
- 不可重复读，侧重于一条数据的值，前后查询不一致。
- 幻读，侧重于多条数据的数量，前后查询不一致。

## 事务隔离级别

MySQL 提供了四个事务隔离级别，用来解决脏读、不可重复读和幻读的问题：

- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE

这四个隔离级别越来越高；但是，缺点是并发能力越来越低。

| 隔离级别             | 脏读可能性 | 不可重复读可能性 | 幻读可能性       | 是否加锁 |
|------------------|-------|----------|-------------|------|
| READ UNCOMMITTED | 是     | 是        | 是           | 否    |
| READ COMMITTED   | 否     | 是        | 是           | 否    |
| REPEATABLE READ  | 否     | 否        | 是（InnoDB除外） | 否    |
| SERIALIZABLE     | 否     | 否        | 否           | 是    |

在 MySQL 中，默认的隔离级别是 REPEATABLE READ。

## 如何设置事务隔离级别？

获取当前事务隔离级别，默认 RR 不可重复读：

```text
SHOW VARIABLES LIKE 'transaction_isolation';
```

```text
mysql> SHOW VARIABLES LIKE 'transaction_isolation';
+-----------------------+-----------------+
| Variable_name         | Value           |
+-----------------------+-----------------+
| transaction_isolation | REPEATABLE-READ |
+-----------------------+-----------------+
1 row in set, 1 warning (0.01 sec)
```

设置当前会话事务隔离级别为“读未提交”：

```text
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
```

```text
mysql> SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW VARIABLES LIKE 'transaction_isolation';
+-----------------------+------------------+
| Variable_name         | Value            |
+-----------------------+------------------+
| transaction_isolation | READ-UNCOMMITTED |
+-----------------------+------------------+
1 row in set, 1 warning (0.01 sec)
```

MySQL 默认 Repeatable Read (RR) —— 可重复读。

MySQL 5.1 以后默认存储引擎就是 InnoDB，因此 MySQL 默认 RR 也能解决幻读问题。



## Reference

- [15.7.2.1 Transaction Isolation Levels](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)
- [dirty read](https://dev.mysql.com/doc/refman/8.0/en/glossary.html#glos_dirty_read)

