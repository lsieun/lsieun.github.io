---
title: "Handling Collections"
sequence: "104"
---

Another small but useful feature available through the `DeserializationFeature` class is the ability
to generate the type of collection we want from a JSON Array response.

For example, we can generate the result as an array:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;

public class FromString2Array {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonArray = "[{\"id\":10,\"name\":\"tom\"},{\"id\":11,\"name\":\"jerry\"}]";

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.USE_JAVA_ARRAY_FOR_JSON_ARRAY, true);
        User[] array = objectMapper.readValue(jsonArray, User[].class);

        System.out.println(Arrays.toString(array));
    }
}
```

Or as a List:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class FromString2List {
    public static void main(String[] args) throws JsonProcessingException {
        String jsonArray = "[{\"id\":10,\"name\":\"tom\"},{\"id\":11,\"name\":\"jerry\"}]";

        ObjectMapper objectMapper = new ObjectMapper();
        List<User> list = objectMapper.readValue(jsonArray, new TypeReference<List<User>>(){});
        list.forEach(System.out::println);
    }
}
```
