---
title: "Functional Interface"
sequence: "102"
---

## @FunctionalInterface

It's recommended that all functional interfaces have an informative `@FunctionalInterface` annotation.
This clearly communicates the purpose of the interface,
and also allows a compiler to generate an error if the annotated interface does not satisfy the conditions.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface FunctionalInterface {
}
```

**Any interface with a SAM(Single Abstract Method) is a functional interface**,
and its implementation may be treated as lambda expressions.

## default methods

Note that Java 8's **default methods** are not abstract and do not count;
a functional interface may still have multiple default methods.


