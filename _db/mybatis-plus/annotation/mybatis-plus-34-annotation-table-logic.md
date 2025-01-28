---
title: "Annotation: @TableLogic"
sequence: "134"
---

## 逻辑删除

- 物理删除：真实删除，将对应数据从数据库中删除，之后查询不到此条被删除的数据
- 逻辑删除：假删除，将对应数据中代表是否被删除字段的状态修改为“被删除状态”，之后在数据库中仍旧能看到此条数据记录
- 使用场景：可以进行数据恢复

## 数据库准备

```mysql
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(30) DEFAULT NULL COMMENT '姓名',
  `age` INT DEFAULT NULL COMMENT '年龄',
  `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
  `is_deleted` INT DEFAULT '0' COMMENT '逻辑删除（0未删除，1已删除）',
  PRIMARY KEY (`id`)
) ENGINE=INNODB;
```

```mysql
INSERT INTO `user` (id, NAME, age, email) VALUES 
(1, 'Jone', 18, 'test1@example.com'), 
(2, 'Jack', 20, 'test2@example.com'), 
(3, 'Tom', 28, 'test3@example.com'), 
(4, 'Sandy', 21, 'test4@example.com'), 
(5, 'Billie', 24, 'test5@example.com');
```

## 实体类

```java
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

@Data
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
    @TableLogic
    private Integer isDeleted;
}
```

## 测试

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testDelete() {
        int result = userMapper.deleteById(1L);
        assertEquals(1, result);
    }
}
```

## value + delval

在 `@TableLogic` 注解中，有 `value` 和 `delval` 两个属性，主要是观察一下两个值在 SQL 语句中的作用。

```java
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

@Data
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
    @TableLogic(value = "5", delval = "10")
    private Integer isDeleted;
}
```

```text
UPDATE user SET is_deleted=10 WHERE id=? AND is_deleted=5
```
