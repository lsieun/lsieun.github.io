---
title: "@InheritInverseConfiguration"
sequence: "101"
---

```java
import lombok.Data;

@Data
public class IdName {
    private int id;
    private String value;
}
```

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {
    private int userId;
    private String username;
    private String password;
}
```

```java
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface IdNameMapper {
    IdNameMapper INSTANCE = Mappers.getMapper(IdNameMapper.class);

    @Mapping(target = "id", source = "userId")
    @Mapping(target = "value", source = "username")
    IdName fromUser(User user);

    @InheritInverseConfiguration(name = "fromUser")
    User toUser(IdName instance);
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        User user1 = new User(100, "tomcat", "123456");
        System.out.println(user1);

        IdName instance = IdNameMapper.INSTANCE.fromUser(user1);
        System.out.println(instance);

        User user2 = IdNameMapper.INSTANCE.toUser(instance);
        System.out.println(user2);
    }
}
```
