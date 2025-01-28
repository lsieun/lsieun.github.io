---
title: "Producing a Report"
sequence: "108"
---

The Toolkit has some built-in capabilities to produce formatted output results saved to a file.
More specialized reporting needs can always be handled by writing custom code.

The `EN_setreport` function is used to define the format of a report
while the `EN_report` function actually writes the report.
**The latter should be called only after a hydraulic or water quality analysis has been made.**

An example of creating a report that lists all nodes
where the pressure variation over the duration of the simulation exceeds 20 psi is shown below:

```text
void reportPressureVariation(EN_Project ph)
{
    // Compute ranges (max - min)
    EN_settimeparam(ph, EN_STATISTIC, EN_RANGE);
 
    // Solve and save hydraulics
    EN_solveH(ph);
    EN_saveH(ph);
 
    // Define contents of the report
    EN_resetreport(ph);
    EN_setreport(ph, "FILE myfile.rpt");
    EN_setreport(ph, "NODES ALL");
    EN_setreport(ph, "PRESSURE PRECISION 1");
    EN_setreport(ph, "PRESSURE ABOVE 20");
 
    // Write the report to file
    EN_report(ph);
}
```
