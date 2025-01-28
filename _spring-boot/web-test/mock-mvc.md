---
title: "MockMvc"
sequence: "101"
---

## pom.xml

```xml
<dependencies>
    <!-- starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebTestApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebTestApplication.class, args);
    }
}
```

## Controller

```java
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/get")
    public String get() {
        return "Hello Get";
    }

    @GetMapping("/get-by-id/{id}")
    public UserDTO getById(@PathVariable(value = "id") int id) {
        UserDTO dto = new UserDTO();
        dto.setId(id);
        dto.setName("用户" + id);
        return dto;
    }


    @PostMapping("/post")
    public String post(@RequestBody UserInput input) {
        System.out.println(input);
        return "success";
    }
}
```

## Controller Test

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import lsieun.springboot.dto.UserDTO;
import lsieun.springboot.input.UserInput;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.nio.charset.StandardCharsets;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGet() throws Exception {
        MvcResult mvcResult = mvc.perform(get("/hello/get")).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }

    @Test
    public void testGetById() throws Exception {
        MvcResult mvcResult = mvc.perform(get("/hello/get-by-id/10")).andReturn();
        String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);
        System.out.println(content);

        UserDTO userDTO = objectMapper.readValue(content, UserDTO.class);
        String jsonString = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(userDTO);
        System.out.println(jsonString);
    }

    @Test
    public void testPost() throws Exception {
        UserInput input = new UserInput();
        input.setId(10);
        input.setName("小明");

        String payload = objectMapper.writeValueAsString(input);

        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.post("/hello/post")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload);

        MvcResult result = mvc.perform(request).andReturn();
        String content = result.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```
