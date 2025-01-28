---
title: "Annotation: Ignore"
sequence: "ignore"
---

## ignore

### @JsonIgnore

The `@JsonIgnore` annotation is used to tell Jackson to ignore a certain property (field) of a Java object.
The property is ignored both when reading JSON into Java objects, and when writing Java objects into JSON.

```java
import com.fasterxml.jackson.annotation.JsonIgnore;

public class PersonIgnore {

    @JsonIgnore
    public long personId = 0;

    public String name = null;
}
```

输出信息：

```text
{"name":null}
```

### @JsonIgnoreProperties

The `@JsonIgnoreProperties` annotation is used to specify a list of properties of a class to ignore.
The `@JsonIgnoreProperties` annotation is placed above the class declaration
instead of above the individual properties (fields) to ignore.

```java
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"firstName", "lastName"})
public class PersonIgnoreProperties {

    public long personId = 0;

    public String firstName = null;
    public String lastName = null;

}
```

输出信息：

```text
{"personId":0}
```

### @JsonIgnoreType

The `@JsonIgnoreType` Jackson annotation is used to mark a whole type (class) to be ignored everywhere that type is used.

```java
import com.fasterxml.jackson.annotation.JsonIgnoreType;

public class PersonIgnoreType {

    @JsonIgnoreType
    public static class Address {
        public String streetName = null;
        public String houseNumber = null;
        public String zipCode = null;
        public String city = null;
        public String country = null;
    }

    public long personId = 0;

    public String name = null;

    public Address address = null;
}
```

```text
{"personId":0,"name":null}
```

## @JsonAutoDetect

The Jackson annotation `@JsonAutoDetect` is used to tell Jackson to include properties which are not public,
both when reading and writing objects.

```java
import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class PersonAutoDetect {

    private long personId = 123;
    public String name = null;

}
```

The `JsonAutoDetect.Visibility` class contains constants matching the visibility levels in Java,
meaning `ANY`, `DEFAULT`, `NON_PRIVATE`, `NONE`, `PROTECTED_AND_PRIVATE` and `PUBLIC_ONLY`.

```text
{"personId":123,"name":null}
```

```java
import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class HelloWorld {
    private int privateValue = 0;
    protected int protectedValue = 1;
    public int publicValue = 2;
    int packageValue = 3;
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();

        ObjectMapper objectMapper = new ObjectMapper();
        String str = objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(instance);
        System.out.println(str);
    }
}
```

```text
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
```

```text
{
  "privateValue" : 0,
  "protectedValue" : 1,
  "publicValue" : 2,
  "packageValue" : 3
}
```

```text
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.NON_PRIVATE)
```

```text
{
  "protectedValue" : 1,
  "publicValue" : 2,
  "packageValue" : 3
}
```

```text
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.PROTECTED_AND_PUBLIC)
```

```text
{
  "protectedValue" : 1,
  "publicValue" : 2
}
```

```text
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.PUBLIC_ONLY)
```

```text
{
  "publicValue" : 2
}
```

```text
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.NONE)
```

```text
{ }
```

```text
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.DEFAULT)
```

```text
{
  "publicValue" : 2
}
```

