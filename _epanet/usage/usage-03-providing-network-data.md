---
title: "Providing Network Data"
sequence: "103"
---

Once a **project** is created there are **two ways** in which it can be populated with data.

## 第一种方式：加载 INP 文件

The first is to use the `EN_open` function to load an EPANET-formatted **Input File**
that provides a description of the network to be analyzed.
This function should be called immediately after a project is created.
It takes as arguments the name of the input file to open and the names of a report file and a binary output file,
both of which are optional. Here is a code sample showing this approach:

```text
EN_Project ph;
int  errcode;
EN_createproject(&ph);
errcode = EN_open(ph, "net1.inp", "net1.rpt", "");
if (errcode == 0)
{
    // Call functions that perform desired analysis
}
EN_deleteproject(ph);
```

After an input file has been loaded in this fashion
the resulting network can have objects added or deleted,
and their properties set using the various Toolkit functions .

## 第二种方式

The second method for supplying network data to a project is
to use the Toolkit's functions to add objects and to set their properties via code.

In this case the `EN_init` function should be called immediately after creating a project,
passing in the names of a report and binary output files (both optional)
as well as the choices of flow units and head loss formulas to use.
After that the various `EN_add` functions, such as `EN_addnode`, `EN_addlink`, `EN_addpattern`, `EN_addcontrol`, etc.,
can be called to add new objects to the network.

Here is a partial example of constructing a network from code:

```text
int index;
EN_Project ph;
EN_createproject(&ph);
EN_init(ph, "net1.rpt", "", EN_GPM, EN_HW);
EN_addnode(ph, "J1", EN_JUNCTION, &index);
EN_addnode(ph, "J2", EN_JUNCTION, &index);
EN_addlink(ph, "P1", EN_PIPE, "J1", "J2", &index);
// additional function calls to complete building the network
```

The labels used to name objects cannot contain **spaces**, **semi-colons**, or **double quotes**
nor exceed `EN_MAXID` characters in length.

While adding objects, their properties can be set as described in the next section.
**Attemtping to change a network's structure by adding or deleting nodes and links
while the Toolkit's hydraulic or water quality solvers are open will result in an error condition.**
