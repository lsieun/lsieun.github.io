---
title: "Jackson JSON Tree Model"
sequence: "112"
---

Jackson has a built-in tree model which can be used to represent a JSON object.

Jackson's tree model is useful if you don't know how the JSON you will receive looks,
or if you for some reason cannot (or just don't want to) create a class to represent it.

> 第一个用处：不能从 Json 转换成 Object

The Jackson Tree Model is also useful if you need to manipulate the JSON before using or forwarding it.

> 第二个用处：

The Jackson tree model is represented by the `JsonNode` class.
You use the Jackson `ObjectMapper` to parse JSON into a `JsonNode` tree model.

## Jackson Tree Model Example

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class HelloWorld {
    public static void main(String[] args) {
        String json = "{\"id\":10,\"name\":\"tom\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode instance = objectMapper.readValue(json, JsonNode.class);
            System.out.println(instance);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
```

As you can see, the JSON string is parsed into a `JsonNode` object ,
simply by passing the `JsonNode.class` as second parameter to the `readValue()` method.

The `ObjectMapper` class also has a special `readTree()` method which always returns a `JsonNode`.
Here is an example of parsing JSON into a `JsonNode` with the `ObjectMapper.readTree()` method:

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class HelloWorld {
    public static void main(String[] args) {
        String json = "{\"id\":10,\"name\":\"tom\"}";

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            JsonNode instance = objectMapper.readTree(json);
            System.out.println(instance);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
```

