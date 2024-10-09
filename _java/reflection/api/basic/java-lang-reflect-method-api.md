---
title: "Method"
sequence: "105"
---

```text
          ┌─── class ────────┼─── getDeclaringClass()
          │
          ├─── name ─────────┼─── getName()
          │
          ├─── modifier ─────┼─── getModifiers()
          │
          │                  ┌─── getParameterCount()
          │                  │
          ├─── parameter ────┼─── getParameterTypes()
          │                  │
          │                  └─── getGenericParameterTypes()
          │
          │                  ┌─── getReturnType()
          ├─── return ───────┤
          │                  └─── getGenericReturnType()
          │
          │                  ┌─── getExceptionTypes()
          ├─── exception ────┤
          │                  └─── getGenericExceptionTypes()
          │
          ├─── invoke ───────┼─── invoke(Object obj, Object... args)
Method ───┤
          │                  ┌─── isBridge()
          │                  │
          │                  ├─── isVarArgs()
          ├─── is ───────────┤
          │                  ├─── isSynthetic()
          │                  │
          │                  └─── isDefault()
          │
          ├─── generic ──────┼─── getTypeParameters()
          │
          │                  ┌─── getDefaultValue()
          │                  │
          │                  ├─── getDeclaredAnnotations()
          │                  │
          ├─── annotation ───┼─── getAnnotation()
          │                  │
          │                  ├─── getParameterAnnotations()
          │                  │
          │                  └─── getAnnotatedReturnType()
          │
          └─── access ───────┼─── setAccessible()
```
