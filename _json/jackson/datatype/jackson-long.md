---
title: "Long"
sequence: "long"
---

## 默认情况

```java
public class HelloWorld {
    private Long id;

    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

public class HelloWorldSerialize {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setId(1234567890L);
        instance.setName("Tom");

        ObjectMapper objectMapper = new ObjectMapper();
        String str = objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(instance);
        System.out.println(str);
    }
}
```

输出结果：

```text
{
  "id" : 1234567890,
  "name" : "Tom"
}
```

## 注解

```text
@JsonSerialize(using = ToStringSerializer.class)
```

```java
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public class HelloWorld {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long id;

    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

## 全局设置

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

public class HelloWorldSerialize {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setId(1234567890L);
        instance.setName("Tom");

        ObjectMapper objectMapper = new ObjectMapper();

        SimpleModule module = new SimpleModule();
        module.addSerializer(Long.class, ToStringSerializer.instance)
                .addSerializer(Long.TYPE, ToStringSerializer.instance);
        objectMapper.registerModule(module);

        String str = objectMapper
                .writerWithDefaultPrettyPrinter()
                .writeValueAsString(instance);
        System.out.println(str);
    }
}
```

```text
{
  "id" : "1234567890",
  "name" : "Tom"
}
```

