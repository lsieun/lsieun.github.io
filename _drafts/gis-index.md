---
title: "GIS"
image: /assets/images/gis/gis-cover.webp
permalink: /gis.html
---

GIS = Geographic Information System

- [GeoJSON]({% link _gis/geo-json-index.md %})
- [Geolatte]({% link _gis/geolatte-index.md %})
- [GeoTools]({% link _gis/geo-tools-index.md %})
- [Leaflet]({% link _gis/leaflet-index.md %})
- [SuperMap]({% link _gis/supermap-index.md %})


## CRS

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/crs/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>


## Reference

- [lsieun/learn-java-gis](https://github.com/lsieun/learn-java-gis)
- [lsieun/learn-java-geom](https://github.com/lsieun/learn-java-geom)

GIS

- [Wiki.GIS.com](http://wiki.gis.com/wiki/index.php/Main_Page)
  - [Transverse Mercator projection](http://wiki.gis.com/wiki/index.php/Transverse_Mercator_projection)
- [GIS Dictionary](https://support.esri.com/en-us/gis-dictionary)

OGC

- [Open Geospatial Consortium](https://www.ogc.org/)

ESRI

- [ArcGIS Pro help](https://pro.arcgis.com/en/pro-app/3.1/help/main/)

PROJ

- [PROJ](https://proj.org/)
- [Understanding a CRS: Proj4 and CRS codes](https://pygis.io/docs/d_understand_crs_codes.html)

GeoLatte

- [Github: GeoLatte](https://github.com/GeoLatte/)
    - [GeoLatte/geolatte-geom](https://github.com/GeoLatte/geolatte-geom):
      A geometry model that conforms to the OGC Simple Features for SQL specification.
    - [GeoJson module](https://github.com/GeoLatte/geolatte-geom/blob/master/json/README.md)

GeoTools

- [GeoTools](https://geotools.org/)
    - [GeoTools Documentation](https://docs.geotools.org/)
    - [Geometry CRS Tutorial](https://docs.geotools.org/latest/tutorials/geometry/geometrycrs.html)

JTS

- [JTS Topology Suite](https://github.com/locationtech/jts) is a Java library for creating and manipulating vector geometry.


JavaScript

- [Leaflet](https://leafletjs.com/)
    - [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw): Leaflet Plugin For Vector drawing and editing
        - [Leaflet Draw API reference](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html)
    - [Leaflet-Geoman](https://github.com/geoman-io/leaflet-geoman): Leaflet Plugin For Creating And Editing
      Geometry Layers
- [Turf.js](http://turfjs.org/)
- [OpenLayers](https://openlayers.org/)

Server

- [GeoServer](https://geoserver.org/)



Other

- [geometry-api-java](https://github.com/Esri/geometry-api-java)



