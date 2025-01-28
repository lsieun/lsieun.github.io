---
title: "@InitBinder"
sequence: "132"
---

- spring-web.jar
    - org.springframework.web.bind.annotation.InitBinder

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface InitBinder {

	String[] value() default {};

}
```

The `@InitBinder` annotation identifies methods that initialize the `org.springframework.web.bind.WebDataBinder`
which will be used for populating command and form object arguments of annotated handler methods.

## 如何使用

### 方法参数 Arguments

#### all arguments

`@InitBinder` methods support all arguments that `@RequestMapping` methods support,
except for command/form objects and corresponding validation result objects.

#### Typical arguments

Typical arguments are `org.springframework.web.bind.WebDataBinder` in combination with
`org.springframework.web.context.request.WebRequest` or `java.util.Locale`,
allowing to register context-specific editors.

### 返回值

`@InitBinder` methods must not have a return value; they are usually declared as `void`.


