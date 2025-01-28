---
title: "@JsonProperty"
sequence: "JsonProperty"
---

```java
@Target({ElementType.ANNOTATION_TYPE, ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotation
public @interface JsonProperty
{
    String value() default USE_DEFAULT_NAME;

    String namespace() default "";

    boolean required() default false;

    int index() default INDEX_UNKNOWN;

    String defaultValue() default "";

}
```

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public class HelloWorld {
    @JsonProperty("userId")
    private int id;

    @JsonProperty("username")
    private String name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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

