---
title: "SuperMap: Drawing symbols and graphics"
sequence: "124"
---

## 安装leaflet-draw

For the Leaflet itself does not support the drawing of point, line and polygon,
the plugin `leaflet.draw.js` needs to be imported.

```text
npm install leaflet-draw --verbose
npm install @types/leaflet-draw -D --verbose
```

安装完成之后，在`node_modules`目录下会有`leaflet-draw`子目录。

## 引入CSS

在`main.ts`文件中引入`leaflet.draw.css`文件：

```text
import 'leaflet-draw/dist/leaflet.draw.css'
```

## Basic drawing

When imported the plugin, the point, line and polygon drawing function is implemented by the following code:

```text
import {nextTick} from 'vue';
import L from 'leaflet';
import 'leaflet-draw';
import {TiledMapLayer} from '@supermap/iclient-leaflet';

const url = "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China";

// Initialize map
const map = L.map('map', {
  center: {lat: 33, lng: 114},
  maxZoom: 18,
  zoom: 4
});

//Create a layer
const layer = new TiledMapLayer(url);
layer.addTo(map);

// Create a drawing layer
const editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

// Draw the configuration of control parameter
const options = {
  position: 'topleft',
  draw: {
    polyline: {}, // line
    polygon: {}, // polygon
    circle: {}, // circle
    rectangle:{}, // rectangle
    marker: {}, // marker
    remove: {}
  },
  edit: {
    featureGroup: editableLayers,
    remove: true
  }
};

// Create and add a draw control
const drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

// monitor drawing events
map.on(L.Draw.Event.CREATED, function (e: any) {
  const type = e.layerType;
  const layer = e.layer;
  editableLayers.addLayer(layer);
});
```

## Capture drawing

Capture drawing means that the mouse enters a certain tolerance range of an already drawn point when drawing,
and the mouse is absorbed to the position of the already drawn point.

The Leaflet itself does not support point, line and polygon capture drawing.
It is necessary to import [leaflet-geoman](https://github.com/geoman-io/leaflet-geoman) plugins.

```text
npm install @geoman-io/leaflet-geoman-free --verbose
```

### 引入CSS

在`main.ts`文件中引入`leaflet-geoman.css`文件：

```text
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
```

### 实现功能

```text
<script setup lang="ts">
import {nextTick} from 'vue';
import L from 'leaflet';
import 'leaflet-draw';
import '@geoman-io/leaflet-geoman-free';
import {TiledMapLayer} from '@supermap/iclient-leaflet';

nextTick(() => {
  console.log('nextTick');
  const url = "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China";

  // Initialize map
  const map = L.map('map', {
    center: {lat: 33, lng: 114},
    maxZoom: 18,
    zoom: 4
  });

  //Create a layer
  const layer = new TiledMapLayer(url);
  layer.addTo(map);

  // Capture drawing control parameter settings
  const options = {
    position: 'topleft', // Control position
    drawMarker: true, // Whether marker drawing is optional
    drawPolygon: true, // Whether drawPolygon drwaing is optional
    drawPolyline: true, // Whether drawPolyline drawing is optional
    editPolygon: true, // Whether EditPolygon editing is optional
    deleteLayer: true
  };

  // Add Capture drawing control
  map.pm.addControls(options);
});
</script>
```

## Reference

- [Leaflet-Geoman](https://github.com/geoman-io/leaflet-geoman)

