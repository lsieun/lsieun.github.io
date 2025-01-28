---
title: "CRS Intro"
sequence: "100"
---

```text
Actual Earth --> Geoid --> Ellipsoid (lat,lng) --> Plannar Coordinates (km)
```

- Actual Earch: A very lumpy object that has topography, bathymetry, chaning ocean height, etc.
- Geoid: A less lumpy mathematical approximation of the earth.
- Ellipsoid: A way of assigning a set of coordinates to locations.
- Planar Coordinates: A way to give coordinates real world, linear measurements.

```text
Ellipsoid --> Geographic coordinate system --> Datum --> Projected coordinate systems
```

## Datums

There are many ellipsoids you can use to reference locations on the earth with latitude and longitude.
These different **geographic coordinate systems** are called **datums**.

Certain datums fit different parts of the lumpy earth better than others,
so changing datums can make measurements more accurate depending on where you are.

For nearly all basic mapping, however, there are two datums that are you need to know:

- WGS84
- NAD83

## Projections

In order to transform these latitude and longitude coordinates into meaningful units,
the datum must be transferred to a planar (cartesian) coordinate system.
There are many ways to do this, and these are called **projections**.

There are three ways to transfer the curved surface of the ellipsoid to a flat plane,
you can make **planar** (azimuthal), **cylindrical**, or **conic** projections.

In order to make different measurements - **distance**, **area**, **shape** or **direction** -
you must choose the best project for the job.

