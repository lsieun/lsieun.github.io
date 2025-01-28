---
title: "Annotation: @TableId"
sequence: "132"
---

## 指定 ID

如果 `id` 字段不存在，那么主键也就不存在了；可以使用 `@TableId` 注解，将某一个字段指定为主键。

```java
package lsieun.batisplus.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class User {
    @TableId
    private Long uid;
    private String name;
    private Integer age;
    private String email;
}
```

## 指定主键的列名

在 `User` 类中，使用了 `id` 字段，但是 `user` 数据表中使用的列名为 `uid`，
那么可以使用 `@TableId(value = "uid")` 绑定两者的关系。

```java
package lsieun.batisplus.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class User {
    @TableId(value = "uid")
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```

## 设置主键自增

```java
package lsieun.batisplus.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class User {
    @TableId(value = "uid", type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```

要使用自增 ID，需要设置两处：

- 第一处，在数据库 `user` 表的主键上设置“自增”
- 第二处，在实体类 `User` 添加 `@TableId(type=IdType.AUTO)` 注解。

常用的主键策略：

- `IdType.ASSIGN_ID`：基于雪花算法的策略生成数据 ID。即使数据库 id 设置了自增，也会使用雪花算法的 ID。
- `IdType.AUTO`：使用数据库的自增策略。注意：这个类型需要配合数据库的 ID 自增才能生效；否则，无效。

## 全局配置主键生成策略

```yaml
mybatis-plus:
  global-config:
    db-config:
      id-type: auto
```

## 雪花算法

雪花算法是由 Twitter 公布的分布式主键生成算法，它能够保证**不同表的主键的不重复性**，以及**相同表的主键的有序性**。

①核心思想：长度共 64bit（一个 long 型）。

- 首先是一个符号位，1bit 标识，由于 long 基本类型在 Java 中是带符号的，最高位是符号位，正数是 0，负数是 1，所以 id 一般是正数，最高位是 0。
- 41bit 时间截 ( 毫秒级 )，存储的是时间截的差值（当前时间截 - 开始时间截 )，结果约等于 69.73 年。
- 10bit 作为机器的 ID（5 个 bit 是数据中心，5 个 bit 的机器 ID，可以部署在 1024 个节点）。
- 12bit 作为毫秒内的流水号（意味着每个节点在每毫秒可以产生 4096 个 ID）。

②优点：整体上按照时间自增排序，并且整个分布式系统内不会产生 ID 碰撞，并且效率较高。
