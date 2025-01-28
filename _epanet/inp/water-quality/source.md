---
title: "SOURCES"
sequence: "source"
---

The `[SOURCES]` defines locations of **water quality sources**.

- water quality
    - chemical: `[SOURCES]` 只应用在这里
    - water age
    - source tracing

## 应用对象

- Junction
- Reservoir
- Tank

## Format

One line for each water quality source containing:

- Node ID label
- Source type (`CONCEN`, `MASS`, `FLOWPACED`, or `SETPOINT`)
- Baseline source strength
- Time pattern ID (optional)

**Remarks**:

- **Source strength** can be made to vary over time by specifying a **time pattern**.

### Units

- For `MASS` type sources, strength is measured in **mass flow per minute**.
  All other types measure source strength in **concentration units**.

### CONCEN

A `CONCEN` source:

- represents the concentration of any external source inflow to the node
- applies only when the node has **a net negative demand** (water enters the network at the node)
- if the node is a **junction**,
  reported concentration is the result of mixing the source flow and inflow from the rest of the network
- if the node is a **reservoir**, the reported concentration is the source concentration
- if the node is a **tank**, the reported concentration is the internal concentration of the tank
- is best used for nodes that represent source water supplies or treatment works
  (e.g., reservoirs or nodes assigned a negative demand)
- do not use at storage tanks with simultaneous inflow/outflow.

### MASS, FLOWPACED, or SETPOINT

A `MASS`, `FLOWPACED`, or `SETPOINT` source:

- represents a booster source, where the substance is injected directly into the network regardless of what the
  demand at the node is
- affects water leaving the node to the rest of the network in the following way:
    - a MASS booster adds a fixed mass flow to that resulting from inflow to the node
    - a FLOWPACED booster adds a fixed concentration to the resultant inflow concentration at the node
    - a SETPOINT booster fixes the concentration of any flow leaving the node (as long as the concentration
      resulting from the inflows is below the setpoint)
- the reported concentration at a junction or reservoir booster source is the concentration that results after the
  boosting is applied; the reported concentration for a tank with a booster source is the internal concentration of
  the tank
- is best used to model direct injection of a tracer or disinfectant into the network or to model a contaminant
  intrusion.

### Chemical

- A `[SOURCES]` section is not needed for simulating **water age** or **source tracing**.

Example:

```text
[SOURCES] 
;Node  Type    Strength  Pattern 
;-------------------------------- 
N1     CONCEN  1.2       Pat1    ;Concentration varies with time 
N44    MASS    12                ;Constant mass injection   
```


