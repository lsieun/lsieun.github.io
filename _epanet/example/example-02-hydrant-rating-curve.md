---
title: "Hydrant Rating Curve Example"
sequence: "102"
---

This example illustrates how the Toolkit could be used to develop a **hydrant rating curve** used in fire flow studies.
This curve shows the amount of flow available at a node in the system as a function of pressure.
The curve is generated by running a number of steady state hydraulic analyses
with the node of interest subjected to a different demand in each analysis.

For this example we assume that the ID label of the node of interest is `MyNode` and
that `N` different **demand levels** stored in the array `D` need to be examined.
The corresponding **pressures** will be stored in `P`.
To keep the code more readable, no error checking is made on the results returned from the Toolkit function calls.

```text
#include "epanet2_2.h"
 
void HydrantRating(char *MyNode, int N, double D[], double P[])
{
    EN_Project ph;
    int   i, nodeindex;
    long  t;
    double pressure;
 
    // Create a project
    EN_createproject(&ph);
 
    // Retrieve network data from an input file
    EN_open(ph, "example2.inp", "example2.rpt", "");
 
    // Open the hydraulic solver
    EN_openH(ph);
 
    // Get the index of the node of interest
    EN_getnodeindex(ph, MyNode, &nodeindex);
 
    // Iterate over all demands
    for (i=1; i<N; i++)
    {
        // Set nodal demand, initialize hydraulics, make a
        // single period run, and retrieve pressure
        EN_setnodevalue(ph, nodeindex, EN_BASEDEMAND, D[i]);
        EN_initH(ph, 0);
        EN_runH(ph, &t);
        EN_getnodevalue(ph, nodeindex, EN_PRESSURE, &pressure);
        P[i] = pressure;
    }
 
    // Close hydraulics solver & delete the project
    EN_closeH(ph);
    EN_deleteproject(ph);
}
```

```java
import com.jm.epanet.EpaNetAPI;
import com.jm.epanet.EpanetException;
import com.jm.epanet.meta.InitHydOption;
import com.jm.epanet.meta.NodeProperty;

import java.io.File;

public class HydrantRatingCurve {
    public static void main(String[] args) throws EpanetException {
        String dir = System.getProperty("user.dir");
        String inpFile = dir + File.separator + "example2.inp";
        String rptFile = dir + File.separator + "example2.rpt";
        String outFile = dir + File.separator + "example2.out";

        String myNode = "J1";

        EpaNetAPI instance = new EpaNetAPI();

        // Retrieve network data from an input file
        instance.open(inpFile, rptFile, outFile);

        // Open the hydraulic solver
        instance.openHydraulic();

        // Get the index of the node of interest
        int nodeIndex = instance.getNodeIndex(myNode);

        // Iterate over all demands
        float[] demandArray = {
                0, 100, 500, 800, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 7800
        };

        for (float demand : demandArray) {
            // Set nodal demand, initialize hydraulics, make a
            // single period run, and retrieve pressure
            instance.setNodeValue(nodeIndex, NodeProperty.BASE_DEMAND, demand);
            instance.initHydraulic(InitHydOption.NO_SAVE);
            instance.runHydraulic();
            double pressure = instance.getNodeValue(nodeIndex, NodeProperty.PRESSURE);

            String message = String.format("demand: %8.3f, pressure: %f", demand, pressure);
            System.out.println(message);
        }

        // Close hydraulics solver
        instance.closeHydraulic();
        instance.close();
    }
}
```

```text
demand:    0.000, pressure: 116.868645
demand:  100.000, pressure: 116.687927
demand:  500.000, pressure: 115.406456
demand:  800.000, pressure: 113.979874
demand: 1000.000, pressure: 112.838982
demand: 2000.000, pressure: 105.096634
demand: 3000.000, pressure: 94.203407
demand: 4000.000, pressure: 80.317574
demand: 5000.000, pressure: 63.527119
demand: 6000.000, pressure: 43.895237
demand: 7000.000, pressure: 21.471922
error code = WARNING: System has negative pressures.
demand: 7800.000, pressure: 1.551725
```
