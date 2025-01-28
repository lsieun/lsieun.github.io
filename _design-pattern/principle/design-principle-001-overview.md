---
title: "设计原则-概览"
sequence: "101"
---

## Object-oriented design principles

Before reading design patterns, I suggest reading some useful oops design principles:

- Encapsulate what varies.
- Code to an interface rather than to an implementation
- Delegation principle
- The open closed principle (OCP)
- DRY - Don't Repeat Yourself
- Single Responsibility Principle (SRP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Injection or Inversion principle

设计模式的6个基本原则（这里先列出来，接下来会参考案例一个个解释）：

- 1、单一职责原则（Single Responsibility Principle）
- 2、里氏代换原则（Liskov Substitution Principle）
- 3、依赖倒转原则（Dependence Inversion Principle）
- 4、接口隔离原则（Interface Segregation Principle），要求程序开发者尽量将臃肿庞大的接口拆分成更小的和更具体的接口，让接口中只包含用户感兴趣的方法
- 5、迪米特法则，又称最少知道原则（Demeter Principle）
- 6、开闭原则（Open Close Principle）

![](/assets/images/design-pattern/principle/design-solid-principle-mind-map.png)

![](/assets/images/design-pattern/principle/design-solid-principle-relation.png)


## SOLID

The following five concepts make up our SOLID principles:

- S: Single Responsibility
- O: Open/Closed
- L: Liskov Substitution
- I: Interface Segregation
- D: Dependency Inversion

## 开闭原则

开闭原则（Open Close Principle, OCP）

在⾯向对象编程领域中，**开闭原则**规定软件中的对象、类、模块和函数：

- 对扩展应该是开放的，
- 但对于修改是封闭的。

## 单⼀职责原则

单⼀职责原则（Single Responsibility Principle, SRP）

## ⾥⽒替换原则

简单来说，**子类可以扩展父类的功能，但不能改变父类原有的功能**。
也就是说：**当子类继承父类时，除添加新的方法且完成新增功能外，尽量不要重写父类的方法**。
这句话包括了四点含义：

- 子类可以实现父类的抽象方法，但不能覆盖父类的非抽象方法。
- 子类可以增加自己特有的方法。
- 当子类的方法重载父类的方法时，方法的前置条件（即方法的输⼊参数）要比父类的方法更宽松。
- 当子类的方法实现父类的方法（重写、重载或实现抽象方法）时，
  方法的后置条件（即方法的输出或返回值）要比父类的方法更严格或与父类的方法相等。

## Reference

- [A Solid Guide to SOLID Principles](https://www.baeldung.com/solid-principles)
- [Single Responsibility Principle in Java](https://www.baeldung.com/java-single-responsibility-principle)
- [Open/Closed Principle in Java](https://www.baeldung.com/java-open-closed-principle)
- [Liskov Substitution Principle in Java](https://www.baeldung.com/java-liskov-substitution-principle)
- [Interface Segregation Principle in Java](https://www.baeldung.com/java-interface-segregation)
- [Dependency Inversion Principle in Java](https://www.baeldung.com/java-dependency-inversion-principle)
- [Law of Demeter in Java](https://www.baeldung.com/java-demeter-law)
