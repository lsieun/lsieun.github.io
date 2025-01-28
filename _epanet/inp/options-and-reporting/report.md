---
title: "REPORT"
sequence: "report"
---

The `[REPORT]` describes the contents of the output report produced from a simulation.

## INP

### Format

```text
PAGESIZE    value
FILE        filename
STATUS      YES/NO/FULL
SUMMARY     YES/NO
MESSAGES    YES/NO
ENERGY      YES/NO
NODES       NONE/ALL/node1 node2 ...
LINKS       NONE/ALL/node1 node2 ...
variable    YES/NO
variable    BELOW/ABOVE/PRECISION value
```

### STATUS

- STATUS: Browser --> Data --> Options --> Hydraulics --> Status Report

`STATUS` determines whether **a hydraulic status report** should be generated.

If `YES` is selected the report will identify **all network components**
that change status during each time step of the simulation.

If `FULL` is selected, then the status report will also include information
from each trial of each hydraulic analysis.
This level of detail is only useful for **de-bugging networks that become hydraulically unbalanced**.

The default is `NO`.

### SUMMARY

`SUMMARY` determines whether

- **a summary table of number of network components** and
- **key analysis options**

is generated.

The default is `YES`.


