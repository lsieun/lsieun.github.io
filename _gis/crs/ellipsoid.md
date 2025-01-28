---
title: "Ellipsoid 椭球"
sequence: "112"
---

Our earth isn't perfectly spherical.
So when we try to approximate the shape of earth, we need to choose an appropriate reference model.
An ellipsoid is such a model or reference surface.

An ellipsoid is defined by either the semi-major axis (`a`) and the semi-minor axis (`b`),
or by `a` and the flattening (`f`).
The following table lists some of the most common ellipsoids:

| Name                                  | Semi-major a (m) | Semi-minor b (m) | Inverse flattening 1/f |
|---------------------------------------|------------------|------------------|------------------------|
| Clarke 1866                           | 6 378 206.4      | 6 356 583.8      | 294.978 698 2          |
| Global Reference System 1980 - GRS 80 | 6 378 137        | 6 356 752.3141   | 298.257 222 101        |
| World Geodetic System 1984 - WGS 84   | 6 378 137        | 6 356 752.3142   | 298.257 223 563        |

The following table lists three common reference ellipsoids in US:

There are many kind of ellipsoid models in the world.
A commonly known ellipsoid is **WGS84**, which is also used in GPS.
Another important ellipsoid is the **GRS80** ellipsoid
that is used for measuring coordinates in the United States and Canada.
WGS84 and GRS80 has the same distance at the equator but the GRS80 ellipsoid is a little more flattened.

From the figure below,
you will have a general idea about the difference between
when different ellipsoid models are applied to the earth surface (WGS84 vs GRS80).

![](/assets/images/gis/crs/ellipsoid-wgs84-vs-grs80.png)

The following table lists the primary ellipsoid parameters of GRS80 and WGS84.

| Ellipsoid reference | Radius at the equator a | Radius at the poles b | Inverse flattening (1/f)  |
|---------------------|-------------------------|-----------------------|---------------------------|
| GRS 80              | 6 378 137.0 m           | ≈ 6356752.314140 m    | 298.257 222 100 882711... |
| WGS 84              | 6 378 137.0 m           | ≈ 6356752.314245 m    | 298.257 223 563           |

## 地球椭球的基本几何参数

地球椭球是选择的旋转椭球，旋转椭球的形状和大小常用子午椭圆的五个基本几何参数(或称元素)：

<ul>
    <li>椭圆的长半轴：\(a\)</li>
    <li>椭圆的短半轴：\(b\)</li>
    <li>椭圆的扁率：\(\alpha = \frac{a - b}{a}\)</li>
    <li>椭圆的第一偏心率：\(e = \frac{\sqrt{a^{2} - b^{2}}}{a}\)</li>
    <li>椭圆的第二偏心率：\(e' = \frac{\sqrt{a^{2} - b^{2}}}{b}\)</li>
</ul>

<p>
扁率反映了椭球体的扁平程度，如 \(\alpha = 0\) 时，椭球变为球体；\(\alpha = 1\)时，则为平面。
\(e\) 和 \(e'\) 是子午椭圆的焦点离开中心的距离与椭圆半径之比，它们也反映了椭球体的扁平程度，偏心率越大，椭球愈扁。
</p>

## Krassovsky Ellipsoid

克拉索夫斯基椭球是克拉索夫斯基于 1940 年提出的地球椭球，其长半径为 `6378245` 米，短半径为 `6356863` 米，扁率为 `1/298.3`。


## 常用椭球参数

| 椭球                | 长半轴(a/m)    | 短半轴(b/m)         | 扁率                |
|-------------------|-------------|------------------|-------------------|
| 克拉索夫斯基椭球体         | 6378245.0   | 6356863.01877304 | 1/298.3           |
| 1975国际椭球          | 6378140.0   | 6356755.28815752 | 1/298.257         |
| WGS84椭球体          | 6378137.0   | 6356752.31424517 | 1/298.257223563   |
| CGCS2000坐标系椭球     | 6378137.0   | 6356752.31414036 | 1/298.25722210100 |
| GRS80坐标系椭球        | 6378137.0   | 6356752.31414036 | 1/298.25722210103 |
| PZ90坐标系椭球         | 6378136.0   | 6356751.36179569 | 1/298.25784       |
| Helmert椭球参数(1906) | 6738140.0   | 6715551.53201475 | 1/298.3           |
| Hayford椭球参数(1910) | 6378388±35  | 6356911.94612795 | 1/297.0±0.5       |
| Bessel椭球参数(1841)  | 6377397±210 | 6356075.04413240 | 1/299.1±4.7       |
| Clarke椭球参数(1840)  | 6378249     | 6356517.31686542 | 1/293.5           |


## Reference

- [What is an Ellipsoid?](https://support.virtual-surveyor.com/en/support/solutions/articles/1000261329)
