---
title: "NamedElement"
sequence: "NamedElement"
---

## API 设计

```text
                ┌─── source.code ───┼─── getActualName()
                │
                │                                          ┌─── getDescriptor()
                ├─── class.file ────┼─── WithDescriptor ───┤
                │                                          └─── getGenericSignature()
NamedElement ───┤
                │                                           ┌─── getName()
                ├─── jvm.runtime ───┼─── WithRuntimeName ───┤
                │                                           └─── getInternalName()
                │
                │                   ┌─── optional ───┼─── WithOptionalName ───┼─── isNamed()
                └─── special ───────┤
                                    └─── generic ────┼─── WithGenericName ───┼─── toGenericString()
```
