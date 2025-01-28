---
title: "Spring Boot Testing Slices"
sequence: "106"
---

One of the most important features that Spring Boot offers is a way to execute test
without the need for a certain infrastructure.

The Spring Boot testing module includes **slices** to test specific parts of the application
without the need of a server or a database engine.

## @JsonTest

The Spring Boot testing module provides the `@JsonTest` annotation,
which helps with object JSON serialization and deserialization,
and verifies that everything works as expected.
`@JsonTest` auto-configures the supported JSON mapper,
depending on which library is in the classpath: **Jackson**, **GSON**, or **JSONB**.

```java
import lsieun.springboot.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.json.JsonContent;
import org.springframework.boot.test.json.ObjectContent;

import java.io.IOException;

@JsonTest
public class JsonTests {
    @Autowired
    private JacksonTester<User> json;

    @Test
    void serializeTest() throws IOException {
        User user = new User(10, "Tom");
        JsonContent<User> jsonContent = this.json.write(user);
        System.out.println(jsonContent);
    }

    @Test
    void deserializeTest() throws IOException {
        String content = "{\"id\":10,\"name\":\"Tom\"}";
        ObjectContent<User> objectContent = this.json.parse(content);
        System.out.println(objectContent);
    }

}
```

## @WebMvcTest

If you need to test your controllers without using a complete server,
Spring Boot provides the `@WebMvcTest` annotation that auto-configures the Spring MVC infrastructure and
limits scanned beans to `@Controller`, `@ControllerAdvice`, `@JsonComponent`, `Converter`,
`GenericConverter`, `Filter`, `WebMvcConfigurer`, and `HandlerMethodArgumentResolver`;
so you know if your controllers are working as expected.

It's important to know that beans marked as `@Component` are not scanned when using this annotation,
but you can still use the `@MockBean` if needed.








