---
title: "Method"
sequence: "105"
---

```text
          ┌─── class ─────────┼─── getDeclaringClass()
          │
          │                   ┌─── name ────────┼─── getName()
          │                   │
          │                   ├─── modifier ────┼─── getModifiers()
          │                   │
          │                   │                 ┌─── getParameterCount()
          │                   │                 │
          │                   ├─── parameter ───┼─── getParameterTypes()
          ├─── method info ───┤                 │
          │                   │                 └─── getGenericParameterTypes()
          │                   │
          │                   │                 ┌─── getReturnType()
          │                   ├─── return ──────┤
          │                   │                 └─── getGenericReturnType()
          │                   │
          │                   │                 ┌─── getExceptionTypes()
          │                   └─── exception ───┤
          │                                     └─── getGenericExceptionTypes()
          │
          │                   ┌─── generic ──────┼─── getTypeParameters()
Method ───┤                   │
          │                   │                  ┌─── getDefaultValue()
          ├─── feature ───────┤                  │
          │                   │                  ├─── getDeclaredAnnotations()
          │                   │                  │
          │                   └─── annotation ───┼─── getAnnotation()
          │                                      │
          │                                      ├─── getParameterAnnotations()
          │                                      │
          │                                      └─── getAnnotatedReturnType()
          │
          │                   ┌─── isBridge()
          │                   │
          │                   ├─── isVarArgs()
          ├─── is ────────────┤
          │                   ├─── isSynthetic()
          │                   │
          │                   └─── isDefault()
          │
          ├─── invoke ────────┼─── invoke(Object obj, Object... args)
          │
          └─── access ────────┼─── setAccessible()
```

