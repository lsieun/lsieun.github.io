---
title: "@Repeatable"
sequence: "106"
---


## Repeatable Annotation

### Repeatable annotations

In pre-Java 8 era there was another limitation related to the annotations which was not discussed yet: the same
annotation could appear only once at the same place, it cannot be repeated multiple times. Java 8 eased this restriction
by providing support for repeatable annotations. For example:

```text
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RepeatableAnnotations {
    RepeatableAnnotation[] value();
}

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(RepeatableAnnotations.class)
public @interface RepeatableAnnotation {
    String value();
}

@RepeatableAnnotation("repeatition 1")
@RepeatableAnnotation("repeatition 2")
public void performAction() {
    // Some code here
}
```

Although in Java 8 the repeatable annotations feature requires a bit of work to be done in order to allow your
annotation to be repeatable (using `@Repeatable`), the final result is worth it: more clean and compact annotated code.

### @Repeatable

```java
/**
 * @since 1.8
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Repeatable {
    /**
     * Indicates the <em>containing annotation type</em> for the
     * repeatable annotation type.
     * @return the containing annotation type
     */
    Class<? extends Annotation> value();
}
```
