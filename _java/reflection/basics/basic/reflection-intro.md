---
title: "Reflection Intro"
sequence: "101"
---

```text
                                           ┌─── Module
                     ┌─── encapsulation ───┤
                     │                     └─── Package
                     │
                     │                                                                ┌─── Field
                     │                                                                │
                     │                     ┌─── Type ────┼─── Class ───┼─── Member ───┤                  ┌─── Constructor
                     │                     │                                          │                  │
                     │                     │                                          └─── Executable ───┼─── Method
                     ├─── type ────────────┤                                                             │
                     │                     │                                                             └─── Parameter
                     │                     │
                     │                     └─── Array
                     │
                     │                                                                                       ┌─── AnnotatedArrayType
                     │                                                                                       │
                     │                                                                                       ├─── AnnotatedParameterizedType
                     │                     ┌─── annotation ───┼─── AnnotatedElement ───┼─── AnnotatedType ───┤
                     │                     │                                                                 ├─── AnnotatedTypeVariable
                     │                     │                                                                 │
java.lang.reflect ───┤                     │                                                                 └─── AnnotatedWildcardType
                     │                     │
                     │                     │                  ┌─── GenericDeclaration
                     │                     │                  │
                     ├─── feature ─────────┤                  ├─── TypeVariable
                     │                     │                  │
                     │                     ├─── generic ──────┼─── GenericArrayType
                     │                     │                  │
                     │                     │                  ├─── ParameterizedType
                     │                     │                  │
                     │                     │                  └─── WildcardType
                     │                     │
                     │                     └─── record ───────┼─── RecordComponent
                     │
                     │                     ┌─── Proxy
                     ├─── proxy ───────────┤
                     │                     └─── InvocationHandler
                     │
                     │                     ┌─── ReflectPermission
                     └─── security ────────┤
                                           └─── AccessibleObject
```
