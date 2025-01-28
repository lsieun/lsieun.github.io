---
title: "@RestController"
sequence: "111"
---

## Source Code

Spring 4.0 introduced the `@RestController` annotation in order to simplify the creation of RESTful web services.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
@ResponseBody
public @interface RestController {
	@AliasFor(annotation = Controller.class)
	String value() default "";
}
```

It's a convenient annotation that combines `@Controller` and `@ResponseBody`,
which eliminates the need to annotate every request handling method of the controller class
with the `@ResponseBody` annotation.

## How to Use

`@RestController` is a specialized version of the controller.
It includes the `@Controller` and `@ResponseBody` annotations, and as a result,
simplifies the controller implementation:

```java
@RestController
@RequestMapping("books-rest")
public class SimpleBookRestController {
    
    @GetMapping("/{id}", produces = "application/json")
    public Book getBook(@PathVariable int id) {
        return findBookById(id);
    }

    private Book findBookById(int id) {
        // ...
    }
}
```

The controller is annotated with the `@RestController` annotation; therefore, the `@ResponseBody` isn't required.

Every request handling method of the controller class automatically serializes return objects into `HttpResponse`.

## Reference

- [The Spring @Controller and @RestController Annotations](https://www.baeldung.com/spring-controller-vs-restcontroller)
