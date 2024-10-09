---
title: "JDK Builtin Annotation"
sequence: "103"
---

## Overview

使用 Annotation 时要在其前面加 `@` 符号。并把该 Annotation 当成一个修饰符使用，用于修饰它支持的程序元素。

Java 提供了 4 个基本 Annotation：

- `@Override`
- `@Deprecated`
- `@SuppressWarnings`
- `@SafeVarargs`
- `@FunctionalInterface`

上面 4 个基本 Annotation 中的 `@SafeVarargs` 是 Java 7 新增的。这 4 个基本的 Annotation 都定义在 `java.lang` 包下。

## @Override

When the compiler comes across the `@Override` annotation,
it makes sure that the method really overrides the method in the superclass.
If the method annotated does not override a method in the superclass, the compiler generates an error.

`@Override` 的作用是告诉编译器检查这个方法，保证**父类**要包含一个被该方法重写的方法；否则，就会编译出错。

`@Override` 只能用于方法，不能用于其他程序元素。

```java
package java.lang;

import java.lang.annotation.*;

/**
 * @since 1.5
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```

## @Deprecated

`@Deprecated` 用于表示某个程序元素（类、方法）已经过时，当其他程序使用已过时的类、方法时，编译器将会给出警告。

```java
package java.lang;

/**
 * @since 1.5
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})
public @interface Deprecated {
}
```

在 Java 9 之后，添加了 `since` 和 `forRemoval`；另外，在 `@Target` 内，也增加了 `MODULE`：

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, MODULE, PARAMETER, TYPE})
public @interface Deprecated {
    /**
     * @since 9
     */
    String since() default "";

    /**
     * @since 9
     */
    boolean forRemoval() default false;
}
```

示例：应用在 PACKAGE 上

FileName: `package-info.java`

```java
@Deprecated
package com.sample;
```

As of Java 9, a deprecated element can also be marked for removal in a future release:
`@Deprecated(forRemoval=true)`.
Read [JEP 277: Enhanced Deprecation](https://openjdk.java.net/jeps/277) for more details on the enhanced deprecation features.
Several platform modules (such as `java.xml.ws` and `java.corba`) are marked for removal in JDK 9.

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, MODULE, PARAMETER, TYPE})
public @interface Deprecated {
    // Since: 9
    String since() default "";

    // Since: 9
    boolean forRemoval() default false;
}
```

## @SuppressWarnings

- [Valid @SuppressWarnings Warning Names](https://www.baeldung.com/java-suppresswarnings-valid-names)

- `all`: this is sort of a wildcard that suppresses all warnings
- `boxing`: suppresses warnings related to boxing/unboxing operations
- `unused`: suppresses warnings of unused code
- `cast`: suppresses warnings related to object cast operations
- `deprecation`: suppresses warnings related to deprecation, such as a deprecated class or method
- `restriction`: suppresses warnings related to the usage of discouraged or forbidden references
- `dep-ann`: suppresses warnings relative to deprecated annotations
- `fallthrough`: suppresses warnings related to missing break statements in switch statements
- `finally`: suppresses warnings related to finally blocks that don't return
- `hiding`: suppresses warnings relative to locals that hide variables
- `incomplete-switch`: suppresses warnings relative to missing entries in a switch statement (enum case)
- `nls`: suppresses warnings related to non-nls string literals
- `null`: suppresses warnings related to null analysis
- `serial`: suppresses warnings related to the missing serialVersionUID field, which is typically found in a Serializable class
- `static-access`: suppresses warnings related to incorrect static variable access
- `synthetic-access`: suppresses warnings related to unoptimized access from inner classes
- `unchecked`: suppresses warnings related to unchecked operations
- `unqualified-field-access`: suppresses warnings related to unqualified field access
- `javadoc`: suppresses warnings related to Javadoc
- `rawtypes`: suppresses warnings related to the usage of raw types
- `resource`: suppresses warnings related to the usage of resources of type Closeable
- `super`: suppresses warnings related to overriding a method without super invocations
- `sync-override`: suppresses warnings due to missing synchronize when overriding a synchronized method

`@SuppressWarnings` 指示被该 Annotation 修饰的程序元素（以及该程序元素的所有子元素）取消显示指定的编译器警告。

- `@SuppressWarnings("rawtypes")`
- `@SuppressWarnings("unchecked")`
- `@SuppressWarnings("unused")`
- `@SuppressWarnings("deprecation")`: suppress ordinary warnings
- `@SuppressWarnings("removal")`: suppress removal warnings
- `@SuppressWarnings({"deprecation", "removal"})`: suppress both ordinary and removal warnings

```java
package java.lang;

import java.lang.annotation.*;
import static java.lang.annotation.ElementType.*;

/**
 * @since 1.5
 */
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    String[] value();
}
```

示例一：应用在 TYPE 上

```java
@SuppressWarnings("rawtypes")
public class HelloWorld {
    //
}
```

示例二：应用在 FIELD 上

```java
import java.util.List;

public class HelloWorld {
    @SuppressWarnings("rawtypes")
    private List mylist;
}
```

示例三：应用在 METHOD 上

```java
public class HelloWorld {
    @SuppressWarnings("rawtypes")
    public void test() {
        //
    }
}
```

示例四：应用在 PARAMETER 上

```java
import java.util.List;

public class HelloWorld {
    public void test(@SuppressWarnings("rawtypes") List mylist) {
        //
    }
}
```

示例五：应用在 CONSTRUCTOR 上

```java
public class HelloWorld {
    @SuppressWarnings("rawtypes")
    public HelloWorld() {
        //
    }
}
```

示例六：应用在 LOCAL_VARIABLE 上

```java
import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public void test() {
        @SuppressWarnings("rawtypes")
        List mylist = new ArrayList();
    }
}
```

## @SafeVarargs

`@SafeVarargs` 是 Java 7 专门为抑制“堆污染”警告提供的。

```java
package java.lang;

import java.lang.annotation.*;

/**
 * @since 1.7
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD})
public @interface SafeVarargs {}
```

## @FunctionalInterface

An interface with one abstract method declaration is known as a **functional interface**.
Previously, a functional interface was known as a **SAM (Single Abstract Method)** type.

The compiler verifies that
all interfaces annotated with a `@FunctionalInterface` really contain one and only one abstract method.
A compile-time error is generated  
if the interfaces annotated with this annotation are not functional.
It is also a compile-time error to use this annotation on classes, annotation types, and enums.  
The `FunctionalInterface` annotation type is a marker annotation.

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface FunctionalInterface {}
```

Note: An interface with only one abstract method is always a functional interface
whether it is annotated with a `@FunctionalInterface` annotation or not.
The use of the annotation instructs the compiler to verify the fact that
the interface is really a functional interface.
