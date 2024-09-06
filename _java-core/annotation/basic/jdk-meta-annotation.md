---
title: "Meta Annotations"
sequence: "102"
---

## Intro

Meta-annotation types are used to annotate other annotation type declarations.
The following are meta-annotation types:

- Target
- Retention
- Inherited
- Documented
- Repeatable

Meta-annotation types are part of the Java class library. They are declared in the `java.lang.annotation` package.

Note: The `java.lang.annotation` package contains a `Native` annotation type, which is not a meta-annotation.
It is used to annotate fields indicating that the field may be referenced from native code.
It is a marker annotation.
Typically, it is used by tools that generate some code based on this annotation.

```text
                        ┌─── super ────┼─── Annotation
                        │
                        │                            ┌─── Retention
                        │              ┌─── time ────┤
                        │              │             └─── RetentionPolicy
                        │              │
                        │              │             ┌─── Target
                        │              ├─── space ───┤
                        ├─── meta ─────┤             └─── ElementType
                        │              │
java.lang.annotation ───┤              │
                        │              │             ┌─── Inherited
                        │              │             │
                        │              └─── other ───┼─── Repeatable
                        │                            │
                        │                            └─── Documented
                        ├─── native ───┼─── Native
                        │
                        │              ┌─── AnnotationFormatError
                        │              │
                        └─── error ────┼─── AnnotationTypeMismatchException
                                       │
                                       └─── IncompleteAnnotationException
```

## Target Annotation

### @Target

`@Target` 也只能修饰一个 Annotation 定义，它用于指定被修饰的 Annotation 能用于修饰哪些程序单元。

```java
package java.lang.annotation;

/**
 * @since 1.5
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Target {
    ElementType[] value();
}
```

`@Target` 也包含一个名为 `value` 的成员变量，该成员变量的值只能是如下几个：

- `ElementType.TYPE`：用于修饰类、接口（包括注释类型）、枚举 Used to annotate class, interface (including annotation type), or enum declarations.
- `ElementType.FIELD`：用于修饰成员变量
- `ElementType.METHOD`：用于修饰方法定义
- `ElementType.PARAMETER`：用于修饰参数
- `ElementType.CONSTRUCTOR`：用于修饰构造器
- `ElementType.LOCAL_VARIABLE`：用于修饰局部变量
- `ElementType.ANNOTATION_TYPE`：用于用于修饰 Annotation
- `ElementType.PACKAGE`：用于修饰包定义
- `ElementType.TYPE_PARAMETER`: Used to annotate type parameters in generic classes, interfaces, methods, etc. it was
  added in Java 8.
- `ElementType.TYPE_USE`:
- `ElementType.MODULE`: Used to annotate modules. it was added in Java 9.
- `ElementType.RECORD_COMPONENT`

The `ElementType.TYPE_USE` is used to annotate all uses of types.
It was added in Java 8.
The annotation can also be used where an annotation with `ElementType.TYPE` and `ElementType.TYPE_PARAMETER` can be
used.
It can also be used before constructors, in which case it represents the objects created by the constructor.

```text
                                ┌─── PACKAGE
               ┌─── boundary ───┤
               │                └─── MODULE
               │
               │                ┌─── TYPE
               │                │
               ├─── type ───────┼─── ANNOTATION_TYPE
               │                │
               │                └─── TYPE_USE
               │
               ├─── field ──────┼─── FIELD
ElementType ───┤
               │                              ┌─── CONSTRUCTOR
               │                ┌─── outer ───┤
               │                │             └─── METHOD
               ├─── method ─────┤
               │                │             ┌─── PARAMETER
               │                └─── inner ───┤
               │                              └─── LOCAL_VARIABLE
               │
               │                ┌─── generic ───┼─── TYPE_PARAMETER
               └─── feature ────┤
                                └─── record ────┼─── RECORD_COMPONENT
```

Prior to Java 8, annotations were allowed on **formal parameters of methods** and
**declarations of packages, classes, methods, fields, and local variables**.
Java 8 added support for using annotations on **any use of a type** and on **type parameter** declarations.
The phrase “any use of a type” needs a little explanation.
A type is used in many contexts, for example, after the `extends` clause as a supertype,
in an object creation expression after the `new` operator, in a cast, in a `throws` clause, etc.
From Java 8, annotations may appear before the simple name of the types wherever a type is used.
Note that the simple name of the type may be used only as a name, not as a type, for example, in an `import` statement.

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

@Target({ElementType.TYPE_USE})
public @interface Fatal {
}
```

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

@Target({ElementType.TYPE_USE})
public @interface NonZero {
}
```

```java
public class TypeUseTest {
    public void processData() throws @Fatal Exception {
        double value = getValue();
        int roundedValue = (@NonZero int) value;
        TypeUseTest t = new @Fatal TypeUseTest();
        // More code goes here
    }

    public double getValue() {
        double value = 189.98;
        // More code goes here
        return value;
    }
}
```

Note: If you do not annotate an annotation type with the `Target` annotation type,
the annotation type can be used everywhere, except in a **type parameter** declaration.

```java
package java.lang.annotation;

/**
 * @since 1.5
 */
public enum ElementType {
    /** Class, interface (including annotation type), or enum declaration */
    TYPE,

    /** Field declaration (includes enum constants) */
    FIELD,

    /** Method declaration */
    METHOD,

    /** Formal parameter declaration */
    PARAMETER,

    /** Constructor declaration */
    CONSTRUCTOR,

    /** Local variable declaration */
    LOCAL_VARIABLE,

    /** Annotation type declaration */
    ANNOTATION_TYPE,

    /** Package declaration */
    PACKAGE,

    /**
     * Type parameter declaration
     *
     * @since 1.8
     */
    TYPE_PARAMETER,

    /**
     * Use of a type
     *
     * @since 1.8
     */
    TYPE_USE,

    /**
     * Module declaration.
     * @since 9
     */
    MODULE,

    /**
     * Record component
     * @since 16
     */
    RECORD_COMPONENT;
}
```

### Element types

Another characteristic which each annotation must have is the element types it could be applied to.
Similarly to the **retention policy**, it is defined as **enumeration** (`ElementType`) with the set of possible element types.

| Element Type    | Description                                                       |
|-----------------|-------------------------------------------------------------------|
| ANNOTATION_TYPE | Annotation type declaration                                       |
| CONSTRUCTOR     | Constructor declaration                                           |
| FIELD           | Field declaration (includes enum constants)                       |
| LOCAL_VARIABLE  | Local variable declaration                                        |
| METHOD          | Method declaration                                                |
| PACKAGE         | Package declaration                                               |
| PARAMETER       | Parameter declaration                                             |
| TYPE            | Class, interface (including annotation type), or enum declaration |

Additionally to the ones described above, Java 8 introduces two new element types the annotations can be applied to.

| Element Type   | Description                |
|----------------|----------------------------|
| TYPE_PARAMETER | Type parameter declaration |
| TYPE_USE       | Use of a type              |

In contrast to the **retention policy**, an annotation may declare **multiple element types** it can be associated with,
using the `@Target` annotation. For example:

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.METHOD})
public @interface AnnotationWithTarget {
}
```

Mostly all annotations you are going to create should have both **retention policy** and **element types** specified in
order to be useful.

#### TYPE_PARAMETER

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

#### TYPE_USE

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

@Target(ElementType.TYPE_USE)
public @interface Bar {
}
```

```java
public class Foo<T> {
    void foo(Foo<@Bar T>this) {
    }
}
```

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

## Source Code

JDK 除了在 `java.lang` 下提供了 4 个基本的 Annotation 之外，还在 `java.lang.annotation` 包下提供了 4 个 Meta Annotation，这 4 个 Meta
Annotation 都用于修饰其他的 Annotation。

4 个 Meta Annoation:

- `@Retention`
- `@Target`
- `@Documented`
- `@Inherited`





