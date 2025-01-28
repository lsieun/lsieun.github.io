---
title: "Spring Boot 事务"
sequence: "102"
---

```text
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
```

在 service 层的类或者方法上添加 `@Transactional` 注解。

SpringBoot 是默认开启事务的。

设置事务隔离级别：

- `@Transactional(isolation = Isolation.READ_UNCOMMITTED)`：读未提交
- `@Transactional(isolation = Isolation.READ_COMMITTED)`：读已提交
- `@Transactional(isolation = Isolation.REPEATABLE_READ)`：可重复读
- `@Transactional(isolation = Isolation.SERIALIZABLE)`：串行化

设置回滚：

`@Transactional(rollbackFor=Exception.class)`，如果类加了这个注解，那么这个类里面的方法抛出异常，就会回滚，数据库里面的数据也会回滚

