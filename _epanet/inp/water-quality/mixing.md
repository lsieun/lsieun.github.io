---
title: "MIXING"
sequence: "mixing"
---

The `[MIXING]` identifies the model that governs mixing within **storage tanks**.

## 应用对象

- Tank

## 格式

One line per tank containing:

- Tank ID label
- Mixing model (`MIXED`, `2COMP`, `FIFO`, or `LIFO`)
- Compartment volume (fraction)

Remarks:

- Mixing models include:
    - Single compartment, complete mix model ( `MIXED` )
    - Two-compartment complete mix model ( `2COMP` )
    - Plug flow, first in, first out model ( `FIFO` )
    - Stacked plug flow, last in, first out model ( `LIFO` )


### MIXED

- The `[MIXING]` section is optional. Tanks not described in this section are assumed to be **completely mixed**.

### 2COMP

- The **compartment volume parameter** only applies to the **two-compartment model** (`2COMP` ) and
  represents the fraction of the **total tank volume** devoted to the **inlet/outlet compartment**.

## Example

```text
[MIXING]
;Tank      Model
;-----------------------
T12        LIFO
T23        2COMP     0.2
```
