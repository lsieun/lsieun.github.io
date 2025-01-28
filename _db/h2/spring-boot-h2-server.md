---
title: "Spring Boot + H2"
sequence: "102-spring-boot"
---

## 示例

### pom.xml

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

```properties
spring.datasource.url=jdbc:h2:mem:jpadb;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=mypass

spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
```

```java
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class H2Config {

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

### Entity

```java
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    @Column(unique = true)
    private String isbn;

    public Book() {
    }

    public Book(String title, String isbn) {
        this.title = title;
        this.isbn = isbn;
    }

}
```

### Dao

```java
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BookRepository extends CrudRepository<Book, Long> {

    Book findByIsbn(String isbn);

    List<Book> findByTitleContaining(String title);
}
```

### Application

```java
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class JpaApplication {
    public static void main(String[] args) {
        SpringApplication.run(JpaApplication.class);
    }

    @Bean
    public CommandLineRunner bookDemo(BookRepository bookRepository) {
        return (args) -> {

            // create books
            bookRepository.save(new Book("Thinking in Java", "0136597238"));
            bookRepository.save(new Book("Beginning Java 2", "1861002238"));
            bookRepository.save(new Book("Java Gently", "0201342979"));
            bookRepository.save(new Book("Java 2 Platform Unleashed", "0672316315"));

            // fetch all books
            System.out.println("Books found with findAll():");
            System.out.println("---------------------------");
            for (Book book : bookRepository.findAll()) {
                System.out.println(book.toString());
            }
            System.out.println();

            // fetch book by id
            Book book = bookRepository.findById(1L).get();
            System.out.println("Book found with findById(1L):");
            System.out.println("-----------------------------");
            System.out.println(book.toString());
            System.out.println();

            // fetch book by ISBN
            Book bookWithIBSN = bookRepository.findByIsbn("0201342979");
            System.out.println("Book found with findByEmail('0201342979'):");
            System.out.println("------------------------------------------");
            System.out.println(bookWithIBSN.toString());
            System.out.println();

            // fetch all books that contain the keyword `java`
            System.out.println("Books that contain keyword 'java':");
            System.out.println("----------------------------------");
            for (Book b : bookRepository.findByTitleContaining("java")) {
                System.out.println(b.toString());
            }
            System.out.println();

            // update book title
            Book bookUpdate = bookRepository.findById(2L).get();
            bookUpdate.setTitle("Java Gently 2nd Edition");
            bookRepository.save(bookUpdate);
            System.out.println("Update book title:");
            System.out.println("------------------");
            System.out.println(bookUpdate.toString());
            System.out.println();

            // total books in DB
            System.out.println("Total books in DB:");
            System.out.println("------------------");
            System.out.println(bookRepository.count());
            System.out.println();

            // delete all books
            bookRepository.deleteAll();
        };
    }
}
```
