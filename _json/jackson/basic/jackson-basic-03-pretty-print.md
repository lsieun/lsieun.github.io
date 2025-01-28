---
title: "Pretty Print"
sequence: "103"
---

## Default Jackson Behavior

By default, Jackson outputs the final JSON in **compact format**:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        // create user object
        User user = new User("John Doe", "john.doe@example.com",
                new String[]{"Member", "Admin"}, true);

        // convert user object to JSON
        String json = new ObjectMapper().writeValueAsString(user);

        // print JSON string
        System.out.println(json);
    }
}
```

```text
{"name":"John Doe","email":"john.doe@example.com","roles":["Member","Admin"],"vip":true}
```

```java
public class User {
    private String name;
    private String email;
    private String[] roles;
    private boolean isVip;

    public User() {
    }

    public User(String name, String email, String[] roles, boolean isVip) {
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.isVip = isVip;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String[] getRoles() {
        return roles;
    }

    public void setRoles(String[] roles) {
        this.roles = roles;
    }

    public boolean isVip() {
        return isVip;
    }

    public void setVip(boolean vip) {
        isVip = vip;
    }
}
```

## Pretty Print JSON Output

To enable the pretty print JSON output while serializing a Java Object,
you can use the `writerWithDefaultPrettyPrinter()` method of `ObjectMapper`:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        // create user object
        User user = new User("John Doe", "john.doe@example.com",
                new String[]{"Member", "Admin"}, true);

        // create object mapper instance
        ObjectMapper mapper = new ObjectMapper();

        // convert user object to pretty print JSON
        String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(user);

        // print JSON string
        System.out.println(json);
    }
}
```

```text
{
  "name" : "John Doe",
  "email" : "john.doe@example.com",
  "roles" : [ "Member", "Admin" ],
  "vip" : true
}
```

You can also enable the pretty print JSON output globally by using the `DefaultPrettyPrinter` class, as shown below:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        // create user object
        User user = new User("John Doe", "john.doe@example.com",
                new String[]{"Member", "Admin"}, true);

        // create object mapper instance
        ObjectMapper mapper = new ObjectMapper();

        // create an instance of DefaultPrettyPrinter
        ObjectWriter writer = mapper.writer(new DefaultPrettyPrinter());

        // convert user object to pretty print JSON
        String json = writer.writeValueAsString(user);

        // print JSON string
        System.out.println(json);
    }
}
```

