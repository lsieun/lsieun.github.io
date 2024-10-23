---
title: "Objects"
sequence: "101"
---

```text
                                     ┌─── checkIndex()
                                     │
           ┌─── int ───┼─── range ───┼─── checkFromToIndex()
           │                         │
           │                         └─── checkFromIndexSize()
           │
           │                           ┌─── isNull()
           │                           │
           │                           ├─── nonNull()
Objects ───┤                           │
           │           ┌─── null ──────┼─── requireNonNull()
           │           │               │
           │           │               ├─── requireNonNullElse()
           │           │               │
           │           │               └─── requireNonNullElseGet()
           │           │
           └─── obj ───┤                                 ┌─── equal
                       │                                 │
                       │               ┌─── compare() ───┼─── less than
                       │               │                 │
                       │               │                 └─── greater than
                       │               │
                       └─── compare ───┤                 ┌─── equals()
                                       ├─── equal ───────┤
                                       │                 └─── deepEquals()
                                       │
                                       │                 ┌─── hash()
                                       └─── hash ────────┤
                                                         └─── hashCode()
```
