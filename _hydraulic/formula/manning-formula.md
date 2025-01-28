---
title: "曼宁公式 1890"
sequence: "101"
---

曼宁公式，指的是**明渠道流量或速度**经验公式，常用于物理计算、水利建设等活动中。
曼宁公式，属于应用范围更加广泛的公式。

但如果明渠中的流体为**恒定均匀流**以及**明渠恒定缓变流**，我们便可以使用形式更为简单的**谢才公式**来计算流量。

## 曼宁公式

曼宁公式，是明渠道流量或速度经验公式。其中，

<ul>
    <li>\(V\) 是速度</li>
    <li>\(k\) 是转换常数，国际单位制中值为 1</li>
    <li>\(n\) 是糙率，是综合反映管渠壁面粗糙情况对水流影响的一个系数。其值一般由实验数据测得，使用时可查表选用。</li>
    <li>\(R_{h}\) 是水力半径，是流体截面积与湿周长的比值。湿周长，指流体与明渠断面接触的周长，不包括与空气接触的周长部分。</li>
    <li>\(S\) 指明渠的坡度。</li>
</ul>

渠道糙率 `n` 参考值：

- 抹光的水泥面：`0.012`
- 不抹光的水泥面：`0.014`
- 光滑的混凝土护面：`0.015`
- 料石砌护：`0.015`
- 粗糙的混凝土护面：`0.017`
- 浆砌块石护面：`0.025`
- 干砌块石护面：`0.0275`~`0.030`
- 卵石铺砌：`0.0225`
- 中等土渠：`0.025`
- 低于一般土渠：`0.0275`
- 较差土渠（水草、崩塌）：`0.030`

The **hydraulic radius** was defined as the cross-sectional area divided by the wetted perimeter.

<p>
\[
V = \frac{k}{n} R^{2/3}_{h} \cdot S^{1/2}
\]
</p>

## Hydraulics

### Manning Equation

Manning Equation (SI units)

<p>
\[
v = (\frac{1.00}{n}) R^{2/3} S^{1/2}
\]
</p>

Manning Equation (English units)

<p>
\[
v = (\frac{1.49}{n}) R^{2/3} S^{1/2}
\]
</p>

Symbology

<ul>
    <li>\(v\) = average velocity</li>    
    <li>\(n\) = Manning coefficient</li>
    <li>\(R\) = hydraulic radius</li>
    <li>\(S\) = canal slope</li>
</ul>

### Discharge

Discharge (SI units)

<p>
\[
Q = (\frac{1.00}{n}) A R^{2/3} S^{1/2}
\]
</p>

Discharge (English units)

<p>
\[
Q = (\frac{1.49}{n}) A R^{2/3} S^{1/2}
\]
</p>

Symbology

<ul>
    <li>\(Q\) = discharge</li>    
    <li>\(n\) = Manning coefficient</li>
    <li>\(R\) = hydraulic radius</li>
    <li>\(S\) = canal slope</li>
    <li>\(A\) = cross-sectional area</li>
</ul>

### Conveyance

Conveyance (SI units)

<p>
\[
K = (\frac{1.00}{n}) A R^{2/3}
\]
</p>

Conveyance (English units)

<p>
\[
K = (\frac{1.49}{n}) A R^{2/3}
\]
</p>

Manning Equation

<p>
\[
Q = K S^{1/2}
\]
</p>

Symbology

<ul>
    <li>\(K\) = conveyance</li>
    <li>\(n\) = Manning coefficient</li>
    <li>\(R\) = hydraulic radius</li>
    <li>\(S\) = canal slope</li>
    <li>\(A\) = cross-sectional area</li>
    <li>\(Q\) = discharge</li>
</ul>

## Manning formula

<p>
An empirical equation published by Manning in 1890 for open-channel flow.
He derived the formula by curve fitting to observations in large rivers and channels.
It expresses the average longitudinal velocity \(V\)
as a function of the hydraulic radius \(R\) of the channel,
the channel slope \(S_{0}\), and a roughness coefficient or retardance factor of the channel lining \(n\):
</p>

<p>
\[
V = (\delta/n) R^{2/3} S^{1/2}_{0}
\]
</p>

<p>
where \(\delta\) is a unit conversion constant = <code>1.00</code> for <b>SI units</b> and
<code>1.49</code> for <b>English units</b>.
It is similar to the formula established theoretically by Chézy in 1775;
in fact, the two formulas are identical if the Chézy roughness factor \(C_{z}\) is taken as:
</p>

<p>
\[
C_{z} = (\delta/n) \cdot R^{1/6}
\]
</p>

### Manning roughness coefficient

The empirical bottom roughness coefficient `n` in the Manning formula,
which reflects the effect of channel or conduit roughness on the velocity of flow:
roughness retards the flow, increases the potential for infiltration, and decreases erosion.
The roughness coefficient varies from `0.025`-`0.033` for natural, clean, straight,
full-stage channels without ripples to `0.070`-`0.150` for weedy reaches or floodways with heavy underbrush.
Where field measurements are not possible,
the Manning coefficient may be estimated from an empirical formulation such as:

<p>
\[
n = 0.031 d^{1/6}
\]
</p>

where `d` is the size of channel particles (Martin and McCutcheon, 1999).
For open-channel flow in pipes, it may vary from `0.009` to `0.017`.

## 示例

### UnitSystem

```java
public enum UnitSystem {
    /**
     * 国际单位制（法语：Système International d'Unités 符号：SI）
     */
    SI,
    /**
     * English Units
     */
    EN,
    ;
}
```

### ManningFormula

```java
public class ManningFormula {
    private static final double DELTA_IN_SI_UNITS = 1.000D;
    private static final double DELTA_IN_ENGLISH_UNITS = 1.486D;

    public static double computeVelocity(double n, double r, double s) {
        return computeVelocity(UnitSystem.SI, n, r, s);
    }

    public static double computeVelocity(UnitSystem unitSystem, double n, double r, double s) {
        if (unitSystem == UnitSystem.SI) {
            return computeVelocity(DELTA_IN_SI_UNITS, n, r, s);
        } else if (unitSystem == UnitSystem.EN) {
            return computeVelocity(DELTA_IN_ENGLISH_UNITS, n, r, s);
        } else {
            return computeVelocity(DELTA_IN_SI_UNITS, n, r, s);
        }
    }

    /**
     * velocity.
     *
     * @param delta unit conversion constant
     * @param n     roughness coefficient
     * @param r     hydraulic radius
     * @param s     channel slope
     * @return the average longitudinal velocity
     */
    public static double computeVelocity(double delta, double n, double r, double s) {
        return (delta / n) * Math.pow(r, 2.0 / 3.0) * Math.sqrt(s);
    }

    public static double computeDischarge(double n, double area, double r, double s) {
        return computeDischarge(UnitSystem.SI, n, area, r, s);
    }

    public static double computeDischarge(UnitSystem unitSystem, double n, double area, double r, double s) {
        if (unitSystem == UnitSystem.SI) {
            return computeDischarge(DELTA_IN_SI_UNITS, n, area, r, s);
        } else if (unitSystem == UnitSystem.EN) {
            return computeDischarge(DELTA_IN_ENGLISH_UNITS, n, area, r, s);
        } else {
            return computeDischarge(DELTA_IN_SI_UNITS, n, area, r, s);
        }
    }

    /**
     * Discharge.
     *
     * @param delta unit conversion constant
     * @param n     Manning coefficient
     * @param area  cross-sectional area
     * @param r     hydraulic radius
     * @param s     canal slope
     * @return discharge
     */
    public static double computeDischarge(double delta, double n, double area, double r, double s) {
        return (delta / n) * area * Math.pow(r, 2.0 / 3.0) * Math.sqrt(s);
    }

    public static void main(String[] args) {

    }
}
```

### MyEntity

```java
public class MyEntity {
    // region input
    private final double diameter;
    private final double height;
    private final double slop;
    private final double nManning;
    private final UnitSystem unitSystem;
    // endregion

    // region calculated
    private final double radius;
    private final double width;
    private final double centralRadian;
    private final double centralAngle;
    private final double area;

    private final double wettedPerimeter;

    private final double hydraulicRadius;

    private final double velocity;

    private final double dischargePerSecond;
    private final double dischargePerDay;
    // endregion


    public MyEntity(
            double diameter, double height, double slop,
            double nManning, UnitSystem unitSystem
    ) {
        this.diameter = diameter;
        this.height = height;
        this.slop = slop;
        this.nManning = nManning;
        this.unitSystem = unitSystem;

        this.radius = diameter / 2;
        double topHeight = radius - height;
        double halfWidth = Math.sqrt(radius * radius - topHeight * topHeight);
        this.width = halfWidth * 2;


        double cosRadian = (radius * radius + radius * radius - width * width) / (2 * radius * radius);
        this.centralRadian = Math.acos(cosRadian);
        this.centralAngle = Math.toDegrees(centralRadian);

        double area1 = radius * radius * centralRadian / 2;
        double area2 = width * topHeight / 2;
        this.area = area1 - area2;
        this.wettedPerimeter = radius * centralRadian;

        this.hydraulicRadius = area / wettedPerimeter;

        this.velocity = ManningFormula.computeVelocity(UnitSystem.SI, nManning, hydraulicRadius, slop);
        this.dischargePerSecond = ManningFormula.computeDischarge(UnitSystem.SI, nManning, area, hydraulicRadius, slop);
        this.dischargePerDay = dischargePerSecond * 3600 * 24;
    }

    public double getDiameter() {
        return diameter;
    }

    public double getHeight() {
        return height;
    }

    public double getSlop() {
        return slop;
    }

    public double getnManning() {
        return nManning;
    }

    public UnitSystem getUnitSystem() {
        return unitSystem;
    }

    public double getRadius() {
        return radius;
    }

    public double getWidth() {
        return width;
    }

    public double getCentralRadian() {
        return centralRadian;
    }

    public double getCentralAngle() {
        return centralAngle;
    }

    public double getArea() {
        return area;
    }

    public double getWettedPerimeter() {
        return wettedPerimeter;
    }

    public double getHydraulicRadius() {
        return hydraulicRadius;
    }

    public double getVelocity() {
        return velocity;
    }

    public double getDischargePerSecond() {
        return dischargePerSecond;
    }

    public double getDischargePerDay() {
        return dischargePerDay;
    }

    @Override
    public String toString() {
        return "MyEntity{" +
                "diameter=" + diameter +
                ", height=" + height +
                ", slop=" + slop +
                ", nManning=" + nManning +
                ", unitSystem=" + unitSystem +
                ", radius=" + radius +
                ", width=" + width +
                ", centralRadian=" + centralRadian +
                ", centralAngle=" + centralAngle +
                ", area=" + area +
                ", wettedPerimeter=" + wettedPerimeter +
                ", hydraulicRadius=" + hydraulicRadius +
                ", velocity=" + velocity +
                ", dischargePerSecond=" + dischargePerSecond +
                ", dischargePerDay=" + dischargePerDay +
                '}';
    }

    public static void main(String[] args) {
        MyEntity entity = new MyEntity(1, 0.3, 0.001, 0.012, UnitSystem.SI);
        System.out.println(entity);
    }
}
```
