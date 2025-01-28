---
title: "Geoid"
sequence: "123"
---

The shape of our earth is not perfectly spherical.
So when we try to approximate the shape of it, we have to find an appropriate model.
In the past, we've learned that an appropriate model can be an ellipsoid.
However, the **geoid** is a more advanced reference surface
that is now often used to approximate the shape of the Earth and to measure elevations (see orthometric elevation).

Any point on the **geoid** is subject to the same level of gravity and the earth's **geoid** is set at the mean sea level.

To compare the difference between **geoid** and **ellipsoid**.
The deviation between the Geoid and a reference ellipsoid is called geoid separation (N):

![](/assets/images/gis/crs/geoid-vs-ellipsoid.png)

The `geoid` is defined as the surface of the earth's gravity field,
which is approximately the same as mean sea level.
It is perpendicular to the direction of gravity pull.
Since the mass of the Earth is not uniform at all points,
and the direction of gravity changes,
the shape of the geoid is irregular.

```text
geoid --> shape of geoid --> spheroid
```

To simplify the model, various **spheroids** or **ellipsoids** have been devised.
These terms are used interchangeably.
For the remainder of this article, the term **spheroid** will be used.

A spheroid is a three-dimensional shape created from a two-dimensional ellipse.
The ellipse is an oval, with a major axis (the longer axis), and a minor axis (the shorter axis).
If you rotate the ellipse, the shape of the rotated figure is the spheroid.

```text
two-dimensional ellipse --> three-dimensional spheroid
```

The semimajor axis is half the length of the major axis.
The semiminor axis is half the length of the minor axis.

For the earth, the semimajor axis is the radius from the center of the earth to the equator,
while the semiminor axis is the radius from the center of the earth to the pole.

One particular spheroid is distinguished from another by the lengths of the semimajor and semiminor axes.
For example, compare the **Clarke 1866** spheroid with the **GRS 1980** and the **WGS 1984** spheroids,
based on the measurements (in meters) below.

| Spheroid    | Semimajor axis (m) | Semiminor axis (m) |
|-------------|--------------------|--------------------|
| Clarke 1866 | 6378206.4          | 6356583.8          |
| GRS80 1980  | 6378137            | 6356752.31414      |
| WGS84 1984  | 6378137            | 6356752.31424518   |

**A particular spheroid can be selected** for use in a specific geographic area,
because that particular spheroid does a perfect job of mimicking the geoid for that part of the world.
For North America, the spheroid of choice is GRS 1980, on which the North American Datum 1983 (NAD83) is based.

A **datum** is built on top of **the selected spheroid**, and can incorporate local variations in elevation.
With the spheroid, the rotation of the ellipse creates a totally smooth surface across the world.
Because this doesn't reflect reality very well, **a local datum** can incorporate local variations in elevation.

The underlying datum and spheroid to which coordinates for a dataset are referenced can change the coordinate values.
An illustrative example using the city of Bellingham, Washington, follows.
Compare the coordinates in decimal degrees for Bellingham using NAD27, NAD83, and WGS84.
It is apparent that while NAD83 and WGS84 express coordinates that are nearly identical,
NAD27 is quite different, because the underlying shape of the earth is expressed differently
by the datums and spheroids used.



## Reference

- [About the geoid, ellipsoid, spheroid and datum, and how they are related](https://webhelp.esri.com/arcgisdesktop/9.3/index.cfm?TopicName=About_the_geoid,_ellipsoid,_spheroid_and_datum,_and_how_they_are_related)


