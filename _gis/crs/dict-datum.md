---
title: "Dict: Datum"
sequence: "dict-datum"
---

## geodesy

[geodesy]
The science of measuring and representing
**the shape and size of the earth**,
and the study of its **gravitational and magnetic fields**.

## datum

[geodesy]
The reference specifications of a measurement system,
usually **a system of coordinate positions on a surface** (**a horizontal datum**) or
**heights above or below a surface** (**a vertical datum**).

## geodetic datum

[geodesy]
A datum that is the basis for
calculating **positions on the earth's surface** or
**heights above or below the earth's surface**.

## horizontal geodetic datum

[geodesy]
A geodetic datum for any extensive measurement system of positions,
usually expressed as latitude-longitude coordinates, on the earth's surface.

A horizontal geodetic datum may be **local** or **geocentric**.

If it is **local**, it specifies the shape and size of an ellipsoid representing the earth,
the location of an origin point on the **ellipsoid surface**,
and the orientation of x- and y-axes relative to the ellipsoid.

```text
local = shape + size + location of an origin point + orientation
```

If it is **geocentric**, it specifies the shape and size of an ellipsoid,
the location of an origin point at the intersection of x-,y-, and z-axes at the **center of the ellipsoid**,
and the orientation of the x-,y-, and z-axes relative to the ellipsoid.

```text
geocentric = shape + size + location of an origin point + orientation
```

Examples of local horizontal geodetic datums include the North American Datum of 1927,
the European Datum of 1950, and the Indian datum of 1960;
examples of geocentric horizontal geodetic datums include the North American Datum of 1983 and
the World Geodetic System of 1984.

## vertical geodetic datum

[geodesy]
A geodetic datum for any extensive measurement system of heights on, above, or below the earth's surface.
Traditionally, a vertical geodetic datum defines zero height as the mean sea level
at a particular location or set of locations;
other heights are measured relative to a level surface passing through this point.
Examples include the North American Vertical Datum of 1988;
the Ordnance Datum Newlyn (used in Great Britain); and the Australian Height Datum.


![](/assets/images/gis/crs/vertical-control-datum.gif)

## tidal datum

[geodesy]
A vertical datum in which zero height is defined by a particular tidal surface, often mean sea level.
Examples of tidal surfaces include mean sea level, mean low water springs, and mean lower low water.
Most traditional vertical geodetic datums are tidal datums.

## mean sea level

[geodesy]
The average height of the surface of the sea for all stages of the tide over a nineteen-year period,
usually determined by averaging hourly height readings from a fixed level of reference.

## local datum

[geodesy]
A horizontal geodetic datum that serves as a basis for measurements over a limited area of the earth;
that has its origin at a location on the earth's surface;
that uses an ellipsoid whose dimensions conform well to its region of use;
and that was originally defined for land-based surveys.
A local datum in this sense stands in contrast to a geocentric datum.
Examples include the North American Datum of 1927 and the Australian Geodetic Datum of 1966.


[geodesy]
A horizontal or vertical datum used for measurements over a limited area of the earth,
such as a nation, a supranational region, or a continent.
A horizontal datum that is local in this sense may or may not be geocentric.
For example, the North American Datum of 1983 and the Geocentric Datum of Australia 1994 are local
in that they are applied to a particular part of the world;
they are also geocentric.
**All vertical datums are local** in that there is, **at present, no global vertical datum**.

## geocentric datum

[geodesy]
A horizontal geodetic datum based on an ellipsoid that has its origin at the earth's center of mass.

Examples are the World Geodetic System of 1984,
the North American Datum of 1983,
and the Geodetic Datum of Australia of 1994.
The first uses the WGS84 ellipsoid; the latter two use the GRS80 ellipsoid.

Geocentric datums are more compatible with satellite positioning systems, such as GPS, than are local datums.

## reference datum

[geodesy]
Any datum, plane, or surface from which other quantities are measured.

## hydrographic datum

[surveying]
A plane of reference for depths, depth contours,
and elevations of foreshore and offshore features.



