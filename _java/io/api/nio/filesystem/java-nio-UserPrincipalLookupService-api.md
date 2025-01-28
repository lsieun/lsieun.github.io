---
title: "UserPrincipalLookupService"
sequence: "103"
---

[UP](/java/java-io-index.html)

```text
                                                                   ┌─── params ───┼─── String
                              ┌─── lookupPrincipalByName() ────────┤
                              │                                    └─── return ───┼─── UserPrincipal
UserPrincipalLookupService ───┤
                              │                                    ┌─── params ───┼─── String
                              └─── lookupPrincipalByGroupName() ───┤
                                                                   └─── return ───┼─── GroupPrincipal
```

```text
             ┌─── getName() ───────┼─── return ───┼─── String
             │
             │                     ┌─── params ───┼─── Subject
Principal ───┼─── implies() ───────┤
             │                     └─── return ───┼─── boolean
             │
             └─── UserPrincipal ───┼─── GroupPrincipal
```
