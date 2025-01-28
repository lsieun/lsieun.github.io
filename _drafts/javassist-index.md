---
title: "Javassist (Java Programming Assistant)"
image: /assets/images/javassist/javassist.png
permalink: /javassist.html
---

Javassist (Java Programming Assistant) makes Java bytecode manipulation simple.
It is a class library for editing bytecodes in Java;
it enables Java programs to define a new class at runtime and to modify a class file when the JVM loads it.

Unlike other similar bytecode editors, Javassist provides two levels of API: **source level** and **bytecode level**.
If the users use the **source-level API**,
they can edit a class file without knowledge of the specifications of the Java bytecode.
The whole API is designed with only the vocabulary of the Java language.
You can even specify inserted bytecode in the form of source text; Javassist compiles it on the fly.
On the other hand, the **bytecode-level API** allows the users to directly edit a class file as other editors.

## Reference

- [Javassist](https://www.javassist.org/)
- [Baeldung: Introduction to Javassist](https://www.baeldung.com/javassist)
- [javassist使用全解析](https://www.cnblogs.com/rickiyang/p/11336268.html)
- [Java 字节码编程之非常好用的 javassist](https://cloud.tencent.com/developer/article/1815164)


