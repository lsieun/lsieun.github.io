---
title: "invokespecial"
sequence: "102"
---

## Java 8

`invokespecial` is used in three situations in which an **instance method**
must be invoked based on **the type of the reference**, not on **the class of the object**.
The three situations are:

- invocation of instance initialization (`<init>`) methods
- invocation of private methods
- invocation of methods using the `super` keyword

## Java 11

- 在 Java 8 中，调用 private 方法，会使用 `invokespecial` 指令
- 在 Java 11 中，调用 private 方法，会使用 `invokevirtual` 指令

there is a `javac` flag for this: `-XDdisableVirtualizedPrivateInvoke`

## Reference

- [Why does the Java compiler 11 use invokevirtual to call private methods?](https://stackoverflow.com/questions/67226178/why-does-the-java-compiler-11-use-invokevirtual-to-call-private-methods)
- [JEP 181: Nest-Based Access Control](https://openjdk.java.net/jeps/181)
