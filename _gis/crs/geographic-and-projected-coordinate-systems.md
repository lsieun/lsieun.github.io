---
title: "Difference Between Geographic and Projected Coordinate Systems"
sequence: "122"
---

- 子午线周长：40008548

- 赤道周长：40075704 米

- 40075704 / 360 * 0.000001 = 0.1113214
- 40075704 / 360 * 0.0000001 = 0.01113214
- 40075704 / 360 * 0.00000001 = 0.001113214

## Geographic Coordinate System

A **Geographic Coordinate System (GCS)** is a coordinate system
which uses a three-dimensional spherical surface (ellipsoid) to define locations on the earth.
A common choice of coordinates is **latitude** and **longitude**.
For example, Leuven, Belgium is located on 50°52'47" North and 4°42'01" East in the WGS84 coordinate system.

A **geographic coordinate system** is constituted by
a **datum (DATUM)**, a **prime meridian (PRIMEM)**, and **unit (UNIT)**.
The **datum** is constituted by an **ellipsoid model** (SPHEROID) and an **anchor point**.

- geographic coordinate system
    - datum (DATUM)
        - ellipsoid model (SPHEROID)
        - anchor point
    - prime meridian (PRIMEM)
    - unit (UNIT)

> meridian: one of the imaginary lines that goes around the Earth from the North Pole to the South Pole.
> These are used for measuring position, time, etc.; this line represented as a line on a map

An example is:

- WGS84 coordinate system with unique EPSG code 4326

![](/assets/images/gis/crs/wgs84-epsg-code-4326.png)

## Projected Coordinate System

In a **Projected Coordinate System (PCS)** you project the geographic coordinate
that you have measured to, for example, a cylinder that you can easily roll out on a two-dimensional surface (the map).
There exist many projections.

Typically, every country, state, or region has its optimal projected coordinate system,
which minimizes distortions for particular applications like mapping.

A **projected coordinate system** is constituted by a **geographic coordinate system**
from which it is projected (GEOGCS) and other projection parameters like the measurement unit
(like meter or US Survey Foot), the projection technique, and its projection parameters.

- projected coordinate system
    - geographic coordinate system
    - projection parameters
    - projection technique

![](/assets/images/gis/crs/utm-wgs84-epsg-code-32633.png)

## Reference

- [The Difference Between Geographic and Projected Coordinate Systems?](https://support.virtual-surveyor.com/en/support/solutions/articles/1000261350)
