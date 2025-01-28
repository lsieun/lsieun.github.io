---
title: "IOC VS. DI"
sequence: "101"
---

IOC (Inversion of control) is a general parent term
while DI (Dependency injection) is a subset of IOC.
IOC is a concept where the flow of application is inverted.

DI provides objects that an object needs.
So rather than the dependencies construct themselves they are injected by some external means.

The basic idea of IoC is that the control of creating and managing objects
is removed from the code itself and placed into the hands of an IoC framework.

So summarizing the differences.

- **Inversion of control**:- It's a generic term and implemented in several ways (events, delegates etc).
- **Dependency injection**:- DI is a subtype of IOC and is implemented by constructor injection, setter injection or method injection.

IoC inverts the **flow of control** as compared to **traditional control flow**.

## Implementation techniques

In object-oriented programming, there are several basic techniques to implement **inversion of control**. These are:

- Using a **service locator pattern**
- Using **dependency injection**; for example,
  - Constructor injection
  - Parameter injection
  - Setter injection
  - Interface injection
  - Method Injection
- Using a contextualized lookup
- Using the **template method design pattern**
- Using the **strategy design pattern**

> 这里主要是想体现DI是实现IOC的一种方式

**Inversion of Control** is a programming technique
in which object coupling is bound at run time by **an assembler object** and
is typically not known at compile time using static analysis.



## Reference

- [InversionOfControl](https://martinfowler.com/bliki/InversionOfControl.html)
- [Wiki: Inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control)
