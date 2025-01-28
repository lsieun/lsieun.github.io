---
title: "Detecting Error Conditions"
sequence: "102"
---

All the Toolkit functions return an error/warning code.

- A `0` indicates that the function ran successfully.
- A number greater than `0` but less than `100` indicates that a warning condition was generated
- while a number higher than `100` indicates that the function failed.

The meaning of specific error and warning codes are listed in the Error Codes and Warning Codes sections of this guide.
The Toolkit function `EN_geterror` can be used to obtain the text of a specific error/warning code.
The following example uses a macro named `ERRCODE` along with a variable named `errcode`
to execute Toolkit commands only if no fatal errors have already been detected:

```text
#define ERRCODE(x) (errcode = ((errcode > 100) ? (errcode) : (x)))
 
void runHydraulics(EN_Project ph, char *inputFile, char *reportFile)
{
    int errcode = 0;
    char errmsg[EN_MAXMSG + 1];
 
    ERRCODE(EN_open(ph, inputFile, reportFile, ""));
    ERRCODE(EN_solveH(ph));
    ERRCODE(EN_saveH(ph));
    ERRCODE(EN_report(ph));
    EN_geterror(errcode, errmsg, EN_MAXMSG);
    if (errcode) printf("\n%s\n", errmsg);
}
```
