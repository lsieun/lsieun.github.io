---
title: "@JsonGetter"
sequence: "JsonGetter"
---

注意：`@JsonGetter` 只能用在方法（`ElementType.METHOD`）上。

```java
@Target({ElementType.ANNOTATION_TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotation
public @interface JsonGetter
{
    String value() default "";
}
```

```java
import com.fasterxml.jackson.annotation.JsonGetter;

public class HelloWorld {
    private int id;
    private String name;

    @JsonGetter("userId")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @JsonGetter("username")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setId(10);
        instance.setName("Tom");

        ObjectMapper objectMapper = new ObjectMapper();
        String str = objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(instance);
        System.out.println(str);
    }
}
```

```text
{
  "userId" : 10,
  "username" : "Tom"
}
```
