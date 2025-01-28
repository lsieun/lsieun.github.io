---
title: "Mocking Beans"
sequence: "105"
---

The Spring Boot testing module offers a `@MockBean` annotation that defines a Mockito
mock for a bean inside the `ApplicationContext`.
In other words, you can mock a new Spring bean or replace an existing definition by adding this annotation.
Remember, this is happening inside the `ApplicationContext`.

```java
import lsieun.springboot.dao.UserRepository;
import lsieun.springboot.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.mockito.BDDMockito.given;


@SpringBootTest
public class SimpleMockBeanTests {
    @MockBean
    private UserRepository repository;

    @Test
    public void test(){
        given(this.repository.findById("my-id"))
                .willReturn(new User(4321, "地爆天星"));
        User user = this.repository.findById("my-id");
        System.out.println(user);
    }
}
```
