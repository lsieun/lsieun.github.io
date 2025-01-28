---
title: "EPANET Application Limitations"
sequence: "105"
---

By being a quasi-static hydraulic model
(non-inertial model, that is to say, it doesn't consider abrupt flow changes in the network),
cannot model rapid flow phenomena such as:

- **a rupture in a pipe**,
- **water hammer caused by a sudden valve closure or the start of stop of a pump**,
- **sudden return valve closure**, etc.

In regard to water-quality modeling,
Epanet does not consider the dispersion term in the differential equation for transport of the modelled substance.
This term, along with the influence of dispersion is important in low velocity network pipes.
Tzatchkovel al. (2002)  published and applied an algorithm
that allows for the consideration of this term using the results file from the Epanet hydraulic calculations.
