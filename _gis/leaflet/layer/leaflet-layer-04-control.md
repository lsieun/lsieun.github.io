---
title: "Layer Control"
sequence: "104"
---

## Layers Control

```text
L.control.layers(<Object> baselayers?, <Object> overlays?, <Control.Layers options> options?)
```

Leaflet has a nice little control that allows your users to control which layers they see on your map.
In addition to showing you how to use it, we'll also show you another handy use for layer groups.



In this example, we want to have two base layers (a grayscale and a colored base map) to switch between,
and an overlay to switch on and off: the city markers we created earlier.

Now let's create those base layers and add the default ones to the map:

```text
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var streets = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

var map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    layers: [osm, cities]
});
```

Next, we'll create two objects.
One will contain our base layers and one will contain our overlays.
These are just simple objects with key/value pairs.
The key sets the text for the layer in the control (e.g. “Streets”),
while the corresponding value is a reference to the layer (e.g. streets).

```text
var baseMaps = {
    "OpenStreetMap": osm,
    "Mapbox Streets": streets
};

var overlayMaps = {
    "Cities": cities
};
```

Now, all that's left to do is to create a **Layers Control** and add it to the map.
The first argument passed when creating the layers control is the **base layers** object.
The second argument is the **overlays** object.
Both arguments are optional: you can pass just a base layers object by omitting the second argument,
or just an overlays objects by passing `null` as the first argument.
In each case, the omitted layer type will not appear for the user to select.

```text
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
```

Note that we added `osm` and `cities` layers to the map but didn't add `streets`.
The layers control is smart enough to detect what layers we've already added
and have corresponding checkboxes and radioboxes set.

Also note that when using multiple base layers,
**only one of them should be added to the map at instantiation**,
**but all of them should be present in the base layers object when creating the layers control**.

You can also style the keys when you define the objects for the layers.
For example, this code will make the label for the grayscale map gray:

```text
var baseMaps = {
    "<span style='color: gray'>Grayscale</span>": grayscale,
    "Streets": streets
};
```

Finally, you can add or remove base layers or overlays dynamically:

```text
var crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.'),
    rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');
    
var parks = L.layerGroup([crownHill, rubyHill]);
var satellite = L.tileLayer(mapboxUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

layerControl.addBaseLayer(satellite, "Satellite");
layerControl.addOverlay(parks, "Parks");
```

## 示例

### 示例一：切换base layer

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

### 示例二：切换overlay

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
        zoom: 13,
        layers: [osm]
    });

    // 第一步，添加两个底图
    const baseMaps = {
        "OpenStreetMap": osm,
        "Mapbox Streets": streets
    };

    const cities = L.layerGroup();

    const mLittleton = L.marker([30.032541581093586, 119.97756958007814]).bindPopup('This is Littleton, CO.').addTo(cities);
    const mDenver = L.marker([30.029123392306236, 120.00246047973634]).bindPopup('This is Denver, CO.').addTo(cities);
    const mAurora = L.marker([30.0316498910357, 120.0223731994629]).bindPopup('This is Aurora, CO.').addTo(cities);
    const mGolden = L.marker([30.02436745529417, 120.05438804626466]).bindPopup('This is Golden, CO.').addTo(cities);

    const overlays = {
        'Cities': cities
    };
    const layerControl = L.control.layers(baseMaps, overlays).addTo(map);

    // 第二步，动态添加overlay
    const crownHill = L.marker([29.976200746844345, 119.97199058532716]).bindPopup('This is Crown Hill Park.');
    const rubyHill = L.marker([29.97679554007324, 120.03344535827638]).bindPopup('This is Ruby Hill Park.');

    const parks = L.layerGroup([crownHill, rubyHill]);
    layerControl.addOverlay(parks, 'Parks');
</script>

</body>
</html>
```

## Reference

- [API: Control.Layers](https://leafletjs.com/reference.html#control-layers)
