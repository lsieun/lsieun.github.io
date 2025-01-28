---
title: "BaseMapper: select"
sequence: "114"
---

## selectById

```java
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
    void testSelect() {
        User user = userMapper.selectById(1L);

        assertNotNull(user);

        System.out.println("user: " + user);
    }
}
```

## selectBatchIds

```text
SELECT id,name,age,email FROM user WHERE id IN (?, ?, ?)
```

```java
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelect() {
        List<Long> idList = Arrays.asList(1L, 2L, 3L);
        List<User> userList = userMapper.selectBatchIds(idList);

        assertNotNull(userList);

        userList.forEach(System.out::println);
    }
}
```

## selectByMap

```text
==>  Preparing: SELECT id,name,age,email FROM user WHERE name = ? AND age = ?
==> Parameters: Jack(String), 20(Integer)
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelect() {
        Map<String, Object> map = new HashMap<>();
        map.put("name", "Jack");
        map.put("age", 20);
        List<User> userList = userMapper.selectByMap(map);

        assertNotNull(userList);

        userList.forEach(System.out::println);
    }
}
```

## selectList

```text
==>  Preparing: SELECT id,name,age,email FROM user
==> Parameters: 
```

```java
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
        List<User> userList = userMapper.selectList(null);

        assertNotNull(userList);

        userList.forEach(System.out::println);
    }
}
```

## limit

```text
==>  Preparing: SELECT id,name,age,email FROM user limit 5
==> Parameters: 
```

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
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.last("limit 5");
        List<User> userList = userMapper.selectList(queryWrapper);

        assertNotNull(userList);

        userList.forEach(System.out::println);
    }
}
```

