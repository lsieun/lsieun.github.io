---
title: "API: Basic Types"
sequence: "121"
---

## Geographical Coordinates

### LatLng

Represents a geographical point with a certain **latitude** and **longitude**.

```text
var latlng = L.latLng(50.5, 30.5);
```

### LatLngBounds

Represents a rectangular geographical area on a map.

```text
var corner1 = L.latLng(40.712, -74.227),
corner2 = L.latLng(40.774, -74.125),
bounds = L.latLngBounds(corner1, corner2);
```

## Pixel Coordinates

### Point

Represents a point with x and y coordinates in **pixels**.

```text
var point = L.point(200, 300);
```

### Bounds

Represents a rectangular area in **pixel coordinates**.

```text
var p1 = L.point(10, 10),
p2 = L.point(40, 60),
bounds = L.bounds(p1, p2);
```

## No Coordinates

### Icon

Represents an icon to provide when creating a marker.

```text
var myIcon = L.icon({
    iconUrl: 'my-icon.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
```

### DivIcon

Represents a lightweight icon for markers that uses a simple **`<div>` element** instead of **an image**.

Inherits from `Icon` but ignores the `iconUrl` and `shadow` options.

```text
var myIcon = L.divIcon({className: 'my-div-icon'});
// you can set .my-div-icon styles in CSS

L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
```

## Reference

- [Basic Types](https://leafletjs.com/reference.html#latlng)
