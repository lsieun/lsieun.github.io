---
title: "@PathVariable"
sequence: "101"
---

```java
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PathVariable {
    @AliasFor("name")
    String value() default "";

    @AliasFor("value")
    String name() default "";

    boolean required() default true;
}
```

## Entity

Spring MVC offers the ability to bind **request params** and **path variables** into a JavaBean.

```java
public class User {
    private Integer id;

    private String name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return String.format("User {id = %s, name = '%s'}", id, name);
    }
}
```

预期目标：将 `/path/{id}/{name}` 中的 `{id}` 和 `{name}` 绑定到 `User` 类的 `id` 和 `name` 字段。

```java
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/path")
public class PathVariableController {

    @RequestMapping("/{id}/{name}")
    public String getUser(User user) {
        return user.toString();
    }

}
```

浏览器访问：

```text
http://localhost:8888/path/10/tomcat
```

数据返回：

```text
User {id = 10, name = 'tomcat'}
```

