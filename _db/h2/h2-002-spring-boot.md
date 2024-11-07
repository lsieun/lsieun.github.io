---
title: "H2: Quick Start (Spring Boot)"
sequence: "102-spring-boot"
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
</dependencies>
```

```xml
<!-- web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## application.yml

```yaml
server:
  port: 80

spring:
  h2:
    console:
      enabled: true
      path: /h2

```

## Application.java

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class H2Application {
    public static void main(String[] args) {
        SpringApplication.run(H2Application.class);
    }
}
```

## Browser

```text
http://localhost/h2
```

![](/assets/images/spring-boot/db/h2/h2-gui-database-not-found.png)



```yaml
server:
  port: 80

spring:
  h2:
    console:
      enabled: true
      path: /h2
  datasource:
    url: jdbc:h2:file:~/test
    driver-class-name: org.h2.Driver
    username: sa
    password: 123456

```

```h2
create table tbl_user (id int, username varchar, password varchar);
```

```h2
insert into tbl_user
values (1, 'tom', '123456');
insert into tbl_user
values (2, 'jerry', '654321');
```

```text
select * from tbl_user;
```
