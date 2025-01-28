---
title: "Spring Data JPA: DataSource"
sequence: "jpa-datasource"
---

## pom.xml

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



## application.properties

```text
spring.datasource.url=jdbc:h2:mem:lsieundb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true
```

## Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DBApplication {
    public static void main(String[] args) {
        SpringApplication.run(DBApplication.class);
    }
}
```

## Test

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;


@SpringBootTest
class DBApplicationTest {
    @Autowired
    private DataSource dataSource;

    @Test
    void contextLoads() {
        System.out.println("Everything is all right.");
    }

    @Test
    void testDataResource() throws SQLException {
        String name = dataSource.getClass().getName();
        System.out.println(name); // com.zaxxer.hikari.HikariDataSource

        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        String databaseProductName = metaData.getDatabaseProductName();
        System.out.println(databaseProductName); // H2
    }
}
```
