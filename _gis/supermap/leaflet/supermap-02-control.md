---
title: "SuperMap: Control"
sequence: "122"
---

## Intro

By adding controls to the map, you can achieve interactive operations
such as zooming in, zooming out, and layer switching.

Commonly used controls:

| Control         | Class name           | Introduction                                        |
|-----------------|----------------------|-----------------------------------------------------|
| Eagle-eye Map   | L.control.minimap    | The default is in the lower right corner of the map |
| Zoom            | L.control.zoom       | The default is in the top left corner of the map    |
| Scale           | L.control.scale      | The default is at the bottom left corner of the map |
| Layer switching | L.control.layers     | The default is in the top right corner of the map   |
| Swipe           | L.control.sideBySide | Swipe appears in the center of the map by default   |

When adding a control,you should **initialize the map first**,
and then add the control to the map via the `addTo()` method.

## Zoom control

```text
// Add Control
L.control.zoom().addTo(map);
```

## Layer switch control

```text
const url ="https://iserver.supermap.io";
const China = new TiledMapLayer(url + '/iserver/services/map-china400/rest/maps/China',{noWrap:true});
const ChinaDark = new TiledMapLayer(url + '/iserver/services/map-china400/rest/maps/ChinaDark', {noWrap:true});

// Initialize map
const map = L.map('map', {
  center: {lng: 0, lat: 0},
  maxZoom: 18,
  zoom: 2,
  zoomControl: false,
  layers: [China, ChinaDark]
});

const baseMaps = { "China": China, "ChinaDark": ChinaDark };
// Add layer switch control
L.control.layers(baseMaps).addTo(map);
```

