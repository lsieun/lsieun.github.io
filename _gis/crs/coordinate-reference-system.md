---
title: "Coordinate Reference System"
sequence: "101"
---

## The Components of a CRS

The coordinate reference system is made up of several key components:

- **Coordinate system**: **The X, Y grid**
  upon which your data is overlayed and how you define where a point is located in space.
- **Horizontal and vertical units**: The **units** used to define the grid along the x, y (and z) axis.
- **Datum**: **A modeled version of the shape of the Earth**
  which defines **the origin** used to place the coordinate system in space.
- **Projection Information**: The mathematical equation used to flatten objects
  that are on a round surface (e.g. the Earth)
  so you can view them on a flat surface (e.g. your computer screens or a paper map).

## Geographic vs. Projected CRS

Two main types of coordinate systems:

- **Geographic coordinate systems**: coordinate systems that span the entire globe (e.g. latitude / longitude).
- **Projected coordinate systems**: coordinate systems that are localized
  to minimize visual distortion in a particular region (e.g. Robinson, UTM, State Plane).

## Intro to Geographic Coordinate Reference Systems

Geographic coordinate systems (which are **often** but **not always** in **decimal degree units**) are often optimal
when you need to locate places on the Earth.
Or when you need to create global maps.
**However, latitude and longitude locations are not located using uniform measurement units.**
Thus, **geographic CRS's are not ideal for measuring distance.**
This is why other projected CRS have been developed.

![](/assets/images/gis/crs/latitude-longitude-globe-ESRI.gif)

A geographic coordinate system locates latitude and longitude location using angles.
Thus, the spacing of each line of latitude moving north and south is not uniform.

### The Structure of a Geographic CRS

A geographic `CRS` uses a grid that wraps around the entire globe.
This means that each point on the globe is defined using the SAME coordinate system and
the same units as defined within that particular geographic CRS.
**Geographic coordinate reference systems are best for global analysis**
however it is important to remember that **distance is distorted using a geographic lat/long `CRS`**.

![](/assets/images/gis/crs/geographic-WGS84-1.png)


**Data Note**:
The distance between the 2 degrees of longitude at the equator (0°) is ~ 69 miles.
The distance between 2 degrees of longitude at 40°N (or S) is only 53 miles.
This difference in actual distance relative to "distance" between the actual parallels and meridians demonstrates
how distance calculations will be less accurate when using geographic `CRS`'s.

## Projected Coordinate Reference Systems

As you learned above, **geographic coordinate systems are ideal for creating global maps.
However, they are prone to error when quantifying distance.**
In contrast, various **spatial projections** have evolved
that can be used to more accurately capture distance, shape and/or area.

### What is a Spatial Projection

Spatial projection refers to the mathematical calculations performed to flatten the 3D data onto a 2D plane
(your computer screen or a paper map).
Projecting data from a round surface onto a flat surface results in
visual modifications to the data when plotted on a map.
Some areas are stretched and some are compressed.
You can see this distortion when you look at a map of the entire globe.

The mathematical calculations used in spatial projections are designed
to optimize the relative size and shape of a particular region on the globe.

![](/assets/images/gis/crs/spatial-projection-transformations-crs.png)

The 3-dimensional globe must be transformed to create a flat 2-dimensional map.
How that transformation or projection occurs changes the appearance of the final map and the relative size of objects in different parts of the map.

### About UTM

The **Universal Transverse Mercator (UTM)** system is a commonly used projected coordinate reference system.
UTM subdivides the globe into **zones**, numbered `0-60` (equivalent to longitude) and **regions** (north and south).

While **UTM zones span the entire globe**, **UTM** uses a **regional projection** and **associated coordinate system**.
The coordinate system grid for each zone is projected individually using the **Mercator projection**.

The origin `(0,0)` for each UTM zone and associated region is located
at the intersection of the equator and a location, 500,000 meters east of the central meridian of each zone.
The origin location is placed outside the boundary of the UTM zone, to avoid negative Easting numbers.

![](/assets/images/gis/crs/utm-zone-characteristics.png)

The `0,0` origin of each UTM zone is located in the **Bottom left** hand corner
(south west) of the zone - exactly `500,000` m EAST from the central meridian of the zone.

![](/assets/images/gis/crs/800px-utm-zones.jpg)

## Coordinate Reference System Formats

There are numerous formats that are used to document a `CRS`.
Three common formats include:

- **Proj4**,
- **WKT** (Well Known Text)
- **EPSG**

One of the most powerful websites to look up CRS strings is [Spatialreference.org](http://spatialreference.org/).
You can use the search on the site to find an `EPSG` code.
Once you find the page associated with your `CRS` of interest
you can then look at all the various formats associated with that `CRS`:
[EPSG 4326 - WGS84 geographic](http://spatialreference.org/ref/epsg/4326/)

### PROJ or PROJ.4 Strings

PROJ.4 strings are a compact way to identify a spatial or coordinate reference system.

Using the `PROJ.4` syntax, you specify the complete set of parameters
including the **ellipse**, **datum**, **projection units** and **projection definition** that define a particular CRS.

This is a `proj4` string:

```text
+proj=utm +zone=11 +datum=WGS84 +units=m +no_defs +ellps=WGS84 +towgs84=0,0,0
```

Each element is specified with a `+` sign.

You can break down the proj4 string into its individual components (again, separated by `+` signs) as follows:

- `+proj=utm`: the projection is UTM, **UTM has several zones**
- `+zone=11`: the zone is 11 which is a zone on the West Coast, USA
- `datum=WGS84`: the datum WGS84 (the datum refers to the `0,0` reference for the coordinate system used in the projection)
- `+units=m`: the units for the coordinates are in METERS
- `+ellps=WGS84`: the ellipsoid (how the earth's roundness is calculated) for the data is WGS84

Note that the **zone** is unique to the **UTM projection**. **Not all CRSs will have a zone.**

#### Geographic (Lat / Long) Proj4 String

```text
+proj=longlat +datum=WGS84 +no_defs +ellps=WGS84 +towgs84=0,0,0
```

This is a `lat/long` or geographic projection.
The components of the `proj4` string are broken down below.

- `+proj=longlat`: the data are in a geographic (latitude and longitude) coordinate system
- `datum=WGS84`: the datum WGS84 (the datum refers to the 0,0 reference for the coordinate system used in the projection)
- `+ellps=WGS84`: the ellipsoid (how the earth's roundness is calculated) is WGS84

Note that there are no specified units above.
This is because this geographic coordinate reference system is in latitude and longitude
which is most often recorded in Decimal Degrees.

**Data tip**: the last portion of each proj4 string is `+towgs84=0,0,0`.
This is a conversion factor that is used if a **datum conversion** is required.

### EPSG Codes

The `EPSG` codes are 4-5 digit numbers that represent CRS definitions.
The acronym `EPGS`, comes from the now defunct, **European Petroleum Survey Group**.
Each code is a four-five digit number which represents a particular CRS definition.

### WKT or Well-Known Text

We won't spend a lot of time on the **Well-known text (WKT)** format.
However, it's useful to recognize this format given many tools - including ESRI's ArcMap and ENVI use this format.
WKT is a compact machine- and human-readable representation of geometric objects.
It defines elements of coordinate reference system (CRS) definitions
using a combination of brackets `[]` and elements separated by commas `(,)`.

```text
GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]
```

```text
GEOGCS[
    "GCS_WGS_1984",
    DATUM[
        "D_WGS_1984",
        SPHEROID["WGS_1984",6378137,298.257223563]
    ],
    PRIMEM["Greenwich",0],
    UNIT["Degree",0.017453292519943295]
]
```

Notice here that the elements are described explicitly using **all caps** - for example:

- UNIT
- DATUM

Sometimes WKT structured CRS information are embedded in a metadata file - similar to the structure seen below:

```text
GEOGCS["WGS 84",
    DATUM["WGS_1984",
        SPHEROID["WGS 84",6378137,298.257223563,
            AUTHORITY["EPSG","7030"]],
        AUTHORITY["EPSG","6326"]],
    PRIMEM["Greenwich",0,
        AUTHORITY["EPSG","8901"]],
    UNIT["degree",0.01745329251994328,
        AUTHORITY["EPSG","9122"]],
    AUTHORITY["EPSG","4326"]]
```

## Reference

- [Lesson 3. Coordinate Reference System and Spatial Projection](https://www.earthdatascience.org/courses/earth-analytics/spatial-data-r/intro-to-coordinate-reference-systems/)
