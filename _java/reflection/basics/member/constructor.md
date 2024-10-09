---
title: "Constructor"
sequence: "106"
---

```text
               ┌─── class ──────────────┼─── getDeclaringClass()
               │
               │                        ┌─── name ────────┼─── getName()
               │                        │
               │                        ├─── modifier ────┼─── getModifiers()
               │                        │
               │                        │                 ┌─── getParameterCount()
               ├─── constructor info ───┤                 │
               │                        ├─── parameter ───┼─── getParameterTypes()
               │                        │                 │
               │                        │                 └─── getGenericParameterTypes()
               │                        │
               │                        │                 ┌─── getExceptionTypes()
               │                        └─── exception ───┤
               │                                          └─── getGenericExceptionTypes()
               │
               │                        ┌─── generic ──────┼─── getTypeParameters()
               │                        │
               │                        │                  ┌─── getAnnotation(Class<T> annotationClass)
Constructor ───┼─── feature ────────────┤                  │
               │                        │                  ├─── getDeclaredAnnotations()
               │                        │                  │
               │                        └─── annotation ───┼─── getParameterAnnotations()
               │                                           │
               │                                           ├─── getAnnotatedReturnType()
               │                                           │
               │                                           └─── getAnnotatedReceiverType()
               │
               ├─── access ─────────────┼─── setAccessible(boolean flag)
               │
               │                        ┌─── toString()
               ├─── str ────────────────┤
               │                        └─── toGenericString()
               │
               │                        ┌─── isVarArgs()
               ├─── is ─────────────────┤
               │                        └─── isSynthetic()
               │
               └─── instance ───────────┼─── newInstance(Object ... initargs)
```
