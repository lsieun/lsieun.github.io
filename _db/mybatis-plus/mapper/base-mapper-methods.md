---
title: "BaseMapper：常用的方法"
sequence: "103"
---

## selectList

### 查询所有

```java
package com.jm.dma.dao;

import com.jm.dma.domain.BasicUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    void testFindAll() {
        List<BasicUser> userList = userDAO.selectList(null);
        System.out.println(userList);
    }

}
```

### 条件查询

```java
package com.jm.dma.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.jm.dma.domain.BasicUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    void testFind() {
        QueryWrapper<BasicUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("login_name", "admin");
        List<BasicUser> userList = userDAO.selectList(queryWrapper);
        userList.forEach(System.out::println);
    }
}
```

```text
queryWrapper.lt("age", "23"); // 年龄小于 23 的
```

```text
queryWrapper.le("age", "30"); // 小于等于
```

### 模糊查询

```text
package com.jm.dma.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.jm.dma.domain.BasicUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    void testFindLike() {
        QueryWrapper<BasicUser> queryWrapper = new QueryWrapper<>();
        // like %?%
        // likeLeft %?
        // likeRight ?%
        queryWrapper.like("login_name", "shuo");
        List<BasicUser> userList = userDAO.selectList(queryWrapper);
        userList.forEach(System.out::println);
    }
}
```

## selectById

```java
package com.jm.dma.dao;

import com.jm.dma.domain.BasicUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    void testFindById() {
        BasicUser user = userDAO.selectById("1");
        System.out.println(user);
    }
}
```

## 保存

```java
package com.jm.dma.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.jm.dma.domain.BasicUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    void testSave() {
        BasicUser entity = new BasicUser();
        entity.setLoginName("user1");
        userDAO.insert(entity);
    }
}
```

## 修改

### 基于 ID 修改

```java
package com.jm.dma.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.jm.dma.domain.BasicUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    void testUpdateById() {
        BasicUser entity = userDAO.selectById("1565297576285085697");
        entity.setLoginName("user2");
        userDAO.updateById(entity);
    }
}
```

### 批量修改

```java
package com.jm.dma.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.jm.dma.domain.BasicUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    void testUpdate() {
        BasicUser entity = userDAO.selectById("1565297576285085697");
        entity.setLoginName("user3");
        // 如果某些字段的值，不想修改，那么设置为 null 就可以了。
        entity.setCreateTime(null);

        QueryWrapper<BasicUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("login_name", "user2");
        userDAO.update(entity, queryWrapper);
    }
}
```

## 删除

### 基于 ID 删除



### 基于条件删除



