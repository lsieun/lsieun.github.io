---
title: "MyBatis 常用注解说明"
sequence: "103"
---

- `@TableName`
- `@TableId`
- `@TableField`

## @TableName 注解

- 描述：用来将**实体对象**与**数据库表名**完成映射
- 修饰范围：用在实体类上
- 常见属性：
  - `value`：`String` 类型，指定映射的表名。
  - `resultMap`：`String` 类型，用来指定 XML 配置中 `resultMap` 的 id 值。

```java
@TableName("t_basic_user")
public class BasicUser {
    private String id;
    private String loginName;
    private String password;
    private Integer isDelete;
    private Long createTime;
}
```

## @TableId 注解

## @TableField 注解

- 常见属性：
  - `value`：对应的数据表中的“列名”
  - `exist`：如果是 `false`，则表示不映射数据库中的任何列名

## Reference

- [注解](https://baomidou.com/pages/223848/)

