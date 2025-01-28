---
title: "BaseMapper: update"
sequence: "113"
---

```java
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testUpdate() {
        User user = new User();
        user.setId(5L);
        user.setName("小明");
        user.setEmail("xiaoming@example.com");
        int result = userMapper.updateById(user);

        assertEquals(1, result);

        System.out.println("result: " + result);
    }
}
```
