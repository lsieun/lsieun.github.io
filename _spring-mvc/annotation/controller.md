---
title: "@Controller"
sequence: "111"
---

We can annotate classic controllers with the `@Controller` annotation.
This is simply a specialization of the `@Component` class,
which allows us to auto-detect implementation classes through the classpath scanning.

> @Controller和@Component之间的关系

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Controller {
	@AliasFor(annotation = Component.class)
	String value() default "";

}
```

## @Controller + @RequestMapping

We typically use `@Controller` in combination with a `@RequestMapping` annotation for request handling methods.

```java
@Controller
@RequestMapping("books")
public class SimpleBookController {

    @GetMapping("/{id}", produces = "application/json")
    public @ResponseBody Book getBook(@PathVariable int id) {
        return findBookById(id);
    }

    private Book findBookById(int id) {
        // ...
    }
}
```


