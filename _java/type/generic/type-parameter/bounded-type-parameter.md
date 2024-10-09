---
title: "Bounded Type Parameters"
sequence: "104"
---

## 1. Generics, wildcards and bounded types

So far we have seen the examples using generics with **unbounded type parameters**.
**The extremely powerful ability of generics is imposing the constraints (or bounds) on the type** they are parameterized with using the `extends` and `super` keywords.

By using upper and lower type bounds (with `extends` and `super`) along with **type wildcards**,
the generics provide a way to fine-tune the type parameter requirements or, is some cases,
completely omit them, still preserving the generics type-oriented semantic.

## 2. Example

Consider a simple generic box:

```java
public class Box<T> {
    protected T value;

    public void box(T t) {
        value = t;
    }

    public T unbox() {
        T t = value;
        value = null;
        return t;
    }
}
```

This is a useful abstraction, but suppose we want to have a restricted form of box that **only holds numbers**.
Java allows us to achieve this by using **a bound** on the **type parameter**.
This is the ability to restrict the types that can be used as the value of a type parameter, for example:

```java
public class NumberBox<T extends Number> extends Box<T> {
    public int intValue() {
        return value.intValue();
    }
}
```

The type bound `T extends Number` ensures that `T` can only be substituted with a type that is compatible with the type `Number`.
As a result of this, the compiler knows that value will definitely have a method `intValue()` available on it.

If we attempt to instantiate `NumberBox` with an invalid value for the type parameter, then the result will be a compilation error, as we can see:

正确示例：

```text
NumberBox<Integer> instance = new NumberBox<>();
```

错误示例：

```text
// Won't compile
NumberBox<Object> instance = new NumberBox<>();
```

## 3. raw types

You must take care with **raw types** when working with **type bounds**, as the **type bound** can be evaded,
but in doing so, the code is left vulnerable to a runtime exception:

```text
// Compiles
NumberBox n = new NumberBox();

// This is very dangerous
n.box(new Object());

// Runtime error
System.out.println(n.intValue());
```

The call to `intValue()` fails with a `java.lang.ClassCastException` — as `javac` has inserted an unconditional cast of `value` to `Number` before calling the method.
