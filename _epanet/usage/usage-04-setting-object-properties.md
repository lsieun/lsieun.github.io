---
title: "Setting Object Properties"
sequence: "104"
---

The Toolkit contains several functions for retrieving and setting **the properties of a network's objects** and
its **analysis options**.

The names of retrieval functions all begin with `EN_get` (e.g., `EN_getnodevalue`, `EN_getoption`, etc.)
while the functions used for setting parameter values begin with `EN_set` (e.g., `EN_setnodevalue`, `EN_setoption`, etc.).

Most of these functions use an **index number** to refer to a specific network component
(such as a node, link, time pattern or data curve).
This number is simply the position of the component in the list of all components of similar type
(e.g., node 10 is the tenth node, **starting from `1`**, in the network)
and is not the same as the ID label assigned to the component.

A series of functions exist to determine a component's index number given its ID label
(see `EN_getnodeindex`, `EN_getlinkindex`, `EN_getpatternindex`, and `EN_getcurveindex`).

```text
id --> index number
```

Likewise, functions exist to retrieve a component's ID label given its index number
(see `EN_getlinkid`, `EN_getnodeid`, `EN_getpatternid`, and `EN_getcurveid`).

```text
index number --> id
```

The `EN_getcount` function can be used to determine the number of different components in the network.
**Be aware that a component's index can change as elements are added or deleted from the network.**
The `EN_addnode` and `EN_addlink` functions return the index of the newly added node or link
as a convenience for immediately setting their properties.

The code below is an example of using the property retrieval and setting functions.
It changes all links with diameter of 10 inches to 12 inches.

```text
void changeDiameters(EN_Project ph)
{
    int   i, nLinks;
    double diam;
    EN_getcount(ph, EN_LINKCOUNT, &nLinks);
    for (i = 1; i <= nLinks; i++)
    {
        EN_getlinkvalue(ph, i, EN_DIAMETER, &diam);
        if (diam == 10) EN_setlinkvalue(ph, i, EN_DIAMETER, 12);
    }
}
```
