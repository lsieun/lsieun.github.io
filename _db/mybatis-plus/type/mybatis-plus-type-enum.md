---
title: "Type: Enum"
sequence: "141"
---

```mysql
use my_batis_db;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`
(
    `id`         BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name`  VARCHAR(30) DEFAULT NULL COMMENT '姓名',
    `sex`        INT         DEFAULT NULL COMMENT '性别（0－女，1－男）',
    PRIMARY KEY (`id`)
) COMMENT '用户表';
```

```java
package lsieun.batisplus.enums;

public enum Gender {
    MALE(0, "女"),
    FEMALE(1, "男");


    public final int value;
    public final String name;

    Gender(int value, String name) {
        this.value = value;
        this.name = name;
    }
}
```

```java
package lsieun.batisplus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lsieun.batisplus.enums.Gender;

@Data
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Gender sex;
}
```

```java
import lsieun.batisplus.entity.User;
import lsieun.batisplus.enums.Gender;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void test() {
        User user = new User();
        user.setName("小明");
        user.setSex(Gender.FEMALE);

        int count = userMapper.insert(user);
        System.out.println("count = " + count);
    }
}
```

```text
### SQL: INSERT INTO user  ( name, sex )  VALUES  ( ?, ? )
### Cause: java.sql.SQLException: Incorrect integer value: 'FEMALE' for column 'sex' at row 1
; uncategorized SQLException; SQL state [HY000]; error code [1366];
 Incorrect integer value: 'FEMALE' for column 'sex' at row 1;
  nested exception is java.sql.SQLException: Incorrect integer value: 'FEMALE' for column 'sex' at row 1
```

## 修改

### 枚举类

添加 `@EnumValue` 注解：

```java
package lsieun.batisplus.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;

public enum Gender {
    MALE(0, "女"),
    FEMALE(1, "男");

    @EnumValue
    public final int value;
    public final String name;

    Gender(int value, String name) {
        this.value = value;
        this.name = name;
    }
}
```


```text
JDBC Connection [HikariProxyConnection@1980698753 wrapping com.mysql.cj.jdbc.ConnectionImpl@52621501] will not be managed by Spring
==>  Preparing: INSERT INTO user ( name, sex ) VALUES ( ?, ? )
==> Parameters: 小明(String), 1(Integer)
<==    Updates: 1
Closing non transactional SqlSession [org.apache.ibatis.session.defaults.DefaultSqlSession@35145874]
count = 1
```
