---
title: "EMITTERS"
sequence: "emitter"
---

The `[EMITTERS]` defines **junctions** modeled as **emitters** (**sprinklers** or **orifices**).

## 应用对象

- Junction
- OPTIONS
    - EMITTER EXPONENT

## 格式

One line for each emitter containing:

- Junction ID label
- Flow coefficient, flow units at 1 psi (1 meter) pressure drop

Remarks:

- Emitters are used to model flow through sprinkler heads or pipe leaks. (用途)
- Flow out of the emitter equals the product of the flow coefficient and the junction pressure raised to a power.

```text
emitter flow = flow coefficient x junction pressure ^ power
```

- The power can be specified using the `EMITTER EXPONENT` option in the `[OPTIONS]` section.
  The default power is `0.5`, which normally applies to sprinklers and nozzles.
- **Actual demand** reported in the program's results includes
  both the **normal demand at the junction** plus **flow through the emitter**.

```text
actual demand = normal demand (junction) + flow (emitter)
```

- An `[EMITTERS]` section is optional. 

## EPANET

EPANET treats **emitters** as a property of a **junction** and not as a separate network component.

## 公式量化计算

Emitters are devices associated with junctions
that model the flow through a nozzle or orifice that discharges to the atmosphere.

The flow rate through the emitter varies as a function of the pressure available at the node:

<p>
\[
q = C p^{\gamma}
\]
</p>

<p>
where
<span>\(q\)</span> = <b>flow rate</b>,
<span>\(p\)</span> = <b>pressure</b>,
<span>\(C\)</span> = <b>discharge coefficient</b>,
and <span>\(\gamma\)</span> = <b>pressure exponent</b>.
</p>

<p>
For nozzles and sprinkler heads <span>\(\gamma\)</span> equals 0.5 and
the manufacturer usually provides the value of the <b>discharge coefficient</b> in units of gpm/psi <sup>0.5</sup>
(stated as the flow through the device at a 1 psi pressure drop).
</p>

## 用途

Emitters are used to model flow through sprinkler(喷水器) systems and irrigation networks.

```text
笔记：第一个用处，模拟 喷水系统 或 灌溉网络
```

They can also be used to simulate leakage in a pipe connected to the junction
(if a **discharge coefficient** and **pressure exponent** for the leaking crack or joint can be estimated)
or compute a fire flow(消防给水流量) at the junction (the flow available at some minimum residual pressure).

```text
笔记：第二个用处，模拟 管道泄漏 或 消防用水
```

In the latter case one would use a very high value of the **discharge coefficient**
(e.g., 100 times the maximum flow expected) and
modify the junction's **elevation** to include the equivalent head of the pressure target.


