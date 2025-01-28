---
title: "Testing Web Endpoints"
sequence: "104"
---

## MockMvc

Spring Boot offers a way to test endpoints: a mocking environment called the `MockMvc` class.

```java
package org.springframework.test.web.servlet;

public final class MockMvc {
    //
}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class MockMvcTests {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testHelloWorld() throws Exception {
        this.mvc
                .perform(get("/hello/user"))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

    }
}
```

## TestRestTemplate

You can also use the `TestRestTemplate` class.

```java
import lsieun.springboot.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SimpleRestTemplateTests {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testHelloWorld() {
        String body = this.restTemplate.getForObject("/hello/world", String.class);
        System.out.println(body);
        assertThat(body).contains("Hello World");
    }

    @Test
    void testHelloJson() {
        String body = this.restTemplate.getForObject("/hello/user", String.class);
        System.out.println(body);
    }

    @Test
    void testJson() {
        User user = this.restTemplate.getForObject("/hello/user", User.class);
        System.out.println(user);
    }
}
```

