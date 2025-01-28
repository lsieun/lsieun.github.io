---
title: "Map"
sequence: "map"
---

We'll illustrate how to serialize and deserialize
`Map<String, String>`, `Map<Object, String>`, and `Map<Object, Object>` to and from JSON-formatted Strings.

## Serialization

Serialization converts a Java object into a stream of bytes, which can be persisted or shared as needed.
Java Maps are collections that map a key Object to a value Object,
and are often the least intuitive objects to serialize.

### `Map<String, String>` Serialization

For a simple case, let's create a `Map<String, String>` and serialize it to JSON:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

public class HelloWorldSerialize {
    public static void main(String[] args) throws JsonProcessingException {
        Map<String, String> map = new HashMap<>();
        map.put("key", "value");

        ObjectMapper objectMapper = new ObjectMapper();
        String str = objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(map);
        System.out.println(str);
    }
}
```

`ObjectMapper` is Jackson's serialization mapper.
It allows us to serialize our map, and write it out as a pretty-printed JSON String
using the `toString()` method in `String`:

```text
{
  "key" : "value"
}
```

### `Map<Object, String>` Serialization

With a few extra steps, we can also serialize a map containing a custom Java class.
Let's create a `MyPair` class to represent a pair of related `String` objects.

Note: the getters/setters should be public, and we annotate `toString()` with `@JsonValue`
to ensure Jackson uses this custom `toString()` when serializing:

```java
import com.fasterxml.jackson.annotation.JsonValue;

public class HelloWorld {
    private String first;
    private String second;

    public String getFirst() {
        return first;
    }

    public void setFirst(String first) {
        this.first = first;
    }

    public String getSecond() {
        return second;
    }

    public void setSecond(String second) {
        this.second = second;
    }

    @Override
    @JsonValue
    public String toString() {
        return first + " and " + second;
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorldSerialize {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setFirst("tom");
        instance.setSecond("jerry");

        ObjectMapper objectMapper = new ObjectMapper();
        String str = objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(instance);
        System.out.println(str);
    }
}
```

```text
"tom and jerry"
```

Then we'll tell Jackson how to serialize `MyPair` by extending Jackson's `JsonSerializer`:

```java
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.io.StringWriter;

public class MyHelloWorldSerializer extends JsonSerializer<HelloWorld> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void serialize(HelloWorld value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        StringWriter writer = new StringWriter();
        objectMapper.writeValue(writer, value);
        gen.writeFieldName(writer.toString());
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.HashMap;
import java.util.Map;

public class HelloWorldSerialize {
    @JsonSerialize(keyUsing = MyHelloWorldSerializer.class)
    private static Map<HelloWorld, String> map;

    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setFirst("tom");
        instance.setSecond("jerry");

        map = new HashMap<>();
        map.put(instance, "Cartoon");

        ObjectMapper objectMapper = new ObjectMapper();
        String str = objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(map);
        System.out.println(str);
    }
}
```

The serialized JSON output is:

```text
{
  "tom and jerry" : "Cartoon"
}
```

## Reference

- [Map Serialization and Deserialization with Jackson](https://www.baeldung.com/jackson-map)
