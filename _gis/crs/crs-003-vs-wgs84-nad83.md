---
title: "WGS84 VS NAD83"
sequence: "crs-003-vs-wgs84-nad83"
---

There are a number of difference between the NAD83 and the WGS84 datum.

## ellipsoid

One is the reference ellipsoid.

- The North American 1983 datum (NAD83) uses the **Geodetic Reference System (GRS80) ellipsoid**
- while the World Geodetic System of 1984 (WGS84) uses the WGS 84 ellipsoid.

The dimensions of these ellipsoids differ slightly.

A map will have only one coordinate system,
either Geographic or Projected in our software's terminology.
For example, the "WGS84 projection" is a geographic one.
A UTM projection is a projected one.
Either of these will use only one datum.
However, the data on the map could have come from multiple sources,
all with unique projections and therefore datums.



## Reference

- [WGS84 vs. NAD83](https://www.esri.com/arcgis-blog/products/arcgis-desktop/mapping/wgs84-vs-nad83/)
