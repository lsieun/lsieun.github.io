---
title: "MethodDelegation 的概念"
sequence: "101"
---

## API

```text
                                                           ┌─── withDefaultConfiguration()
                                            ┌─── config ───┤
                                            │              └─── withEmptyConfiguration()
                                            │
                                            │                                                        ┌─── type
                                            │                                                        │
                                            │                                         ┌─── param ────┼─── obj
                         ┌─── static ───────┤                                         │              │
                         │                  │              ┌─── to() ─────────────────┤              └─── obj + field
                         │                  │              │                          │
                         │                  │              │                          └─── return ───┼─── MethodDelegation
                         │                  │              │
                         │                  │              │                          ┌─── param ────┼─── type
                         │                  │              ├─── toConstructor() ──────┤
                         │                  └─── to ───────┤                          └─── return ───┼─── MethodDelegation
                         │                                 │
                         │                                 │                          ┌─── param ────┼─── name
MethodDelegation::api ───┤                                 ├─── toField() ────────────┤
                         │                                 │                          └─── return ───┼─── MethodDelegation
                         │                                 │
                         │                                 │                          ┌─── param ────┼─── name
                         │                                 └─── toMethodReturnOf() ───┤
                         │                                                            └─── return ───┼─── MethodDelegation
                         │
                         │                                   ┌─── prepare() ────┼─── from ───┼─── InstrumentedType.Prepareable
                         │                  ┌─── internal ───┤
                         │                  │                └─── appender() ───┼─── from ───┼─── Implementation
                         └─── non-static ───┤
                                            │                ┌─── andThen() ────────┼─── from ───┼─── Implementation.Composable
                                            └─── external ───┤
                                                             └─── withAssigner()
```

## WithCustomProperties


