---
title: "Executable"
sequence: "108"
---

```text
              ┌─── class ─────┼─── getDeclaringClass()
              │
              │               ┌─── name ────────┼─── getName()
              │               │
              │               ├─── modifiers ───┼─── getModifiers()
              │               │
              │               │                 ┌─── getParameterCount()
              │               │                 │
              ├─── self ──────┤                 ├─── getParameters()
              │               ├─── parameter ───┤
              │               │                 ├─── getParameterTypes()
              │               │                 │
              │               │                 └─── getGenericParameterTypes()
              │               │
              │               │                 ┌─── getExceptionTypes()
              │               └─── exception ───┤
              │                                 └─── getGenericExceptionTypes()
              │
              │               ┌─── generic ──────┼─── getTypeParameters()
              │               │
Executable ───┤               │                  ┌─── parameter ───┼─── getParameterAnnotations()
              ├─── feature ───┤                  │
              │               │                  │                 ┌─── getAnnotation(Class<T> annotationClass)
              │               │                  │                 │
              │               │                  ├─── instance ────┼─── getAnnotationsByType(Class<T> annotationClass)
              │               └─── annotation ───┤                 │
              │                                  │                 └─── getDeclaredAnnotations()
              │                                  │
              │                                  │                 ┌─── getAnnotatedParameterTypes()
              │                                  │                 │
              │                                  │                 ├─── getAnnotatedReturnType()
              │                                  └─── source ──────┤
              │                                                    ├─── getAnnotatedReceiverType()
              │                                                    │
              │                                                    └─── getAnnotatedExceptionTypes()
              │
              │               ┌─── isVarArgs()
              ├─── is ────────┤
              │               └─── isSynthetic()
              │
              └─── str ───────┼─── toGenericString()
```

