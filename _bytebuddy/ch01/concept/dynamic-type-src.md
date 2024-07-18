---
title: "DynamicType"
sequence: "104"
---

## DynamicType



## DynamicType.Builder

### method

```text
                                                   ┌─── name/return/access ───┼─── defineMethod()
                                                   │
                                                   │                          ┌─── withParameter()
                               ┌─── method head ───┼─── parameters ───────────┤
                               │                   │                          └─── withParameters()
                               │                   │
                               │                   └─── throws ───────────────┼─── throwing()
                               │
DynamicType.Builder: method ───┤                   ┌─── withoutCode()
                               │                   │
                               │                   │
                               │                   │                     ┌─── StubMethod.INSTANCE
                               │                   │                     │
                               └─── method body ───┤                     │                           ┌─── value()
                                                   │                     │                           │
                                                   │                     ├─── FixedValue ────────────┼─── nullValue()
                                                   │                     │                           │
                                                   │                     │                           └─── argument()
                                                   └─── intercept() ─────┤
                                                                         ├─── FieldAccessor ─────────┼─── ofField()
                                                                         │
                                                                         ├─── MethodCall
                                                                         │
                                                                         ├─── MethodDelegation
                                                                         │
                                                                         └─── Advice
```

### Generic

```text
                                                              ┌─── typeVariable(String symbol)
                                                              │
                                       ┌─── typeVariable() ───┼─── typeVariable(String symbol, Type... bound)
                                       │                      │
DynamicType.Builder ───┼─── generic ───┤                      └─── typeVariable(String symbol, TypeDefinition... bound)
                                       │
                                       └─── transform() ──────┼─── transform(ElementMatcher, Transformer)
```

