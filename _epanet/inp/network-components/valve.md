---
title: "VALVE"
sequence: "valve"
---

## INP: VALVES

The `[VALVES]` defines all control **valve links** contained in the network.

```text
                           ┌─── name
                           │
                           ├─── description
                           │
         ┌─── link ────────┤                   ┌─── start node
         │                 ├─── node ──────────┤
         │                 │                   └─── end node
         │                 │
         │                 └─── diameter
         │
         │                 ┌─── type ────────┼─── PRV/PSV/PBV/FCV/TCV/GPV
         │                 │
         │                 │                 ┌─── pressure: PRV/PSV/PBV
         │                 │                 │
VALVE ───┤                 │                 ├─── flow: FCV
         │                 ├─── setting ─────┤
         ├─── hydraulic ───┤                 ├─── loss coefficient: TCV
         │                 │                 │
         │                 │                 └─── head loss curve: GPV
         │                 │
         │                 ├─── head loss ───┼─── minor loss coefficient
         │                 │
         │                 └─── switch ──────┼─── fixed status (None/OPEN/CLOSED)
         │
         └─── quality
```

Format:

One line for each valve containing:

- ID label
- ID of start node
- ID of end node
- Diameter, inches (mm)
- Valve type
- Valve setting
- Minor loss coefficient

**Remarks:**

- Valve types and settings include:

| Valve Type                      | Setting               |
|---------------------------------|-----------------------|
| PRV (pressure reducing valve)   | Pressure, (m)         |
| PSV (pressure sustaining valve) | Pressure, (m)         |
| PBV (pressure breaker valve)    | Pressure, (m)         |
| FCV (flow control valve)        | Flow (flow units)     |
| TCV (throttle control valve)    | Loss Coefficient      |
| GPV (general purpose valve)     | ID of head loss curve |


- **Shutoff valves** and **check valves** are considered to be part of a **pipe**,
  not a separate control valve component.
