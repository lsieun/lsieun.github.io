---
title: "EPANET API"
sequence: "101"
---

```text
                                                                                                       ┌─── Node Functions
                                                                                          ┌─── node ───┤
                                                                                          │            └─── Nodal Demand Functions
                                                       ┌─── physical ─────────────────────┤
                                                       │                                  │            ┌─── Link Functions
                                                       │                                  └─── link ───┤
                                                       │                                               └─── Pump Functions
                                                       │
                                                       │                                  ┌─── Time Pattern Functions
              ┌─── Project Functions ──────────────────┤                                  │
              │                                        ├─── non-physical ─────────────────┼─── Data Curve Functions
              │                                        │                                  │
              │                                        │                                  │                              ┌─── Simple Controls Functions
              │                                        │                                  └─── control ──────────────────┤
              │                                        │                                                                 └─── Rule-Based Controls Functions
EPANET API ───┤                                        │
              │                                        └─── Analysis Options Functions
              │
              ├─── Hydraulic Analysis Functions
              │
              ├─── Water Quality Analysis Functions
              │
              └─── Reporting Functions
```
