---
title: "门面模式"
sequence: "facade"
---

![](/assets/images/design-pattern/diagrams/facade-structure.png)


## Intent

**Facade** is a **structural design pattern**
that **provides a simplified (but limited) interface** to **a complex system of classes, library or framework.**

![](/assets/images/design-pattern/facade.png)

## Problem

Imagine that you must make your code work with a broad set of objects
that belong to a sophisticated library or framework.
Ordinarily, you'd need to initialize all of those objects,
keep track of dependencies, execute methods in the correct order, and so on.

As a result, the business logic of your classes would become tightly coupled to
the implementation details of 3rd-party classes, making it hard to comprehend and maintain.

## Solution

A facade is a class
that provides a simple interface to a complex subsystem
which contains lots of moving parts.
A facade might provide limited functionality in comparison to working with the subsystem directly.
However, it includes only those features that clients really care about.

Having a facade is handy when you need to integrate your app with a sophisticated library that has dozens of features,
but you just need a tiny bit of its functionality.

For instance, an app
that uploads short funny videos with cats to social media
could potentially use a professional video conversion library.
However, all that it really needs is a class with the single method `encode(filename, format)`.
After creating such a class and connecting it with the video conversion library, you'll have your first facade.

## 举例

- SL4J

## Reference

- [Facade](https://refactoring.guru/design-patterns/facade)
