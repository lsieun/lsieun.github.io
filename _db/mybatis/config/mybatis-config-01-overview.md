---
title: "MyBatis 配置概览"
sequence: "101"
---

## 介绍

### config

在 `mybatis-3.x.x.jar` 文件中，`org.apache.ibatis.builder.xml` 目录下有如下几个文件：

- `mybatis-3-config.dtd`
- `mybatis-3-mapper.dtd`
- `mybatis-config.xsd`
- `mybatis-mapper.xsd`

![](/assets/images/db/mybatis/mybatis-jar-org-apache-ibatis-builder-xml-package.png)



### 与 Spring 整合

在单独使用 MyBatis 时，`mybatis-config.xml` 是核心配置文件。

但是，当 MyBatis 与 Spring 整合时，就不再需要 `mybatis-config.xml` 文件了，所有配置项都交给 Spring 来管理。

## MyBatis 配置文件的层次结构

注意，这些层次是不能够颠倒顺序的：如果颠倒顺序，MyBatis 在解析 XML 文件的时候，就会出现异常。

```text
<!ELEMENT configuration (
    properties?,
    settings?,
    typeAliases?,
    typeHandlers?,
    objectFactory?,
    objectWrapperFactory?,
    reflectorFactory?,
    plugins?,
    environments?,
    databaseIdProvider?,
    mappers?)>
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties/>     <!-- 属性 -->
    <settings/>       <!-- 设置 -->
    <typeAliases/>    <!-- 类型命名 -->
    <typeHandlers/>   <!-- 类型处理器 -->
    <objectFactory/>  <!-- 对象工厂 -->
    <plugins/>        <!-- 插件 -->
    <environments>    <!-- 配置多个连接数据的环境 -->
        <environment> <!-- 环境变量 -->
            <transactionManager/> <!-- 事务管理器 -->
            <dataSource/>         <!-- 数据源 -->
        </environment>
    </environments>
    <databaseIdProvider/> <!-- 数据库厂商标识 -->
    <mappers>             <!-- 映射器 -->
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```

