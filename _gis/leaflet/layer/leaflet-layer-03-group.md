---
title: "Layer Group"
sequence: "103"
---

## Overview

```text
Map --- Layer Group --- Layer
```

The `LayerGroup` was used to group several layers and handle them as one.
If you add it to the map, any layers added or removed from the group will be added/removed on the map as well.

## 创建

语法：

```text
L.layerGroup(<Layer[]> layers?, <Object> options?)
```

示例：

```text
L.layerGroup([marker1, marker2])
    .addLayer(polyline)
    .addTo(map);
```

Let's suppose you have a bunch of layers you want to combine into a group to handle them as one in your code:

```text
var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
    denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
```

Instead of adding them directly to the map, you can do the following, using the `LayerGroup` class:

```text
var cities = L.layerGroup([littleton, denver, aurora, golden]);
```

Now you have a `cities` layer that combines your city markers into one layer
you can add or remove from the map at once.

## Methods

```text
              ┌─── add ───────┼─── addLayer(<Layer> layer)
              │
              │               ┌─── removeLayer(<Layer> layer)
              ├─── remove ────┤
              │               └─── clearLayers()
              │
              │                              ┌─── eachLayer(<Function> fn, <Object> context?)
              │               ┌─── all ──────┤
              ├─── get ───────┤              └─── getLayers()
              │               │
              │               └─── single ───┼─── hasLayer(<Layer> layer)
LayerGroup ───┤
              │                              ┌─── getLayerId(<Layer> layer)
              │                              │
              │               ┌─── get ──────┼─── getLayer(<Number> id)
              │               │              │
              ├─── layerId ───┤              └─── hasLayer(<Number> id)
              │               │
              │               └─── remove ───┼─── removeLayer(<Number> id)
              │
              ├─── zIndex ────┼─── setZIndex(<Number> zIndex)
              │
              └─── export ────┼─── toGeoJSON(<Number|false> precision?)
```

```text
addLayer(<Layer> layer)
removeLayer(<Layer> layer)
```

```text
hasLayer(<Layer> layer)
```

### 遍历

```text
eachLayer(<Function> fn, <Object> context?)
getLayers()
```

### 清空

```text
clearLayers()
```

### toGeoJSON

```text
toGeoJSON(<Number|false> precision?)
```

### LayerId

```text
getLayerId(<Layer> layer)
getLayer(<Number> id)
removeLayer(<Number> id)
hasLayer(<Number> id)
```

## 示例

### 示例一

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Quick Start</title>

    <!-- 第一步，引入leaflet.css和leaflet-src.js -->
    <link rel="stylesheet" href="../leaflet.css" crossorigin=""/>
    <script src="../leaflet-src.js" crossorigin=""></script>

    <style>
        html, body {
            height: 100%;
            margin: 0;
        }
        .leaflet-container {
            height: 600px;
            width: 800px;
            max-width: 100%;
            max-height: 100%;
            border: 1px solid greenyellow;
            margin: auto;
        }
    </style>
</head>
<body>

<!-- 第二步，定义div -->
<div id="map" class="leaflet-container"></div>

<!-- 第三步，编写Javascript，加载图层 -->
<script>
    const map = L.map('map').setView([30, 120], 13);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const firstPoint = L.marker([30.013219833932094, 119.96263504028322]).bindPopup('This is the First Point');
    const secondPoint = L.marker([30.022583920091417, 120.01670837402345]).bindPopup('This is the Second Point');
    const thirdPoint = L.marker([29.97486244905764, 119.96280670166017]).bindPopup('This is the Third Point');
    const fourthPoint = L.marker([29.9828919653158, 120.02889633178712]).bindPopup('This is the Fourth Point');

    const layerGroup = L.layerGroup([firstPoint, secondPoint, thirdPoint, fourthPoint]);
    layerGroup.addTo(map);
</script>

</body>
</html>
```

## Reference

- [API: LayerGroup](https://leafletjs.com/reference.html#layergroup)
