---
title: "Ellipsoid VS. Datum"
sequence: "129"
---

The terms "**geographic coordinate system**" and "**datum**" are used interchangeably.

A **datum** and **ellipsoid** are not equivalent.
For a loose definition, think of the ellipsoid as defining size and shape.
The datum then fixes that ellipsoid to the earth.

`NAD83` (various realizations) and `WGS` (another set of realizations) use almost the same ellipsoid `GRS80`/`WGS84`,
and were originally designed in the 1980s to be equivalent.
Since then, `NAD83` has remained fixed to the North American plate, while WGS84 is...not.
Thus, the `NAD83` and `WGS` datums are drifting further apart with time.

Think also about non-earth-center-earth-fixed datums.
Many used the same ellipsoid, but the ellipsoid was 'fixed' to the earth at different locations.
**Datums that share the same ellipsoid could have a coordinate pair that was hundreds of meters apart on the ground.**

An **ellipsoid** is a surface where all plane sectors are all ellipses
while **geodetic datum** is a coordinate system with reference such as a sea level
that serves provide locations to begin surveys and creating maps.

## Reference

- [The Shape of Earth and Reference Ellipsoids - Tutorials and Handouts](https://www.unavco.org/education/resources/tutorials-and-handouts/tutorials/elevation-and-geoid.html)
- [Tutorial: The Geoid and Receiver Measurements](https://www.unavco.org/education/resources/tutorials-and-handouts/tutorials/geoid-gps-receivers.html)
- [The geoid, ellipsoid, spheroid, and datum, and how they are related](https://desktop.arcgis.com/en/arcmap/latest/map/projections/about-the-geoid-ellipsoid-spheroid-and-datum-and-h.htm)
- [WGS84和CGCS2000的最大区别](https://www.bilibili.com/video/BV1ZU4y1C7vm/)
- [带你认识坐标系，一次搞明白地理坐标系和平面坐标系的关系](https://www.bilibili.com/video/BV1u84y1v7AZ/)

