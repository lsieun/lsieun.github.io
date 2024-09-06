---
title: "方法体实现介绍"
sequence: "101"
---

```text
                                   ┌─── StubMethod
                  ┌─── exit ───────┤
                  │                └─── ExceptionMethod
                  │
                  ├─── constant ───┼─── FixedValue
                  │
                  ├─── field ──────┼─── FieldAccessor
                  │
Implementation ───┤                ┌─── MethodCall
                  │                │
                  │                ├─── SuperMethodCall
                  ├─── method ─────┤
                  │                ├─── DefaultMethodCall
                  │                │
                  │                └─── MethodDelegation
                  │
                  └─── opcode ─────┼─── StackManipulation
```
