---
title: "NamedElement"
sequence: "102"
---

Represents a Java element with a name.

```text
                ┌─── getActualName()
                │
                │                        ┌─── getName()
                │                        │
                ├─── WithRuntimeName ────┼─── getInternalName()
                │                        │
NamedElement ───┤                        └─── WithGenericName ─────┼─── toGenericString()
                │
                ├─── WithOptionalName ───┼─── isNamed()
                │
                │
                │                        ┌─── getDescriptor()
                └─── WithDescriptor ─────┤
                                         └─── getGenericSignature()
```
