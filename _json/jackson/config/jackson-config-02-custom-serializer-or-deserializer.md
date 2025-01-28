---
title: "Creating Custom Serializer or Deserializer"
sequence: "102"
---

Another essential feature of the `ObjectMapper` class is the ability to register a custom serializer and deserializer.

Custom serializers and deserializers are very useful in situations
where the input or the output JSON response is different in structure than
the Java class into which it must be serialized or deserialized.

```text
ObjectMapper --> module --> serializer + deserializer
```

```text
SimpleModule module = new SimpleModule(
        "CustomUserSerializer",
        new Version(1, 0, 0, null, null, null)
);
module.addSerializer(User.class, new CustomUserSerializer());
objectMapper.registerModule(module);
```

## Custom Serializer

```java
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class CustomUserSerializer extends StdSerializer<User> {
    
    public CustomUserSerializer() {
        this(null);
    }

    public CustomUserSerializer(Class<User> t) {
        super(t);
    }

    @Override
    public void serialize(User value, JsonGenerator jsonGenerator, SerializerProvider serializer) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("username", value.getName());
        jsonGenerator.writeStringField("createdBy", "lsieun");
        jsonGenerator.writeEndObject();
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class RunCustomWrite {
    public static void main(String[] args) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        SimpleModule module = new SimpleModule(
                "CustomUserSerializer",
                new Version(1, 0, 0, null, null, null)
        );
        module.addSerializer(User.class, new CustomUserSerializer());
        objectMapper.registerModule(module);

        User user = UserUtils.getTom();
        String carJson = objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(user);
        System.out.println(carJson);
    }
}
```

输出信息：

```text
{
  "username" : "tom",
  "createdBy" : "lsieun"
}
```

## Custom Deserializer

```java
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class CustomUserDeserializer extends StdDeserializer<User> {
    
    public CustomUserDeserializer() {
        this(null);
    }

    public CustomUserDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public User deserialize(JsonParser parser, DeserializationContext deserializer) throws IOException {

        ObjectCodec codec = parser.getCodec();
        JsonNode node = codec.readTree(parser);
        
        // try catch block
        JsonNode usernameNode = node.get("username");
        String username = usernameNode.asText();

        User instance = new User();
        instance.setName(username);
        return instance;
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class RunCustomRead {
    public static void main(String[] args) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        SimpleModule module = new SimpleModule(
                "CustomUserDeserializer",
                new Version(1, 0, 0, null, null, null)
        );
        module.addDeserializer(User.class, new CustomUserDeserializer());
        mapper.registerModule(module);

        String json = "{\"username\":\"tom\",\"createdBy\":\"lsieun\"}";
        User instance = mapper.readValue(json, User.class);
        System.out.println(instance);
    }
}
```

输出信息：

```text
User: id=0, name=tom
```
