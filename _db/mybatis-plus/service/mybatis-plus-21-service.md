---
title: "Service: 自定义功能"
sequence: "121"
---

## IService

MyBatis-Plus 中有一个接口 `IService` 和其实现类 `ServiceImpl`，封装了常见的业务层逻辑

详情查看源码 IService 和 ServiceImpl

- `com.baomidou.mybatisplus.extension.service.IService`
  - `com.baomidou.mybatisplus.extension.service.impl.ServiceImpl`

```java
public interface IService<T> {
    //
}
```

```java
public class ServiceImpl<M extends BaseMapper<T>, T> implements IService<T> {
    //
}
```

## 示例

### 接口

```java
package lsieun.batisplus.service;

import com.baomidou.mybatisplus.extension.service.IService;
import lsieun.batisplus.entity.User;

public interface UserService extends IService<User> {
}
```

- `IService<User>`

### 实现

```java
package lsieun.batisplus.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lsieun.batisplus.entity.User;
import lsieun.batisplus.mapper.UserMapper;
import lsieun.batisplus.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}
```

- `extends ServiceImpl<UserMapper, User>`
- `implements UserService`
- `@Service`

### 测试：查询总记录数

```java
package lsieun.batisplus.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
class UserServiceTest {
    @Autowired
    private UserService userService;

    @Test
    public void testCount() {
        long count = userService.count();
        assertNotEquals(0L, count);

        System.out.println("count: " + count);
    }
}
```

- `@SpringBootTest`
- `@Autowired`
- `@Test`

### 测试：批量添加

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class UserServiceTest {
    @Autowired
    private UserService userService;

    @Test
    public void testSaveBatch() {
        List<User> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            User user = new User();
            user.setName("用户" + (20 + i));
            user.setAge(20 + i);
            list.add(user);
        }

        boolean flag = userService.saveBatch(list);
        assertTrue(flag);

        System.out.println("flag: " + flag);
    }
}
```

## Reference

- [CRUD 接口](https://baomidou.com/pages/49cc81/)
