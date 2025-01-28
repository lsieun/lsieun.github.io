---
title: "mappers"
sequence: "112"
---

## mappers

### mapper

### package

以包为单位引入映射文件，有两个要求：

- 1、mapper 接口所在的包要和映射文件所在的包一致
- 2、mapper 接口要和映射文件的名字一致

## 示例：mapper

```text
<mappers>
    <mapper resource="mappers/UserMapper.xml"/>
</mappers>
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

## 示例：package

```text
<mappers>
    <package name="lsieun.batis.entity"/>
</mappers>
```

