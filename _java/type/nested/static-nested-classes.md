---
title: "Static Nested Classes"
sequence: "101"
---

## 对外部类的成员访问

As with class methods and variables,
a **static nested class** is associated with its outer class.
And like static class methods,
a static nested class cannot refer directly to instance variables or methods defined in its enclosing class:
it can use them only through an object reference.

Note: A static nested class interacts with the instance members of its outer class (and other classes) just like any other top-level class.
In effect, a static nested class is behaviorally a top-level class
that has been nested in another top-level class for packaging convenience.

## 创建对象

```text
class OuterClass {
    ...
    class InnerClass {
        ...
    }
    static class StaticNestedClass {
        ...
    }
}
```

You instantiate a static nested class the same way as a top-level class:

```text
StaticNestedClass staticNestedObject = new StaticNestedClass();
```

