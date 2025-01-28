---
title: "The Unnamed Package"
sequence: "102"
---

If a package declaration is not used, classes are placed in an **unnamed package**.

> 什么是 unnamed package

**Classes in an unnamed package cannot be imported by classes in any other package.**

> 这里需要注意

The official Java Tutorial advises against this:

```text
Generally speaking, an unnamed package is only for small or temporary applications or
when you are just beginning the development process.
Otherwise, classes and interfaces belong in named packages.
```

[Section 7.5 of the JLS](https://docs.oracle.com/javase/specs/jls/se7/html/jls-7.html#jls-7.5) explicitly states that a compiler error will result from trying to import a type from an unnamed package.


An `import` declaration makes types or members available by their simple names only within the compilation unit
that actually contains the import declaration.
The scope of the type(s) or member(s) introduced
by an import declaration specifically does not include the PackageName of a package declaration,
other import declarations in the current compilation unit, or other compilation units in the same package.

An import declaration makes types or members available by their simple names only within the compilation unit
that actually contains the import declaration.
The scope of the type(s) or member(s) introduced
by an import declaration specifically does not include other compilation units in the same package,
other import declarations in the current compilation unit, or a package declaration in the current compilation unit (except for the annotations of a package declaration).

A type in an unnamed package (§7.4.2) has no canonical name,
so the requirement for a canonical name in every kind of import declaration implies that
(a) **types in an unnamed package cannot be imported**,
and (b) **static members of types in an unnamed package cannot be imported**.
As such, §7.5.1, §7.5.2, §7.5.3, and §7.5.4 all require a compile-time error on any attempt to import a type (or static member thereof) in an unnamed package.
[Link](https://docs.oracle.com/javase/specs/jls/se7/html/jls-7.html#jls-7.5)

> 注意：上面这段在 Java 7 的文档中，在 Java 8 的文档中没有。



## Reference

Wiki

- [Java package](https://en.wikipedia.org/wiki/Java_package) 这里简单的提到 Classes in an unnamed package cannot be imported by classes in any other package.

Oracle

- [Chapter 7. Packages](https://docs.oracle.com/javase/specs/jls/se8/html/jls-7.html)
