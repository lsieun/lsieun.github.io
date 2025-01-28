---
title: "API: layer"
sequence: "123"
---

```text
         ┌─── Marker
         │
         │                             ┌─── Popup
         ├─── DivOverlay ──────────────┤
         │                             └─── Tooltip
         │
         ├─── GridLayer (other) ───────┼─── TileLayer (raster) ───┼─── TileLayer.WMS (raster)
         │
Layer ───┤                             ┌─── VideoOverlay (raster)
         ├─── ImageOverlay (raster) ───┤
         │                             └─── SVGOverlay (vector)
         │
         │                             ┌─── Polyline (vector) ───────┼─── Polygon (vector) ───┼─── Rectangle (vector)
         ├─── Path (vector) ───────────┤
         │                             └─── CircleMarker (vector) ───┼─── Circle (vector)
         │
         └─── LayerGroup (other) ──────┼─── FeatureGroup (other) ───┼─── GeoJSON (other)
```

## Layer

A set of methods from the `Layer` base class that all Leaflet layers use.

Inherits all **methods**, **options** and **events** from `L.Evented`.

```text
var layer = L.marker(latlng).addTo(map);
layer.addTo(map);
layer.remove();
```

## Methods

### Popup methods

All layers share a set of methods convenient for binding popups to it.

```text
var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
layer.openPopup();
layer.closePopup();
```

Popups will also be automatically opened when the layer is clicked on and
closed when the layer is removed from the map or another popup is opened.

### Tooltip methods

All layers share a set of methods convenient for binding tooltips to it.

```text
var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
layer.openTooltip();
layer.closeTooltip();
```

## Reference

- [API: Layer](https://leafletjs.com/reference.html#layer)

