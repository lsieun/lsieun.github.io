---
title: "Field"
sequence: "103"
---

```text
         ┌─── class ────────┼─── getDeclaringClass()
         │
         ├─── name ─────────┼─── getName()
         │
         │                                         ┌─── isEnumConstant()
         ├─── access ───────┼─── getModifiers() ───┤
         │                                         └─── isSynthetic()
         │
         │                  ┌─── getType()
         ├─── type ─────────┤
         │                  └─── getGenericType()
         │
         │                  ┌─── getAnnotation(Class<T> annotationClass)
         │                  │
         │                  ├─── getAnnotationsByType(Class<T> annotationClass)
         ├─── annotation ───┤
         │                  ├─── getDeclaredAnnotations()
         │                  │
         │                  └─── getAnnotatedType()
Field ───┤
         │
         │                              ┌─── get(Object obj)
         │                              │
         │                              ├─── getBoolean(Object obj)
         │                              │
         │                              ├─── getByte(Object obj)
         │                              │
         │                              ├─── getChar(Object obj)
         │                              │
         │                  ┌─── get ───┼─── getShort(Object obj)
         │                  │           │
         │                  │           ├─── getInt(Object obj)
         │                  │           │
         │                  │           ├─── getLong(Object obj)
         │                  │           │
         │                  │           ├─── getFloat(Object obj)
         │                  │           │
         │                  │           └─── getDouble(Object obj)
         └─── value ────────┤
                            │           ┌─── set(Object obj, Object value)
                            │           │
                            │           ├─── setBoolean(Object obj, boolean z)
                            │           │
                            │           ├─── setByte(Object obj, byte b)
                            │           │
                            │           ├─── setChar(Object obj, char c)
                            │           │
                            └─── set ───┼─── setShort(Object obj, short s)
                                        │
                                        ├─── setInt(Object obj, int i)
                                        │
                                        ├─── setLong(Object obj, long l)
                                        │
                                        ├─── setFloat(Object obj, float f)
                                        │
                                        └─── setDouble(Object obj, double d)
```
