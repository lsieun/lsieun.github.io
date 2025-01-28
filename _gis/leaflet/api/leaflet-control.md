---
title: "API: control"
sequence: "124"
---

```text
           ┌─── Control.Zoom
           │
           ├─── Control.Attribution
Control ───┤
           ├─── Control.Layers
           │
           └─── Control.Scale
```

## Control.Zoom

A basic zoom control with two buttons (zoom in and zoom out).

It is put on the map by default unless you set its `zoomControl` option to `false`.

Extends `Control`.

## Control.Attribution

The attribution control allows you to display attribution data in a small text box on a map.

It is put on the map by default unless you set its `attributionControl` option to `false`,
and it fetches attribution texts from layers with the `getAttribution` method automatically.

Extends `Control`.

## Control.Layers

The layers control gives users the ability to switch between different **base layers**
and switch **overlays** on/off.

Extends `Control`.

```text
var baseLayers = {
    "Mapbox": mapbox,
    "OpenStreetMap": osm
};

var overlays = {
    "Marker": marker,
    "Roads": roadsLayer
};

L.control.layers(baseLayers, overlays).addTo(map);
```

## Control.Scale

A simple scale control that shows the scale of the current center of screen in metric (m/km) and
imperial (mi/ft) systems.

Extends `Control`.

```text
L.control.scale().addTo(map);
```
