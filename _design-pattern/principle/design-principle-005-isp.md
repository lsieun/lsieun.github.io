---
title: "SOLID-I：接口隔离原则"
sequence: "105"
---

ISP = Interface Segregation Principle

**Larger interfaces should be split into smaller ones.**
By doing so, we can ensure that implementing classes only need to be concerned about
the methods that are of interest to them.

The goal of this principle is to reduce the side effects of using larger interfaces
by breaking application interfaces into smaller ones.
It's similar to the **Single Responsibility Principle**, where each class or interface serves a single purpose.

Precise application design and correct abstraction is the key behind the Interface Segregation Principle.
Though it'll take more time and effort in the design phase of an application and might increase the code complexity, in the end, we get a flexible code.

## Reference

- [Interface Segregation Principle in Java](https://www.baeldung.com/java-interface-segregation)
