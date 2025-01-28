---
title: "Basic mappings"
sequence: "101"
---

To create a **mapper** simply define a Java interface with the required **mapping method(s)** and
annotate it with the `org.mapstruct.Mapper` annotation:

```java
@Mapper
public interface CarMapper {

    @Mapping(target = "manufacturer", source = "make")
    @Mapping(target = "seatCount", source = "numberOfSeats")
    CarDto carToCarDto(Car car);

    @Mapping(target = "fullName", source = "name")
    PersonDto personToPersonDto(Person person);
}
```

The `@Mapper` annotation causes the MapStruct code generator to create
an implementation of the `CarMapper` interface during build-time.

In the generated method implementations all readable properties from the source type (e.g. `Car`)
will be copied into the corresponding property in the target type (e.g. `CarDto`):

- When a property has the same name as its target entity counterpart, it will be mapped implicitly.
- When a property has a different name in the target entity, its name can be specified via the `@Mapping` annotation.

## Ignore

目标：将 `User` 转换成 `AccountDto` 中的过程中，忽略掉 `password` 字段。

关键代码：

```text
@Mapping(target = "password", ignore = true)
```

代码结构：

```text
                       ┌─── from ───┼─── User
        ┌─── entity ───┤
        │              └─── to ─────┼─── AccountDto
code ───┤
        ├─── mapper ───┼─── MyMapper
        │
        └─── run ──────┼─── HelloWorld
```

`User` 类：

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

`AccountDto` 类：

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AccountDto {
    private Long accountId;
    private String name;

    private String password;
}
```

`MyMappter` 类：

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface MyMappter {
    MyMappter INSTANCE = Mappers.getMapper(MyMappter.class);

    @Mapping(target = "accountId", source = "userId")
    @Mapping(target = "name", source = "username")
    @Mapping(target = "password", ignore = true)
    AccountDto fromUser2Account(User user);
}
```

`HelloWorld` 类：

```java
public class HelloWorld {
    public static void main(String[] args) {
        User user = new User(10, "tom", "12345678");
        System.out.println(user);

        AccountDto account = MyMappter.INSTANCE.fromUser2Account(user);
        System.out.println(account);
    }
}
```

输出结果：

```text
User(userId=10, username=tom, password=12345678)
AccountDto(accountId=10, name=tom, password=null)
```

