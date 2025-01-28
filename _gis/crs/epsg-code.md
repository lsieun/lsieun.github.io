---
title: "EPSG Code"
sequence: "122"
---

**EPSG** stands for **European Petroleum Survey Group** and is an organization
that maintains a geodetic parameter database with standard codes, the **EPSG codes**,
for **coordinate systems**, **datums**, **spheroids**, **units** and such alike.
Additionally, this database contains the parameters for these objects
or - if they cannot easily be expressed as values - at least references to where such parameters can be found.

> geodetic = geodesic 测地线的，大地线的（曲面上两点间距离最短的线） relating to the shortest possible line between two points on a curved surface

Every geographic object (**coordinate system**, **spheroid**, **unit**, etc.) gets assigned a unique number.
The database is under active maintenance.

> 坐标系、椭球体、单位

The coordinate system with its EPSG code is usually stored in the source file (GeoTIFF, Shapefile, LandXML, etc.)

> 存储在什么位置

## 常用的 ESPG

### WGS84

### CGCS2000

#### CGCS2000 - SPHEROID

- [EPSG:1024](https://epsg.io/1024-ellipsoid): CGCS2000 - SPHEROID

ESRI Well Known Text

```text
SPHEROID["CGCS2000",6378137.0,298.257222101]
```

#### 平面坐标系

China Geodetic Coordinate System 2000 - GEODCRS

- [EPSG:4479](https://epsg.io/4479)

```text
GEODCRS["China Geodetic Coordinate System 2000",
    DATUM["China 2000",
        ELLIPSOID["CGCS2000",6378137,298.257222101,
            LENGTHUNIT["metre",1]]],
    PRIMEM["Greenwich",0,
        ANGLEUNIT["degree",0.0174532925199433]],
    CS[Cartesian,3],
        AXIS["(X)",geocentricX,
            ORDER[1],
            LENGTHUNIT["metre",1]],
        AXIS["(Y)",geocentricY,
            ORDER[2],
            LENGTHUNIT["metre",1]],
        AXIS["(Z)",geocentricZ,
            ORDER[3],
            LENGTHUNIT["metre",1]],
    USAGE[
        SCOPE["Geodesy."],
        AREA["China - onshore and offshore."],
        BBOX[16.7,73.62,53.56,134.77]],
    ID["EPSG",4479]]
```

#### 经纬度坐标系

China Geodetic Coordinate System 2000 - GEOGCRS

- [EPSG:4490](https://epsg.io/4490)

OGC Well Known Text 2 (2019)

```text
GEOGCRS["China Geodetic Coordinate System 2000",
    DATUM["China 2000",
        ELLIPSOID["CGCS2000",6378137,298.257222101,
            LENGTHUNIT["metre",1]]],
    PRIMEM["Greenwich",0,
        ANGLEUNIT["degree",0.0174532925199433]],
    CS[ellipsoidal,2],
        AXIS["geodetic latitude (Lat)",north,
            ORDER[1],
            ANGLEUNIT["degree",0.0174532925199433]],
        AXIS["geodetic longitude (Lon)",east,
            ORDER[2],
            ANGLEUNIT["degree",0.0174532925199433]],
    USAGE[
        SCOPE["Horizontal component of 3D system."],
        AREA["China - onshore and offshore."],
        BBOX[16.7,73.62,53.56,134.77]],
    ID["EPSG",4490]]
```

## Reference

EPSG

- [epsg.io](https://epsg.io)
    - [EPSG:3857](https://epsg.io/3857): WGS 84 / Pseudo-Mercator -- Spherical Mercator, Google Maps, OpenStreetMap, Bing, ArcGIS, ESRI
    - [EPSG:4326](https://epsg.io/4326): WGS84 - World Geodetic System 1984, used in GPS
    - [EPSG:4490](https://epsg.io/4490): China Geodetic Coordinate System 2000
    - [EPSG:4979](https://epsg.io/4979): WGS 84
    - [EPSG:25833](https://epsg.io/25833): ETRS89 / UTM zone 33N
- [GeoRepository](https://epsg.org/home.html)
- [What is an EPSG Code?](https://support.virtual-surveyor.com/en/support/solutions/articles/1000261353)
