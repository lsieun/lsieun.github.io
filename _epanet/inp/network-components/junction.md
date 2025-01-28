---
title: "JUNCTIONS"
sequence: "junction"
---


The `[JUNCTIONS]` defines junction nodes contained in the network.

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
            │
            │                                                  ┌─── base demand
JUNCTION ───┤                                 ┌─── single ─────┤
            │                 ┌─── demand ────┤                └─── demand pattern
            │                 │               │
            ├─── hydraulic ───┤               └─── multiple ───┼─── demand categories
            │                 │
            │                 └─── emitter ───┼─── emitter coefficient
            │
            │                 ┌─── initial quality
            └─── quality ─────┤
                              └─── source  quality
```

**Format**

One line for each junction containing:

- ID label
- Elevation, 单位：米(m)
- Base demand flow (flow units) (optional)
- Demand pattern ID (optional)

**Remarks**

- A `[JUNCTIONS]` section with at least one junction is required.
- If no demand pattern is supplied then the junction demand follows the Default Demand Pattern specified in the `[OPTIONS]` section or Pattern 1 if no default pattern is specified.
  If the default pattern (or Pattern 1) does not exist, then the demand remains constant.
- Demands can also be entered in the `[DEMANDS]` section and include multiple demand categories per junction.

```text
[JUNCTIONS]
;ID    Elev.   Demand   Pattern
;------------------------------
J1     100     50       Pat1
J2     120     10              ;Uses default demand pattern
J3     115                     ;No demand at this junction
```
