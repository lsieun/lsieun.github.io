---
title: "Inner Classes"
sequence: "102"
---

## 对外部类的成员访问

As with instance methods and variables,
an inner class is associated with an instance of its enclosing class and
has direct access to that object's methods and fields.


> an inner class ---> an instance of its enclosing class

Objects that are instances of an inner class exist within an instance of the outer class.
Consider the following classes:

```text
class OuterClass {
    ...
    class InnerClass {
        ...
    }
}
```

An instance of `InnerClass` can exist only within an instance of `OuterClass` and has direct access to the methods and fields of its enclosing instance.

## Inner Class 的约束

Also, because an inner class is associated with an instance, it cannot define any `static` members itself.

## 创建 Inner Class 实例

To instantiate an inner class, you must first instantiate the outer class.
Then, create the inner object within the outer object with this syntax:

```text
OuterClass outerObject = new OuterClass();
OuterClass.InnerClass innerObject = outerObject.new InnerClass();
```

There are two special kinds of inner classes: local classes and anonymous classes.
