---
title: "Type"
sequence: "101"
---

```java
public interface Type {
    default String getTypeName() {
        return toString();
    }
}
```

类的继承关系：

```text
        ┌─── Class
        │
        ├─── TypeVariable
        │
Type ───┼─── ParameterizedType
        │
        ├─── WildcardType
        │
        └─── GenericArrayType
```

`TypeVariable` is the common superinterface for type variables of kinds.

`ParameterizedType` represents a **parameterized type** such as `Collection<String>`.

`WildcardType` represents a **wildcard type expression**, such as `?`, `? extends Number`, or `? super Integer`.

`GenericArrayType` represents an **array type** whose **component type** is either a **parameterized type** or a **type variable**.

类的逻辑（logic）组织：

```text
        ┌─── non-generic ───┼─── Class
        │
        │                                   ┌─── Class (generic type)
Type ───┤                   ┌─── declare ───┤
        │                   │               └─── TypeVariable
        │                   │
        └─── generic ───────┤
                            │               ┌─── ParameterizedType
                            │               │
                            └─── use ───────┼─── WildcardType
                                            │
                                            └─── GenericArrayType
```

## GenericDeclaration

`GenericDeclaration` is a common interface for all entities that declare type variables.

```java
public interface GenericDeclaration extends AnnotatedElement {
    TypeVariable<?>[] getTypeParameters();
}
```

```text
                      ┌─── Class
                      │
GenericDeclaration ───┤
                      │                  ┌─── Constructor
                      └─── Executable ───┤
                                         └─── Method
```

## ParameterizedType

```java
public interface ParameterizedType extends Type {
    Type getRawType();
    Type[] getActualTypeArguments();
}
```

