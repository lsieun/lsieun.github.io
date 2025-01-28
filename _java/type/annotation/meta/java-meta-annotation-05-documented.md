---
title: "@Documented"
sequence: "105"
---


## Documented Annotation

The `Documented` annotation type is a marker meta-annotation type.
If an annotation type is annotated with a `Documented` annotation,
the Javadoc tool will generate documentation for all of its instances.

### @Documented

如果定义 Annotation 类时，使用了 `@Documented` 修饰，则所有使用该 Annotation 修饰的程序元素的 API 文档中将包含该 Annotation 说明。

```java
package java.lang.annotation;

/**
 * @author Joshua Bloch
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Documented {
}
```
