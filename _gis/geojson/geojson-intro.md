---
title: "GeoJSON"
sequence: "101"
---

GeoJSON is a format for encoding a variety of geographic data structures […].
A GeoJSON object may represent a region of space (a `Geometry`), a spatially bounded entity (a `Feature`),
or a list of Features (a `FeatureCollection`).

GeoJSON supports the following **geometry types**:
`Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, and `GeometryCollection`.
**Features** in GeoJSON contain a Geometry object and additional properties,
and a **FeatureCollection** contains a list of Features.

```text
geometry types = Point + LineString + Polygon + 
                 MultiPoint + MultiLineString + MultiPolygon + 
                 GeometryCollection
                 
Feature = Geometry object + additional properties

FeatureCollection = a list of Features
```

```text
                                                  ┌─── (1) Point
                                                  │
                                                  ├─── (2) MultiPoint
                                                  │
                                                  ├─── (3) LineString
                                                  │
                    ┌─── geometry type(7) ────────┼─── (4) MultiLineString
                    │                             │
                    │                             ├─── (5) Polygon
                    │                             │
                    │                             ├─── (6) MultiPolygon
GeoJSON types(9) ───┤                             │
                    │                             └─── (7) GeometryCollection
                    │
                    ├─── (8) Feature
                    │
                    └─── (9) FeatureCollection
```

A GeoJSON FeatureCollection:

```text
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [102, 0.5]
            },
            "properties": {
                "prop0": "value0"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [102, 0],
                    [103, 1],
                    [104, 0],
                    [105, 1]
                ]
            },
            "properties": {
                "prop0": "value0",
                "prop1": 0
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [100, 0],
                        [101, 0],
                        [101, 1],
                        [100, 1],
                        [100, 0]
                    ]
                ]
            },
            "properties": {
                "prop0": "value0",
                "prop1": {
                    "this": "that"
                }
            }
        }
    ]
}
```

## 几个概念

### GeoJSON Text

A GeoJSON text is a JSON text and consists of a single GeoJSON object.

> GeoJSON text 与 GeoJSON object

### GeoJSON Object

A GeoJSON object represents a Geometry, Feature, or collection of Features.

- 第一个成员，`type`。A GeoJSON object has a member with the name `type`.
  The value of the member MUST be one of the GeoJSON types.
- 第二个成员，`bbox`。A GeoJSON object MAY have a `bbox` member, the value of which MUST be a **bounding box array**.
- 第三个成员，其它成员。A GeoJSON object MAY have other members.

### Geometry Object

A Geometry object represents points, curves, and surfaces in coordinate space.

Every Geometry object is a GeoJSON object no matter where it occurs in a GeoJSON text.

```text
Geometry object --> GeoJSON object --> GeoJSON text
```

- The value of a Geometry object's "type" member MUST be one of the seven geometry types.
- A GeoJSON Geometry object of any type other than "GeometryCollection" has a member with the name "coordinates".
  The value of the "coordinates" member is an array.
  The structure of the elements in this array is determined by the type of geometry.
  GeoJSON processors MAY interpret Geometry objects with empty "coordinates" arrays as null objects.

## Reference

- [The GeoJSON Format](https://www.rfc-editor.org/rfc/rfc7946)
