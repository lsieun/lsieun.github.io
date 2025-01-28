---
title: "Heap Pollution"
sequence: "122"
---

再有，heap pollution 的反面是 type safety，泛型本身就是为了保证在 compile time 时类型的安全，

我把 heap pollution 归到这一类，是因为觉得，它是由于泛型（generic）和可变参数（varargs，由数组实现）造成的。

In the Java programming language,
**heap pollution** is a situation that arises when a variable of a parameterized type refers to an object that is not of that parameterized type.
This situation is normally detected during **compilation** and indicated with an **unchecked warning**.
Later, during **runtime** heap pollution will often cause a `ClassCastException`.

有三点：

- 第一点，从 source code 角度的“本质”上来说，类型的不兼容。
- 第二点，从 compile time 的角度的“表象”来说，它体现为 unchecked warning
- 第三点，从 runtime 的角度的“表象”来说，它体现为 `ClassCastException`。可能报错，也可能不报错，

A source of heap pollution in Java arises from the fact that type arguments and variables are not reified at run-time.
As a result, different parameterized types are implemented by the same class or interface at run time.
Indeed, all invocations of a given generic type declaration share a single run-time implementation.
This results in the possibility of heap pollution.


## reification

Representing a type at runtime is called **reification**.
A type that can be represented at runtime is called a **reifiable type**.
A type that is not completely represented at runtime is called a **non-reifiable type**.

Most generic types are non-reifiable
because generics are implemented using erasure,
which removes the type's parameter information at compile time.

For example, when you write `Wrapper<String>`,
the compiler removes the type parameter `<String>`,
and the runtime sees only `Wrapper` instead of `Wrapper<String>`.

## Heap pollution

**Heap pollution** is a situation that occurs
when **a variable of a parameterized type** refers to **an object not of the same parameterized type**.
The compiler issues an unchecked warning if it detects possible heap pollution.
If your program compiles without any unchecked warnings, heap pollution will not occur.

```java
public class HelloWorld {
    public void test() {
        Wrapper<? extends Number> nW = new Wrapper<Long>(1L); // #1
        // Unchecked cast and unchecked warning occurs when the
        // following statement #2 is compiled. Heap pollution
        // occurs, when it is executed.
        Wrapper<Short> sw = (Wrapper<Short>) nW;  // #2
        short s = sw.get();                       // #3 ClassCastException
    }
}
```

## Varargs Methods and Heap Pollution Warnings

Java implements the varargs parameter of a varargs method by converting the varargs parameter into an array.
If a varargs method uses a generic type varargs parameter,
Java cannot guarantee the type-safety.
A non-reifiable generic type varargs parameter may possibly lead to heap pollution.

Consider the following snippet of code that declares a `process()` method with a parameterized type parameter.
The comments in the method's body indicate the heap pollution and other types of problems:

```java
public class HelloWorld {
    public static void process(Wrapper<Long>... nums) {
        Object[] obj = nums;               // Heap pollution
        obj[0] = new Wrapper<>("Hello");   // An array corruption
        Long lv = nums[0].get();           // A ClassCastException Other code goes here
    }
}
```

You need to use the `-Xlint:unchecked,varargs` option with the `javac` compiler to see the unchecked and varargs warnings.

### @SafeVarargs

If you create a varargs method with a **non-reifiable type parameter**,
you can suppress the unchecked warnings at the location of the **method's declaration**
as well as the **method's call** by using the `@SafeVarargs` annotation.

By using `@SafeVarargs`, you are asserting that your varargs method with non-reifiable type parameter is safe to use.

```java
public class HelloWorld {
    @SafeVarargs
    public static void process(Wrapper<Long>... nums) {
        Object[] obj = nums;               // Heap pollution
        obj[0] = new Wrapper<>("Hello");   // An array corruption
        Long lv = nums[0].get();           // A ClassCastException Other code goes here
    }

    public static void test() {
        Wrapper<Long> v1 = new Wrapper<>(10L);
        Wrapper<Long> v2 = new Wrapper<>(11L);
        process(v1, v2); // An unchecked warning
    }
}
```

### @SuppressWarnings

You can suppress the **unchecked** and varargs **warnings** for a varargs method with a
non-reifiable type parameter by using the `@SuppressWarnings` annotation as follows:

```java
public class HelloWorld {
    @SuppressWarnings({"unchecked", "varargs"})
    public static void process(Wrapper<Long>... nums) {
        Object[] obj = nums;               // Heap pollution
        obj[0] = new Wrapper<>("Hello");   // An array corruption
        Long lv = nums[0].get();           // A ClassCastException Other code goes here
    }

    public static void test() {
        Wrapper<Long> v1 = new Wrapper<>(10L);
        Wrapper<Long> v2 = new Wrapper<>(11L);
        process(v1, v2); // An unchecked warning
    }
}
```

Note that when you use the `@SuppressWarnings` annotation with a varargs method,
it suppresses warnings only at the location of the **method's declaration**,
not at the **locations where the method is called.**

## Reference

- [Java @SafeVarargs Annotation](https://www.baeldung.com/java-safevarargs)
- [Overview of Java Built-in Annotations](https://www.baeldung.com/java-default-annotations)
- [Varargs in Java](https://www.baeldung.com/java-varargs)
- [Wiki: Heap pollution](https://en.wikipedia.org/wiki/Heap_pollution)
- 在 Effective Java 中也有涉及


