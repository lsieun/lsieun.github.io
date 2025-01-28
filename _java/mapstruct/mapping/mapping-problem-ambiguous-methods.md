---
title: "Mapping Problem: Ambiguous methods"
sequence: "111"
---

## 问题场景

```java
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Student {
    private String name;
    private int math;
    private int chinese;
    private int english;
}
```

```java
import lombok.Data;

@Data
public class KeyValuePair {
    private String key;
    private int value;
}
```

```java
import lsieun.mapstruct.dto.KeyValuePair;
import lsieun.mapstruct.entity.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface StudentMapper {
    StudentMapper INSTANCE = Mappers.getMapper(StudentMapper.class);

    @Mapping(target = "key", source = "name")
    @Mapping(target = "value", source = "chinese")
    KeyValuePair fromChinese(Student student);

    List<KeyValuePair> fromChineseList(List<Student> list);

    @Mapping(target = "key", source = "name")
    @Mapping(target = "value", source = "english")
    KeyValuePair fromEnglish(Student student);

    List<KeyValuePair> fromEnglishList(List<Student> list);
}
```

```java
import lsieun.mapstruct.dto.KeyValuePair;
import lsieun.mapstruct.entity.Student;
import lsieun.mapstruct.mapper.StudentMapper;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) {
        List<Student> studentList = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Student student = new Student("name" + i, 60 + i, 70 + i, 80 + i);
            studentList.add(student);
        }

        List<KeyValuePair> keyValuePairList1 = StudentMapper.INSTANCE.fromChineseList(studentList);
        keyValuePairList1.forEach(System.out::println);

        List<KeyValuePair> keyValuePairList2 = StudentMapper.INSTANCE.fromEnglishList(studentList);
        keyValuePairList2.forEach(System.out::println);
    }
}
```

```text
java: Ambiguous mapping methods found for mapping collection element to KeyValuePair:
 KeyValuePair fromChinese(Student student), KeyValuePair fromEnglish(Student student).
  See https://mapstruct.org/faq/#ambiguous for more info.
```

## 解决方案

通过`@Named`和`@IterableMapping`注解来解决：

```java
import lsieun.mapstruct.dto.KeyValuePair;
import lsieun.mapstruct.entity.Student;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface StudentMapper {
    StudentMapper INSTANCE = Mappers.getMapper(StudentMapper.class);

    @Named("chinese")
    @Mapping(target = "key", source = "name")
    @Mapping(target = "value", source = "chinese")
    KeyValuePair fromChinese(Student student);

    @IterableMapping(qualifiedByName = "chinese")
    List<KeyValuePair> fromChineseList(List<Student> list);

    @Named("english")
    @Mapping(target = "key", source = "name")
    @Mapping(target = "value", source = "english")
    KeyValuePair fromEnglish(Student student);

    @IterableMapping(qualifiedByName = "english")
    List<KeyValuePair> fromEnglishList(List<Student> list);
}
```

## Reference

- [MapStruct: Ambiguous mapping methods found for mapping collection element 问题解决](https://www.jianshu.com/p/4ebd81ecb5e4)

