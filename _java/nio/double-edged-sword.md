---
title: "No Longer CPU Bound"
sequence: "102"
---

[UP](/java-nio.html)


The JVM is a double-edged sword.
It provides a uniform operating environment that shelters the Java programmer from
most of the annoying differences between operating-system environments.
This makes it faster and easier to write code because platform-specific idiosyncrasies are mostly hidden.
But cloaking the specifics of the operating system means that the jazzy(绚丽的；花哨的), wiz-bang stuff is invisible too.

> idiosyncrasy （个人特有的）习性；特征；癖好 a person's particular way of behaving, thinking, etc., especially when it is unusual

What to do? If you're a developer,
you could write some native code using the Java Native Interface (JNI) to access the operating-system features directly.
Doing so ties you to a specific operating system  (and maybe a specific version of that operating system) and
exposes the JVM to corruption or crashes if your native code is not 100% bug free.
If you're an operating-system vendor,
you could write native code and ship it with your JVM implementation to provide these features as a Java API.
But doing so might violate the license you signed to provide a conforming JVM.
Sun took Microsoft to court about this over the JDirect package which, of course, worked only on Microsoft systems.
Or, as a last resort, you could turn to another language to implement performance-critical applications.

The `java.nio` package provides new abstractions to address this problem.
The `Channel` and `Selector` classes in particular provide generic APIs to I/O services that were not reachable prior to JDK 1.4.
The TANSTAAFL principle still applies:
**you won't be able to access every feature of every operating system,
but these new classes provide a powerful new framework that encompasses the high-performance I/O features commonly available on commercial operating systems today.**
Additionally, a new **Service Provider Interface (SPI)** is provided in `java.nio.channels.spi`
that allows you to plug in new types of channels and selectors without violating compliance with the specifications.

```text
TANSTAAFL = There Ain't No Such Thing As A Free Lunch.
```
