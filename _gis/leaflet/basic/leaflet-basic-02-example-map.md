---
title: "示例: 地图"
sequence: "102"
---

步骤：

- 第一步，引入`leaflet.css`和`leaflet-src.js`
- 第二步，定义div
- 第三步，编写Javascript，加载图层

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

