---
title: "Annotation Intro"
sequence: "101"
---


从 JDK5 开始，Java 增加了元数据（MetaData）的支持，也就是 Annotation（注释）。

## 什么是 Annotation

According to the Merriam-Webster dictionary, the meaning of annotation is

```text
A note added by way of comment or explanation.
```

This is exactly what an annotation is in Java.
It lets you associate (or annotate) metadata (or notes) to the **program elements** in a Java program.
The **program elements** may be a module, a package, a class, an interface, a field of a class,
a method, a local variable, a parameter of a method, an enum, an annotation,
a type parameter in a generic type/method declaration, a type use, etc.


To make an annotation available to the **compiler** and the **runtime**,
an annotation has to follow rules.
In fact, an annotation is another type like a class and an interface.
As you have to declare a class type or an interface type before you can use it,
you must also declare an annotation type.

An annotation does not change the semantics (or meaning) of the program element that it annotates.
In that sense, an annotation is like a comment,
which does not affect the way the annotated program element works.
You (or a tool/framework) can change the behavior of a program based on an annotation.
In such cases, you use the annotation rather than the annotation doing anything on its own.
The point is that an annotation by itself is always passive.

## Annotations as special interfaces

**annotations are the syntactic sugar used to associate the metadata with different elements of Java language**.

Annotations by themselves do not have any direct effect on the element they are annotating.
However, depending on the annotations and the way they are defined,
they may be used by Java compiler (the great example of that is the `@Override`),
by **annotation processors** and
by **the code at runtime using reflection and other introspection techniques**.

处理 Annotation 的三种方式：

- Compile Time: Java Compiler
- Annotation Processor
- Runtime: Reflection

- JDK 4 个基本 Annotation （普通 Annoation）
    - `@Override`
    - `@Deprecated`
    - `@SuppressWarnings`
    - `@SafeVarargs`
- JDK Meta Annotation （元 Annotation）
    - @Retention
    - @Target
    - @Inherited
    - @Repeatable
- 自定义 Annotation
    - 定义 Annotation 信息
    - 提取 Annotation 信息

```text
                               ┌─── @Retention
                               │
                               ├─── @Target
              ┌─── Meta ───────┤
              │                ├─── @Inherited
              │                │
              │                └─── @Repeatable
              │
              │                ┌─── @Override
              │                │
Annotation ───┤                ├─── @Deprecated
              ├─── Basic ──────┤
              │                ├─── @SuppressWarnings
              │                │
              │                └─── @SafeVarargs
              │
              │
              └─── Advanced ───┼─── @CallerSensitive
```
