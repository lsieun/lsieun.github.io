---
title: "@RequestMapping"
sequence: "112"
---

## 位置

可以应用在Class上，也可以应用在Method上：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequestMapping {
    // ...
}
```

## value

多个

```text
@RequestMapping(value = {"/", "/index", "/home"})
public String index() {
    return "index";
}
```

### Ant

Spring MVC支持ant风格的路径：

- `?`: 表示任意单个字符，但是排除`/`、`?`。有疑问的是空格可以吗？
  - OK: `:`
  - NO: `/`, `?`
- `*`: 表示任意的0个或多个字符
- `**`: 表示任意的一层或多层目录

注意：在使用`**`时，只能使用`/**/xxx`的方式。例如，`/a**a/xxx`是不能表示多层目录的。

### 占位符

```text
<a th:href="@{/testRest/1/admin}">URL</a>
```

```text
@RequestMapping("testRest/{id}/{username}")
public String testRest(@PathVariable("id") String id, @PathVariable("username") String username) {
    System.out.println("id: " + id + ", username: " + username);
    return "target";
}
```

## method

```text
<a th:href="@{/test}">test ---> get</a>
<form th:action="@{/test}" method="post">
    <input type="submit">
</form>
```

第一，对于处理指定请求方式的控制器方法，Spring MVC中提供了`@RequestMapping`的派生注解：

- `@GetMapping`: 处理Get请求的映射`@GetMapping("/good")`
- `@PostMapping`:
- `@PutMapping`:
- `@DeleteMapping`:

第二，常用的请求方式有get、post、put和delete

但是，目前浏览器只支持get和post，若在form表单提交时，为method设置了其它请求方式的字符串（put或delete），则按照默认的请求方式get处理

若要发送put或delete请求，则需要通过Spring提供的过滤器`HiddenHttpMethodEnter`


