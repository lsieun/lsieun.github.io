---
title: "使用 Jackson 忽略 Null 字段"
sequence: "101"
---

## 注解方式：@JsonInclude

注意：`@Target`的值，它可以应用到类上、字段上、方法上等。

```java
@Target({
        ElementType.ANNOTATION_TYPE,
        ElementType.METHOD,
        ElementType.FIELD,
        ElementType.TYPE,
        ElementType.PARAMETER
})
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotation
public @interface JsonInclude {
    // ...
}
```

### 类层面

```java
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class HelloWorld {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setName(null);
        instance.setAge(10);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(instance);
        System.out.println(json);
    }
}
```

输出：

```text
{
  "age" : 10
}
```

### 字段层面

```java
import com.fasterxml.jackson.annotation.JsonInclude;


public class HelloWorld {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

## 全局忽略：ObjectMapper

```text
objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL)
```

```java
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setName(null);
        instance.setAge(10);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper
                .setSerializationInclusion(JsonInclude.Include.NON_NULL)
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(instance);
        System.out.println(json);
    }
}
```









