---
title: "@JsonCreator"
sequence: "JsonCreator"
---

```java
@Target({ElementType.ANNOTATION_TYPE, ElementType.METHOD, ElementType.CONSTRUCTOR})
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotation
public @interface JsonCreator
{
    public Mode mode() default Mode.DEFAULT;
}
```

- Marks Constructor or Factory Methods
- Used With `@JsonProperty` Annotation
- Deserialize Mismatched Property Name

```text
{
  "name1": "Tom",
  "name2": "Cat"
}
```

```java
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class HelloWorld {
    private String firstName;
    private String lastName;

    @JsonCreator
    public HelloWorld(
            @JsonProperty("name1") String firstName,
            @JsonProperty("name2") String lastName
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Override
    public String toString() {
        return String.format("firstName = %s, lastName = %s", firstName, lastName);
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lsieun.utils.DataUtils;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        String json = DataUtils.getJson();

        ObjectMapper objectMapper = new ObjectMapper();
        HelloWorld instance = objectMapper.readValue(json, HelloWorld.class);
        System.out.println(instance);
    }
}
```

```text
firstName = Tom, lastName = Cat
```

