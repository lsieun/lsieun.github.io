---
title: "API: map"
sequence: "122"
---

```text
// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
});
```

## Creation

- `L.map(<String> id, <Map options> options?)`: Instantiates a map object given the DOM ID of a `<div>` element and
  optionally an object literal with **Map options**.
- `L.map(<HTMLElement> el, <Map options> options?)`: Instantiates a map object given an instance of a `<div>` HTML element
  and optionally an object literal with **Map options**.

```text
         ┌─── div
         │
         │                                           ┌─── attributionControl
         │               ┌─── Control options ───────┤
L.map ───┤               │                           └─── zoomControl
         │               │
         │               ├─── Interaction Options
         │               │
         └─── Options ───┤                           ┌─── crs
                         │                           │
                         │                           ├─── center
                         │                           │
                         │                           ├─── zoom
                         │                           │
                         └─── Map State Options ─────┼─── minZoom
                                                     │
                                                     ├─── maxZoom
                                                     │
                                                     ├─── layers
                                                     │
                                                     └─── maxBounds
```

## Events

```text
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);
```

```text
              ┌─── Layer events
              │
              ├─── Map state change events
              │
              ├─── Popup events
              │
              ├─── Tooltip events
              │
map.Events ───┼─── Location events
              │
              │                               ┌─── click
              │                               │
              ├─── Interaction events ────────┼─── mouseover
              │                               │
              │                               └─── mouseout
              │
              └─── Other Events
```

## Methods

```text
                                           ┌─── addControl(<Control> control)
                                           │
               ┌─── Layers and Controls ───┼─── addLayer(<Layer> layer)
               │                           │
               │                           └─── openPopup(<Popup> popup)
               │
               │                           ┌─── getCenter()
               │                           │
               │                           ├─── getZoom()
               │                           │
               │                           ├─── getMinZoom()
               ├─── Getting Map State ─────┤
               │                           ├─── getMaxZoom()
               │                           │
               │                           ├─── getBounds()
               │                           │
               │                           └─── getSize()
               │
map.Methods ───┤                           ┌─── setView(<LatLng> center, <Number> zoom, <Zoom/pan options> options?)
               │                           │
               │                           ├─── setZoom(<Number> zoom, <Zoom/pan options> options?)
               ├─── Modifying map state ───┤
               │                           ├─── setMinZoom(<Number> zoom)
               │                           │
               │                           └─── setMaxZoom(<Number> zoom)
               │
               │                           ┌─── locate(<Locate options> options?)
               ├─── Geolocation methods ───┤
               │                           └─── stopLocate()
               │
               │                           ┌─── project(<LatLng> latlng, <Number> zoom)
               ├─── Conversion Methods ────┤
               │                           └─── unproject(<Point> point, <Number> zoom)
               │
               └─── Other Methods
```

### 定义setView

```text
const map = L.map('map').setView([30, 120], 13);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

## Properties

```text
                  ┌─── Controls ───┼─── zoomControl
                  │
map.Properties ───┤                ┌─── boxZoom
                  │                │
                  └─── Handlers ───┼─── dragging
                                   │
                                   └─── keyboard
```

## Reference

- [API: Map](https://leafletjs.com/reference.html#map)
