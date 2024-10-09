---
title: "Variable Handles"
sequence: "101"
---

Java 9 introduced a new API called **variable handles**
(extending Java 7's **method handles**, which few developers have a use case for).
It centers around the class `java.lang.invoke.VarHandle`,
whose instances are strongly typed references to variables:
for example, fields (although it's not limited to that).
It addresses use cases from areas like **reflection**, **concurrency**, and **off-heap data storage**.

Compared to the **reflection API**, it offers more **type safety** and **better performance**.

```java
import java.lang.invoke.MethodHandles;
import java.lang.invoke.VarHandle;
import java.lang.reflect.Field;

public class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public static void main(String[] args) throws Exception {
        Object obj = new HelloWorld("Tom", 10);
        String fieldName = "name";

        Class<?> clazz = obj.getClass();
        Field field = clazz.getDeclaredField(fieldName);

        MethodHandles.Lookup lookup = MethodHandles.lookup();
        VarHandle handle = lookup.unreflectVarHandle(field);
        Object value = handle.get(obj);
        System.out.println(value);
    }
}
```

## What Are Variable Handles?

Generally, **a variable handle is just a typed reference to a variable.**
The variable can be an array element, instance, or static field of the class.

The `VarHandle` class provides write and read access to variables under specific conditions.

`VarHandle`s are immutable and have no visible state. What's more, they cannot be sub-classed.

Each VarHandle has :

a generic type T, which is the type of every variable represented by this VarHandle
a list of coordinate types CT, which are types of coordinate expressions, that allow locating variable referenced by this VarHandle
The list of coordinate types may be empty.

The goal of `VarHandle` is to define a standard for invoking equivalents of `java.util.concurrent.atomic` and
`sun.misc.Unsafe` operations on fields and array elements.

Those operations are mostly atomic or ordered operations — for example, atomic field incrementation.

## Reference

- [Java 9 Variable Handles Demystified](https://www.baeldung.com/java-variable-handles)
