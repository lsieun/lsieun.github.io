---
title: "Spring Data JPA: CRUD"
sequence: "crud"
---

```text
                                 ┌─── @Entity
                   ┌─── clazz ───┤
                   │             └─── @Table
persistence-api ───┤
                   │             ┌─── @Id
                   │             │
                   └─── field ───┼─── @GeneratedValue
                                 │
                                 └─── @Column
```

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
spring.datasource.url=jdbc:h2:mem:lsieun;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true

spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=none
```

这条配置很重要：

```text
spring.jpa.hibernate.ddl-auto=none
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

### Entity

```java
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "COURSES")
@Getter
@Setter
@ToString
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NAME")
    private String name;
    @Column(name = "CATEGORY")
    private String category;
    @Column(name = "RATING")
    private int rating;

    @Column(name = "DESCRIPTION")
    private String description;
}
```

- The `@Entity` annotation marks the Java class as a JPA entity
- The `@Table` annotation provides the database table details in which the entity needs to be managed.
- The `@Column` annotation provides mapping information
  between the Java fields and the associated column name in the table.
- The `@Id` annotation indicates that this field is the primary key of the table.
  You've also provided details to indicate that
  the values for this field should be generated using the provided strategy.





### DAO

```java
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends CrudRepository<Course, Long> {
}
```

You've annotated the `CourseRepository` interface with the `@Repository` annotation
to indicate this is a Spring repository.
**Notice that, although it seems to be an empty interface,
at runtime its concrete method implementation is provided by Spring Data JPA,
which is then used to perform the CRUD operations.**

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrudApplication {
    public static void main(String[] args) {
        SpringApplication.run(CrudApplication.class);
    }
}
```

The last change you need to perform is to update the `application.properties` file
with the `spring.jpa.hibernate.ddl-auto` property with the `create` value.
This property instructs the **Hibernate** (the **default JPA provider in Spring Data JPA**)
to manage the database tables for the entities.
Note that this property is specific to Hibernate and is not applicable if any other JPA provider is used.

```text
spring.jpa.hibernate.ddl-auto=create
```
