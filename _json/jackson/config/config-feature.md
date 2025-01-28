---
title: "ConfigFeature"
sequence: "105"
---


## MapperFeature



## SerializationFeature

### WRAP_ROOT_VALUE

```java
public class HelloWorld {

    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setName("tom");
        instance.setAge(10);

        JsonMapper jsonMapper = JsonMapper.builder()
                .configure(SerializationFeature.WRAP_ROOT_VALUE, false)
                .build();
        String json = jsonMapper.writerWithDefaultPrettyPrinter().writeValueAsString(instance);
        System.out.println(json);
    }
}
```

```text
{
  "name" : "tom",
  "age" : 10
}
```

将 `false` 修改为 `true`：

```text
{
  "HelloWorld" : {
    "name" : "tom",
    "age" : 10
  }
}
```

### INDENT_OUTPUT

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        HelloWorld instance = new HelloWorld();
        instance.setName("tom");
        instance.setAge(10);

        JsonMapper jsonMapper = JsonMapper.builder()
                .configure(SerializationFeature.INDENT_OUTPUT, false)
                .build();
        String json = jsonMapper.writeValueAsString(instance);
        System.out.println(json);
    }
}
```

```text
{"name":"tom","age":10}
```

将 `false` 修改为 `true`：

```text
{
  "name" : "tom",
  "age" : 10
}
```

## DeserializationFeature

