---
title: "ArchRuleDefinition"
sequence: "102"
---

```text
                                             ┌─── all()
                      ┌─── GivenObjects ─────┤
                      │                      └─── no()
                      │
                      │                                          ┌─── classes()
                      │                                          │
                      │                                          ├─── noClasses()
                      │                      ┌─── clazz ─────────┤
                      │                      │                   ├─── theClass()
                      │                      │                   │
                      │                      │                   └─── noClass()
                      │                      │
                      │                      │                   ┌─── members()
                      │                      ├─── member ────────┤
                      │                      │                   └─── noMembers()
                      │                      │
ArchRuleDefinition ───┼─── GivenClasses ─────┤                   ┌─── fields()
                      │                      ├─── field ─────────┤
                      │                      │                   └─── noFields()
                      │                      │
                      │                      │                   ┌─── constructors()
                      │                      ├─── constructor ───┤
                      │                      │                   └─── noConstructors()
                      │                      │
                      │                      │                   ┌─── methods()
                      │                      └─── method ────────┤
                      │                                          └─── noMethods()
                      │
                      │                      ┌─── codeUnits()
                      ├─── GivenCodeUnits ───┤
                      │                      └─── noCodeUnits()
                      │
                      └─── Creator ──────────┼─── priority()
```
