---
title: "Call sites"
sequence: "102"
---

## Call sites

A location in the bytecode where a method invocation instruction occurs is known as a **call site**.

> 什么是 call site，是指 bytecode 当中一个 method invocation instruction 触发的位置（location）

Java bytecode has traditionally had four opcodes
that handle different cases of method invocation:

- static methods,
- "normal" invocation (a virtual call that may involve method overriding),
- interface lookup, and
- "special" invocation (for cases where override resolution is not required, such as **superclass calls** and **private methods**).

Dynamic invocation goes much further than that by offering a mechanism
through which the decision about which method is actually called is made by the programmer, on a **per-call site** basis.

Here, `invokedynamic` call sites are represented as `CallSite` objects in the Java heap.
This isn't strange: Java has been doing similar things with the Reflection API since Java 1.1
with types such as `Method` and, for that matter, `Class`.
Java has many dynamic behaviors at runtime,
so there should be nothing surprising about the idea
that Java is now modeling **call sites** as well as other runtime type information.

> call site 原本是一个抽象的概念，现在具象化成一个 CallSite 类型的对象

When the `invokedynamic` instruction is reached,
the JVM locates the corresponding call site object
(or it creates one, if this call site has never been reached before).
The **call site object** contains a **method handle**,
which is an object that represents the method that I actually want to invoke.

> call site object ---> method handle

The **call site object** is a necessary level of indirection,
allowing the associated invocation target (that is, the **method handle**) to change over time.

> call site object = a necessary level of indirection

There are three available subclasses of `CallSite` (which is abstract):
`ConstantCallSite`, `MutableCallSite`, and `VolatileCallSite`.
The base class has only package-private constructors, while the three subtypes have public constructors.
This means that `CallSite` cannot be directly subclassed by user code, but it is possible to subclass the subtypes.
For example, the JRuby language uses `invokedynamic` as part of its implementation and subclasses `MutableCallSite`.

```text
            ┌─── ConstantCallSite
            │
CallSite ───┼─── MutableCallSite
            │
            └─── VolatileCallSite
```

```java
/**
 * A CallSite is a holder for a variable MethodHandle, which is called its target.
 */
public abstract class CallSite {
    // The actual payload of this call site.
    final MethodHandle target;
}
```

```java
public class ConstantCallSite extends CallSite {
}
```

```java
public class MutableCallSite extends CallSite {
}
```

```java
public class VolatileCallSite extends CallSite {
}
```

Note: Some `invokedynamic` call sites are effectively just **lazily computed**,
and the method they target will never change after they have been executed the first time.
This is a very common use case for `ConstantCallSite`, and this includes lambda expressions.

This means that a **non-constant call site** can have **many different method handles**
as its target over the lifetime of a program.


## Reference

- [Mastering the mechanics of Java method invocation](https://blogs.oracle.com/javamagazine/post/mastering-the-mechanics-of-java-method-invocation)
- [Understanding Java method invocation with invokedynamic](https://blogs.oracle.com/javamagazine/post/understanding-java-method-invocation-with-invokedynamic)
- [Behind the scenes: How do lambda expressions really work in Java?](https://blogs.oracle.com/javamagazine/post/behind-the-scenes-how-do-lambda-expressions-really-work-in-java)

