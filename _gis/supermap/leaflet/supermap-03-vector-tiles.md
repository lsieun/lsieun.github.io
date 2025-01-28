---
title: "SuperMap: vector tiles"
sequence: "123"
---

Vector tiles organize and define vector data through different description files,
analyze data in real time and complete rendering on the client.

SuperMap iServer provides vector tile layers, namely `new L.supermap.TiledVectorLayer(url, options)`:

- `url`: Map service address
- `options`: Layer optional parameter

```text
const url = "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China";

// Initialize map
const map = L.map('map', {
  center: [40, 120],
  maxZoom: 18,
  zoom: 5
});

//Create a vector tile layer
const vectorLayer = new TiledVectorLayer(url, {
  cacheEnabled: true,
  returnAttributes: true,
  attribution: "Tile Data©SuperMap iServer with©SuperMap iClient"
}).addTo(map);

//Adds click event to the vector tile layer, sets default style
vectorLayer.on('click', function (evt: any) {
  // Click the vector tile layer to get id & layerName
  const id = evt.layer.properties.id;
  const layerName = evt.layer.layerName;
  // Set the style for vector tile layer
  const selectStyle = {
    fillColor: '#800026',
    fillOpacity: 0.5,
    stroke: true,
    fill: true,
    color: 'red',
    opacity: 1,
    weight: 2
  };
  vectorLayer.setFeatureStyle(id, layerName, selectStyle);
});
```


