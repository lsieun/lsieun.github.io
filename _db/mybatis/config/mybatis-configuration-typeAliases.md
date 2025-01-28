---
title: "typeAliases"
sequence: "104"
---

## typeAliases

### typeAlias

- `type`：是必须要设置的
- `alias`：
  - 第一，如果不设置值，默认是类的名字。例如：`type` 是 `lsieun.batis.entity.User`，那么默认的 `alias` 是 `User`。
  - 第二，使用的时候，不区分大小写，例如：`user`、`useR` 和 `User` 都是可以的

### package




## 示例：typeAlias

### mybatis-config.xml

```text
<typeAliases>
    <typeAlias alias="user" type="lsieun.batis.entity.User"/>
</typeAliases>
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="jdbc.properties"/>

    <typeAliases>
        <typeAlias alias="user" type="lsieun.batis.entity.User"/>
    </typeAliases>

    <!-- 设置连接数据库的环境 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.connection.url}"/>
                <property name="username" value="${jdbc.connection.username}"/>
                <property name="password" value="${jdbc.connection.password}"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 引入映射文件 -->
    <mappers>
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```

### UserMapper.java

```java
import java.util.List;

public interface UserMapper {
    List<User> getAllUser();
}
```

### UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="lsieun.batis.mapper.UserMapper">
    <select id="getAllUser" resultType="user"> <!-- 注意：这里使用了 user 别名 -->
        select * from t_user
    </select>
</mapper>
```

## 示例二：package

### mybatis-config.xml

```text
<typeAliases>
    <package name="lsieun.batis.entity"/>
</typeAliases>
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="jdbc.properties"/>

    <typeAliases>
        <package name="lsieun.batis.entity"/>
    </typeAliases>

    <!-- 设置连接数据库的环境 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.connection.url}"/>
                <property name="username" value="${jdbc.connection.username}"/>
                <property name="password" value="${jdbc.connection.password}"/>
            </dataSource>
        </environment>
    </environments>

    <!-- 引入映射文件 -->
    <mappers>
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```

