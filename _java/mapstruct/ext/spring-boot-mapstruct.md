---
title: "Spring Boot + MapStruct"
sequence: "101"
---

## pom.xml

### properties

```xml

<properties>
    <org.mapstruct.version>1.5.5.Final</org.mapstruct.version>
</properties>
```

### dependencies

```xml

<dependencies>
    <!-- mapstruct -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>

    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>

    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-jdk8</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>
</dependencies>
```

### build

```xml

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <source>${java.version}</source>
        <target>${java.version}</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>${org.mapstruct.version}</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

## 代码

### Entity

```java
package lsieun.springboot.entity;

public class Person {
    private Long id;
    private String name;
    private String email;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```

### DTO

```java
package lsieun.springboot.dto;

public class PersonDTO {
    private Long id;
    private String name;

    private Long timestamp;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}
```

### Converter

```java
package lsieun.springboot.converter;

import lsieun.springboot.dto.PersonDTO;
import lsieun.springboot.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PersonConverter {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "timestamp", expression = "java(System.currentTimeMillis())")
    PersonDTO fromEntity2DTO(Person entity);
}
```

经过编译之后，在 `target/generated-sources/annotations` 目录会生成 `PersonConverterImpl.java` 文件：

```java
package lsieun.springboot.converter;

import javax.annotation.processing.Generated;

import lsieun.springboot.dto.PersonDTO;
import lsieun.springboot.entity.Person;
import org.springframework.stereotype.Component;

@Generated(
        value = "org.mapstruct.ap.MappingProcessor",
        date = "2023-05-31T19:01:14+0800",
        comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.3.1 (Oracle Corporation)"
)
@Component
public class PersonConverterImpl implements PersonConverter {

    @Override
    public PersonDTO fromEntity2DTO(Person entity) {
        if (entity == null) {
            return null;
        }

        PersonDTO personDTO = new PersonDTO();

        personDTO.setId(entity.getId());
        personDTO.setName(entity.getName());

        personDTO.setTimestamp(System.currentTimeMillis());

        return personDTO;
    }
}
```

### Controller

```java
package lsieun.springboot.controller;

import lsieun.springboot.converter.PersonConverter;
import lsieun.springboot.dto.PersonDTO;
import lsieun.springboot.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {

    private final PersonConverter personConverter;

    @Autowired
    public HelloController(PersonConverter personConverter) {
        this.personConverter = personConverter;
    }

    @GetMapping("/world")
    public PersonDTO world() {
        Person person = new Person();
        person.setId(10L);
        person.setName("Tom");
        person.setEmail("tom@example.com");

        return personConverter.fromEntity2DTO(person);
    }

}
```

### 访问

浏览器访问：

```text
http://localhost:8080/hello/world
```

返回结果：

```text
{"id":10,"name":"Tom","timestamp":1685530890910}
```
