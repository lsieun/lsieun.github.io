---
title: "MySQL 锁"
sequence: "102"
---

MySQL 的锁：

- 粒度分类
    - 行级锁
    - 表级锁
- 职责分类
    - 共享锁-读锁
    - 独占锁（排它锁）-写锁

## InnoDB 锁

InnoDB 默认使用**行级锁**。

问题：在 InnoDB 中，什么时候使用“行级锁”，什么时候使用“表级锁”？

回答：

- 只有利用“索引”的更新、删除操作，才可以使用“行级锁”；
- 如果不能使用“索引”的写操作，则是“表级锁”。

```mysql
BEGIN;
UPDATE innodb_test1 SET name='张三A' WHERE id=1;
COMMIT;

BEGIN;
UPDATE innodb_test1 SET name='张三B' WHERE id=1;
COMMIT;
```

**特别注意：在实际开发的时候，如果遇到写操作，一定要确保 update/delete 语句的条件要能够使用“索引”；
否则，就会使用“表级锁”，程序不具备“并发性”。**
