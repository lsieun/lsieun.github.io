---
title: "Type Inference in Generic Object Creation"
sequence: "108"
---

In many cases, the compiler can infer the value for the type parameter in an **object creation expression**
when you create an object of a generic type.
Note that the type inference support in the object creation expression is limited to the situations
where the type is obvious. 

```text
List<String> list = new ArrayList<String>();
```

```text
List<String> list = new ArrayList<>();
```

Note that if you do not specify a type parameter for a generic type in an object creation expression,
the type is the raw type, and the compiler generates unchecked warnings.

## 特殊情况

**Sometimes, the compiler cannot correctly infer the parameter type of a type in an object creation expression.**

In those cases, you need to specify the parameter type instead of using the diamond operator (`<>`).
Otherwise, the compiler will infer a wrong type, which will generate an error.

## 推测逻辑

When the diamond operator is used in an object creation expression,
the compiler uses a **four-step process** to infer the parameter type for the parameterized type.

```text
T1<T2> var = new T3<>(constructor-arguments);
```

First, it tries to infer the type parameter from the static type of the **constructor arguments**.
Note that constructor arguments may be empty, for example, `new ArrayList<>()`.
If the type parameter is inferred in this step, the process continues to the next step.

It uses the **left side of the assignment operator** to infer the type.
In the previous statement, it will infer `T2` as the type if the **constructor arguments** are empty.
Note that an object creation expression may not be part of an assignment statement.
In such cases, it will use the next step.

If the object creation expression is used as an actual parameter for a method call,
the compiler tries to infer the type by looking at **the type of the formal parameter for the method** being called.

If all else fails and it cannot infer the type using these steps,
it infers `Object` as the type parameter.

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class HelloWorld {
    public void test() {
        List<String> list1 = Arrays.asList("A", "B");
        List<Integer> list2 = Arrays.asList(9, 19, 1969);

        List<String> list3 = new ArrayList<>(list1);

        // A compile-time error
        List<String> list4 = new ArrayList<>(list2);

        List<String> list5 = new ArrayList<>();
    }
}
```

### 方法参数

Consider a `process()` method that is declared as follows:

```text
public static void process(List<String> list) {
    // Code goes here
}
```

The following statement makes a call to the `process()` method, and the inferred type parameter is `String`:

```text
// The inferred type is String
process(new ArrayList<>());
```

The compiler looks at the type of the formal parameter of the `process()` method,
finds `List<String>`, and infers the type as `String`.

## Readability VS. Brevity

Using the diamond operator saves some typing.
Use it when the type inference is obvious.

However, it is better, for readability, to specify the type,
instead of the diamond operator, in a complex object creation expression.

**Always choose readability over brevity.**

## Anonymous classes

JDK9 added support for the **diamond operator** in **anonymous classes** if the inferred types are denotable.
You cannot use the diamond operator with anonymous classes — even in JDK9 or later — if the inferred types are non-denotable.

> 其中，denotable 是什么意思呢？

### denotable types

The Java compiler uses types that cannot be written in Java programs.
Types that can be written in Java programs are known as **denotable types**.
Types that the compiler knows but cannot be written in Java programs are known as **non-denotable types**.

> 这里解释 denotable types

For example, `String` is a denotable type because you can use it in programs to denote a type;
however, `Serializable & CharSequence` is not a denotable type,
even though it is a valid type for the compiler.
It is an **intersection type** that represents a type
that implements both interfaces, `Serializable` and `CharSequence`.

**Intersection types** are allowed in **generic type definitions**,
but you cannot **declare a variable** using this intersection type:

错误使用：declare a variable

```text
// Not allowed in Java code. Cannot declare a variable
// of an intersection type.
Serializable & CharSequence var;
```

```java
import java.io.Serializable;

// Allowed in Java code
class Magic<T extends Serializable & CharSequence> {
    // More code goes here
}
```

### 举例

Java contains a generic `Callable<V>` interface in the `java.util.concurrent` package.
It is declared as follows:

```text
public interface Callable<V> {
    V call() throws Exception;
}
```

In JDK9 and later, the compiler will infer the type parameter for the anonymous class
as Integer in the following snippet of code:

```text
// A compile-time error in JDK8, but allowed in JDK9.
Callable<Integer> c = new Callable<>() {
    @Override
    public Integer call() {
        return 100;
    }
};
```

