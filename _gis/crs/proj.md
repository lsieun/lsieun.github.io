---
title: "PROJ.4 String"
sequence: "103"
---

## PROJ.4 String

A PROJ.4 string identifies and defines a particular CRS.
The string holds the parameters (e.g., **units**, **datum**) of a given CRS.

## What is in a PROJ.4 string?

Multiple parameters are needed in the string to describe a CRS.
To separate the parameters in the string and identify each individual parameter, each parameter begins with a `+` sign.
A CRS parameter is defined after the `+` sign.

A few PROJ.4 parameters can be applied to most CRSs:

| Parameter     | Description                                                         |
|---------------|---------------------------------------------------------------------|
| `+a`          | Semimajor radius of the ellipsoid axis                              |
| `+axis`       | Axis orientation                                                    |
| `+b`          | Semiminor radius of the ellipsoid axis                              |
| `+ellps`      | Ellipsoid name                                                      |
| `+k_0`        | Scaling factor                                                      |
| `+lat_0`      | Latitude of origin                                                  |
| `+lat_1 or 2` | Standard parallels                                                  |
| `+lon_0`      | Central meridian                                                    |
| `+lon_wrap`   | Center longitude to use for wrapping                                |
| `+over`       | Allow longitude output outside -180 to 180 range, disables wrapping |
| `+pm`         | Alternate prime meridian (typically a city name)                    |
| `+proj`       | Projection name                                                     |
| `+units`      | meters, US survey feet, etc.                                        |
| `+vunits`     | vertical units                                                      |
| `+x_0`        | False easting                                                       |
| `+y_0`        | False northing                                                      |
|               |                                                                     |


Some parameters (not listed above) are specific to certain CRSs.
**Be sure to always verify the parameters that are allowed for each projection.**
You can't always “mix and match” the PROJ.4 parameters when creating a custom projection.

Take for instance lambert conformal conic with the proj4 string:

```text
+proj=lcc +lat_1=20 +lat_2=60 lon_0=-96 +datum=NAD83 +units=m
```

We can see that `lat_1` and `lat_2` specify the standard parallels.
This is an example of a “secant”(割线) projection which touches the globe in two places in order to minimize distortion.
The central meridian `lon_0` is moved away from **Greenwich England** 96 degrees W to be over roughly **Dallas TX**.

![](/assets/images/gis/crs/lambert-proj-code.png)

We can look at another example for a UTM projection with the proj4 string:

```text
+proj=tmerc +lon_0=-99 +x_0=500,000 units=m
```

This projection by comparison has a central meridian `lon_0` directly over **Dallas TX**
which is 99 degrees W of Greenwich.
This central meridan is assigned the 'false easting' `x_0` of `500,000` meters.

![](/assets/images/gis/crs/mercator-proj-code.png)

## Ellipsoids

An **ellipsoid** is a mathematically defined surface which approximates the **geoid**:
the surface of the Earth's gravity field, which is approximately the same as mean sea level.

![Global and local fitting of the ellipsoid](/assets/images/gis/crs/general-ellipsoid.png)

A complete **ellipsoid** definition comprises a **size** (primary) and a **shape** (secondary) parameter.

```text
ellipsoid = size + shape
```

### Ellipsoid size parameters

<ul>
    <li><code>+R=&lt;value&gt;</code>: Radius of the sphere, \(R\).</li>
    <li><code>+a=&lt;value&gt;</code>: Semi-major axis of the ellipsoid, \(a\).</li>
</ul>

### Ellipsoid shape parameters

<ul>
    <li><code>+rf=&lt;value&gt;</code>: Reverse flattening of the ellipsoid, \(1/f\).</li>
    <li><code>+f=&lt;value&gt;</code>: Flattening of the ellipsoid, \(f\).</li>
    <li><code>+es=&lt;value&gt;</code>: Eccentricity squared, \(e^{2}\).</li>
    <li><code>+e=&lt;value&gt;</code>: Eccentricity, \(e\).</li>
    <li><code>+b=&lt;value&gt;</code>: Semi-minor axis, \(b\).</li>
</ul>

The ellipsoid definition may be augmented with a spherification flag,
turning the ellipsoid into a sphere with features defined by the ellipsoid.

- eccentricity: 偏心率 strange or unusual behavior; an idea, action, or habit that is strange or unusual

### Ellipsoid spherification parameters

<ul>
    <li><code>+R_A=&lt;value&gt;</code>: A sphere with the same surface area as the ellipsoid.</li>
    <li><code>+R_V=&lt;value&gt;</code>: A sphere with the same volume as the ellipsoid.</li>
    <li><code>+R_a=&lt;value&gt;</code>: A sphere with  \(R=(a+b)/2\) (arithmetic mean).</li>
    <li><code>+R_g=&lt;value&gt;</code>: A sphere with  \(R=\sqrt{ab}\) (geometric mean).</li>
    <li><code>+R_h=&lt;value&gt;</code>: A sphere with  \(R=2ab/(a+b)\) (harmonic mean).</li>
    <li><code>+R_lat_a=&lt;phi&gt;</code>: A sphere with  \(R\) being the arithmetic mean of the corresponding ellipsoid at latitude \(\phi\).</li>
    <li><code>+R_lat_g=&lt;phi&gt;</code>: A sphere with  \(R\) being the geometric mean of the corresponding ellipsoid at latitude \(\phi\).</li>
</ul>

If `+R` is given as **size** parameter, any **shape** and **spherification** parameters given are ignored.

### Built-in ellipsoid definitions

The `ellps=xxx` parameter provides both **size** and **shape** for a number of built-in ellipsoid definitions.

| ellps  | Parameters                   | Datum name                   |
|--------|------------------------------|------------------------------|
| GRS80  | a=6378137.0 rf=298.257222101 | GRS 1980(IUGG, 1980)         |
| airy   | a=6377563.396 b=6356256.910  | Airy 1830                    |
| bessel | a=6377397.155 rf=299.1528128 | Bessel 1841                  |
| clrk66 | a=6378206.4 b=6356583.8      | Clarke 1866                  |
| intl   | a=6378388.0 rf=297.          | International 1909 (Hayford) |
| WGS60  | a=6378165.0 rf=298.3         | WGS 60                       |
| WGS66  | a=6378145.0 rf=298.25        | WGS 66                       |
| WGS72  | a=6378135.0 rf=298.26        | WGS 72                       |
| WGS84  | a=6378137.0 rf=298.257223563 | WGS 84                       |
| sphere | a=6370997.0 b=6370997.0      | Normal Sphere (r=6370997)    |

If **size** and **shape** are given as `ellps=xxx`,
later shape and size parameters are taken into account as modifiers for the built-in ellipsoid definition.

### Transformation examples

Spherical earth with radius 7000km:

```text
+proj=latlon +R=7000000
```

Using the GRS80 ellipsoid:

```text
+proj=latlon +ellps=GRS80
```

<p>
Expressing ellipsoid by semi-major axis and reverse flattening \(1/f\):
</p>

```text
+proj=latlon +a=6378137.0 +rf=298.25
```

Spherical earth based on volume of ellipsoid:

```text
+proj=latlon +a=6378137.0 +rf=298.25 +R_V
```

## Gauss-Kruger

- [Transverse Mercator](https://proj.org/operations/projections/tmerc.html)

The following table gives special cases of the **Transverse Mercator projection**.

| Projection Name     | Areas               | Central meridian           | Zone width                               | Scale Factor |
|---------------------|---------------------|----------------------------|------------------------------------------|--------------|
| Transverse Mercator | World wide          | Various                    | less than 1000 km                        | Various      |
| Gauss-Kruger        | Former USSR,  China | Various, according to area | Usually less than 6°, often less than 4° | 1.0000       |
|                     |                     |                            |                                          |              |
|                     |                     |                            |                                          |              |

Example using Gauss-Kruger on Germany area (aka EPSG:31467)

```text
$ echo 9 51 | proj +proj=tmerc +lat_0=0 +lon_0=9 +k_0=1 +x_0=3500000 +y_0=0 +ellps=bessel +units=m
3500000.00  5651505.56
```

## Reference

- [Understanding a CRS: Proj4 and CRS codes](https://pygis.io/docs/d_understand_crs_codes.html)
  - [PROJ.4 String](https://pygis.io/docs/d_understand_crs_codes.html#proj-4-string)

- [PROJ](https://proj.org/index.html)
  - [Using PROJ](https://proj.org/usage/index.html)
    - [Ellipsoids](https://proj.org/usage/ellipsoids.html)

- [Docker Hub: osgeo/proj](https://hub.docker.com/r/osgeo/proj)