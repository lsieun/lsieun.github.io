---
title: "Polygon"
sequence: "103"
---

A class for drawing polygon overlays on a map.

Note that **points you pass when creating a polygon shouldn't have an additional last point equal to the first one**
— it's better to filter out such points.

```text
L.polygon(<LatLng[]> latlngs, <Polyline options> options?)
```

```text
// create a red polygon from an array of LatLng points
var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];

var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);

// zoom the map to the polygon
map.fitBounds(polygon.getBounds());
```

You can also pass an array of arrays of latlngs,
with the first array representing the outer shape and the other arrays representing holes in the outer shape:

```text
var latlngs = [
  [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
  [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
];
```

Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.

```text
var latlngs = [
  [ // first polygon
    [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
    [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
  ],
  [ // second polygon
    [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
  ]
];
```

## Reference

- [API: Polygon](https://leafletjs.com/reference.html#polygon)
