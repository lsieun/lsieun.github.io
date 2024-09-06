---
title: "Annotation: Type Parameter Annotation"
sequence: "110"
---

Byte Buddy exposes and writes type annotations as they were introduced as a part of Java 8.

```java
@Target(ElementType.TYPE_PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyTag {
}
```

```java
public class HelloWorld<@MyTag T> {
}
```

Type annotations are accessible as declared annotations by the any `TypeDescription.Generic` instance.

If a type annotation should be added to a type of a **generic field or method**,
an annotated type can be generated using a `TypeDescription.Generic.Builder`.



