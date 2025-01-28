---
title: "示例: popup"
sequence: "104"
---

## 示例一：单独的popup

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

    const popup = L.popup()
        .setLatLng([30.014260331613986, 120.0465774536133])
        .setContent('I am a standalone popup.')
        .openOn(map);

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent('You clicked the map at ' + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
</script>

</body>
</html>
```

## 示例二：添加popup

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

    const marker = L.marker([30, 120]).addTo(map)
        .bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup();

    const mytable = '<table><tr><th>姓名</th><th>年龄</th></tr><tr><td>小明</td><td>10</td></tr><tr><td>小红</td><td>10</td></tr></table>';

    const circle = L.circle([29.98051291706061, 119.95765686035158], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map).bindPopup(mytable);

    const polygon = L.polygon([
        [29.998651720385457, 120.00984191894533],
        [29.989285375094507, 120.00623703002931],
        [29.972185799395607, 120.00932693481447],
        [29.974118942496585, 120.04520416259767],
        [29.99225891379294, 120.04314422607423],
        [29.999246379135947, 120.03610610961915]
    ]).addTo(map).bindPopup('I am a polygon.');
</script>

</body>
</html>
```
