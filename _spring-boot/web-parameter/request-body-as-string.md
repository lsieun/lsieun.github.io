---
title: "Request Body As String"
sequence: "121"
---

## 示例

### pom.xml

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

    <!-- devtools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
    </dependency>

    <!-- test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

</dependencies>
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebParameterApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebParameterApplication.class, args);
    }
}
```

### Entity

```java
public class User {
    private Integer id;

    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

### Controller

```java
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @PostMapping("/process")
    public String process(HttpEntity<String> request) {
        System.out.println("headers: " + request.getHeaders());
        System.out.println("body: " + request.getBody());
        return "OK";
    }

}
```

### Test

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import lsieun.springboot.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testPost() throws Exception {
        User input = new User();
        input.setId(10);
        input.setName("小明");

        String payload = objectMapper.writeValueAsString(input);

        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.post("/hello/process")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload);

        MvcResult result = mvc.perform(request).andReturn();
        String content = result.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

