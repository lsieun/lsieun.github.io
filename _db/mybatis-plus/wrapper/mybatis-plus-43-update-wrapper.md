---
title: "Wrapper: UpdateWrapper"
sequence: "143"
---

```java
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testUpdate() {
        UpdateWrapper<User> updateWrapper = new UpdateWrapper<>();
        updateWrapper.like("user_name", "a")
                .and(w -> w.gt("age", 20).or().isNull("email"));
        updateWrapper.set("user_name", "小明").set("email", "xiaoming@abc.com");

        List<User> userList = userMapper.selectList(updateWrapper);

        assertNotNull(userList);
        userList.forEach(System.out::println);
    }
}
```

```text
==>  Preparing: SELECT id,user_name AS name,age,email,is_deleted FROM user WHERE is_deleted=0 AND (user_name LIKE ? AND (age > ? OR email IS NULL))
==> Parameters: %a%(String), 20(Integer)
<==    Columns: id, name, age, email, is_deleted
<==        Row: 4, Sandy, 21, sandy@example.com, 0
<==      Total: 1
```
