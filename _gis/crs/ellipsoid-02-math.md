---
title: "地球椭球的基本几何参数"
sequence: "ellipsoid-02-math"
---

## 地球椭球的基本几何参数

地球椭球是选择的旋转椭球，旋转椭球的形状和大小常用子午椭圆的五个基本几何参数(或称元素)：

<ul>
    <li>椭圆的长半轴：\(a\)</li>
    <li>椭圆的短半轴：\(b\)</li>
    <li>椭圆的扁率：\(\alpha = \frac{a-b}{a} \)</li>
    <li>椭圆的第一偏心率：\(e = \frac{\sqrt{a^{2} - b^{2}}}{a} \)</li>
    <li>椭圆的第二偏心率：\(e' = \frac{\sqrt{a^{2} - b^{2}}}{b} \)</li>
</ul>

扁率，反映了椭球体的扁平程度：

<ul>
    <li>当 \(\alpha=0\)时，椭球变为球体</li>
    <li>当 \(\alpha=1\)时，则为平面</li>
</ul>

<p>
\(e\)和\(e'\)是子午椭圆的<b>焦点</b>离开中心的距离与椭圆半径之比，它们也反映了椭球体的扁平程度，偏心率越大，椭球愈扁。
</p>

## Example

### alpha = 0

![](/assets/images/gis/crs/ellipsoid-flattening-0.0.png)

```text
a = 0.500000
b = 0.500000
    α = 0.000000
    e1 = 0.000000
    e2 = 0.000000
```

### alpha = 0.2

![](/assets/images/gis/crs/ellipsoid-flattening-0.2.png)

```text
a = 0.500000
b = 0.400000
    α = 0.200000
    e1 = 0.600000
    e2 = 0.750000
```

### alpha = 0.4

![](/assets/images/gis/crs/ellipsoid-flattening-0.4.png)

```text
a = 0.500000
b = 0.300000
    α = 0.400000
    e1 = 0.800000
    e2 = 1.333333
```

### alpha = 0.6

![](/assets/images/gis/crs/ellipsoid-flattening-0.6.png)

```text
a = 0.500000
b = 0.200000
    α = 0.600000
    e1 = 0.916515
    e2 = 2.291288
```

### alpha = 0.8

![](/assets/images/gis/crs/ellipsoid-flattening-0.8.png)

```text
a = 0.500000
b = 0.100000
    α = 0.800000
    e1 = 0.979796
    e2 = 4.898979
```

### alpha = 0.98

![](/assets/images/gis/crs/ellipsoid-flattening-0.98.png)

```text
a = 0.500000
b = 0.010000
    α = 0.980000
    e1 = 0.999800
    e2 = 49.989999
```

### alpha = 0.998

![](/assets/images/gis/crs/ellipsoid-flattening-0.998.png)

```text
a = 0.500000
b = 0.001000
    α = 0.998000
    e1 = 0.999998
    e2 = 499.999000
```


## 代码

```java
import lsieun.std.StdDraw;

import java.util.Formatter;

public class MyEllipsoid {
    public static void main(String[] args) {
        double a = 0.5;
        double b = 0.5;
        double alpha = (a - b) / a;
        double e1 = Math.sqrt(a * a - b * b) / a;
        double e2 = Math.sqrt(a * a - b * b) / b;

        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("a = %f%n", a);
        fm.format("b = %f%n", b);
        fm.format("    α = %f%n", alpha);
        fm.format("    e1 = %f%n", e1);
        fm.format("    e2 = %f%n", e2);
        System.out.println(sb);


        StdDraw.setPenColor(StdDraw.BLUE);
        StdDraw.line(0, 0.5, 1, 0.5);
        StdDraw.line(0.5, 0, 0.5, 1);
        StdDraw.ellipse(0.5, 0.5, a, b);
    }
}
```
