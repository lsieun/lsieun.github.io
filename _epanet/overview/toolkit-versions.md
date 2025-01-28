---
title: "Toolkit Versions"
sequence: "103"
---

The Toolkit comes with two sets of identical functions that programmers can utilize:

- the **single-threaded** version of the Toolkit is compatible with previous releases and only works with single threaded applications.
- the **multi-threaded** version allows users to create multiple EPANET data sets (called projects) that can be analyzed concurrently.

Both Toolkit versions utilize identical function names and argument lists with the following exceptions:

- The `#include "epanet2.h"` directive must appear in all C/C++ code modules that use the **single-threaded** library
  while `#include "epanet2_2.h"` must be used for the **multi-threaded** library.
- Function names in the **single-threaded** library begin with `EN` while those in the **multi-threaded** library begin with `EN_`.
- The **multi-threaded** functions contain an additional argument that references a particular network project that the function is applied to.
- The **multi-threaded** library contains two additional functions that allow users to create and delete EPANET projects.
- The **single-threaded** library uses **single precision** for its **floating point arguments**
  while the **multi-threaded** library uses **double precision**.

To avoid unnecessary duplication this document only discusses the **multi-threaded version** of the Toolkit.

