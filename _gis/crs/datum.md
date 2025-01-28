---
title: "Datum"
sequence: "101"
---

A Datum can be either a global Datum (i.e. WGS84) or a local Datum (i.e. NAD83 - North American Datum)


## Datum

The **datum** describes the vertical and horizontal reference point of the coordinate system.
The **vertical datum** describes the relationship between **a specific ellipsoid** (the top of the earth's surface)
and **the center of the earth**. The datum also describes the origin `(0,0)` of a coordinate system.

> datum 基准 a known or assumed fact that is used as the basis for a theory, conclusion, or inference;
> a point, line, or surface used as a basis for measurement or calculation in mapping or surveying

Frequently encountered datums:

- WGS84 – World Geodetic System (created in) 1984. The origin is the center of the Earth.
- NAD27 & NAD83 – North American Datum 1927 and 1983, respectively. The origin for NAD 27 is Meades Ranch in Kansas.
- ED50 – European Datum 1950

NOTE: All coordinate reference systems have a **vertical and horizontal datum** which defines a "`0,0`" reference point.
There are **two models** used to define the **datum**:

- **ellipsoid** (or **spheroid**): a mathematical representation of the shape of the earth.
  Visit [Wikipedia's article on the earth ellipsoid](https://en.wikipedia.org/wiki/Earth_ellipsoid) for more information and
- **geoid**: a model of the Earth's gravitational field
  which approximates the mean sea level across the entire Earth.
  It is from this that elevation is measured.
  Visit [Wikipedia's geoid article](https://en.wikipedia.org/wiki/Geoid) for more information.
