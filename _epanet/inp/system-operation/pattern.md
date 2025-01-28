---
title: "PATTERNS"
sequence: "patterns"
---

## 应用

应用在什么地方：

- Junction
    - Demand Pattern
    - Demand Categories
        - Time Pattern
    - Source Quality
        - Time Pattern
- Reservoir
    - Head Pattern
    - Source Quality
        - Time Pattern
- Tank
    - Source Quality
        - Time Pattern
- Pump
    - Pump Operation Pattern 
    - Energy Price Pattern
- Options:
    - Hydraulics
        - Default Demand Pattern
    - Energy
        - Price Pattern

## INP: PATTERNS

The `[PATTERNS]` defines time patterns.

**Format**:

One or more lines for each pattern containing:

- Pattern ID label
- One or more multipliers

**Remarks**:

Multipliers define how some base quantity (e.g., demand) is adjusted for each time period.

- All patterns share the same time period interval as defined in the `[TIMES]` section.
- Each pattern can have a different number of time periods.
- When the simulation time exceeds the pattern length the pattern wraps around to its first period.
- Use as many lines as it takes to include all multipliers for each pattern.

**Example**:

```text
[PATTERNS]
;Pattern P1
P1    1.1    1.4    0.9    0.7
P1    0.6    0.5    0.8    1.0
;Pattern P2
P2    1      1      1      1
P2    0      0      1
```

