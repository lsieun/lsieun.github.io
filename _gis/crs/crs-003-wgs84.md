---
title: "WGS84"
sequence: "125"
---

```text
WGS84 = World Geodetic System Established in 1984
```

自上世纪60年代，美国军方相继推出 `WGS60`、`WGS66`、`WGS72`、`WGS84` 世界大地坐标系，生活中广泛使用的导航给出的就是 `WGS84`
坐标系下的坐标。

## 坐标系

WGS－84坐标系（World Geodetic System）是一种国际上采用的地心坐标系。
坐标原点为地球质心，其地心空间直角坐标系的
Z轴指向国际时间局（BIH）1984.0定义的协议地极（CTP）方向，
X轴指向BIH1984.0的协议子午面和CTP赤道的交点，
Y轴与Z轴、X轴垂直构成右手坐标系，称为1984年世界大地坐标系。

这是一个国际协议地球参考系统（ITRS），是目前国际上统一采用的大地坐标系。

GPS广播星历是以WGS-84坐标系为根据的。

GPS数据：一般是WGS84坐标，以大地坐标（经纬度）的形式展现，无投影。

WGS84 is an extensively used term in mapping.
There are different situations when WGS84 is used, and people often get confused.
Does WGS84 mean the same thing in "WGS84/UTM zone 32N" and "GPS uses WGS84"?
In this article, we help you to better understand what WGS84 stands for.

Actually, **WGS84** stands for **World Geodetic System 1984** and comprises four different things:

- an **ellipsoid**
- a **horizontal datum**
- a **vertical datum**
- a **coordinate system**

## An Ellipsoid

The shape of our earth is not perfectly spherical.
So when we try to approximate the shape of our earth, we need to have a better model.
Such a model is the ellipsoid and an example is the WGS84 ellipsoid,
which has a certain defined radius at the equator and a flattening at the top.

![](/assets/images/gis/crs/planet-earth-vs-sphere-vs-wgs84.png)

## A Horizontal Datum

When you position the ellipsoid on a certain location with respect to the earth, on the so-called **anchor point**,
you set a **horizontal datum**.

```text
The horizontal datum = ellipsoid + anchor point
```

For example, the WGS84 ellipsoid with its anchor point is the WGS84 horizontal datum.
The anchor point for the WGS84 horizontal datum is known to about 2 cm.
Because the ellipsoid is now set with respect to the earth
you'll be able to determine your geographic location.

## A Vertical Datum

When you determine the elevation of your position
you can measure that elevation with respect to the WGS84 ellipsoid.
In this case, WGS84 refers to a **vertical datum** or a vertical reference level.

![](/assets/images/gis/crs/wgs84-ellipsoid-elevation.png)

Important to know here is that the elevation —
that comes with the pictures acquired by your drone(无人驾驶飞机) —
uses WGS84 as the vertical datum.
Often, the end user will require the elevation model with respect to a different vertical datum.

## A Coordinate System

WGS84 can also be one type of geographic coordinate system.

```text
The geographic coordinate system = horizontal datum + prime meridian + angular unit
```

The WGS84 Coordinate Systems
adds Greenwich as the starting point (**prime meridian**) for the longitude (0°) and
sets the **units** in degrees (°).
This coordinate system also has a unique reference code, the so-called EPSG code, which is `4326`.

The illustration below lists the WGS84 system with all its properties:
**EPSG code**, **Datum**, **Spheroid** (Ellipsoid), **Prime Meridian** and **the units**.

![](/assets/images/gis/crs/wgs84-epsg-code-4326.png)

The most known use case is GPS, which uses WGS84 as its coordinate system.
Your drone also contains a GPS
that is used to tag the pictures acquired with your drone with coordinates and elevations
that are determined in the WGS84 coordinate system.

## Final

Due to advances in measurement and continents moving (i.e. plate tectonics),
the WGS84 Datum will one day be replaced.

## XYZ

The origin is the center of mass of the Earth, the **geocenter**.

![](/assets/images/gis/crs/three-dimensional-cartesian-coordinate.png)

The **x-axis** is a line from the geocenter through its intersection
at the zero meridian as it was January 1, 1903, with the internationally defined conventional equator.
**The meridian through this intersection is very close to the Greenwich meridian,
but the two are not exactly coincident.**

The **y-axis** is extended from the geocenter
along a line perpendicular from the x-axis in the same mean equatorial plane.
That means that the y-axis intersects the actual Earth in the Indian Ocean.
In any case, they both rotate with the Earth around the **z-axis**,
a line from the geocenter through the internationally defined pole known as the International Reference Pole (IRP).
This is the pole as it was on **January 1, 1903**.

The **date** attached to the definition of the **pole** and the **zero meridian** is necessary
because the Earth's motion is not as regular as one might imagine.
One aspect of the variation is called **polar motion**.
It is a consequence of the actual movement of the Earth's spin axis
as it describes an irregular circle with respect to the Earth's surface.

![](/assets/images/gis/crs/the-wandering-of-the-earth-pole.png)

The circle described by the wandering pole has a period of about 435 d, and is known as the Chandler period.
In other words, it takes about that long for the location of the pole to complete a circle
that has a diameter of about 12 m to 15 m.
The pole is also drifting about 10 cm per yr toward Ellesmere Island.
The **Conventional International Origin (CIO)**, is the average position of the pole from 1900 to 1905.

This arrangement of the x-, y-, and z-axes are part of a right-handed orthogonal system.
This is a system that has been utilized in NAD83, WGS 84, and ITRS.

