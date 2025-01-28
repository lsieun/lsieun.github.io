---
title: "MethodHandle"
sequence: "102"
---

```text
                                ┌─── method.type ───┼─── type()
                                │
                ┌─── define ────┤                   ┌─── asFixedArity()
                │               │                   │
                │               │                   ├─── withVarargs()
                │               └─── VarArgs ───────┤
                │                                   ├─── asVarargsCollector()
                │                                   │
                │                                   └─── isVarargsCollector()
                │
                ├─── bind ──────┼─── bindTo()
                │
                │               ┌─── invoke()
MethodHandle ───┤               │
                ├─── invoke ────┼─── invokeExact()
                │               │
                │               └─── invokeWithArguments()
                │
                │               ┌─── asCollector()
                │               │
                ├─── convert ───┼─── asSpreader()
                │               │
                │               └─── asType()
                │
                └─── other ─────┼─── describeConstable()
```
