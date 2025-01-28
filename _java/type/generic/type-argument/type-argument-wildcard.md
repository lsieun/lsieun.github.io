---
title: "Type Argument: Wildcards"
sequence: "105"
---

A **parameterized type**, such as `ArrayList<T>`, is not instantiable; we cannot create instances of them.
This is because `<T>` is just a type parameter — merely a placeholder for a genuine type.
It is only when we provide a concrete value for the type parameter (e.g., `ArrayList<String>`)
that the type becomes fully formed and we can create objects of that type.

This poses a problem if the type that we want to work with is unknown at compile time.
Fortunately, the Java type system is able to accommodate this concept.
It does so by having an explicit concept of the unknown type — which is represented as `<?>`.
This is the simplest example of Java's **wildcard types**.

We can write expressions that involve the unknown type:

```text
ArrayList<?> mysteryList = unknownList();
Object o = mysteryList.get(0);
```

This is perfectly valid Java — `ArrayList<?>` is a complete type that a variable can have, unlike `ArrayList<T>`.
We don't know anything about `mysteryList`'s payload type, but that may not be a problem for our code.

For example, when we get an item out of `mysteryList`, it has a completely unknown type.
However, we can be sure that the object is assignable to `Object` —
because all valid values of a generic type parameter are reference types and all reference values can be assigned to a variable of type `Object`.

On the other hand, when we're working with the unknown type, there are some limitations on its use in user code.
For example, this code will not compile:

```text
// Won't compile
mysteryList.add(new Object());
```

The reason for this is simple — we don't know what the payload type of `mysteryList` is!
For example, if `mysteryList` was really a instance of `ArrayList<String>`,
then we wouldn't expect to be able to put an `Object` into it.

The only value that we know we can always insert into a container is `null` — as we know that `null` is a possible value for any reference type.
This isn't that useful, and for this reason, the Java language spec also rules out instantiating a container object with the unknown type as payload, for example:

```text
// Won't compile
List<?> unknowns = new ArrayList<?>();
```

**The unknown type** may seem to be of limited utility,
but one very important use for it is as a starting point for resolving the covariance question.
We can use the unknown type if we want to have a subtyping relationship for containers, like this:

```text
// Perfectly legal
List<?> objects = new ArrayList<String>();
```

This means that `List<String>` is a subtype of `List<?>` — although when we use an assignment like the preceding one,
we have lost some type information.
For example, the return type of `get()` is now effectively `Object`.

Note: `List<?>` is not a subtype of any `List<T>`, for any value of `T`.

**The unknown type** sometimes confuses developers — provoking questions like,
“Why wouldn't you just use `Object` instead of **the unknown type**?”
However, as we've seen, the need to have subtyping relationships between **generic types** essentially requires us to have a notion of **the unknown type**.

## BOUNDED WILDCARDS

In fact, Java's **wildcard types** extend beyond just **the unknown type**, with the concept of **bounded wildcards**.

They are used to describe **the inheritance hierarchy** of a **mostly unknown type**— effectively making statements like,
for example, “I don't know anything about this type, except that it must implement `List`.”

This would be written as `? extends List` in the **type parameter**.
This provides a useful lifeline to the programmer — instead of being restricted to the totally unknown type,
she knows that at least the capabilities of the type bound are available.

The `extends` keyword is always used, regardless of whether the constraining type is a `class` or `interface` type.

A wildcard is a syntactic construct with a "`?`" that denotes not just one type, but **a family of types**.  In its simplest form a wildcard is just a question mark and stands for "all types".

## 1. What is a wildcard?

A syntactic construct that denotes **a family of types**.

A wildcard describes a family of types. There are 3 different flavors of wildcards:

- "`?`" - the unbounded wildcard. It stands for the family of all types.
- "`? extends Type`" - a wildcard with an **upper bound**. It stands for the family of all types that are subtypes of `Type`, type `Type` being included.
- "`? super Type`" - a wildcard with a **lower bound**. It stands for the family of all types that are supertypes of `Type`, type `Type` being included.

Wildcards are used to declare so-called wildcard parameterized types, where a wildcard is used as an argument for instantiation of generic types. Wildcards are useful in situations where no or only partial knowledge about the type argument of a parameterized type is required.

## 2. What is an unbounded wildcard?

**A wildcard without a bound**.

The unbounded wildcard looks like "`?`" and stands for **the family of all types**.

The unbounded wildcard is used as argument for instantiations of generic types. The **unbounded wildcard is useful** in situations where **no knowledge about the type argument of a parameterized type is needed**.

Example:

```text
void printCollection( Collection<?> c){   // an unbounded wildcard parameterized type
  for (Object o : c){
    System.out.println(o);
  }
}
```

The `printCollection` method does not require any particular properties of the elements contained in the collection that it prints. For this reason it declares its argument using an **unbounded wildcard parameterized type**, saying that **any type of collection** regardless of the element type **is welcome**.

## 3. What is a bounded wildcard?

**A wildcard with either an upper or a lower bound**.

**A wildcard with an upper bound** looks like "`? extends Type`" and stands for the family of all types that are subtypes of `Type`, type `Type` being included. `Type` is called the upper bound.

**A wildcard with a lower bound** looks like "`? super Type`" and stands for the family of all types that are supertypes of `Type`, type `Type` being included. `Type` is called the lower bound.

Note, **a wildcard can have only one bound**. In can neither have both an upper and a lower bound nor several upper or lower bounds. Constructs such as "`? super Long extends Number`"  or  "`? extends Comparable<String> & Cloneable`" are illegal.

Bounded wildcards are used as arguments for instantiation of generic types. **Bounded wildcards are useful** in situations where **only partial knowledge about the type argument of a parameterized type is needed**, but where **unbounded wildcards** carry too little type information.

Example:

```java
public class Collections {
  public static <T> void copy(List<? super T> dest, List<? extends T> src) {  // bounded wildcard parameterized types
      for (int i=0; i<src.size(); i++)
        dest.set(i,src.get(i));
  }
}
```

The `copy` method copies elements from a source list into a destination list. The destination list must be capable of holding the elements from the source list. We express this by means of **bounded wildcards**: the output list is required to have an element type with a lower bound `T` and the input list must have an element type with an upper bound `T`.

Let's study an example to explore **the typical use of bounded wildcards** and to explain why unbounded wildcards do not suffice. It's the example of the `copy` method mentioned above. It copies elements from a source list into a destination list. Let's start with a naive implementation of such a `copy` method.

Example (of a restrictive implementation of a copy method):

```java
public class Collections {
  public static <T> void copy(List<T> dest, List<T> src) {  // uses no wildcards
      for (int i=0; i<src.size(); i++)
        dest.set(i,src.get(i));
  }
}
```

This implementation of a `copy` method is more restrictive than it need be, because it requires that both input and output collection must be lists with the exact same type. For instance, the following invocation - although perfectly sensible - would lead to an error message:

Example (of illegal use of the copy method):

```text
List<Object> output = new ArrayList< Object >();
List<Long>    input = new ArrayList< Long >();
...
Collections.copy(output,input);  // error: illegal argument types
```

The invocation of the `copy` method is rejected because the declaration of the method demands that both lists must be of the same type. Since the source list is of type `List<Long>` and the destination list is of type `List<Object>` the compiler rejects the method call, regardless of the fact that a list of `Object` references can hold `Long`s. If both list were of type `List<Object>` or both were of type `List<Long>` the method call were accepted.

We could try to relax the method's requirements to the argument types and declare **wildcard parameterized types** as the method parameter types.  Declaring wildcard parameterized types as method parameter types has the advantage of allowing a broader set of argument types. Unbounded wildcards allow the broadest conceivable argument set, because the unbounded wildcard `?` stands for any type without any restrictions. Let's try using an **unbounded wildcard parameterized type**.  The method would then look as follows:

Example (of a relaxed copy method; does not compile):

```java
public class Collections {
  public static void copy(List<?> dest, List<?> src) {  // uses unbounded wildcards
      for (int i=0; i<src.size(); i++)
        dest.set(i,src.get(i)); // error: illegal argument types
  }
}
```

It turns out that this relaxed method signature does not compile.  The problem is that the `get()` method of a `List<?>` returns **a reference pointing to an object of unknown type**. References pointing to objects of unknown type are usually expressed as a reference of type `Object`. Hence `List<?>.get()` returns an `Object`.

On the other hand, the `set()` method of a `List<?>` requires **something unknown**, and **"unknown" does not mean that the required argument is of type `Object`**. Requiring an argument of type `Object` would mean accepting everything that is derived of `Object`. That's not what the `set()` method of a `List<?>` is asking for. Instead, **"unknown" in this context** means that **the argument must be of a type that matches the type that the wildcard `?` stands for**.  That's a much stronger requirement than just asking for an `Object`.

For this reason the compiler issues an error message: `get()` returns an `Object` and `set()` asks for a more specific, yet unknown type. In other words, the method signature is too relaxed.  Basically, a signature such as `void copy(List<?> dest, List<?> src)` is saying that the method takes one type of list as a source and copies the content into another - totally unrelated - type of destination list. Conceptually it would allow things like copying a list of apples into a list of oranges. That's clearly not what we want.

What we really want is a signature that allows copying elements from a source list into a destination list with a specific property, namely that it is capable of holding the source list's elements. Unbounded wildcards are too relaxed for this purpose, as we've seen above, but bounded wildcards are suitable in this situation.  A bounded wildcard carries more information than an unbounded wildcard.

In our example of a `copy` method we can achieve our goal of allowing all sensible method invocations by means of bounded wildcards, as in the following implementation of the copy method:

Example (of an implementation of the copy method that uses bounded wildcards):

```java
public class Collections {
  public static <T> void copy(List<? super T> dest, List<? extends T> src) {  // uses bounded wildcards
      for (int i=0; i<src.size(); i++)
        dest.set(i,src.get(i));
  }
}
```

In this implementation we require that a type `T` exists that is subtype of the output list's element type and supertype of the input list's element type.  We express this by means of wildcards: the output list is required to have an element type with a lower bound `T` and the input list must have an element type with an upper bound `T`.

Example (of using the copy method with wildcards):

```text
List<Object> output = new ArrayList< Object >();
List<Long>    input = new ArrayList< Long >();
...
Collections.copy(output,input);  // fine; T:= Number & Serializabe & Comparable<Number>

List<String> output = new ArrayList< String >();
List<Long>    input = new ArrayList< Long >();
...
Collections.copy(output,input);  // error
```

In the first method call `T` would have to be a supertype of `Long` and a subtype of `Object`, and luckily there is a number of types that fall into this category, namely `Number`, `Serializable` and `Comparable<Number>`. Hence the compiler can use any of the 3 types as type argument and the method invocation is permitted.

The second nonsensical method call is rejected by the compiler, because the compiler realizes that there is no type that is subtype of `String` and supertype of `Long`.

Conclusion:

**Bounded wildcards** carry more information than **unbounded wildcards**. While an unbounded wildcard stands for a representative from the family of all types, a bounded wildcards stands for a represenstative of a family of either super- or subtypes of a type.  Hence a bounded wildcard carries more type information than an unbounded wildcard. The supertype of such a family is called the upper bound, the subtype of such a family is called the lower bound.

## 4. Which types are permitted as wildcard bounds?

All references types including parameterized types, but no primitive types.

All reference types can be used as a wildcard bound. This includes **classes**, **interfaces**, **enum types**, **nested** and **inner types**, and **array types**. **Only primitive types** cannot be used as wildcard bound.

Example (of wildcard bounds):

```text
List<? extends int >                                 l0;          // error
List<? extends String >                              l1;
List<? extends Runnable >                            l2;
List<? extends TimeUnit >                            l3;
List<? extends Comparable >                          l4;
List<? extends Thread.State >                        l5;
List<? extends int[] >                               l6;
List<? extends Object[] >                            l7;
List<? extends Callable<String> >                    l8;
List<? extends Comparable<? super Long> >            l9;
List<? extends Class<? extends Number> >             l10;
List<? extends Map.Entry<?,?> >                      l11;
List<? extends Enum<?> >                             l12;
```

The example only shows the various reference types as upper bound of a wildcard, but these type are permitted as lower bound as well.

We can see that **primitive types** such as `int` are not permitted as wildcard bound.

**Class types**, such as `String`, and **interface types**, such as `Runnable`, are permitted as wildcard bound. **Enum types**, such as `TimeUnit` (see `java.util.concurrent.TimeUnit`) are also permitted as wildcard bound. Note, that even types that do not have subtypes, such as **final classes** and **enum types**, can be used as upper bound. The resulting family of types has exactly one member then. For instance, "`? extends String`" stands for the type family consisting of the type `String` alone. Following the same line of logic, the wildcard "`? super Object`" is permitted, too, although class `Object` does not have a supertype. The resulting type family consists of type `Object` alone.

**Raw types** are permitted as wildcard bound; `Comparable` is an example.

`Thread.State` is an example of a **nested type**; `Thread.State` is an enum type nested into the `Thread` class. **Non-static inner types** are also permitted.

An **array type**, such as `int[]` and `Object[]`, is permitted as wildcard bound. Wildcards with an array type as a bound denote the family of all sub- or supertypes of the wildcard type. For instance, "`? extends Object[]`" is the family of all array types whose component type is a reference type. `int[]` does not belong to that family, but `Integer[]` does. Similarly, "`? super Number[]`" is the family of all supertypes of the array type, such as `Object[]`, but also `Object`, `Cloneable` and `Serializable`.

**Parameterized types** are permitted as wildcard bound, including concrete parameterized types such as `Callable<String>`, bounded wildcard parameterized types such as `Comparable<? super Long>` and `Class<? extends Number>`, and unbounded wildcard parameterized types such as `Map.Entry<?,?>`. Even the primordial supertype of all enum types, namely class `Enum`, can be used as wildcard bound.

## What is the difference between a wildcard bound and a type parameter bound?

**A wildcard can have only one bound, while a type parameter can have several bounds.**

A **wildcard** can have **a lower or an upper bound**, while there is **no such thing as a lower bound** for a **type parameter**.

Wildcard bounds and type parameter bounds are often confused, because they are both called bounds and have in part similar syntax.

Example (of type parameter bound and wildcard bound):

```text
class Box<T extends Appendable & Flushable> {
  private T theObject;
  public Box(T arg) { theObject = arg; }
  public Box(Box<? extends T> box) { theObject = box.theObject; }
  ...
}
```

The code sample above shows a type parameter `T` with two bounds, namely `Appendable` and `Flushable`, and a wildcard with an upper bound `T`.

The **type parameter bounds** give access to their non-static methods. For instance, in the example above, the bound `Flushable` makes is possible that the `flush` method can be invoked on variables of type `T`. In other words, the compiler would accept an expression such as `theObject.flush()`.

The **wildcard bound** describes the family of types that the wildcard stands for. In the example, the wildcard "`? extends T`" denotes the family of all subtypes of `T`. It is used in the argument type of a constructor and permits that box objects of a box type from the family `Box<? extends T>` can be supplied as constructor arguments. It allows that a `Box<Writer>` can be constructed from a `Box<PrintWriter>`, for instance.

The syntax is similar and yet different:

- type parameter bound: `TypeParameter extends Class & Interface 1 & ... & Interface N`
- wildcard bound
    - upper bound: `? extends SuperType`
    - lower bound: `? super SubType`

A **wildcard** can have only one bound, either a lower or an upper bound. A list of wildcard bounds is not permitted.

A **type parameter**, in constrast, can have several bounds, but there is no such thing as a lower bound for a type parameter.

