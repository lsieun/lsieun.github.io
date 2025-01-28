---
title: "Configuring Serialization or Deserialization Feature"
sequence: "101"
---

One of the greatest strengths of the Jackson library is the highly customizable serialization and deserialization process.

```text
                                                ┌─── USE_ANNOTATIONS(true)
                 ┌─── MapperFeature ────────────┤
                 │                              └─── USE_GETTERS_AS_SETTERS(true)
                 │
ConfigFeature ───┼─── SerializationFeature
                 │
                 │                                                              ┌─── FAIL_ON_UNKNOWN_PROPERTIES(true)
                 │                                                              │
                 └─── DeserializationFeature ───┼─── Error handling features ───┼─── FAIL_ON_NULL_FOR_PRIMITIVES(false)
                                                                                │
                                                                                └─── FAIL_ON_NUMBERS_FOR_ENUMS(false)
```

```java
public class ObjectMapper extends ObjectCodec implements Versioned, Serializable {
    public ObjectMapper configure(JsonGenerator.Feature f, boolean state) {
        // ...
        return this;
    }

    public ObjectMapper configure(JsonParser.Feature f, boolean state) {
        // ...
        return this;
    }

    public ObjectMapper configure(SerializationFeature f, boolean state) {
        // ...
        return this;
    }

    public ObjectMapper configure(DeserializationFeature f, boolean state) {
        // ...
        return this;
    }
}
```

## User

```java
import java.text.MessageFormat;

public class User {
    private int id;
    private String name;

    public User() {
    }

    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }

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

    @Override
    public String toString() {
        return MessageFormat.format("User: id={0}, name={1}", id, name);
    }
}
```

## DeserializationFeature

### FAIL_ON_UNKNOWN_PROPERTIES

While converting JSON objects to Java classes, in case the JSON string has some new fields,
the default process will result in an exception:

```text
String jsonString = "{ \"color\" : \"Black\", \"type\" : \"Fiat\", \"year\" : \"1970\" }";
```

The JSON string in the above example in the default parsing process to the Java object for the Class `Car`
will result in the `UnrecognizedPropertyException` exception.

Through the `configure` method, we can extend the default process to ignore the new fields:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonString = "{\"id\":10,\"name\":\"tom\", \"captcha\":\"good\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        User instance = objectMapper.readValue(jsonString, User.class);
        System.out.println(instance);
    }
}
```

错误信息：

```text
Exception in thread "main" com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException:
 Unrecognized field "captcha" (class lsieun.jackson.User), not marked as ignorable (2 known properties: "id", "name"])
 at [Source: (String)"{"id":10,"name":"tom", "captcha":"good"}"; line: 1, column: 35]
```

修改代码：

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Deserialization_FailOnUnknownProperties {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonString = "{\"id\":10,\"name\":\"tom\", \"captcha\":\"good\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        User instance = objectMapper.readValue(jsonString, User.class);
        System.out.println(instance);
    }
}
```

输出信息：

```text
User: id=10, name=tom
```

### FAIL_ON_NULL_FOR_PRIMITIVES

Yet another option is based on the `FAIL_ON_NULL_FOR_PRIMITIVES`,
which defines if the `null` values for primitive values are allowed:

```text
objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, false);
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonString = "{\"id\":null,\"name\":\"tom\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        User instance = objectMapper.readValue(jsonString, User.class);
        System.out.println(instance);
    }
}
```

输出信息：

```text
User: id=0, name=tom
```

修改代码：

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Deserialization_FailOnNullForPrimitives {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonString = "{\"id\":null,\"name\":\"tom\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES, true);

        User instance = objectMapper.readValue(jsonString, User.class);
        System.out.println(instance);
    }
}
```

错误信息：

```text
Exception in thread "main" com.fasterxml.jackson.databind.exc.MismatchedInputException:
 Cannot map `null` into type `int` (set DeserializationConfig.DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES to 'false' to allow)
 at [Source: (String)"{"id":null,"name":"tom"}"; line: 1, column: 7]
```

### FAIL_ON_NUMBERS_FOR_ENUM

Similarly, `FAIL_ON_NUMBERS_FOR_ENUM` controls if enum values are allowed to be serialized/deserialized as numbers:

```text
objectMapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, false);
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonString = "{\"day\":\"1\",\"message\":\"Good Moring\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        Diary instance = objectMapper.readValue(jsonString, Diary.class);
        System.out.println(instance);
    }
}
```

输出信息：

```text
Diary - TUESDAY: Good Moring
```

修改代码：

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Deserialization_FailOnNumbersForEnums {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonString = "{\"day\":\"1\",\"message\":\"Good Moring\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_NUMBERS_FOR_ENUMS, true);

        Diary instance = objectMapper.readValue(jsonString, Diary.class);
        System.out.println(instance);
    }
}
```

错误信息：

```text
Exception in thread "main" com.fasterxml.jackson.databind.exc.InvalidFormatException:
 Cannot deserialize value of type `java.time.DayOfWeek` from String "1":
  not one of the values accepted for Enum class: [MONDAY, WEDNESDAY, SATURDAY, THURSDAY, TUESDAY, FRIDAY, SUNDAY]
 at [Source: (String)"{"day":"1","message":"Good Moring"}"; line: 1, column: 8]
```

