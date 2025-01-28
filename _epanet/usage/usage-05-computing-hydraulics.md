---
title: "Computing Hydraulics"
sequence: "105"
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

There are two ways to use the Toolkit to run a hydraulic analysis:

- Use the `EN_solveH` function to run a complete extended period analysis, without having access to intermediate results.
- Use the `EN_openH` - `EN_initH` - `EN_runH` - `EN_nextH` - `EN_closeH` series of functions
  to step through the simulation one hydraulic time step at a time.

Method 1 is useful if you only want to run a single hydraulic analysis,
perhaps to provide input to a water quality analysis.
With this method hydraulic results are always saved to an intermediate hydraulics file at every time step.

Method 2 must be used if you need to access results between time steps or if you wish to run many analyses efficiently.
To accomplish the latter, you would make only one call to `EN_openH` to begin the process,
then make successive calls to `EN_initH` - `EN_runH` - `EN_nextH` to perform each analysis,
and finally call `EN_closeH` to close down the hydraulics system.

An example of this is shown below
(calls to `EN_nextH` are not needed because we are only making a single period analysis in this example).

```text
void runHydraulics(EN_Project ph, int nRuns)
{
    int  i;
    long t;
    EN_openH(ph);
    for (i = 1; i <= nRuns; i++)
    {
        // user-supplied function to set parameters
        setparams(ph, i);
        // initialize hydraulics; don't save them to file
        EN_initH(ph, EN_NOSAVE);
        // solve hydraulics
        EN_runH(ph, &t);
        // user-supplied function to process results
        getresults(ph, i);
    }
    EN_closeH(ph);
}
```
