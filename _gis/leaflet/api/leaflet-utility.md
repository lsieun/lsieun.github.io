---
title: "API: utility"
sequence: "126"
---

## Browser

A namespace with static properties for browser/feature detection used by Leaflet internally.

```text
if (L.Browser.ielt9) {
  alert('Upgrade your browser, dude!');
}
```

## Util

Various utility functions, used by Leaflet internally.

## Transformation

Represents an affine transformation:
a set of coefficients `a`, `b`, `c`, `d` for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)`
and doing the reverse.
Used by Leaflet in its projections code.

```text
var transformation = L.transformation(2, 5, -1, 10),
    p = L.point(1, 2),
    p2 = transformation.transform(p), //  L.point(7, 8)
    p3 = transformation.untransform(p2); //  L.point(1, 2)
```

## LineUtil

Various utility functions for polyline points processing,
used by Leaflet internally to make polylines lightning-fast.

## PolyUtil

Various utility functions for polygon geometries.

- `clipPolygon(<Point[]> points, <Bounds> bounds, <Boolean> round?)`:
  Clips the polygon geometry defined by the given `points` by the given `bounds`
  (using the Sutherland-Hodgman algorithm).
  Used by Leaflet to only show polygon points that are on the screen or near, increasing performance.
  Note that polygon points needs different algorithm for clipping than polyline, so there's a separate method for it.


