---
title: "Type System: super-subtype-relationship"
sequence: "128"
---

## 1. difference

### 1.1. What is the difference between the unbounded wildcard parameterized type and the raw type?

**The compiler issues error messages for an unbounded wildcard parameterized type while it only reports "unchecked" warnings for a raw type**.

In code written after the introduction of genericity into the Java programming language you would usually avoid use of **raw types**, because it is discouraged and raw types might no longer be supported in future versions of the language (according to the Java Language Specification).  Instead of the **raw type** you can use the **unbounded wildcard parameterized type**.

The raw type and the unbounded wildcard parameterized type have a lot in common. Both act as kind of a supertype of all instantiations of the corresponding generic type. Both are so-called **reifiable types**. Reifiable types can be used in `instanceof` expressions and as the component type of arrays, where non-reifiable types (such as concrete and bounded wildcard parameterized type) are not permitted.

In other words, the **raw type** and the **unbounded wildcard parameterized type** are **semantically equivalent**. **The only difference** is that **the compiler applies stricter rules to the unbounded wildcard parameterized type than to the corresponding raw type**. Certain operations performed on the raw type yield "unchecked" warnings. The same operations, when performed on the corresponding  unbounded wildcard parameterized type, are rejected as errors.

## 2. Example

### 2.1. Is `List<Object>` a supertype of `List<String>`?

No, different instantiations of the same generic type for different concrete type arguments have no type relationship.

It is sometimes expected that a `List<Object>` would be a supertype of a `List<String>`, because `Object` is a supertype of `String`. This expectation stems from the fact that such a type relationship exists for arrays:  `Object[]` is a supertype of `String[]`, because `Object` is a supertype of `String`. (This type relationship is known as **covariance**.) The super-subtype-relationship of the component types extends into the corresponding array types. No such a type relationship exists for instantiations of generic types. (Parameterized types are not covariant.)

The lack of a **super-subtype-relationship** among instantiations of the same generic type has various consequences.  Here is an example.

Example:

```java
void printAll(ArrayList<Object> c) {
  for (Object o : c)
    System.out.println(o);
}

ArrayList<String> list = new ArrayList<String>();
... fill list ...
printAll(list);   // error
```

A `ArrayList<String>` object cannot be passed as argument to a method that asks for a `ArrayList<Object>` because the two types are instantiations of **the same generic type**, but for different type arguments, and for this reason they are not compatible with each other.<sub>generic type 相同，而 type argument 不同</sub>

On the other hand, instantiations of **different generic types** for the same type argument can be compatible.<sub>type argument 相同，而 generic type 不同</sub>

Example:

```java
void printAll(Collection<Object> c) {
  for (Object o : c)
    System.out.println(o);
}

List<Object> list = new ArrayList<Object>();
... fill list ...
printAll(list);   // fine
```

A `List<Object>` is compatible to a `Collection<Object>` because the two types are instantiations of a generic supertype and its generic subtype and the instantiations are for the same type argument `Object`.

Compatibility between **instantiations of the same generic type** exist only among **wildcard instantiations** and **concrete instantiations** that belong to the family of instantiations that the wildcard instantiation denotes.
