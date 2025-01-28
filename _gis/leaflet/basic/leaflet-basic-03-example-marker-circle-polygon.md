---
title: "示例: marker/circle/polygon"
sequence: "103"
---

## 示例一

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

    const marker = L.marker([30, 120]).addTo(map);

    const circle = L.circle([29.98051291706061, 119.95765686035158], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

    const polygon = L.polygon([
        [29.998651720385457, 120.00984191894533],
        [29.989285375094507, 120.00623703002931],
        [29.972185799395607, 120.00932693481447],
        [29.974118942496585, 120.04520416259767],
        [29.99225891379294, 120.04314422607423],
        [29.999246379135947, 120.03610610961915]
    ]).addTo(map);
</script>

</body>
</html>
```


