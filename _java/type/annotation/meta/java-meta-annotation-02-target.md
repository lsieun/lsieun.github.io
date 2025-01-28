---
title: "@Target（空间）"
sequence: "102"
---


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

