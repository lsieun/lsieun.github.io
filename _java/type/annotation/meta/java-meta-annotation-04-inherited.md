---
title: "@Inherited（父子继承）"
sequence: "104"
---


## Inherited Annotation

The `Inherited` annotation type is a marker meta-annotation type.
If an annotation type is annotated with an `Inherited` meta-annotation,
its instances are inherited by a subclass declaration.
It has no effect if an annotation type is used to annotate any **program elements** other than a **class declaration**.

### @Inherited

假如使用 `@Inherited` 定义一个名为 `@Testable` 的 Annotation。
当父类被 `@Testable` 修饰时，那么子类将自动被 `@Testable` 修饰。

```java
package java.lang.annotation;

/**
 * @since 1.5
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Inherited {
}
```



### Inheritance

The important relation exists between **declaring annotations** and **inheritance** in Java. By default, the subclasses
do not inherit the annotation declared on the parent class. However, there is a way to propagate particular annotations
throughout the class hierarchy using the `@Inherited` annotation. For example:

```java

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@interface InheritableAnnotation {
}

@InheritableAnnotation
public class Parent {
}

public class Child extends Parent {
}
```

In this example, the `@InheritableAnnotation` annotation declared on the `Parent` class will be inherited by the `Child`
class as well.


