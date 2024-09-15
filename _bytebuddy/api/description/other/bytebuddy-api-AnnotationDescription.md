---
title: "AnnotationDescription"
sequence: "AnnotationDescription"
---

### AnnotationDescription.Builder

```text
                                                ┌─── ofType(Class<? extends Annotation> annotationType)
                                 ┌─── start ────┤
                                 │              └─── ofType(TypeDescription annotationType)
                                 │
                                 │              ┌─── common ───────┼─── define(String property, AnnotationValue<?, ?> value)
                                 │              │
                                 │              │                  ┌─── define(String property, boolean value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, byte value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, char value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, short value)
                                 │              ├─── primitive ────┤
                                 │              │                  ├─── define(String property, int value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, long value)
                                 │              │                  │
                                 │              │                  ├─── define(String property, float value)
                                 │              │                  │
                                 │              │                  └─── define(String property, double value)
                                 │              │
                                 │              ├─── string ───────┼─── define(String property, String value)
                                 │              │
                                 │              │                  ┌─── define(String property, Class<?> type)
                                 │              ├─── class ────────┤
                                 │              │                  └─── define(String property, TypeDescription typeDescription)
                                 │              │
                                 │              │                  ┌─── define(String property, Enum<?> value)
                                 │              │                  │
                                 ├─── define ───┼─── enum ─────────┼─── define(String property, TypeDescription enumerationType, String value)
                                 │              │                  │
                                 │              │                  └─── define(String property, EnumerationDescription value)
                                 │              │
                                 │              │                  ┌─── define(String property, Annotation annotation)
                                 │              ├─── annotation ───┤
AnnotationDescription.Builder ───┤              │                  └─── define(String property, AnnotationDescription annotationDescription)
                                 │              │
                                 │              │                                     ┌─── defineArray(String property, boolean... value)
                                 │              │                                     │
                                 │              │                                     ├─── defineArray(String property, byte... value)
                                 │              │                                     │
                                 │              │                                     ├─── defineArray(String property, char... value)
                                 │              │                                     │
                                 │              │                                     ├─── defineArray(String property, short... value)
                                 │              │                  ┌─── primitive ────┤
                                 │              │                  │                  ├─── defineArray(String property, int... value)
                                 │              │                  │                  │
                                 │              │                  │                  ├─── defineArray(String property, long... value)
                                 │              │                  │                  │
                                 │              │                  │                  ├─── defineArray(String property, float... value)
                                 │              │                  │                  │
                                 │              │                  │                  └─── defineArray(String property, double... value)
                                 │              │                  │
                                 │              │                  ├─── string ───────┼─── defineArray(String property, String... value)
                                 │              │                  │
                                 │              └─── array ────────┤                  ┌─── defineTypeArray(String property, Class<?>... type)
                                 │                                 ├─── class ────────┤
                                 │                                 │                  └─── defineTypeArray(String property, TypeDescription... typeDescription)
                                 │                                 │
                                 │                                 │                  ┌─── defineEnumerationArray(String property, Class<T> enumerationType, T... value)
                                 │                                 │                  │
                                 │                                 ├─── enum ─────────┼─── defineEnumerationArray(String property, TypeDescription enumerationType, String... value)
                                 │                                 │                  │
                                 │                                 │                  └─── defineEnumerationArray(String property, TypeDescription enumerationType, EnumerationDescription... value)
                                 │                                 │
                                 │                                 │                  ┌─── defineAnnotationArray(String property, Class<T> annotationType, T... annotation)
                                 │                                 └─── annotation ───┤
                                 │                                                    └─── defineAnnotationArray(String property, TypeDescription annotationType, AnnotationDescription... annotationDescription)
                                 │
                                 │
                                 └─── output ───┼─── build()
```
