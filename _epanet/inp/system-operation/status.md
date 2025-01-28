---
title: "STATUS"
sequence: "status"
---

The `[STATUS]` defines **initial status of selected links** at the start of a simulation.

**Format**:

One line per link being controlled containing:

- Link ID label
- Status or setting

**Remarks**:


- Use `[CONTROLS]` or `[RULES]` to change **status or setting** at some future point in the simulation.

```text
                                       ┌─── OPEN (default)
          ┌─── Pipe ────┼─── Status ───┤
          │                            └─── CLOSED
          │
          │                             ┌─── OPEN (default)
          │             ┌─── Status ────┤
          ├─── Pump ────┤               └─── CLOSED
STATUS ───┤             │
          │             └─── Setting ───┼─── speed setting
          │
          │                             ┌─── OPEN
          │                             │
          │             ┌─── Status ────┼─── CLOSED
          │             │               │
          └─── Valve ───┤               └─── ACTIVE (default)
                        │
                        └─── Setting ───┼─── valve setting
```

### PIPE

- Links not listed in this section have a default status of `OPEN` (for **pipes** and **pumps**)

- The **initial status of pipes** can also be set in the `[PIPES]` section.

> 对于 Pipe 来说，它的 Open、Close、CV 三个状态，可以在 `[PIPES]` 部分设置。

- **Check valves** cannot have their status be preset.

> Check Valve 是作为 Pipe 的一部分

### PUMP

- Links not listed in this section have a default status of `OPEN` (for **pipes** and **pumps**)

- The `setting` value can be a **speed setting for pumps**.

> 对于 Pump 来说，speed setting 可以在 `[PUMPS]` 部分中的 `Properties` 设置

### VALVE

- Links not listed in this section have a default status of  `ACTIVE` (for **valves**).

- The `status` value can be `OPEN` or `CLOSED`.
  For control valves (e.g., `PRV`s, `FCV`s, etc.) this means that the valve is either fully opened or closed,
  not active at its control setting.

- The `setting` value can be a **valve setting for valves**.

> 对于 Valve 来说，valve setting 可以放到 `[VALVES]` 中

- If a `CLOSED` or `OPEN` control valve is to become `ACTIVE` again,
  then its **pressure or flow setting** must be specified in the **control or rule** that re-activates it.

**Example**:

```text
[STATUS]
; Link   Status/Setting
;----------------------
  L22     CLOSED         ;Link L22 is closed
  P14     1.5            ;Speed for pump P14
  PRV1    OPEN           ;PRV1 forced open
                         ;(overrides normal operation)
```
