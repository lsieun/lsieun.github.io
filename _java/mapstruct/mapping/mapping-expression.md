---
title: "Mapping: Expression"
sequence: "111"
---

## Default Expression

### Entity

```java
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Person {
    private String id;
    private String name;
}
```

### DTO

```java
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PersonDTO {
    private String id;
    private String name;
}
```

### Converter

学习重点：`defaultExpression = "java(java.util.UUID.randomUUID().toString())"`

```java
import lsieun.mapstruct.dto.PersonDTO;
import lsieun.mapstruct.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PersonConverter {
    PersonConverter INSTANCE = Mappers.getMapper(PersonConverter.class);

    @Mapping(
            target = "id", source = "id",
            defaultExpression = "java(java.util.UUID.randomUUID().toString())"
    )
    PersonDTO entity2DTO(Person entity);
}
```

编译之后，生成如下：

```java
import javax.annotation.processing.Generated;
import lsieun.mapstruct.dto.PersonDTO;
import lsieun.mapstruct.entity.Person;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-05-31T20:31:05+0800",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.3.1 (Oracle Corporation)"
)
public class PersonConverterImpl implements PersonConverter {

    @Override
    public PersonDTO entity2DTO(Person entity) {
        if ( entity == null ) {
            return null;
        }

        PersonDTO personDTO = new PersonDTO();

        if ( entity.getId() != null ) {
            personDTO.setId( entity.getId() );
        }
        else {
            personDTO.setId( java.util.UUID.randomUUID().toString() );
        }
        personDTO.setName( entity.getName() );

        return personDTO;
    }
}
```

### Run

```java
public class App {
    public static void main(String[] args) {
        Person entity = new Person();
        entity.setName("Tom");

        PersonDTO dto = PersonConverter.INSTANCE.entity2DTO(entity);
        System.out.println(dto);
    }
}
```
