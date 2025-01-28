---
title: "Quick Start"
sequence: "102"
---

## Overview

This tutorial focuses on understanding the Jackson `ObjectMapper` class and
how to **serialize Java objects into JSON** and **deserialize JSON string into Java objects**.

## Dependencies

Let's first add the following dependencies to the `pom.xml`:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.14.2</version>
</dependency>
```

This dependency will also transitively add the following libraries to the classpath:

- `jackson-annotations`
- `jackson-core`

## Reading and Writing Using ObjectMapper

Let's start with **the basic read and write operations**.

The simple `readValue` API of the `ObjectMapper` is a good entry point. We can use it to parse or deserialize JSON content into a Java object.

Also, on the writing side, we can use the `writeValue` API to serialize any Java object as JSON output.

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

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class BasicReadAndWrite {
    public static void main(String[] args) throws JsonProcessingException {
        User user1 = new User(123, "tom");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(user1);
        System.out.println(json);

        User user2 = objectMapper.readValue(json, User.class);
        System.out.println(user2);
    }
}
```

```text
{"id":123,"name":"tom"}
User: id=123, name=tom
```

The Jackson `ObjectMapper` can also be used to generate JSON from an object. You do so using the one of the methods:

- `writeValue()`
- `writeValueAsString()`
- `writeValueAsBytes()`
