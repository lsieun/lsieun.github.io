---
title: "BaseMapper: delete"
sequence: "112"
---

## deleteById(Serializable)

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
        int result = userMapper.deleteById(1565958810064510978L);

        assertEquals(1, result);

        System.out.println("result: " + result);
    }
}
```

## deleteByMap

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testDelete() {
        Map<String, Object> map = new HashMap<>();
        map.put("name", "汤姆");
        map.put("age", 10);
        int result = userMapper.deleteByMap(map);

        assertEquals(1, result);

        System.out.println("result: " + result);
    }
}
```

## deleteBatchIds

```text
DELETE FROM user WHERE id IN (?, ?, ?)
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testDelete() {
        List<Long> idList = Arrays.asList(1L, 2L, 3L);
        int result = userMapper.deleteBatchIds(idList);

        assertEquals(3, result);

        System.out.println("result: " + result);
    }
}
```
