---
title: "lambda 和 invokedynamic"
sequence: "101"
---

Although **lambdas** and `invokedynamic` are conceptually orthogonal,
in practice **lambdas** are implemented using `invokedynamic`.

```text
笔记：lambda 是 Java Language 范围内的概念，而 invokedynamic 是 ClassFile 范围内的概念，两者是不相关的（orthogonal）概念。
但两者之间也存在联系，即 lambda 底层的实现是依赖于 invokedynamic 完成的。
```

We know that Java code itself does not compile directly to bytes that are executed by the operating system.
Instead, the Java compiler (henceforth, "javac") compiles to another intermediate form,
which is executed by the Java Virtual Machine (henceforth, “JVM”).
This intermediate form is called the Java bytecode.
**Bytecode, however, has no concept of lambdas.**
It also has no concept of **try-with-resources blocks**, **enhanced for-loops**,
or many of the other structures within Java.
Instead, the compiler converts those Java structures into an underlying form in bytecode.

```text
Lambda 是 Java 语言层面的概念，而 invokedynamic 是 ClassFile 层面的 opcode，两者之间关系是：Lambda 是由 invokedynamic 来实现的。
```
