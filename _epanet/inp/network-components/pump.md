---
title: "PUMPS"
sequence: "pump"
---

The `[PUMPS]` defines all pump links contained in the network.

```text
                          ┌─── name
                          │
        ┌─── link ────────┼─── description
        │                 │
        │                 │                   ┌─── start node
        │                 └─── node ──────────┤
        │                                     └─── end node
        │
        │                                                   ┌─── constant ───┼─── power
        │                                ┌─── power ────────┤
        │                                │                  └─── variable ───┼─── pump curve
        │                                │
        │                                │                  ┌─── speed setting
PUMP ───┤                                ├─── speed ────────┤
        │                 ┌─── energy ───┤                  └─── time pattern
        │                 │              │
        │                 │              ├─── efficiency ───┼─── efficiency curve
        │                 │              │
        ├─── hydraulic ───┤              │                  ┌─── energy price
        │                 │              └─── price ────────┤
        │                 │                                 └─── price pattern
        │                 │
        │                 └─── switch ───┼─── initial status (OPEN/CLOSED)
        │
        └─── quality
```

**Format**

One line for each pump containing:

- ID label of pump
- ID of start node
- ID of end node
- Keyword and Value (can be repeated)

**Remarks**

Keywords consists of:

- **POWER** – power value for constant energy pump, hp (kW)
- **HEAD** - ID of curve that describes **head versus flow** for the pump
- **SPEED** - relative speed setting (normal speed is `1.0`, `0` means pump is off)
- **PATTERN** - ID of time pattern that describes how **speed setting** varies with time

Either **POWER** or **HEAD** must be supplied for each pump. The other keywords are optional.

**Example**

```text
[PUMPS]
;ID    Node1    Node2    Properties
;---------------------------------------------
Pump1   N12      N32     HEAD Curve1
Pump2   N121     N55     HEAD Curve1  SPEED 1.2
Pump3   N22      N23     POWER 100
```
