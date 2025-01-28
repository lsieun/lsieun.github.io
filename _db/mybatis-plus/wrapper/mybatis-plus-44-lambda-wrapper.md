---
title: "Wrapper: LambdaXxxWrapper"
sequence: "144"
---

## LambdaQueryWrapper

```java
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
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
        String username = "a";
        Integer ageBegin = 20;
        Integer ageEnd = 30;
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(StringUtils.isNotBlank(username), User::getName, username)
                .ge(ageBegin != null, User::getAge, ageBegin)
                .le(ageEnd != null, User::getAge, ageEnd);

        List<User> userList = userMapper.selectList(queryWrapper);

        assertNotNull(userList);
        userList.forEach(System.out::println);
    }
}
```

```text
==>  Preparing: SELECT id,user_name AS name,age,email,is_deleted FROM user WHERE is_deleted=0 AND (user_name LIKE ? AND age >= ? AND age <= ?)
==> Parameters: %a%(String), 20(Integer), 30(Integer)
<==      Total: 0
```

## LambdaUpdateWrapper

```java
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
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
        LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.like(User::getName, "a")
                .and(w -> w.gt(User::getAge, 20).or().isNull(User::getEmail));
        updateWrapper.set(User::getName, "小明").set(User::getEmail, "xiaoming@abc.com");

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
