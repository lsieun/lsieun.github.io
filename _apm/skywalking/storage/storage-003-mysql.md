---
title: "MySQL"
sequence: "103"
---

第一，默认情况下，不直接支持 MySQL，需要将 MySQL 数据库驱动包拷贝到 `SKYWALKING_OAP_HOME/oap-libs` 目录。

- [ ] 测试，不添加驱动，会发生什么错误

```text
org.apache.skywalking.oap.server.starter.OAPServerBootstrap - 57 [main] ERROR [] -
 Failed to get driver instance for jdbcUrl=jdbc:mysql://localhost:3306/swtest?rewriteBatchedStatements=true
java.lang.RuntimeException: Failed to get driver instance for jdbcUrl=jdbc:mysql://localhost:3306/swtest?rewriteBatchedStatements=true
        at com.zaxxer.hikari.util.DriverDataSource.<init>(DriverDataSource.java:110) ~[HikariCP-3.1.0.jar:?]
        ...
Caused by: java.sql.SQLException: No suitable driver
        at java.sql.DriverManager.getDriver(DriverManager.java:299) ~[java.sql:?]
        at com.zaxxer.hikari.util.DriverDataSource.<init>(DriverDataSource.java:103) ~[HikariCP-3.1.0.jar:?]
```

第二，修改 `config/application.yml` 中 `storage` 部分的内容：

```text
storage:
  selector: ${SW_STORAGE:mysql}
  
mysql:
  properties:
    jdbcUrl:${SW_JDBC_URL:"jdbc:mysql://localhost:3306/skywalking"}
    dataSource.user:${SW_DATA_SOURCE_USER:root}
    dataSource.password:${SW_DATA_SOURCE_PASSWORD:admin}
```

- 验证：需要手动创建 MySQL 的数据库
