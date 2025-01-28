---
title: "Select"
sequence: "151"
---

## Select

### XML

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batisplus.mapper.UserMapper">
    <select id="findUserById" parameterType="long" resultType="lsieun.batisplus.entity.User">
        select id, name, age, email
        from user
        where id = #{userId}
    </select>
</mapper>
```

## Mapper

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import lsieun.batisplus.entity.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper extends BaseMapper<User> {
    User findUserById(Long userId);
}
```

### Test

```java
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelect() {
        User user = userMapper.findUserById(1L);
        System.out.println(user);
    }
}
```

## List

### XML

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batisplus.mapper.UserMapper">
    <select id="findAllUsers" resultType="lsieun.batisplus.entity.User">
        select id, name, age, email
        from user;
    </select>
</mapper>
```

### Mapper

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import lsieun.batisplus.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMapper extends BaseMapper<User> {
    List<User> findAllUsers();
}
```

### Test

```java
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelect() {
        List<User> list = userMapper.findAllUsers();
        System.out.println(list.size());
        list.forEach(System.out::println);
    }
}
```

## resultMap

We can use either `resultType` or `resultMap` for a `SELECT` mapped statement, but not both.

### XML

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batisplus.mapper.UserMapper">
    <resultMap id="UserResult" type="lsieun.batisplus.entity.User">
        <id column="id" property="id"/>
        <result column="name" property="name"/>
        <result column="age" property="age"/>
        <result column="email" property="email"/>
    </resultMap>

    <select id="findAllUsers" resultMap="UserResult">
        select id, name, age, email
        from user;
    </select>
</mapper>
```

### Mapper

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import lsieun.batisplus.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserMapper extends BaseMapper<User> {
    List<User> findAllUsers();
}
```

### Test

```java
import lsieun.batisplus.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelect() {
        List<User> list = userMapper.findAllUsers();
        System.out.println(list.size());
        list.forEach(System.out::println);
    }
}
```

