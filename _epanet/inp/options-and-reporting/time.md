---
title: "TIMES"
sequence: "time"
---

The `[TIMES]` defines various time step parameters used in the simulation.

**Format**:

<table>
<tbody>
<tr>
  <th class="w3-center">DURATION</th>
  <td>Value (units)</td>
</tr>
<tr>
  <th>HYDRAULIC TIMESTEP</th>
  <td>Value (units)</td>
</tr>
<tr>
  <th>QUALITY TIMESTEP</th>
  <td>Value (units)</td>
</tr>
<tr>
  <th>RULE TIMESTEP</th>
  <td>Value (units)</td>
</tr>
<tr>
  <th>PATTERN TIMESTEP</th>
  <td>Value (units)</td>
</tr>
<tr>
  <th>PATTERN START</th>
  <td>Value (units)</td>
</tr>
<tr>
  <th>REPORT TIMESTEP</th>
  <td>Value (units)</td>
</tr>
<tr>
  <th>REPORT START</th>
  <td>Value (units)</td>
</tr>
<tr>
  <th>START CLOCKTIME</th>
  <td>Value (AM/PM)</td>
</tr>
<tr>
  <th>STATISTIC</th>
  <td>NONE/AVERAGED/MINIMUM/MAXIMUM/RANGE</td>
</tr>
</tbody>
</table>

![](/assets/images/epanet/inp/option-time-start-duration-timestep.png)

- 整体视角
  - 什么时候开始：start clock time
  - 持续多长时间：total duration
- 局部视角
  - 时间步长大小：timestep
  - 什么时候生效：start

```text
                           ┌─── since ───┼─── START CLOCKTIME
         ┌─── whole ───────┤
         │                 └─── total ───┼─── DURATION
         │
         │                              ┌─── HYDRAULIC TIMESTEP
         │                              │
         │                              ├─── QUALITY TIMESTEP
         │                              │
         │                 ┌─── step ───┼─── RULE TIMESTEP
         │                 │            │
         │                 │            ├─── PATTERN TIMESTEP
TIMES ───┼─── local ───────┤            │
         │                 │            └─── REPORT TIMESTEP
         │                 │
         │                 │            ┌─── PATTERN START
         │                 └─── when ───┤
         │                              └─── REPORT START
         │
         │                 ┌─── NONE
         │                 │
         │                 ├─── AVERAGED
         │                 │
         └─── STATISTIC ───┼─── MINIMUM
                           │
                           ├─── MAXIMUM
                           │
                           └─── RANGE
```

Definitions:

**DURATION** is the duration of the simulation. Use `0` to run a single period snapshot analysis. The default is `0`.

**HYDRAULIC TIMESTEP** determines how often a new hydraulic state of the network is computed.
If greater than either the **PATTERN** or **REPORT** time step it will be automatically reduced.
The default is **1 hour**.

**QUALITY TIMESTEP** is the time step used to track changes in water quality throughout the network.
The default is `1/10` of the hydraulic time step.

**RULE TIMESTEP** is the time step used to check for changes in system status due to activation of rule-based controls
between hydraulic time steps.
The default is `1/10` of the hydraulic time step.

**PATTERN TIMESTEP** is the interval between time periods in all time patterns. The default is **1 hour**.

**PATTERN START** is the time offset at which all patterns will start.
For example, a value of 6 hours would start the simulation with each pattern in the time period
that corresponds to hour 6.
The default is `0`.

**REPORT TIMESTEP** sets the time interval between which output results are reported. The default is 1 hour.

**REPORT START** is the length of time into the simulation at which output results begin to be reported.
The default is `0`.

**START CLOCKTIME** is the time of day (e.g., 3:00 PM) at which the simulation begins.
The default is 12:00 AM midnight.

**STATISTIC** determines what kind of statistical post-processing should be done
on the time series of simulation results generated.
**AVERAGED** reports a set of time-averaged results,
**MINIMUM** reports only the minimum values,
**MAXIMUM** the maximum values,
and **RANGE** reports the difference between the minimum and maximum values.
**NONE** reports the full time series for all quantities for all nodes and links and is the default.

**Remarks**:

- Units can be **SECONDS** (**SEC**), **MINUTES** (**MIN**), **HOURS**, or **DAYS**. The default is hours.
- If units are not supplied, then time values can be entered as `decimal hours` or in `hours:minutes` notation.
- All entries in the `[TIMES]` section are optional. Items offset by slashes (`/`) indicate allowable choices.

**Example**:

```text
[TIMES]
DURATION           240 HOURS
QUALITY TIMESTEP   3 MIN
REPORT START       120
STATISTIC          AVERAGED
START CLOCKTIME    6:00 AM
```
