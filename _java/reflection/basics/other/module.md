---
title: "Module"
sequence: "111"
---

```text
                                ┌─── loader ─────┼─── getClassLoader()
          ┌─── classloader ─────┤
          │                     └─── resource ───┼─── getResourceAsStream(String name)
          │
          │                     ┌─── layer ─────┼─── getLayer()
          │                     │
          │                     │                                  ┌─── isNamed()
          │                     │               ┌─── name ─────────┤
          ├─── hierarchy ───────┼─── module ────┤                  └─── getName()
          │                     │               │
          │                     │               └─── descriptor ───┼─── getDescriptor()
          │                     │
          │                     └─── package ───┼─── getPackages()
          │
          │                                    ┌─── canRead(Module other)
          │                     ┌─── read ─────┤
          │                     │              └─── addReads(Module other)
          │                     │
Module ───┤                     │              ┌─── isExported(String pn)
          │                     │              │
          │                     ├─── export ───┼─── isExported(String pn, Module other)
          │                     │              │
          │                     │              └─── addExports(String pn, Module other)
          ├─── encapsulation ───┤
          │                     │              ┌─── isOpen(String pn)
          │                     │              │
          │                     ├─── open ─────┼─── isOpen(String pn, Module other)
          │                     │              │
          │                     │              └─── addOpens(String pn, Module other)
          │                     │
          │                     │              ┌─── canUse(Class<?> service)
          │                     └─── use ──────┤
          │                                    └─── addUses(Class<?> service)
          │
          │                     ┌─── getAnnotation(Class<T> annotationClass)
          │                     │
          └─── annotation ──────┼─── getAnnotations()
                                │
                                └─── getDeclaredAnnotations()
```

- [Java Reflection - Modules](https://jenkov.com/tutorials/java-reflection/modules.html)
