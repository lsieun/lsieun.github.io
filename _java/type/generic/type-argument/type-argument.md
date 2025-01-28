---
title: "Type Argument: Wildcards"
sequence: "105"
---

## 1. What is a type argument?

A reference type that is used for **the instantiation of a generic type** or for **the instantiation of a generic method**, or **a wildcard that is used for the instantiation of a generic type**. An **actual type argument** replaces the **formal type parameter** used in the declaration of the generic type or method.

Generic types and methods have **formal type parameters**, which are replaced by **actual type arguments** when the parameterized type or method is instantiated.

Example (of a generic type):

```text
class Box <T> {
  private T theObject;
  public Box(T arg) { theObject = arg; }
  ...
}

class Test {
  public static void main(String[] args) {
    Box <String> box = new Box <String> ("Jack");
  }
}
```

In the example we see a generic class `Box` with one formal type parameter `T`. This formal type parameter is replaced by actual type argument `String`, when the `Box` type is used in the test program.

There are few of rules for type arguments:

- The actual type arguments of a **generic type** are
    - reference types,
    - wildcards, or
    - parameterized types (i.e. instantiations of other generic types).
- **Generic methods** cannot be instantiated using wildcards as actual type arguments.
- **Type parameters** are permitted as actual type arguments.
- **Primitive types** are not permitted as type arguments.
- **Type arguments** must be **within bounds**.

## 2. Which types are permitted as type arguments?

**All references types including parameterized types, but no primitive types**.

All reference types can be used a type arguments of a parameterized type or method. This includes **classes**, **interfaces**, **enum types**, **nested** and **inner types**, and **array types**. **Only primitive types cannot** be used as type argument.

Example (of types as type arguments of a parameterized type):

```text
List< int >                                 l0;          // error
List< String >                              l1;
List< Runnable >                            l2;
List< TimeUnit >                            l3;
List< Comparable >                          l4;
List< Thread.State >                        l5;
List< int[] >                               l6;
List< Object[] >                            l7;
List< Callable<String> >                    l8;
List< Comparable<? super Long> >            l9;
List< Class<? extends Number> >             l10;
List< Map.Entry<?,?> >                      l11;
```

The code sample shows that a primitive type such as `int` is not permitted as type argument.

**Class types**, such as `String`, and **interface types**, such as `Runnable`, are permitted as type arguments. **Enum types**, such as `TimeUnit` (see `java.util.concurrent.TimeUnit`), are also permitted as type arguments.

**Raw types** are permitted as type arguments; `Comparable` is an example.

`Thread.State` is an example of a **nested type**;  `Thread.State` is an enum type nested into the `Thread` class. **Non-static inner types** are also permitted.

An **array type**, such as `int[]` and `Object[]`, is permitted as type arguments of a parameterized type or method.

**Parameterized types** are permitted as type arguments, including concrete parameterized types such as `Callable<String>`, **bounded wildcard parameterized types** such as `Comparable<? super Long>` and `Class<? extends Number>`, and **unbounded wildcard parameterized types** such as `Map.Entry<?,?>`.

The same types are permitted as explicit type arguments of a generic method.

Example (of types as type arguments of a generic method):

```text
List<?> list;
list = Collections.< int >emptyList();              // error
list = Collections.< String >emptyList();
list = Collections.< Runnable >emptyList();
list = Collections.< TimeUnit >emptyList();
list = Collections.< Comparable >emptyList();
list = Collections.< Thread.State >emptyList();
list = Collections.< int[] >emptyList();
list = Collections.< Object[] >emptyList();
list = Collections.< Callable<String> >emptyList();
list = Collections.< Comparable<? super Long> >emptyList();
list = Collections.< Class<? extends Number> >emptyList();
list = Collections.< Map.Entry<?,?> >emptyList();
```

The code sample shows that primitive types such as `int` are not permitted as type argument of a **generic method** either.

## 3. Are wildcards permitted as type arguments?

For instantiation of a **generic type**, **yes**. For instantiation of a **generic method**, **no**.

A wildcard is a syntactic construct that denotes **a family of types**.

All wildcards can be used as type arguments of a **parameterized type**.  This includes the unbounded wildcard as well as wildcards with an upper or lower bound.

Examples:

```text
List< ? >                 l0;
List< ? extends Number >  l1;
List< ? super Long >      l2;
```

Wildcards can not be used as type arguments of a **generic method**.

Examples:

```text
list = Collections.< ? >emptyList(); //error
list = Collections.< ? extends Number >emptyList(); //error
list = Collections.< ? super Long >emptyList(); //error
```
