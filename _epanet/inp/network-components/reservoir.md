---
title: "RESERVOIRS"
sequence: "reservoir"
---

The `[RESERVOIRS]` defines all reservoir nodes contained in the network.

```text
                               ┌─── name
                               │
                               ├─── description
             ┌─── node ────────┤
             │                 │                                      ┌─── x
             │                 │                   ┌─── coordinate ───┤
             │                 └─── position ──────┤                  └─── y
             │                                     │
             │                                     └─── elevation
RESERVOIR ───┤
             │                              ┌─── total head
             ├─── hydraulic ───┼─── head ───┤
             │                              └─── head pattern
             │
             │                 ┌─── initial quality
             └─── quality ─────┤
                               └─── source  quality
```

**Format**:

One line for each reservoir containing:

- ID label
- Head, ft (m)
- Head pattern ID (optional)

**Remarks**:

- Head is the hydraulic head (elevation + pressure head) of water in the reservoir.
- A **head pattern** can be used to make the reservoir head vary with time.
- At least one reservoir or tank must be contained in the network.

**Example**:

```text
[RESERVOIRS]
;ID    Head    Pattern
;---------------------
R1     512               ;Head stays constant
R2     120     Pat1      ;Head varies with time
```

