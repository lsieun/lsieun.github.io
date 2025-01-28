---
title: "Chlorine Dosage Example"
sequence: "103"
---

This example illustrates how the Toolkit could be used to determine the lowest dose of chlorine applied
at the entrance to a distribution system needed to ensure that a minimum residual is met throughout the system.
We assume that the EPANET input file contains the proper set of kinetic coefficients
that describe the rate at which chlorine will decay in the system being studied.

In the example code, the ID label of the source node is contained in `SourceID`,
the minimum residual target is given by `Ctarget`,
and the target is only checked after a start-up duration of 5 days (432,000 seconds).
To keep the code more readable, no error checking is made on the results returned from the Toolkit function calls.

```text
#include "epanet2_2.h"
 
double cl2dose(char *SourceID, double Ctarget)
{
    int i, nnodes, sourceindex, violation;
    double c, csource;
    long t, tstep;
    EN_Project ph;
 
    // Open the toolkit & obtain a hydraulic solution
    EN_createproject(&ph);
    EN_open(ph, "example3.inp", "example3.rpt", "");
    EN_solveH(ph);
 
    // Get the number of nodes and the source node's index
    EN_getcount(ph, EN_NODECOUNT, &nnodes);
    EN_getnodeindex(ph, SourceID, &sourceindex);
 
    // Setup the system to analyze for chlorine
    // (in case it was not done in the input file)
    EN_setqualtype(ph, EN_CHEM, "Chlorine", "mg/L", "");
 
    // Open the water quality solver
    EN_openQ(ph);
 
    // Begin the search for the source concentration
    csource = 0.0;
    do {
 
        // Update source concentration to next level
        csource = csource + 0.1;
        EN_setnodevalue(ph, sourceindex, EN_SOURCEQUAL, csource);
 
        // Run WQ simulation checking for target violations
        violation = 0;
        EN_initQ(ph, 0);
        do {
            EN_runQ(ph, &t);
            if (t > 432000) {
                for (i=1; i<=nnodes; i++) {
                    EN_getnodevalue(ph, i, EN_QUALITY, &c);
                    if (c < Ctarget) {
                        violation = 1;
                        break;
                    }
                }
            }
            EN_nextQ(ph, &tstep);
 
        // End WQ run if violation found
        } while (!violation && tstep > 0);
 
    // Continue search if violation found
    } while (violation && csource <= 4.0);
 
    // Close up the WQ solver and delete the project
    EN_closeQ(ph);
    EN_deleteproject(ph);
    return csource;
}
```

```java
import com.jm.epanet.EpaNetAPI;
import com.jm.epanet.EpanetException;
import com.jm.epanet.meta.CountType;
import com.jm.epanet.meta.NodeProperty;
import com.jm.epanet.meta.QualityType;

import java.io.File;

public class ChlorineDosage {
    public static void main(String[] args) throws EpanetException {
        String dir = System.getProperty("user.dir");
        String inpFile = dir + File.separator + "example3.inp";
        String rptFile = dir + File.separator + "example3.rpt";
        String outFile = dir + File.separator + "example3.out";


        EpaNetAPI instance = new EpaNetAPI();

        // Open the toolkit & obtain a hydraulic solution
        instance.open(inpFile, rptFile, outFile);
        instance.solveHydraulic();

        // Get the number of nodes and the source node's index
        int nodeCount = instance.getCount(CountType.NODE_COUNT);
        String sourceName = "9";
        int sourceIndex = instance.getNodeIndex(sourceName);

        // Setup the system to analyze for chlorine
        // (in case it was not done in the input file)
        instance.setQualityType(QualityType.CHEM, "Chlorine", "mg/L", "");

        // Open the water quality solver
        instance.openQuality();

        // Begin the search for the source concentration
        float cSource = 0.0F;
        float cTarget = 0.2F;
        boolean violation;
        do {
            // Update source concentration to next level
            cSource = cSource + 0.1F;
            instance.setNodeValue(sourceIndex, NodeProperty.SOURCE_QUAL, cSource);

            // Run WQ simulation checking for target violations
            violation = false;
            instance.initQuality(1);

            long tstep;
            do {
                long t = instance.runQuality();
                if (t > 432000) {
                    System.out.println("cSource = " + cSource);
                    System.out.println("cTarget = " + cTarget);
                    for (int i = 1; i <= nodeCount; i++) {
                        double quality = instance.getNodeValue(i, NodeProperty.QUALITY);
                        String info = String.format("    |%03d|: %f from %s", i, quality, t / 3600);
                        System.out.println(info);
                    }

                    for (int i = 1; i <= nodeCount; i++) {
                        double quality = instance.getNodeValue(i, NodeProperty.QUALITY);
                        if (quality < cTarget) {
                            System.out.println("index = " + i + ", quality = " + quality);
                            violation = true;
                            break;
                        }
                    }
                }

                tstep = instance.nextQuality();
            }
            // End WQ run if violation found
            while (!violation && tstep > 0);


        }
        // Continue search if violation found
        while (violation && cSource <= 4.0F);

        // Close up the WQ solver and delete the project
        instance.close();

        System.out.println("cSource = " + cSource);
    }
}
```
