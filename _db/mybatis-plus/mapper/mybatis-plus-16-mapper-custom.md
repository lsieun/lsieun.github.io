---
title: "BaseMapper: 自定义功能"
sequence: "116"
---

## 配置文件的位置

在默认情况下，`classpath*:/mapper/**/*.xml` 都是 MyBatis Plus 的配置文件。

![](/assets/images/db/mybatis-plus/mapper-defaut-locations.png)

```java

```

```text
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="">

</mapper>
```

## Mapper

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import lsieun.batisplus.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface UserMapper extends BaseMapper<User> {
    Map<String, Object> selectMapById(Long id);
}
```

## 配置文件

File: `src/main/resources/mapper/UserMapper.xml`

正确写法：

```text
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batisplus.mapper.UserMapper">
    <select id="selectMapById" resultType="map">
        select id,name,age,email from user where id = #{id}
    </select>
</mapper>
```

错误写法：在 `select` 标签中，应该用 `resultType` 属性，而不是 `resultMap` 属性。

```text
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batisplus.mapper.UserMapper">
    <select id="selectMapById" resultMap="map">    <!-- 这里是错误的，应该是 resultType -->
        select id,name,age,email from user where id = #{id}
    </select>
</mapper>
```

## 测试

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class UserMapperTest {
    @Autowired
    private UserMapper userMapper;

    @Test
    void testSelect() {
        Map<String, Object> map = userMapper.selectMapById(1L);

        assertNotNull(map);

        System.out.println("map: " + map);
    }
}
```

