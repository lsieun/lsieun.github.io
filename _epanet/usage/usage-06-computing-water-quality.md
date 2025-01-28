---
title: "Computing Water Quality"
sequence: "106"
---

```text
          ┌─── open ─────────────────────┼─── EN_open()
          │
          │                              ┌─── complete ───────┼─── solve ───┼─── EN_solveH()
          │                              │
          │                              │                    ┌─── open ────┼─── EN_openH()
          ├─── hydraulic analysis ───────┤                    │
          │                              │                    ├─── init ────┼─── EN_initH()
          │                              │                    │
          │                              └─── step by step ───┤             ┌─── EN_runH()
          │                                                   ├─── loop ────┤
          │                                                   │             └─── EN_nextH()
          │                                                   │
          │                                                   └─── close ───┼─── EN_closeH()
          │
epanet ───┤                              ┌─── complete ───────┼─── solve ───┼─── EN_solveQ()
          │                              │
          │                              │                    ┌─── open ────┼─── EN_openQ()
          ├─── water quality analysis ───┤                    │
          │                              │                    ├─── init ────┼─── EN_initQ()
          │                              │                    │
          │                              │                    │             ┌─── EN_runQ()
          │                              └─── step by step ───┤             │
          │                                                   ├─── loop ────┼─── EN_nextQ(): hydraulic time step
          │                                                   │             │
          │                                                   │             └─── EN_stepQ(): water quality time step
          │                                                   │
          │                                                   └─── close ───┼─── EN_closeQ()
          │
          └─── close ────────────────────┼─── EN_close()
```

As with a **hydraulic analysis**, there are two ways to carry out a **water quality analysis**:

- Use the `EN_solveQ` function to run a complete extended period analysis, without having access to intermediate results.
  A complete set of hydraulic results must have been generated
  either from running a hydraulic analysis or from importing a saved hydraulics file from a previous run.
- Use the `EN_openQ` - `EN_initQ` - `EN_runQ` - `EN_nextQ` - `EN_closeQ` series of functions
  to step through the simulation one **hydraulic time step** at a time.
  (Replacing `EN_nextQ` with `EN_stepQ` will step through one **water quality time step** at a time.)

The second option can either be carried out **after a hydraulic analysis has been run** or
**simultaneously as hydraulics are being computed**.

Example code for these two alternatives is shown below:

```text
int runSequentialQuality(EN_Project ph)
{
    int err;
    long t, tStep;
    err = EN_solveH(ph);
    if (err > 100) return err;
    EN_openQ(ph);
    EN_initQ(ph, EN_NOSAVE);
    do {
        EN_runQ(ph, &t);
        // Access quality results for time t here
        EN_nextQ(ph, &tStep);
    } while (tStep > 0);
    EN_closeQ(ph);
    return 0;
}
 
int runConcurrentQuality(EN_Project ph)
{
    int err = 0;
    long t, tStep;
    EN_openH(ph);
    EN_initH(ph, EN_NOSAVE);
    EN_openQ(ph);
    EN_initQ(ph, EN_NOSAVE);
    do {
        err = EN_runH(ph, &t);
        if (err > 100) break;
        EN_runQ(ph, &t);
        // Access hydraulic & quality results for time t here
        EN_nextH(ph, &tStep);
        EN_nextQ(ph, &tStep);
    } while (tStep > 0);
    EN_closeH(ph);
    EN_closeQ(ph);
    return err;
}
```
