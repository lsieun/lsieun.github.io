---
title: "Generic Type"
sequence: "101"
---

## Generic Type

Generic Type 分成两种类型：Generic Class 和 Generic Interface。

```text
                ┌─── Generic Class
Generic Type ───┤
                └─── Generic Interface
```

定义 generic class 的格式:

```text
class name<T1, T2, ..., Tn> { /* ... */ }
```

假如有一个 `Box` 类：

```java
public class Box {
    private Object object;

    public void set(Object object) {
        this.object = object;
    }

    public Object get() {
        return object;
    }
}
```

将其转换成 generic class：

```java
public class Box<T> {
    // T stands for "Type"
    private T t;

    public void set(T t) {
        this.t = t;
    }

    public T get() {
        return t;
    }
}
```

进行使用：

```java
public class HelloWorld {
    public void test() {
        Box<String> box = new Box<>();
    }
}
```

## 概念区分

在这里，我们要区分五个概念：generic type、parameterized type、type parameter、type variable 和 type argument。

```text
                                               ┌─── type parameter
                    ┌─── generic type ─────────┤
                    │                          └─── type variable
Generic Concepts ───┤
                    │
                    └─── parameterized type ───┼─── type argument
```

![](/assets/images/java/generic/generic-type-and-parameterized-type-concepts.png)

- generic type: 对泛型的定义
- paramterized type: 对泛型的使用
- type parameter: formal type parameter
- type argument: actual type parameter

The `T` in `Box<T>` is a **type parameter** and the `String` in `Box<String> box` is a **type argument**.

A reference type in Java, which accepts one or more **type parameters**, is called a **generic type**.

The parameter that is specified in the type declaration is called a **formal type parameter**;
for example, `T` is a formal type parameter in the `Box<T>` class declaration.

When you replace the **formal type parameter** with the **actual type**
(e.g., in `Box<String>` you replace the formal type parameter `T` with `String`),
it is called a **parameterized type**.

在[Oracle 官方文档](https://docs.oracle.com/javase/tutorial/java/generics/types.html) 中提到：

**Type Parameter and Type Argument Terminology**:
Many developers use the terms "type parameter" and "type argument" interchangeably, but these terms are not the same.
When coding, one provides **type arguments** in order to create a **parameterized type**.

## Type Parameter

第一点，位置。Type parameter 在 angle brackets (`<>`) 当中指定：

```java
public class Box<T> {
}
```

第二点，多个。当有多个 Type Parameter 时，可以用逗号（comma `,`）分隔：

```java
public class Box<T, U, V, W> {
}
```

第三点，名字。The **type parameter** can be any valid Java identifiers.

问题：下面的 `value` 字段是什么类型呢？ 回答：并不是 `Integer` 类型，而是 `Object` 类型。

```java
public class Box<Integer> {
    Integer value;
}
```

**Type Parameter Naming Convention**

Use an uppercase single-character for formal type parameter. For example,

- `<T>` for type.
- `S`,`U`,`V`, etc. for 2nd, 3rd, 4th type parameters.
- `<E>` for an element of a collection.
- `<K, V>` for key and value.
- `<R>` for return type.

## Implementation

### 类型擦除和伪泛型

A generic type is mostly implemented in the compiler.
The JVM has no knowledge of generic types.

All actual type parameters are erased at compile time using a process known as erasure.

### 好处

**Compile-time type-safety** is the benefit
that you get when you use a parameterized generic type in your code
without the need to use casts.

