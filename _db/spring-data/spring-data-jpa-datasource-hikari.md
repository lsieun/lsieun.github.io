---
title: "Spring Data JPA: Hikari"
sequence: "jpa-datasource-hikari"
---

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
</dependencies>
```

The H2 database driver dependency is configured with `runtime` scope to ensure
it is available at the application runtime and not needed at the time of compilation.

The presence of database configuration details in the `application.properties file`,
and **the Spring Data JPA and H2 driver jars** in the classpath enable Spring Boot
to configure an **H2 data source** in the application.
You can use this data source for database communication.

```text
Spring Data JPA jars + H2 driver jar --> Spring Boot --> H2 data source
```

As part of the database configuration, Spring Boot automatically configures the
**HikariCP** (https://github.com/brettwooldridge/HikariCP) database connection pool.

```text
HikariCP = database connection pool
```

A database connection pool contains one or more database connections
that are generally **created at the time of application startup** and available for use by the application.

```text
created time
```

The benefit of a database connection pool is that
a set of database connections are created at the application startup and available for use by the application.
Thus, you don't create a new connection each time you need a database connection and close it once done.
The application can take a connection from the pool, use it, and return to the pool.

Spring Boot uses HikariCP as the default database connection pool library.

If you are curious to know where the HikariCP dependency is located,
you can inspect the `spring-boot-starter-data-jpa` dependency
by looking at its associated `pom.xml` file.
Browse to the `pom.xml` file of the sample application in your IDE,
and click on the `spring-boot-starter-data-jpa` dependency.
You can observe that `spring-boot-starter-data-jpa` has a dependency on `spring-boot-starter-jdbc`,
and that, in turn, has a dependency on the `HikariCP` library.

DataSource

```text
spring-boot-starter-data-jpa --> spring-boot-starter-jdbc --> HikariCP
```

## 切换其它连接池

If you need to use a database connection pooling library other than `HikariCP`,
you can achieve this by excluding the HikariCP dependency from the `spring-boot-starter-data-jpa` dependency and
including your preferred database connection pooling library (e.g., Oracle UCP, Tomcat JDBC, DBCP2, etc.).

```xml

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
        <exclusions>
            <exclusion>
                <groupId>com.zaxxer</groupId>
                <artifactId>HikariCP</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>org.apache.tomcat</groupId>
        <artifactId>tomcat-jdbc</artifactId>
    </dependency>
</dependencies>
```

## 如何决定 DataSource

Spring Boot uses the following strategies to detect the database connection pool
library based on the configuration:

- 1 If HikariCP is not available, then Spring Boot attempts to use Apache Tomcat
  database connection pooling if it is available in the classpath.
- 2 If both HikariCP and Apache Tomcat connection pool dependencies are not
  available, then Spring Boot attempts to use Apache Commons DBCP2 library
  (https://commons.apache.org/proper/commons-dbcp).
- 3 If DBCP2 is also not available, Spring Boot configures the JDK's default data
  source (`javax.sql.DataSource`).

[hikari-github-url]: https://github.com/brettwooldridge/HikariCP
