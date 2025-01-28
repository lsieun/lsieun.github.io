---
title: "Base Layer"
sequence: "102"
---

## 示例

### 示例一：One Base Layer

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
</script>

</body>
</html>
```

### 示例二：two base layer

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
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    });

    const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const streets = L.tileLayer(mbUrl, {
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        attribution: mbAttr
    });

    const map = L.map('map', {
        center: [30, 120],
        zoom: 10,
        layers: [osm, streets]
    });
</script>

</body>
</html>
```

### 示例三：切换底图

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
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const streets = L.tileLayer(mbUrl, {
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        attribution: mbAttr
    });

    const map = L.map('map', {
        center: [30, 120],
        zoom: 10,
        layers: [osm, streets]
    });

    // 第一步，添加两个底图
    const baseMaps = {
        "OpenStreetMap": osm,
        "Mapbox Streets": streets
    };
    const layerControl = L.control.layers(baseMaps).addTo(map);

    // 第二步，动态添加第三个底图
    const satellite = L.tileLayer(mbUrl, {
        id: 'mapbox/satellite-v9',
        tileSize: 512,
        zoomOffset: -1,
        attribution: mbAttr
    });
    layerControl.addBaseLayer(satellite, 'Satellite');
</script>

</body>
</html>
```

