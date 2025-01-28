---
title: "关系数据库初始化"
sequence: "jpa-init-database-schema"
---

Spring Boot allows you to initialize a database schema with built-in solutions as well as
third-party libraries (ORM solutions).

在 Spring Boot 的 classpath 中：

```text
src/main/resources
```

添加 `schema.sql` 和 `data.sql`：

- the `schema.sql` file to provide all DDL scripts
- the `data.sql` file to include the DML scripts

其中，`schema.sql` 内容：

```h2
create table AUTHORS
(
    id   bigint not null,
    name varchar(255),
    primary key (id)
);
```

其中，`data.sql` 内容：

```h2
INSERT INTO AUTHORS(id, name)
VALUES (1, 'John Doe');
```

## 其它数据库

To begin with, if you are using a database other than an embedded (in-memory) database,
you need to set `spring.sql.init.mode` to `always` be in the `application.properties file`.

```text
spring.sql.init.mode=always
```

This property instructs Spring Boot to always initialize the database schema.
It supports three values - `embedded`, `always`, and `never`.

> 三个可选值

By default, this property is set to the value `embedded`.
This means Spring Boot automatically initializes the database schema for embedded database types
(e.g., H2 in-memory database available at https://www.h2database.com/html/main.html).

> 默认值：embedded

To initialize MySQL or other actual databases,
you need to explicitly configure the value to `always`.

> 对于 MySQL 要使用：always

Since you are using the H2 database in this technique, you may ignore this property.

In this **schema initialization-based approach**,
Spring Boot re-creates the schema each time you restart the application.
There is no database schema versioning done by Spring Boot.

## Example

### pom.xml

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
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
    </dependency>
</dependencies>
```

### application.properties

```text
spring.datasource.url=jdbc:h2:mem:lsieundb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true
```

### SQL

File: `schema.sql`

```h2
CREATE TABLE COURSES
(
    id          int           NOT NULL,
    name        varchar(100)  NOT NULL,
    category    varchar(20)   NOT NULL,
    rating      int           NOT NULL,
    description varchar(1000) NOT NULL,
    PRIMARY KEY (id)
);
```

File: `data.sql`

```h2
INSERT INTO COURSES(ID, NAME, CATEGORY, RATING, DESCRIPTION)
VALUES (1, 'Rapid Spring Boot Application Development',
        'Spring', 4, 'Spring Boot gives all the power of the Spring Framework without all of the complexities');
INSERT INTO COURSES(ID, NAME, CATEGORY, RATING, DESCRIPTION)
VALUES (2, 'Getting Started with Spring Security DSL',
        'Spring', 3, 'Learn Spring Security DSL in easy steps');
INSERT INTO COURSES(ID, NAME, CATEGORY, RATING, DESCRIPTION)
VALUES (3, 'Scalable, Cloud Native Data Applications',
        'Spring', 4, 'Manage Cloud based applications with Spring Boot');
INSERT INTO COURSES(ID, NAME, CATEGORY, RATING, DESCRIPTION)
VALUES (4, 'Fully Reactive: Spring, Kotlin, and JavaFX Playing Together',
        'Spring', 3, 'Unleash the power of Reactive Spring with Kotlin and Spring Boot');
INSERT INTO COURSES(ID, NAME, CATEGORY, RATING, DESCRIPTION)
VALUES (5, 'Getting Started with Spring Cloud Kubernetes',
        'Spring', 5, 'Master Spring Boot application deployment with Kubernetes');
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Jpa002Application {
    public static void main(String[] args) {
        SpringApplication.run(Jpa002Application.class);
    }
}
```

### Test

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@SpringBootTest
class Jpa002ApplicationTest {
    @Autowired
    private DataSource dataSource;

    @Test
    void testCount() {
        try (
                PreparedStatement ps = dataSource.getConnection().prepareStatement("SELECT COUNT(1) FROM COURSES");
                ResultSet rs = ps.executeQuery();
        ) {
            while (rs.next()) {
                int count = rs.getInt(1);
                System.out.println("count: " + count);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## Different Location

By default, you define and define and place it inside the `src\main\resources` folder
for Spring Boot to detect and execute these files.

Further, you can also use the `spring.datasource.schema` and `spring.datasource.data` properties
to customize the default behavior.

### classpath

You can also specify a different schema and data file name with a different location.

```text
spring.sql.init.schema-locations=classpath:sql/schema/sbip-schema.sql 
spring.sql.init.data-locations=classpath:sql/data/sbip-data.sql
```

### filesystem

Other than classpath, you can also provide a file system location
(with `file://<absolute path>`) if your schema and data files are in the file system.

### more than one

Further, you can specify more than one schema or data file separated by the comma.

```text
spring.sql.init.data-locations=classpath:sql/data/sbip-data.sql,file://c:/sql/data/reference-data.sql
```

## Database-specific schema and data SQL files

In addition to the `schema.sql` and `data.sql` files, Spring Boot also supports database-specific SQLs.
For instance, if your application supports multiple database types, and there are SQL syntax differences,
you can use `schema-${platform}.sql` and `data-${platform}.sql` files.
Thus, you can define a `schema-h2.sql` and `data-h2.sql` if you need to support the H2 database.
You can specify the database platform by defining `spring.sql.init.platform=h2` in the `application.properties` file.

```text
spring.sql.init.platform=h2
```

Note that **at any point only one database is active**.
Thus, you can maintain multiple `schema-${plat-form}.sql` and `data-${platform}.sql` files,
but you can configure the `spring.sql.init.platform` to a specific database at any time.
