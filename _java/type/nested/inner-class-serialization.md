---
title: "Inner Classes Serialization"
sequence: "103"
---

Serialization of **inner classes**, including **local** and **anonymous classes**, is strongly discouraged.

> 首先，不推荐

When the Java compiler compiles certain constructs, such as **inner classes**, it creates **synthetic constructs**;
these are classes, methods, fields, and other constructs that do not have a corresponding construct in the source code.

> 原因一：从 source code 角度来讲，synthetic construct 没有对应的内容

**Synthetic constructs** enable Java compilers to implement new Java language features without changes to the JVM.
However, synthetic constructs can vary among different Java compiler implementations,
which means that `.class` files can vary among different implementations as well.

> 原因二：从 compiler 角度来讲，不同的 compiler 会生成不同的 synthetic constructs

Consequently, you may have **compatibility issues** if you serialize an inner class and
then deserialize it with a different JRE implementation.
See the section Implicit and Synthetic Parameters in the section Obtaining Names of Method Parameters for more
information about the synthetic constructs generated when an inner class is compiled.

> 原因三：从 JER/JVM 角度来讲，不同版本的 JRE/JVM 存在兼容性的问题

- synthetic constructs
    - source code
        - do not have a corresponding construct in the source code
    - compiler
        - vary among different Java compiler implementations
    - JRE/JVM
        - compatibility issues

## Reference

- [The Java Tutorials-Nested Classes-Serialization](https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html#serialization)
