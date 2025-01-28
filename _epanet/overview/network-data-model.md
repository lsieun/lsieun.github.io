---
title: "Network Data Model"
sequence: "101"
---

EPANET models a pipe network as a collection of **links** connected to **nodes**.

- The **links** represent **pipes**, **pumps**, and **control valves**.
    - Pipes have a length, diameter and roughness coefficient
      that determines their head loss as a function of flow rate.
    - Pumps have either a constant power rating or a head curve
      that determines the head they add as a function of flow rate.
    - Valves are used to regulate either flow or pressure.
      Controls can be applied to completely open or close a link or
      to adjust its setting (pump speed or valve setting).
- The **nodes** represent **junctions**, **tanks**, and **reservoirs**.
    - **Junctions** have a user-supplied water withdrawal rate (i.e., consumer demand) associated with them.
    - **Tanks** are storage units whose water level changes over time.
    - **Reservoirs** are boundary points where a fixed hydraulic head applies.

The figure below illustrates how these objects can be connected to one another to form a network.

![](/assets/images/epanet/epanet-network-example-01.png)

In addition to these **physical objects** an EPANET model can also contain the following data objects:

- **time patterns** that allow demands, quality source strength and pump speed settings to vary at fixed intervals of time
- **data curves** that describe relationships between two quantities,
  such as head versus flow for pumps and volume versus water level for tanks
- **simple controls** that adjust a link's setting (such as a pump's status)
  based on node pressure, tank level, elapsed time, ot time of day
- **rule-based controls** that consist of one or more premises
  that if true result in one set of actions being taken and
  if false result in a different set of actions being taken
- **water quality sources** that introduce a chemical constituent into the network at specified nodes.

An EPANET model also contains a number of **analysis options** that specify:

- the project's **flow units** which in turn determines its unit system (US or SI)
- the **formula** used to compute head loss
- whether to use a **demand driven** or a **pressure driven analysis**
- **hydraulic convergence criteria**
- **time steps** used for hydraulic, water quality and reporting
- the **type of water quality analysis** to perform (chemical reaction, source tracing or water age)
- **global values for chemical reaction coefficients** that can be overridden for individual pipes
- **global values for energy usage parameters** that can be overridden for individual pumps.

```text
                                                     ┌─── junction
                                                     │
                                        ┌─── node ───┼─── reservoir
                                        │            │
                                        │            └─── tank
                ┌─── physical ──────────┤
                │                       │            ┌─── pipe
                │                       │            │
                │                       └─── link ───┼─── pump
                │                                    │
                │                                    └─── valve
                │
                │                       ┌─── curve
                │                       │
                │                       ├─── time pattern
                │                       │
                ├─── non-physical ──────┤                            ┌─── simple control
EPANET model ───┤                       ├─── control ────────────────┤
                │                       │                            └─── rule-base control
                │                       │
                │                       └─── water quality source
                │
                │                                          ┌─── flow units
                │                                          │
                │                                          ├─── head loss formula
                │                       ┌─── hydraulic ────┤
                │                       │                  ├─── DDA or PDA
                │                       │                  │
                │                       │                  └─── hydraulic convergence criteria
                │                       │
                └─── analysis option ───┼─── quality
                                        │
                                        ├─── reaction
                                        │
                                        ├─── time steps
                                        │
                                        └─── energy
```














