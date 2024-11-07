---
title: "Network Building Example"
sequence: "101"
---

This example shows how a network can be built just through toolkit function calls,
eliminating the need to always use an EPANET formatted input file.
This creates opportunities to use other sources of network data in one's code,
such as relational database files or GIS/CAD files.

Below is a schematic of the network to be built.

![](/assets/images/epanet/epanet-network-example-02.png)

```java
import com.jm.epanet.EpaNetAPI;
import com.jm.epanet.EpanetException;
import com.jm.epanet.meta.*;

import java.io.File;

/**
 * @author xxx
 */
public class NetBuilder {
    public static void main(String[] args) throws EpanetException {
        EpaNetAPI instance = new EpaNetAPI();
        instance.init("", "", FlowUnits.GPM, HeadLossType.HW);

        // Add the first junction node to the project with
        // an elevation of 700 ft and a demand of 0
        int j1Index = instance.addNode("J1", NodeType.JUNCTION);
        instance.setJunctionData(j1Index, 700, 0, "");
        System.out.println(j1Index);

        // Add the remaining two junctions with elevations of
        // 710 ft and demands of 250 and 500 gpm, respectively
        int j2Index = instance.addNode("J2", NodeType.JUNCTION);
        instance.setJunctionData(j2Index, 710, 250, "");
        System.out.println(j2Index);
        int j3Index = instance.addNode("J3", NodeType.JUNCTION);
        instance.setJunctionData(j3Index, 710, 500, "");
        System.out.println(j3Index);

        // Add the reservoir at an elevation of 650 ft
        int r1Index = instance.addNode("R1", NodeType.RESERVOIR);
        instance.setNodeValue(r1Index, NodeProperty.ELEVATION, 650);
        System.out.println(r1Index);

        // Add the tank node at elevation of 850 ft, initial water level
        // at 120 ft, minimum level at 100 ft, maximum level at 150 ft
        // and a diameter of 50.5 ft
        int t1Index = instance.addNode("T1", NodeType.TANK);
        instance.setTankData(t1Index, 850, 120, 100, 150, 50.5F, 0.0001F, "");
        System.out.println(t1Index);
        double tankDiameter = instance.getNodeValue(t1Index, NodeProperty.TANK_DIAM);
        System.out.println("tankDiameter: " + tankDiameter);
        double minVolume = instance.getNodeValue(t1Index, NodeProperty.MIN_VOLUME);
        System.out.println("minVolume: " + minVolume);
        double volCurveId = instance.getNodeValue(t1Index, NodeProperty.VOL_CURVE);
        System.out.println("curveId: " + volCurveId);


        // Add the pipes to the project, setting their length,
        // diameter, and roughness values
        int p1Index = instance.addLink("P1", LinkType.PIPE, "J1", "J2");
        instance.setPipeData(p1Index, 10560, 12, 100, 0);
        int p2Index = instance.addLink("P2", LinkType.PIPE, "J1", "T1");
        instance.setPipeData(p2Index, 5280, 14, 100, 0);
        int p3Index = instance.addLink("P3", LinkType.PIPE, "J1", "J3");
        instance.setPipeData(p3Index, 5280, 14, 100, 0);
        int p4Index = instance.addLink("P4", LinkType.PIPE, "J2", "J3");
        instance.setPipeData(p4Index, 5280, 14, 100, 0);
        System.out.println(p1Index);

        // Add a pump to the project
        int pumpIndex = instance.addLink("PUMP", LinkType.PUMP, "R1", "J1");
        System.out.println(pumpIndex);

        // Create a single point head curve (index = 1) and
        // assign it to the pump
        instance.addCurve("C1");
        int c1Index = instance.getCurveIndex("C1");
        instance.setCurveValue(c1Index, 1, 1500, 250);
        instance.setLinkValue(pumpIndex, LinkProperty.PUMP_HCURVE, c1Index);
        System.out.println(c1Index);

        // Save the project for future use
        String dir = System.getProperty("user.dir");
        String filepath = dir + File.separator + "example2.inp";
        System.out.println(filepath);
        instance.saveInpFile(filepath);
    }
}
```

