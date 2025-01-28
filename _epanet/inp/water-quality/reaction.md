---
title: "REACTIONS"
sequence: "reaction"
---

The `[REACTIONS]` defines parameters related to **chemical reactions** occurring in the network.

## 应用

- Pipe
- Tank
- Reaction
    - Options --> Reaction

## 格式

Format:

<table>
    <tr>
        <th>ORDER</th>
        <td>BULK/WALL/TANK</td>
        <td>value</td>
    </tr>
    <tr>
        <th>GLOBAL</th>
        <td>BULK/WALL</td>
        <td>value</td>
    </tr>
    <tr>
        <th>BULK/WALL</th>
        <td>pipeID</td>
        <td>value</td>
    </tr>
    <tr>
        <th>TANK</th>
        <td>tankID</td>
        <td>value</td>
    </tr>
    <tr>
        <th>LIMITING POTENTIAL</th>
        <td>value</td>
        <td></td>
    </tr>
    <tr>
        <th>ROUGHNESS CORRELATION</th>
        <td>value</td>
        <td></td>
    </tr>
</table>

### Definitions

`ORDER` is used to set the order of reactions occurring in the **bulk fluid**,
at the **pipe wall**, or in **tanks**, respectively.
Values for **wall** reactions must be either `0` or `1`.
If not supplied the default reaction order is `1.0`.

- Order
    - Pipe
        - Pipe Bulk Fluid
        - Pipe Wall
    - Tank
        - Tank Bulk Fluid

`GLOBAL` is used to set a global value for all **bulk reaction coefficients** (**pipes** and **tanks**) or
for all **pipe wall coefficients**.
The default value is **zero**.

`BULK`, `WALL`, and `TANK` are used to override the global reaction coefficients for **specific pipes and tanks**.

`LIMITING POTENTIAL` specifies that **reaction rates** are proportional to
the difference between **the current concentration** and **some limiting potential value**.

`ROUGHNESS CORRELATION` will make all **default pipe wall reaction coefficients**
be related to **pipe roughness** in the following manner:

<table>
    <thead>
    <tr>
        <th>Head Loss Equation</th>
        <th>Roughness Correlation</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Hazen-Williams</td>
        <td><span>\(F / C\)</span></td>
    </tr>
    <tr>
        <td>Darcy-Weisbach</td>
        <td><span>\(F / log(e/D)\)</span></td>
    </tr>
    <tr>
        <td>Chezy-Manning</td>
        <td><span>\(F*n\)</span></td>
    </tr>
    </tbody>
</table>

<p>
where <span>\(F\)</span> = roughness correlation,
<span>\(C\)</span> = Hazen-Williams C-factor,
<span>\(e\)</span> = Darcy-Weisbach roughness,
<span>\(D\)</span> = pipe diameter, and
<span>\(n\)</span> = Chezy-Manning roughness coefficient.
The default value computed this way can be overridden for any pipe
by using the <strong>WALL</strong> format to supply a specific value for the pipe.
</p>

Remarks:

- Remember to use **positive numbers** for **growth reaction coefficients** and
  **negative numbers** for **decay coefficients**.
- The **time units** for all reaction coefficients are `1/days`.
- All entries in this section are optional. Items offset by slashes (`/`)
  indicate allowable choices.

Example:

```text
[REACTIONS]
ORDER WALL    0    ;Wall reactions are zero-order
GLOBAL BULK  -0.5  ;Global bulk decay coeff.
GLOBAL WALL  -1.0  ;Global wall decay coeff.
WALL   P220  -0.5  ;Pipe-specific wall coeffs.
WALL   P244  -0.7
```
