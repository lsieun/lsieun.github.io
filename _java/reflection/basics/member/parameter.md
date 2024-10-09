---
title: "Parameter"
sequence: "107"
---

```text
             ┌─── executable ───┼─── getDeclaringExecutable()
             │
             │                                   ┌─── isNamePresent()
             │                  ┌─── name ───────┤
             │                  │                └─── getName()
             │                  │
             ├─── param info ───┼─── modifier ───┼─── getModifiers()
             │                  │
             │                  │                ┌─── getParameterizedType()
             │                  └─── type ───────┤
             │                                   └─── getType()
             │
             │                  ┌─── source ─────┼─── getAnnotatedType()
             │                  │
Parameter ───┤                  │                ┌─── getAnnotation(Class<T> annotationClass)
             ├─── annotation ───┤                │
             │                  │                ├─── getDeclaredAnnotation(Class<T> annotationClass)
             │                  │                │
             │                  │                ├─── getAnnotationsByType(Class<T> annotationClass)
             │                  └─── instance ───┤
             │                                   ├─── getDeclaredAnnotationsByType(Class<T> annotationClass)
             │                                   │
             │                                   ├─── getAnnotations()
             │                                   │
             │                                   └─── getDeclaredAnnotations()
             │
             │                  ┌─── isImplicit()
             │                  │
             └─── is ───────────┼─── isSynthetic()
                                │
                                └─── isVarArgs()
```
