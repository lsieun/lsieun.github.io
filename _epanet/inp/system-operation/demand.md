---
title: "DEMANDS"
sequence: "demand"
---

## INP: DEMANDS

The `[DEMANDS]` supplement to `[JUNCTIONS]` section for defining multiple water demands at junction nodes.

**Format**:

One line for each category of demand at a junction containing:

- Junction ID label
- Base demand (flow units)
- Demand pattern ID (optional)
- Name of demand category preceded by a semicolon (optional)

**Remarks**:

- Only use for **junctions** whose demands need to be changed or supplemented from entries in `[JUNCTIONS]` section.
- Data in this section replaces any demand entered in `[JUNCTIONS]` section for the same junction.
- Unlimited number of **demand categories** can be entered per junction.
- If no demand pattern is supplied
  then the junction demand follows the **Default Demand Pattern** specified in the `[OPTIONS]` section or
  Pattern 1 if no default pattern is specified.
  If the default pattern (or Pattern 1) does not exist, then the demand remains constant.

Example:

```text
[DEMANDS]
;ID    Demand   Pattern   Category
;---------------------------------
J1     100      101       ;Domestic
J1     25       102       ;School
J256   50       101       ;Domestic
```
