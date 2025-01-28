---
title: "Modifier"
sequence: "106"
---

```text
                                                     ┌─── isPublic(int mod)
                                                     │
                             ┌─── visibility ────────┼─── isPrivate(int mod)
                             │                       │
                             │                       └─── isProtected(int mod)
                             │
                             ├─── owner ─────────────┼─── isStatic(int mod)
                             │
                             │                       ┌─── isFinal(int mod)
                             │                       │
                             ├─── abstract ──────────┼─── isAbstract(int mod)
                             │                       │
            ┌─── single ─────┤                       └─── isInterface(int mod)
            │                │
            │                │                       ┌─── isSynchronized(int mod)
            │                ├─── synchronization ───┤
            │                │                       └─── isVolatile(int mod)
            │                │
            │                ├─── serialization ─────┼─── isTransient(int mod)
            │                │
            │                │
            │                │                       ┌─── isNative(int mod)
            │                └─── other ─────────────┤
            │                                        └─── isStrict(int mod)
Modifier ───┤                               ┌─── classModifiers()
            │                ┌─── type ─────┤
            │                │              └─── interfaceModifiers()
            │                │
            ├─── multiple ───┤              ┌─── fieldModifiers()
            │                │              │
            │                │              ├─── constructorModifiers()
            │                └─── member ───┤
            │                               ├─── methodModifiers()
            │                               │
            │                               └─── parameterModifiers()
            │
            └─── str ────────┼─── toString(int mod)
```
