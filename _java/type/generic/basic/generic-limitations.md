---
title: "Generic Limitations"
sequence: "109"
---

## No Generic Exception Classes

因为 Generic 是 compile time 的功能，而 Exception 是 runtime 时才能发挥作用。

Exceptions are thrown at runtime.
The compiler cannot ensure the type-safety of exceptions at runtime
if you use a generic exception class in a **catch clause**,
because the erasure process erases the mention of any type parameter during compilation.

This is the reason that it is a compile-time error to attempt to define a generic class,
which is a direct or indirect subclass of `java.lang.Throwable`.

## No Generic Anonymous Classes

An anonymous class is a one-time class.
You need a class name to specify the actual type parameter.
An anonymous class does not have a name.
Therefore, you cannot have a generic anonymous class.

However, you can have generic methods inside an anonymous class.

> anonymous class 可以有 generic methods

Your anonymous class can inherit a generic class.
An anonymous class can implement generic interfaces.

> anonymous class 可以继承 generic class 或 generic interface

Any class, except an exception type, enums, and anonymous inner classes, can have type parameters.

> 除了 exception type，any class 都可以有 type parameters

## Are there any types that cannot have type parameters?

**All types, except enum types, anonymous inner classes and exception classes, can be generic**.

Almost all reference types can be generic.
This includes classes, interfaces, nested (static) classes, nested interfaces, inner (non-static) classes, and local classes.

The following types cannot be generic:

**Anonymous inner classes**.
They can implement a parameterized interface or extend a parameterized class, but they cannot themselves be generic classes.
A generic anonymous class would be nonsensical.
Anonymous classes do not have a name,
but the name of a generic class is needed for declaring an instantiation of the class and providing the type arguments.
Hence, generic anonymous classes would be pointless.

**Exception types**.
A generic class must not directly or indirectly be derived from class `Throwable`.
Generic exception or error types are disallowed
because the exception handling mechanism is a runtime mechanism and
the Java virtual machine does not know anything about Java generics.
The JVM would not be capable of distinguishing between different instantiations of a generic exception type.
Hence, generic exception types would be pointless.

**Enum types**.
Enum types cannot have type parameters.
Conceptually, an enum type and its enum values are static.
Since type parameters cannot be used in any static context, the parameterization of an enum type would be pointless.

Annotation. 这是我自己测试的结果。

```java
// 会编译出错，提示 @interface may not have type parameters
public @interface HelloWorld<T> {
    Class<T> value();
}
```
