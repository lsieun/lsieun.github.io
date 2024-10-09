---
title: "Type Erasure: Reification"
sequence: "118"
---

## 1. What is reification?

**Representing type parameters and arguments of generic types and methods at runtime. Reification is the opposite of type erasure**.

In Java, **type parameters** and **type arguments** are elided when the compiler performs **type erasure**. A side effect of type erasure is that the virtual machine has no information regarding **type parameters** and **type arguments**.  The JVM cannot tell the difference between a `List<String>` and a `List<Date>`.

In other languages, like for instance C#, **type parameters** and **type arguments** of generics types and methods do have a runtime representation. This representation allows the runtime system to perform certain checks and operations based on type arguments. In such a language the runtime system can tell the difference between a `List<String>` and a `List<Date>`.

## 2. What is a reifiable type?

**A type whose type information is fully available at runtime, that is, a type that does not lose information in the course of type erasure**.

As a side effect of **type erasure**, some type information that is present in the **source code** is no longer available at **runtime**. For instance, parameterized types are translated to their corresponding raw type in a process called type erasure and lose the information regarding their type arguments.

For example, types such as `List<String>` or `Pair<? extends Number, ? extends Number>` are available to and used by the compiler in their exact form, including the **type argument** information.  After **type erasure**, the virtual machine has only the raw types `List` and `Pair` available, which means that part of the type information is lost.

In contrast, non-parameterized types such as `java.util.Date` or `java.lang.Thread.State` are not affected by type erasure. Their type information remains exact, because they do not have **type arguments**.

Among the instantiations of a generic type only the **unbounded wildcard instantiations**, such as `Map<?,?>` or `Pair<?,?>`, are unaffected by type erasure.  They do lose their type arguments, but since all type arguments are unbounded wildcards, no information is lost.

Types that do NOT lose any information during type erasure are called **reifiable types**. The term reifiable stems from reification.  **Reification** means that **type parameters** and **type arguments** of **generic types and methods** are available at **runtime**. Java does not have such a runtime representation for type arguments because of type erasure. Consequently, the reifiable types in Java are only those types for which reification does not make a difference, that is, the types that do not need any runtime representation of type arguments.

The following types are reifiable:

- primitive types (`int`)
- non-generic (or non-parameterized) reference types (`Integer`)
- unbounded wildcard instantiations (`List<?>`)
- raw types (`List`)
- arrays of any of the above (`int[]`)

The non-reifiable types, which lose type information as a side effect of type erasure, are:

- instantiations of a generic type with at least one **concrete type argument**
- instantiations of a generic type with at least one **bounded wildcard** as type argument

Reifiable types are permitted in some places where non-reifiable types are disallowed. Reifiable types are permitted (and non-reifiable types are prohibited):

- as type in an `instanceof` expression
- as component type of an array

```text
public void test_instanceof(Object obj) {
    if (obj instanceof List) {
        List<?> list = (List<?>) obj;
    }
}

public void test_array() {
    Object[] array = new List<?>[10];
}
```
