---
title: "Spring Data JPA"
sequence: "jpa"
---

## 引入依赖

在 `pom.xml` 文件中添加 `spring-boot-starter-data-jpa` 和 relational database driver dependency:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
```






在 `HikariCP` 中，有一个 `com.zaxxer.hikari.HikariDataSource` 类：

```xml
<dependency>
    <groupId>com.zaxxer</groupId>
    <artifactId>HikariCP</artifactId>
</dependency>
```

```java
package com.zaxxer.hikari;

import javax.sql.DataSource;

public class HikariDataSource extends HikariConfig implements DataSource, Closeable {}
```
