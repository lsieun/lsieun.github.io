---
title: "Java Interface Overview"
sequence: "101"
---

```text
                                       ┌─── Marker Interface
                  ┌─── Prior Java 8 ───┤
                  │                    └─── Constant Interface
                  │
                  │
                  │                    ┌─── Default Method
Java Interface ───┤                    │
                  ├─── Java 8 ─────────┼─── Static Method
                  │                    │
                  │                    └─── @FunctionalInterface
                  │
                  └─── Java 9 ─────────┼─── Private Method
```

接口内定义的成员变量

接口里的变量是 final static 类型的

What is an interface in Java?

An interface is a collection of methods that must be implemented by the implementing class.

An interface defines a **contract** regarding what a class must do, without saying anything about how the class will do it.

Interface can contain declaration of methods and variables.

Implementing class must define all the methods declared in the interface.

If a class implements an interface and does not implement all the methods then class itself must be declared as `abstract`.

Variables in interface automatically become `static` and `final` variable of the implementing class.

Members of interface are implicitly `public`, so need not be declared as `public`.

An interface must be implemented in class.

