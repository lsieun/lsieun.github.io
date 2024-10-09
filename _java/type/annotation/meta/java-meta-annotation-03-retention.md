---
title: "@Retention（时间）"
sequence: "103"
---


## Retention Annotation

You can use annotations for different purposes.
You may want to use them solely for documentation purposes,
to be processed by the compiler, and/or to use them at runtime.
An annotation can be retained at three levels:

- Source code only
- Class file only (the default)
- Class file and runtime

### @Retention

`@Retention` 只能用于修饰一个**Annotation 定义**，用于指定被修饰的 Annotation 可以保留多长时间。

```java
package java.lang.annotation;

/**
 * @since 1.5
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Retention {
    RetentionPolicy value();
}
```

`@Retention` 包含一个 `RetentionPolicy` 类型的 `value` 成员变量。`value` 成员变量的值只能是如下 3 个：

- `RetentionPolicy.CLASS`：编译器将把 Annotation 记录在 class 文件中。当运行 Java 程序时，JVM 不再保留 Annotation。这是默认值。
- `RetentionPolicy.RUNTIME`：编译器将把 Anotation 记录在 class 文件中。当运行 Java 程序时，JVM 也会保留 Annotation，程序可以通过反射获取该 Annotation 信息。
- `RetentionPolicy.SOURCE`：Annotation 只保留在源代码中，编译器直接丢弃这种 Annotation。

如果需要通过反射获取注释信息，就应当将 `@Retention` 的 `value` 属性值设置为 `RetentionPolicy.RUNTIME`

```java
package java.lang.annotation;

/**
 * @since 1.5
 */
public enum RetentionPolicy {
    SOURCE,
    CLASS,
    RUNTIME
}
```

两个示例：

```java
@Retension(value = RetensionPolicy.RUNTIME) // 使用 value=RetensionPolicy.RUNTIME
public @interface Testable {
}
```

```java

@Retension(RetensionPolicy.SOURCE) // 直接使用 RetensionPolicy.SOURCE
public @interface Testable {
}
```

> 如果 Annotation 里只有一个 `value` 成员变量名，使用该 Annotation 时可以直接在 Annotation 后的括号里指定 `value` 的值，无须使用 `name=value` 的形式。


### Retention policy

Each annotation has the very important characteristic called **retention policy**
which is an enumeration (of type `RetentionPolicy`) with the set of policies on how to retain annotations.
It could be set to one of the following values.

| Policy    | Description                                                                                                                            |
|-----------|----------------------------------------------------------------------------------------------------------------------------------------|
| `CLASS`   | Annotations are to be recorded in the class file by the compiler but need not be retained by the VM at run time                        |
| `RUNTIME` | Annotations are to be recorded in the class file by the compiler and retained by the VM at run time, so they may be read reflectively. |
| `SOURCE`  | Annotations are to be discarded by the compiler.                                                                                       |

Note: If you do not use the `Retention` meta-annotation on an annotation type,
**its retention policy defaults to class file only.**
This implies that you will not be able to read those annotations at runtime.

An annotation on a **local variable declaration** is never available in the class file or at runtime
irrespective of the retention policy of the annotation type.
The reason for this restriction is that
the Java runtime does not let you access the local variables using reflection at runtime;
unless you have access to the local variables at runtime, you cannot read annotations for them.

Retention policy has a crucial effect on when the annotation will be available for processing.
The retention policy could be set using `@Retention` annotation.
For example:

```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface AnnotationWithRetention {
}
```

Setting annotation retention policy to `RUNTIME` will guarantee its presence in the compilation process and in the
running application.

