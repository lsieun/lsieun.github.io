---
title: "Wrapper: QueryWrapper"
sequence: "142"
---

## 数据库准备

```text
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_name` VARCHAR(30) DEFAULT NULL COMMENT '姓名',
  `age` INT DEFAULT NULL COMMENT '年龄',
  `email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
  `is_deleted` INT DEFAULT '0' COMMENT '逻辑删除（0未删除，1已删除）',
  PRIMARY KEY (`id`)
) ENGINE=INNODB;
```

```text
TRUNCATE TABLE `user`;

INSERT INTO `user` (`id`, `user_name`, `age`, `email`, `is_deleted`) VALUES 
(1, 'Jone', 18, 'jone@example.com', 0), 
(2, 'Jack', 20, 'jack@example.com', 1), 
(3, 'Tom', 28, 'tom@example.com', 0), 
(4, 'Sandy', 21, 'sandy@example.com', 0), 
(5, 'Billie', 24, 'billie@example.com', 0),
(6, 'Jerry', 27, NULL, 0);

SELECT * FROM `user`;
```

注意：第 2 条数据的 `is_deleted` 字段是 `1`，表示已经逻辑删除。

## 实体类

```java
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

@Data
public class User {
    private Long id;

    // 第一点：数据表中叫 user_name，在实体类中叫 name
    @TableField(value = "user_name")
    private String name;
    private Integer age;
    private String email;

    // 第二点：使用逻辑删除
    @TableLogic
    private Integer isDeleted;
}
```

## 测试：查询-like/between/notnull

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
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
    void testSelect() {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        // 这里使用的是数据表的列名（user_name），而不是实体类的字段名（name）
        queryWrapper.like("user_name", "a")
                .between("age", 20, 30)
                .isNotNull("email");
        List<User> userList = userMapper.selectList(queryWrapper);
        assertNotNull(userList);
        userList.forEach(System.out::println);
    }
}
```

注意点：

- 第一点，`is_deleted=0`，判断没有进行逻辑删除
- 第二点，分别是 `user_name`、`age` 和 `email` 列的判断

```text
==>  Preparing:
SELECT id,user_name AS name,age,email,is_deleted
FROM user
WHERE is_deleted=0 AND (user_name LIKE ? AND age BETWEEN ? AND ? AND email IS NOT NULL)
==> Parameters: %a%(String), 20(Integer), 30(Integer)
<==    Columns: id, name, age, email, is_deleted
<==        Row: 4, Sandy, 21, sandy@example.com, 0
<==      Total: 1
```

## 测试：查询 - 排序

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
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
    void testSelect() {
        // 查询用户信息，按照年龄的降序排序；若年龄相同，则按照 id 升序排序
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("age")
                .orderByAsc("id");

        List<User> userList = userMapper.selectList(queryWrapper);

        assertNotNull(userList);
        userList.forEach(System.out::println);
    }
}
```

```text
==>  Preparing: 
SELECT id,user_name AS name,age,email,is_deleted 
FROM user 
WHERE is_deleted=0
ORDER BY age DESC,id ASC
==> Parameters: 
<==    Columns: id, name, age, email, is_deleted
<==        Row: 3, Tom, 28, tom@example.com, 0
<==        Row: 5, Billie, 24, billie@example.com, 0
<==        Row: 4, Sandy, 21, sandy@example.com, 0
<==        Row: 1, Jone, 18, jone@example.com, 0
<==      Total: 4
```

## 测试：删除

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testDelete() {
        // 删除 email 为 null 的用户信息
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.isNull("email");

        int result = userMapper.delete(queryWrapper);

        assertNotEquals(0, result);
        System.out.println("result: " + result);
    }
}
```

```text
==>  Preparing: UPDATE user SET is_deleted=1 WHERE is_deleted=0 AND (email IS NULL)
==> Parameters: 
<==    Updates: 1

result: 1
```

## 测试：修改

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testUpdate() {
        // 将（用户年龄大于 20 且用户名中包含有 a）或者邮箱为 null 的用户信息修改
        User user = new User();
        user.setName("小明");
        user.setEmail("xiaoming@abc.com");

        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.gt("age", 20)
                .like("user_name", "a")
                .or()
                .isNull("email");


        int result = userMapper.update(user, queryWrapper);

        assertNotEquals(0, result);
        System.out.println("result: " + result);
    }
}
```

```text
==>  Preparing: UPDATE user SET user_name=?, email=? WHERE is_deleted=0 AND (age > ? AND user_name LIKE ? OR email IS NULL)
==> Parameters: 小明(String), xiaoming@abc.com(String), 20(Integer), %a%(String)
<==    Updates: 2
```

## 条件的优先级

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testUpdate() {
        // 将用户名中包含有 a 并且（年龄大于 20 或邮箱为 null）的用户信息进行修改
        User user = new User();
        user.setName("小红");
        user.setEmail("xiaohong@abc.com");

        // lambda 中的条件优先执行
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper
                .like("user_name", "a")
                .and(q -> q.gt("age", 20)
                        .or()
                        .isNull("email"));


        int result = userMapper.update(user, queryWrapper);

        assertNotEquals(0, result);
        System.out.println("result: " + result);
    }
}
```

```text
==>  Preparing: UPDATE user SET user_name=?, email=? WHERE is_deleted=0 AND (user_name LIKE ? AND (age > ? OR email IS NULL))
==> Parameters: 小红(String), xiaohong@abc.com(String), %a%(String), 20(Integer)
<==    Updates: 1
```

## 组装 select 子句

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelect() {
        // 将用户的用户名、年龄、邮箱信息
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("user_name", "age", "email");

        List<Map<String, Object>> maps = userMapper.selectMaps(queryWrapper);

        assertNotNull(maps);
        System.out.println("maps: " + maps);
    }
}
```

```text
==>  Preparing: SELECT user_name,age,email FROM user WHERE is_deleted=0
==> Parameters: 
<==    Columns: user_name, age, email
<==        Row: Jone, 18, jone@example.com
<==        Row: Tom, 28, tom@example.com
<==        Row: 小红, 21, xiaohong@abc.com
<==        Row: Billie, 24, billie@example.com
<==        Row: Jerry, 27, null
<==      Total: 5
```

## 组装子查询

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
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
    void testSelect() {
        // 查询用户信息，按照年龄的降序排序；若年龄相同，则按照 id 升序排序
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.inSql("id", "select id from user where id <=3");

        List<User> userList = userMapper.selectList(queryWrapper);

        assertNotNull(userList);
        userList.forEach(System.out::println);
    }
}
```

```text
==>  Preparing: 
SELECT id,user_name AS name,age,email,is_deleted 
FROM user 
WHERE is_deleted=0 AND (id IN (select id from user where id <=3))
==> Parameters: 
<==    Columns: id, name, age, email, is_deleted
<==        Row: 1, Jone, 18, jone@example.com, 0
<==        Row: 3, Tom, 28, tom@example.com, 0
<==      Total: 2
```

## condition 组装条件

```java
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
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
    void testSelect() {
        String username = "";
        Integer ageBegin = 20;
        Integer ageEnd = 30;
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.like(StringUtils.isNotBlank(username), "user_name", username)
                .gt(ageBegin != null, "age", ageBegin)
                .le(ageEnd != null, "age", ageEnd);

        List<User> userList = userMapper.selectList(queryWrapper);

        assertNotNull(userList);
        userList.forEach(System.out::println);
    }
}
```

```text
==>  Preparing: 
SELECT id,user_name AS name,age,email,is_deleted 
FROM user 
WHERE is_deleted=0 AND (age > ? AND age <= ?)
==> Parameters: 20(Integer), 30(Integer)
<==    Columns: id, name, age, email, is_deleted
<==        Row: 3, Tom, 28, tom@example.com, 0
<==        Row: 4, 小红, 21, xiaohong@abc.com, 0
<==        Row: 5, Billie, 24, billie@example.com, 0
<==        Row: 6, Jerry, 27, null, 0
<==      Total: 4
```
