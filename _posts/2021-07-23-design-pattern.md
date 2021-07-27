---
title:  "Design Patterns"
categories: software
image: /assets/images/design-pattern/design-pattern-in-java.png
tags: design-pattern
published: false
---

In software engineering, a design pattern is a general repeatable solution to a commonly occurring problem in software design.

## What is Design Patterns

In software engineering, a design pattern is a general repeatable solution to a commonly occurring problem in software design.
A design pattern isn't a finished design that can be transformed directly into code.
It is a description or template for how to solve a problem that can be used in many situations.

## Uses of Design Patterns

- **Design patterns can speed up the development process** by providing tested, proven development paradigms. Effective software design requires considering issues that may not become visible until later in the implementation. Reusing design patterns helps to prevent subtle issues that can cause major problems and improves code readability for coders and architects familiar with the patterns.
- Often, people only understand how to apply certain software design techniques to certain problems. These techniques are difficult to apply to a broader range of problems. Design patterns provide general solutions, documented in a format that doesn't require specifics tied to a particular problem.
- In addition, **patterns allow developers to communicate using well-known, well-understood names for software interactions**. Common design patterns can be improved over time, making them more robust than ad-hoc designs.

## Object-oriented design principles

Before reading design patterns, I suggest reading some useful oops design principles:

- Encapsulate what varies.
- Code to an interface rather than to an implementation
- Delegation principle
- The open closed principle (OCP)
- DRY- Don't Repeat Yourself
- Single Responsibility Principle (SRP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Injection or Inversion principle

设计模式的6个基本原则（这里先列出来，接下来会参考案例一个个解释）：

1、单一职责原则（Single Responsibility Principle）
2、里氏代换原则（Liskov Substitution Principle）
3、依赖倒转原则（Dependence Inversion Principle）
4、接口隔离原则（Interface Segregation Principle）
5、迪米特法则，又称最少知道原则（Demeter Principle）
6、开闭原则（Open Close Principle）


## Organizing the Catalog

Design patterns are organized into Creational, Structural, or Behavioral purpose.

- Creational patterns concern the process of object creation.
- Structural patterns deal with the composition of classes or objects.
- Behavioral patterns characterize the ways in which classes or objects interact and distribute responsibility.

### Creational design patterns

- Singleton Design Pattern
- Factory Design Pattern
- Abstract Factory Design Pattern
- Builder Design Pattern
- Prototype Design Pattern

### Structural design patterns

- Adapter Design Pattern
- Bridge Design Pattern
- Composite Design Pattern
- Decorator Design Pattern
- Facade Design Pattern
- Flyweight Design Pattern
- Proxy Design Pattern

### Behavioral design patterns

- Chain of responsibility
- Command Design Pattern
- Iterator Design Pattern
- Mediator Design Pattern
- Memento Design Pattern
- Observer Design Pattern
- State Design Pattern
- Strategy Design Pattern
- Template Method Design Pattern
- Delegation Pattern

## References

- [Wiki: SOLID](https://en.wikipedia.org/wiki/SOLID)
- Wiki: GRASP: `https://en.wikipedia.org/wiki/GRASP_(object-oriented_design)`

相关书籍

- Head First Design Patterns
- Design Patterns: Elements of Reusable Object-Oriented Software

系列文章

- [refactoring.guru: DESIGN PATTERNS](https://refactoring.guru/design-patterns)
- [sourcecodeexamples: Design Patterns Overview](https://www.sourcecodeexamples.net/2017/12/design-patterns-overview.html)
    - [Github:sourcecodeexamples源码](https://github.com/RameshMF/gof-java-design-patterns)
- [The Software Architecture Chronicles](https://herbertograca.com/2017/07/03/the-software-architecture-chronicles/)

单独文章


