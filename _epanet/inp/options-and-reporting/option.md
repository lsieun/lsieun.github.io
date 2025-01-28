---
title: "OPTIONS"
sequence: "option"
---

## INP: OPTIONS

The `[OPTIONS]` defines various simulation options.

**Formats**:

<table>
  <tbody>
  <tr>
    <th class="w3-center">UNITS</th>
    <td>
      CFS/GPM/MGD/IMGD/AFD/<br/>
      LPS/LPM/MLD/CMH/CMD
    </td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">HEADLOSS</th>
    <td>H-W/D-W/C-M</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">HYDRAULICS</th>
    <td>USE/SAVE</td>
    <td>filename</td>
  </tr>
  <tr>
    <th class="w3-center">QUALITY</th>
    <td>NONE/CHEMICAL/AGE/TRACE</td>
    <td>id</td>
  </tr>
  <tr>
    <th class="w3-center">VISCOSITY</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">DIFFUSIVITY</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">SPECIFIC GRAVITY</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">TRIALS</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">ACCURACY</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">HEADERROR</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">FLOWCHANGE</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">UNBALANCED</th>
    <td>STOP/CONTINUE/CONTINUE</td>
    <td>n</td>
  </tr>
  <tr>
    <th class="w3-center">PATTERN</th>
    <td>id</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">DEMAND MODEL</th>
    <td>DDA/PDA</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">MINIMUM PRESSURE</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">REQUIRED PRESSURE</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">PRESSURE EXPONENT</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">DEMAND MULTIPLIER</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">EMITTER EXPONENT</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">TOLERANCE</th>
    <td>value</td>
    <td></td>
  </tr>
  <tr>
    <th class="w3-center">MAP</th>
    <td>filename</td>
    <td></td>
  </tr>
  </tbody>
</table>

```text
                                                                         ┌─── LPS
                                                                         │
                                                                         ├─── LPM
                                                                         │
                              ┌─── Units of Measurement ───┼─── UNITS ───┼─── MLD
                              │                                          │
                              │                                          ├─── CMH
                              │                                          │
                              │                                          └─── CMD
                              │
                              │                                                              ┌─── H-W: Hazen-Williams
                              │                                                              │
                              │                            ┌─── pipe ───────┼─── HEADLOSS ───┼─── D-W: Darcy-Weisbach
                              │                            │                                 │
                              │                            │                                 └─── C-M: Chezy-Manning
                              ├─── component ──────────────┤
                              │                            │                                ┌─── PATTERN (Default Pattern)
                              │                            │                ┌─── demand ────┤
                              │                            └─── junction ───┤               └─── DEMAND MULTIPLIER
                              │                                             │
                              │                                             └─── emitter ───┼─── EMITTER EXPONENT
                              │
                              │                            ┌─── VISCOSITY (Relative Viscosity)
                              ├─── fluid ──────────────────┤
                              │                            └─── SPECIFIC GRAVITY
                              │
           ┌─── Hydraulics ───┤                                                               ┌─── DDA
           │                  │                                                               │
           │                  │                            ┌─── DEMAND MODEL ─────────────────┤           ┌─── MINIMUM PRESSURE
           │                  │                            │                                  │           │
           │                  │                            │                                  └─── PDA ───┼─── REQUIRED PRESSURE
           │                  │                            │                                              │
           │                  │                            │                                              └─── PRESSURE EXPONENT
           │                  │                            │
           │                  │                            ├─── run ──────────────────────────┼─── TRIALS (Maximum Trials)
           │                  │                            │
           │                  ├─── solve ──────────────────┤                                  ┌─── ACCURACY
           │                  │                            │                                  │
           │                  │                            ├─── convergence ──────────────────┼─── HEADERROR (Max. Head Error)
           │                  │                            │                                  │
           │                  │                            │                                  └─── FLOWCHANGE (Max. Flow Change)
           │                  │                            │
OPTIONS ───┤                  │                            │                                  ┌─── STOP
           │                  │                            │                                  │
           │                  │                            └─── UNBALANCED (If Unbalanced) ───┼─── CONTINUE
           │                  │                                                               │
           │                  │                                                               └─── CONTINUE n
           │                  │
           │                  │                                               ┌─── SAVE
           │                  └─── result ─────────────────┼─── HYDRAULICS ───┤
           │                                                                  └─── USE
           │
           │                                                             ┌─── NONE
           │                                                             │
           │                                                             ├─── CHEMICAL
           │                  ┌─── QUALITY ──────────────────────────────┤
           │                  │                                          ├─── AGE
           │                  │                                          │
           └─── Quality ──────┤                                          └─── TRACE
                              │
                              ├─── DIFFUSIVITY (Relative Diffusivity)
                              │
                              └─── TOLERANCE (Quality Tolerance)
```

**Definitions**:

**UNITS** sets the units in which flow rates are expressed where:

- **CFS** = cubic feet per second
- **GPM** = gallons per minute
- **MGD** = million gallons per day
- **IMGD** = Imperial MGD
- **AFD** = acre-feet per day
- **LPS** = liters per second
- **LPM** = liters per minute
- **MLD** = million liters per day
- **CMH** = cubic meters per hour
- **CMD** = cubic meters per day

For **CFS**, **GPM**, **MGD**, **IMGD**, and **AFD** other input quantities are expressed in US Customary Units.
If flow units are in liters or cubic meters then Metric Units must be used for all other input quantities as well.
The default flow units are **GPM**.

> 在EPANET中，默认的 flow units 是 GPM（加仑每分钟）；在项目的监测数据中（安徽安庆），水表的单位是 CMH（立方米/小时）

**HEADLOSS** selects a formula to use for computing head loss for flow through a pipe.
The choices are the Hazen-Williams (**H-W**), Darcy-Weisbach (**D-W**), or Chezy-Manning (**C-M**) formulas.
The default is **H-W**.

> 水头损失，默认使用 H-W

**HYDRAULICS** option allows you to either **SAVE** the current hydraulics solution to a file or
**USE** a previously saved hydraulics solution.
This is useful when studying factors that only affect water quality behavior.

> hydraulic solution 何去何从

**QUALITY** selects the type of water quality analysis to perform.
The choices are **NONE**, **CHEMICAL**, **AGE**, and **TRACE**.
- In place of **CHEMICAL** the actual name of the chemical can be used followed by its concentration units
  (e.g., **CHLORINE mg/L**).
- If **TRACE** is selected it must be followed by the ID label of the node being traced.
- The default selection is **NONE** (no water quality analysis).

In lieu of **Chemical**, you can  enter the actual name of the chemical being modeled (e.g., **Chlorine**).

> 水质分析

**VISCOSITY** is the kinematic viscosity of the fluid being modeled
relative to that of water at 20 deg. C (1.0 centistoke).
The default value is **1.0**.

> 水质分析-运动粘性系数

**DIFFUSIVITY** is the molecular diffusivity of the chemical being analyzed relative to that of chlorine in water.
The default value is **1.0**.
Diffusivity is only used when mass transfer limitations are considered in pipe wall reactions.
A value of `0` will cause EPANET to ignore mass transfer limitations.

> 水质分析-分子扩散系数

**SPECIFIC GRAVITY** is the ratio of the density of the fluid being modeled to that of water at 4 deg. C (unitless).

> 水质分析-相对密度。某种液体，它相对于水在4摄氏度的时候的密度。

<p>
    同一种物质，随着温度、压强的变化，其密度也会有所变化。
    以水为例，水在4℃的时候密度达到最大值，随着温度的升高，其密度也会越来越小。
    因此，确定水在4℃时的密度为其标准密度。
</p>
<p>
    4℃时的水的密度\(\rho_{w}=1000kg/m^{3}\)，
    固体和流体的密度\(\rho\)的比重\(s\)就是以水的密度为标准的，
    用公式表示如下：
</p>
<p>
    \[
    s(比重) = \frac{\rho(流体的密度kg/m^{3})}{\rho_{w}(水的密度1000kg/m^{3})}
    \]
</p>

**TRIALS** are the maximum number of trials used to solve network hydraulics
at each hydraulic time step of a simulation.
The default is `200`.

> 水力计算-尝试计算的次数

**ACCURACY** prescribes the convergence criterion that determines when a hydraulic solution has been reached.
The trials end when **the sum of all flow changes** from the previous solution
divided by **the total flow in all links** is less than this number.
The default is **0.001**.

> 水力计算-收敛-精度

**HEADERROR** augments **ACCURACY** option.
Sets the maximum head loss error that any network link can have for hydraulic convergence to occur.
A link's head loss error is the difference between the head loss found as a function of computed flow in the link
(such as by the Hazen-Williams equation for a pipe) and the difference in computed heads for the link's end nodes.
The units of this parameter are feet (US) or meters (SI).
The default value of `0` indicates that no head error limit applies.

> 水力计算-收敛-最大的水头损失误差

**FLOWCHANGE** augments the **ACCURACY** option.
Sets the largest change in flow that any network element
(link, emitter, or pressure driven demand) can have for hydraulic convergence to occur.
It is specified in whatever flow units the project is using.
The default value of `0` indicates that no flow change limit applies.

> 水力计算-收敛-最大的流量变化范围

**UNBALANCED** determines what happens if a hydraulic solution cannot be reached
within the prescribed number of **TRIALS** at some hydraulic time step into the simulation.
“**STOP**” will halt the entire analysis at that point.
“**CONTINUE**” will continue the analysis with a warning message issued.
“**CONTINUE n**” will continue the search for a solution for another “n” trials
with the status of all links held fixed at their current settings.
The simulation will be continued at this point with a message issued about whether convergence was achieved or not.
The default choice is “STOP”.

> 水力计算-收敛失败

**PATTERN** provides the ID label of a **default demand pattern** to be applied to all **junctions**
where no demand pattern was specified.
If no such pattern exists in the `[PATTERNS]` section
then by default the pattern consists of a single multiplier equal to `1.0`.
If this option is not used, then the global default demand pattern has a label of “1”.

**DEMAND MULTIPLIER** is used to adjust the values of baseline demands
for **all junctions** and **all demand categories**.
For example, a value of 2 doubles all baseline demands, while a value of 0.5 would halve them.
The default value is 1.0.

<p>
<strong>DEMAND MODEL</strong> determines nodal demand model – Demand Driven Analysis (<strong>DDA</strong>) or
Pressure Driven Analysis (<strong>PDA</strong>).
DDA assumes a nodal demand at a given point in time is a fixed value <span>\(D\)</span>.
This sometimes results in hydraulic solutions with negative pressures (a physical impossibility).
PDA assumes the demand delivered, <span>\(d\)</span>, is a function of nodal pressure, <span>\(p\)</span>, as follows:
</p>

<p>
\[
d = D \left[ \frac{p - P_{min}}{P_{req} - P_{min}} \right]^{P_{exp}}
\]
</p>
<p>
where <span>\(D\)</span> is the full demand required, 
<span>\(P_{min}\)</span> is the pressure below which demand is zero,
<span>\(P_{req}\)</span> is the pressure required to deliver the full required demand
and <span>\(P_{exp}\)</span> is an exponent.
The units of the pressures are psi (US) or meters (SI).
When <span>\(p &lt; P_{min}\)</span> demand is 0 and when
<span>\(p &gt; P_{req}\)</span> demand equals <span>\(D\)</span>.
The default value is <strong>DDA</strong>.
</p>

> 选择DEMAND MODEL是DDA，还是PDA

<p><strong>MINIMUM PRESSURE</strong> specifies the value for <span>\(P_{min}\)</span>. Default value is <code>0.0</code>.</p>
<p><strong>REQUIRED PRESSURE</strong> specifies the value for <span>\(P_{req}\)</span>. Default value is <code>0.1</code>.</p>
<p><strong>PRESSURE EXPONENT</strong> specifies the value for <span>\(P_{exp}\)</span>. Default value is <code>0.5</code>.</p>
<p>
<strong>EMITTER EXPONENT</strong> specifies the power to which the pressure at a junction is raised
when computing the flow issuing from an emitter. The default is `0.5`.
</p>

**MAP** is used to supply the name of a file containing coordinates of the network's nodes
so that a map of the network can be drawn.
It is not used for any hydraulic or water quality computations.

**TOLERANCE** is the difference in water quality level
below which one can say that one parcel of water is essentially the same as another.
The default is `0.01` for all types of quality analyses (chemical, age (measured in hours),
or source tracing (measured in percent)).

**Remarks**:

- All options assume their default values if not explicitly specified in this section.
- Items offset by slashes (`/`) indicate allowable choices.

**Example**:

```html
[OPTIONS]
UNITS        CFS
HEADLOSS     D-W
QUALITY      TRACE   Tank23
UNBALANCED   CONTINUE   10
```


