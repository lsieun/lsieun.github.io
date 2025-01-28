---
title: "class literal"
sequence: "123"
---

## 1. type parameter

Why is there no class literal for a type parameter? **Because a type parameter does not have a runtime type representation of its own**.

As part of the translation by type erasure, all type parameters are replaces by their leftmost bound, or `Object` if the type parameter is unbounded.  Consequently, there is no point to forming class literals such as `T.class`, where `T` is a type parameter, because no such Class objects exist. Only the bound has a `Class` object that represents its runtime type.

Example (before type erasure):

```text
<T extends Collection> Class<?> someMethod(T arg){
  ...
  return T.class;  // error
}
```

The compiler rejects the expression `T.class` as illegal, but even if it compiled it would not make sense. After type erasure the method above could at best look like this:

Example (after type erasure):

```text
Class someMethod( Collection arg){
  ...
  return Collection .class;
}
```

The method would always return the bound's type representation, no matter which instantiation of the generic method was invoked. This would clearly be misleading.

The point is that type parameters are non-reifiable, that is, they do not have a runtime type representation. Consequently, there is no `Class` object for type parameters and no class literal for them.

## 2. concrete parameterized types

Why is there no class literal for concrete parameterized types? **Because parameterized type has no exact runtime type representation**.

A **class literal** denotes a `Class` object that represents a given type. For instance, the class literal `String.class` denotes the Class object that represents the type `String` and is identical to the Class object that is returned when method `getClass` is invoked on a `String` object. A class literal can be used for runtime type checks and for reflection.

**Parameterized types** lose their **type arguments** when they are translated to byte code during compilation in a process called **type erasure**. As a side effect of type erasure, all instantiations of a generic type share the same runtime representation, namely that of the corresponding **raw type**. In other words, parameterized types do not have type representation of their own. Consequently, there is no point in forming class literals such as `List<String>.class`, `List<Long>.class` and `List<?>.class`, since no such Class objects exist. Only the raw type `List` has a Class object that represents its runtime type. It is referred to as `List.class`.

## 3. wildcard parameterized type

Why is there no class literal for wildcard parameterized types? **Because a wildcard parameterized type has no exact runtime type representation**.

The rationale is the same as for concrete parameterized types.

Wildcard parameterized types lose their type arguments when they are translated to byte code in a process called **type erasure**. As a side effect of type erasure, all instantiations of a generic type share the same runtime representation, namely that of the corresponding **raw type**. In other words, parameterized types do not have type representation of their own. Consequently, there is no point to forming class literals such as `List<?>.class`, `List<? extends Number>.class` and `List<Long>.class`, since no such `Class` objects exist. Only the raw type `List` has a `Class` object that represents its runtime type. It is referred to as `List.class`.
