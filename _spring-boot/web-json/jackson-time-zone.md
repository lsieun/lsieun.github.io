---
title: "配置Jackson时区：各种Date时间相差8小时出现的问题及其解决方法！"
sequence: "103"
---

## 全局配置文件

在`application.properties`中添加如下内容：

```text
spring.jackson.time-zone=GMT+8
```

输出：

```text
{
    "id": 10,
    "name": "用户",
    "birthDay": "2022-11-10T15:38:04.992+08:00"
}
```

```text
spring.jackson.time-zone=GMT+8
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
```

输出：

```text
{
    "id": 10,
    "name": "用户",
    "birthDay": "2022-11-10 15:40:31"
}
```

## 注解

```text
@JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm")
```

第一次测试，用在类上，不起作用：

```java
@JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm")
public class UserDTO {
    // ...

    private Date birthDay;
}
```

第二次测试，用在字段上，起作用：

```java
public class UserDTO {
    private int id;
    private String name;

    @JsonFormat(timezone = "GTM+8", pattern = "yyyy-MM-dd")
    private Date birthDay;
}
```

第三次测试，用在方法上，起作用：

```java
public class UserDTO {
    private int id;
    private String name;

    private Date birthDay;

    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm")
    public Date getBirthDay() {
        return birthDay;
    }

}
```


