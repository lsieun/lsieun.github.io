---
title: "Array"
sequence: "101"
---

```text
                          ┌─── newInstance(Class<?> componentType, int length)
         ┌─── instance ───┤
         │                └─── newInstance(Class<?> componentType, int... dimensions)
         │
         ├─── length ─────┼─── getLength(Object array)
         │
         │                            ┌─── get(Object array, int index)
         │                            │
         │                            ├─── getBoolean(Object array, int index)
         │                            │
         │                            ├─── getByte(Object array, int index)
         │                            │
Array ───┤                            ├─── getChar(Object array, int index)
         │                            │
         │                ┌─── get ───┼─── getShort(Object array, int index)
         │                │           │
         │                │           ├─── getInt(Object array, int index)
         │                │           │
         │                │           ├─── getLong(Object array, int index)
         │                │           │
         │                │           ├─── getFloat(Object array, int index)
         │                │           │
         │                │           └─── getDouble(Object array, int index)
         └─── value ──────┤
                          │           ┌─── set(Object array, int index, Object value)
                          │           │
                          │           ├─── setBoolean(Object array, int index, boolean z)
                          │           │
                          │           ├─── setByte(Object array, int index, byte b)
                          │           │
                          │           ├─── setChar(Object array, int index, char c)
                          │           │
                          └─── set ───┼─── setShort(Object array, int index, short s)
                                      │
                                      ├─── setInt(Object array, int index, int i)
                                      │
                                      ├─── setLong(Object array, int index, long l)
                                      │
                                      ├─── setFloat(Object array, int index, float f)
                                      │
                                      └─── setDouble(Object array, int index, double d)
```
