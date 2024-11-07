---
title: "CURVES"
sequence: "curve"
---




## 应用

应用在什么地方：

- Tank
    - Volume Curve
- Pump
    - Pump Curve
    - Effic. Curve
- Valve
    - GPV
        - Head Loss Curve

## Curve Type

Curves can be used to represent the following relations:

- Head v. Flow for pumps
- Efficiency v. Flow for pumps
- Volume v. Depth for tanks
- Headloss v. Flow for General Purpose Valves

## INP: CURVES

The `[CURVES]` defines data curves and their X,Y points.

**Format**:

One line for each X,Y point on each curve containing:

- Curve ID label
- X value
- Y value

Remarks:

- Curves can be used to represent the following relations:
    - Head v. Flow for pumps
    - Efficiency v. Flow for pumps
    - Volume v. Depth for tanks
    - Headloss v. Flow for **General Purpose Valves** (`GPV`)
- **The points of a curve must be entered in order of increasing X-values (lower to higher)**.
- If the input file will be used with the Windows version of EPANET,
  then adding a comment which contains the curve type and description, separated by a colon,
  directly above the first entry for a curve will ensure that these items appear correctly in EPANET's Curve Editor.
  Curve types include **PUMP**, **EFFICIENCY**, **VOLUME**, and **HEADLOSS**.

**Example**:

```text
[CURVES]
;ID   Flow    Head
;PUMP: Curve for Pump 1 C1 0 200
C1    1000    100
C1    3000    0

;ID   Flow    Effic.
;EFFICIENCY:
E1    200     50
E1    1000    85
E1    2000    75
E1    3000    65
```


## Power Curve

![](/assets/images/epanet/software/epanet-curve-editor-example-01.png)

![](/assets/images/epanet/software/epanet-curve-editor-example-02.png)

![](/assets/images/epanet/software/epanet-curve-pump-algorithm.png)

![](/assets/images/epanet/software/epanet-curve-pump-c-power-curve-code.png)


```java
public class CurveUtils {
    private static final double TINY = 1.E-6;

    /**
     * H = a - bQ^c
     *
     * @param h0 shutoff head
     * @param h1 design head
     * @param h2 head at max. flow
     * @param q1 design flow
     * @param q2 max. flow
     */
    public static void powerCurve(double h0, double h1, double h2, double q1, double q2) {
        if (h0 < TINY || (h0 - h1) < TINY || (h1 - h2) < TINY || q1 < TINY || (q2 - q1) < TINY) {
            throw new IllegalArgumentException("参数不合理");
        }

        // 求解 a
        double a = h0;

        // 求解 c
        double h4 = h0 - h1;
        double h5 = h0 - h2;
        double c = Math.log(h5 / h4) / Math.log(q2 / q1);

        if (c <= 0.0 || c > 20.0) {
            throw new IllegalArgumentException("参数不合理");
        }

        // 求解 b
        double b = -1 * h4 / Math.pow(q1, c);

        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println("c = " + c);
    }

    public static void main(String[] args) {
        double q0 = 0;
        double h0 = 104;

        double q1 = 2000;
        double h1 = 92;

        double q2 = 4000;
        double h2 = 64;

        powerCurve(h0, h1, h2, q1, q2);
    }
}
```
