---
title: "@JacksonInject"
sequence: "JacksonInject"
---

```java
@Target({ElementType.ANNOTATION_TYPE, ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotation
public @interface JacksonInject
{
    public String value() default "";
    
    public OptBoolean useInput() default OptBoolean.DEFAULT;
}
```

- Marks the Property For Injection
- Name Value Identifies The Injection Field

```text
{
  "firstName": "Tom",
  "lastName": "Cat"
}
```

```java
import com.fasterxml.jackson.annotation.JacksonInject;

import java.util.UUID;

public class HelloWorld {
    @JacksonInject
    private UUID id;
    private String firstName;
    private String lastName;


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
        return String.format("id = %s, firstName = %s, lastName = %s", id, firstName, lastName);
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.InjectableValues;
import com.fasterxml.jackson.databind.ObjectMapper;
import lsieun.utils.DataUtils;

import java.util.UUID;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        UUID id = UUID.fromString("b6d11955-32fc-4e9d-9a7a-1eccde286da5");
        String json = DataUtils.getJson();

        InjectableValues inject = new InjectableValues.Std().addValue(UUID.class, id);
        ObjectMapper objectMapper = new ObjectMapper();
        HelloWorld instance = objectMapper.reader(inject)
                .forType(HelloWorld.class).readValue(json);
        System.out.println(instance);
    }
}
```

```text
id = b6d11955-32fc-4e9d-9a7a-1eccde286da5, firstName = Tom, lastName = Cat
```

```java
import com.fasterxml.jackson.annotation.JacksonInject;

import java.util.UUID;

public class HelloWorld {
    @JacksonInject("id")
    private UUID id;
    private String firstName;
    private String lastName;


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
        return String.format("id = %s, firstName = %s, lastName = %s", id, firstName, lastName);
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.InjectableValues;
import com.fasterxml.jackson.databind.ObjectMapper;
import lsieun.utils.DataUtils;

import java.util.UUID;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        UUID id = UUID.fromString("b6d11955-32fc-4e9d-9a7a-1eccde286da5");
        String json = DataUtils.getJson();

        InjectableValues inject = new InjectableValues.Std().addValue("id", id);
        ObjectMapper objectMapper = new ObjectMapper();
        HelloWorld instance = objectMapper.reader(inject)
                .forType(HelloWorld.class).readValue(json);
        System.out.println(instance);
    }
}
```

```text
id = b6d11955-32fc-4e9d-9a7a-1eccde286da5, firstName = Tom, lastName = Cat
```
