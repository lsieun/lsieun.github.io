---
title: "properties"
sequence: "102"
---

## 示例

## jdbc.properties

正确的示例：

```text
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.connection.url=jdbc:mysql://localhost:3306/my_batis_db
jdbc.connection.username=root
jdbc.connection.password=123456
```

错误的示例：（错误的地方在于 url 配置后面的参数不对）

```text
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.connection.url=jdbc:mysql://localhost:3306/my_batis_db?serverTimezone=GMT%2B8&amp;characterEncoding=utf-8&amp;useSSL=false
jdbc.connection.username=root
jdbc.connection.password=123456
```

### mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="jdbc.properties"/>

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
