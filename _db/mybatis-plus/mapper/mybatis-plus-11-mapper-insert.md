---
title: "BaseMapper: insert"
sequence: "111"
---

```text
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testInsert() {
        User user = new User();
        user.setName("汤姆");
        user.setAge(10);
        user.setEmail("tom@gmail.com");
        int result = userMapper.insert(user);

        assertEquals(1, result);

        System.out.println("result: " + result);
        System.out.println("id: " + user.getId());
    }
}
```

```text
result: 1
id: 1565958810064510978
```

在 MyBatis Plus 中，默认情况下，使用雪花算法来生成 ID。

这也是为什么在创建 `user` 数据表的时候，`id` 列使用 `bigint` 类型：

```text
CREATE TABLE `user` ( 
    `id` bigint(20) NOT NULL COMMENT '主键ID', 
    `name` varchar(30) DEFAULT NULL COMMENT '姓名', 
    `age` int(11) DEFAULT NULL COMMENT '年龄', 
    `email` varchar(50) DEFAULT NULL COMMENT '邮箱', 
    PRIMARY KEY (`id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

同时，在 `User` 实体类中 `id` 字段使用 `Long` 类型：

```java
@Data
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```
