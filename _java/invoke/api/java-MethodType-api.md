---
title: "MethodType"
sequence: "101"
---

```text
                                 ┌─── methodType()
                                 │
              ┌─── static ───────┼─── genericMethodType()
              │                  │
              │                  └─── fromMethodDescriptorString()
              │
              │                                  ┌─── appendParameterTypes()
              │                                  │
              │                                  ├─── changeParameterType()
              │                                  │
              │                                  ├─── dropParameterTypes()
              │                                  │
              │                                  ├─── insertParameterTypes()
              │                                  │
MethodType ───┤                  ┌─── param ─────┼─── lastParameterType()
              │                  │               │
              │                  │               ├─── parameterArray()
              │                  │               │
              │                  │               ├─── parameterCount()
              │                  │               │
              │                  │               ├─── parameterList()
              │                  │               │
              │                  │               └─── parameterType()
              │                  │
              │                  │               ┌─── changeReturnType()
              │                  ├─── return ────┤
              │                  │               └─── returnType()
              └─── non-static ───┤
                                 │               ┌─── erase()
                                 ├─── generic ───┤
                                 │               └─── generic()
                                 │
                                 │               ┌─── describeConstable()
                                 │               │
                                 ├─── desc ──────┼─── descriptorString()
                                 │               │
                                 │               └─── toMethodDescriptorString()
                                 │
                                 │               ┌─── hasPrimitives()
                                 │               │
                                 │               ├─── hasWrappers()
                                 └─── wrap ──────┤
                                                 ├─── unwrap()
                                                 │
                                                 └─── wrap()
```
