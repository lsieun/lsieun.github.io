---
title: "H2: Server + Client"
sequence: "105"
---

## Server

### pom.xml

```xml
<dependencies>
    <!-- h2 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
    </dependency>
</dependencies>
```

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:mydb
    username: sa
    password:
```

```java
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource getDataSource() {
        DataSourceBuilder<?> dataSourceBuilder = DataSourceBuilder.create();
        dataSourceBuilder.driverClassName("org.h2.Driver");
        dataSourceBuilder.url("jdbc:h2:mem:test");
        dataSourceBuilder.username("SA");
        dataSourceBuilder.password("");
        return dataSourceBuilder.build();
    }
}
```

### Config

```java
package lsieun.springboot.config;

import org.h2.tools.Server;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import javax.annotation.PostConstruct;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;


@Configuration
public class H2ServerConfig {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Bean(initMethod = "start", destroyMethod = "stop")
    public Server inMemoryH2DatabaseaServer() throws SQLException {
        return Server.createTcpServer(
                "-tcp", "-tcpAllowOthers",
                "-tcpPort", "9090"
        );
    }

    @PostConstruct
    private void initDb() {
        System.out.println(String.format("****** Creating table: %s, and Inserting test data ******", "Employees"));

        String sqlStatements[] = {
                "drop table employees if exists",
                "create table employees(id serial,first_name varchar(255),last_name varchar(255))",
                "insert into employees(first_name, last_name) values('Eugen','Paraschiv')",
                "insert into employees(first_name, last_name) values('Scott','Tiger')"
        };

        Arrays.asList(sqlStatements).stream().forEach(sql -> {
            System.out.println(sql);
            jdbcTemplate.execute(sql);
        });

        System.out.println(String.format("****** Fetching from table: %s ******", "Employees"));
        jdbcTemplate.query("select id,first_name,last_name from employees",
                new RowMapper<Object>() {
                    @Override
                    public Object mapRow(ResultSet rs, int i) throws SQLException {
                        String msg = String.format("id:%s,first_name:%s,last_name:%s",
                                rs.getString("id"),
                                rs.getString("first_name"),
                                rs.getString("last_name"));

                        System.out.println(msg);
                        return null;
                    }
                });
    }
}

```

### Application

```java
package lsieun.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class H2ServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(H2ServerApplication.class);
    }
}

```

## Client

### pom.xml

```xml
<dependencies>
    <!-- h2 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
    </dependency>
</dependencies>
```

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:tcp://localhost:9090/mem:mydb
    username: sa
    password:
```

### Application

```java
package lsieun.springboot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import javax.annotation.PostConstruct;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;

@SpringBootApplication
public class H2ClientApplication {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public static void main(String[] args) {
        SpringApplication.run(H2ClientApplication.class);
    }

    @PostConstruct
    private void initDb() {
        System.out.println("****** Inserting more sample data in the table: Employees ******");
        String sqlStatements[] = {
                "insert into employees(first_name, last_name) values('Donald','Trump')",
                "insert into employees(first_name, last_name) values('Barack','Obama')"
        };

        Arrays.asList(sqlStatements).stream().forEach(sql -> {
            System.out.println(sql);
            jdbcTemplate.execute(sql);
        });

        System.out.println(String.format("****** Fetching from table: %s ******", "Employees"));
        jdbcTemplate.query("select id,first_name,last_name from employees",
                new RowMapper<Object>() {
                    @Override
                    public Object mapRow(ResultSet rs, int i) throws SQLException {
                        System.out.println(String.format("id:%s,first_name:%s,last_name:%s",
                                rs.getString("id"),
                                rs.getString("first_name"),
                                rs.getString("last_name")));
                        return null;
                    }
                });
    }
}
```
