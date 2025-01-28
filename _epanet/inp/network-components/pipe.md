---
title: "PIPES"
sequence: "pipe"
---

The `[PIPES]` defines all pipe links contained in the network.

```text
                          ┌─── name
                          │
                          ├─── description
                          │
                          │                   ┌─── start node
        ┌─── link ────────┼─── node ──────────┤
        │                 │                   └─── end   node
        │                 │
        │                 ├─── length
        │                 │
        │                 └─── diameter
        │
PIPE ───┤                                   ┌─── roughness coefficient
        │                 ┌─── head loss ───┤
        ├─── hydraulic ───┤                 └─── minor loss coefficient
        │                 │
        │                 └─── switch ──────┼─── initial status (OPEN/CLOSE/CV)
        │
        │                                  ┌─── bulk coefficient
        └─── quality ─────┼─── reaction ───┤
                                           └─── wall coefficient
```

**Format**

One line for each pipe containing:

- ID label of pipe
- ID of start node
- ID of end node
- Length, 单位：米(m)
- Diameter, 单位：毫米(mm)
- Roughness coefficient
- Minor loss coefficient
- Status (`OPEN`, `CLOSED`, or `CV`)

**Remarks**

- Roughness coefficient is unitless for the Hazen-Williams and Chezy-Manning head loss formulas and has units of millifeet (mm) for the Darcy-Weisbach formula.
  Choice of **head loss formula** is supplied in the `[OPTIONS]` section.
- Setting status to `CV` means that the pipe contains a check valve restricting flow to one direction.
- If **minor loss coefficient** is `0` and pipe is `OPEN` then these two items can be dropped from the input line.

**Example**

```text
[PIPES]
;ID   Node1  Node2   Length   Diam.   Roughness  Mloss   Status
;-------------------------------------------------------------
 P1    J1     J2     1200      12       120       0.2    OPEN
 P2    J3     J2      600       6       110       0      CV
 P3    J1     J10    1000      12       120
```

