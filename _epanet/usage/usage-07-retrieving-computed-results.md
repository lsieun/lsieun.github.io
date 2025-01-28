---
title: "Retrieving Computed Results"
sequence: "107"
---

The `EN_getnodevalue` and `EN_getlinkvalue` functions can also be used
to retrieve the results of hydraulic and water quality simulations.

The computed parameters (and their Toolkit codes) that can be retrieved are as follows:

| For Nodes:                         | For Links:                               |
|------------------------------------|------------------------------------------|
| EN_DEMAND (demand)                 | EN_FLOW (flow rate)                      |
| EN_DEMANDDEFICIT (demand deficit)  | EN_VELOCITY (flow velocity)              |
| EN_HEAD (hydraulic head)           | EN_HEADLOSS (head loss)                  |
| EN_PRESSURE (pressure)             | EN_STATUS (link status)                  |
| EN_TANKLEVEL (tank water level)    | EN_SETTING (pump speed or valve setting) |
| EN_TANKVOLUME (tank water volume)  | EN_ENERGY (pump energy usage)            |
| EN_QUALITY (water quality)         | EN_PUMP_EFFIC (pump efficiency)          |
| EN_SOURCEMASS (source mass inflow) |                                          |

The following code shows how to retrieve the pressure at each node of a network
after each time step of a hydraulic analysis
(`writetofile` is a user-defined function that will write a record to a file):

```text
void getPressures(EN_Project ph)
{
    int   i, numNodes;
    long  t, tStep;
    double p;
    char  id[EN_MAXID + 1];
    EN_getcount(ph, EN_NODECOUNT, &numNodes);
    EN_openH(ph);
    EN_initH(ph, EN_NOSAVE);
    do {
        EN_runH(ph, &t);
        for (i = 1; i <= NumNodes; i++) {
            EN_getnodevalue(ph, i, EN_PRESSURE, &p);
            EN_getnodeid(ph, i, id);
            writetofile(t, id, p);
        }
        EN_nextH(&tStep);
    } while (tStep > 0);
    EN_closeH(ph);
}
```
