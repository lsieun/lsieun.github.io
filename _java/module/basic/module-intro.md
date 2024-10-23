---
title: "Module Intro"
sequence: "101"
---

## Goals

According to [JSR 376](https://jcp.org/en/jsr/detail?id=376),
the key goals of modularizing the Java SE platform are

- 

```text
                   ┌─── reliable configuration
                   │
                   │                              ┌─── readability
                   │                              │
JPMS: key goals ───┼─── strong encapsulation ─────┼─── visibility
                   │                              │
                   │                              └─── accessibility
                   │
                   └─── scalable Java platform
```

```text
                               ┌─── JEP 200: The Modular JDK
                               │
                               ├─── JEP 201: Modular Source Code
                               │
                               ├─── JEP 220: Modular Run-Time Images
                  ┌─── JEPs ───┤
                  │            ├─── JEP 260: Encapsulate Most Internal APIs
                  │            │
                  │            ├─── JEP 261: Module System
Project Jigsaw ───┤            │
                  │            └─── JEP 282: jlink: The Java Linker
                  │
                  │
                  └─── JSRs ───┼─── JSR 376: Java Platform Module System
```
