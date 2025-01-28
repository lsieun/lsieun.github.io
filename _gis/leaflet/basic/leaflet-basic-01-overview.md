---
title: "Leaflet"
sequence: "101"
---

Leaflet is the leading open-source JavaScript library for mobile-friendly interactive maps.
Weighing just about 42 KB of JS, it has all the mapping features most developers ever need.


For anyone who uses **NPM** and **TypeScript**

(Basically, the problem is that you are missing the Leaflet-Draw library)

Install packages and types:

```text
$ npm i -S leaflet
$ npm i -S leaflet-draw
$ npm i -D @types/leaflet
$ npm i -D @types/leaflet-draw
```

Update your `tsconfig.json`:

```text
{
  "compilerOptions": {
    ...
    types: [
      "leaflet",
      "leaflet-draw",
      ...
    ]
}
```

```text
           ┌─── LatLng
           │
           ├─── LatLngBounds
           │
           ├─── Point
           │
           ├─── Bounds
           │
           │                                    ┌─── Map
           │                                    │
           │                                    │                                  ┌─── Canvas
           │                                    │             ┌─── Renderer ───────┤
           │                                    │             │                    └─── SVG
           │                                    │             │
           │                    ┌─── Evented ───┤             ├─── GridLayer ──────┼─── TileLayer
Leaflet ───┤                    │               │             │
           │                    │               │             │                    ┌─── SVGOverlay
           │                    │               │             ├─── ImageOverlay ───┤
           │                    │               │             │                    └─── VideoOverlay
           │                    │               │             │
           │                    │               └─── Layer ───┤                    ┌─── CircleMarker ───┼─── Circle
           │                    │                             ├─── Path ───────────┤
           │                    │                             │                    └─── Polyline ───────┼─── Polygon ───┼─── Rectangle
           │                    │                             │
           │                    │                             ├─── LayerGroup ─────┼─── FeatureGroup ───┼─── GeoJSON
           │                    │                             │
           │                    │                             │                    ┌─── Popup
           │                    │                             ├─── DivOverlay ─────┤
           │                    │                             │                    └─── Tooltip
           │                    │                             │
           │                    │                             └─── Marker
           └─── Class ──────────┤
                                │               ┌─── Layers
                                │               │
                                │               ├─── Zoom
                                ├─── Control ───┤
                                │               ├─── Scale
                                │               │
                                │               └─── Attribution
                                │
                                ├─── Icon ──────┼─── DivIcon
                                │
                                │               ┌─── BoxZoom
                                │               │
                                │               ├─── DoubleClickZoom
                                │               │
                                │               ├─── Drag
                                │               │
                                └─── Handler ───┼─── Keyboard
                                                │
                                                ├─── ScrollWheelZoom
                                                │
                                                ├─── TapHold
                                                │
                                                └─── TouchZoom
```

![](/assets/images/gis/leaflet/leaflet-class-diagram.png)

```text
                                              ┌─── DrawToolbar
                              ┌─── Toolbar ───┤
leaflet.draw ───┼─── Class ───┤               └─── EditToolbar
                              │
                              └─── Control ───┼─── Draw
```
