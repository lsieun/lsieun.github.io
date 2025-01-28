---
title: "Leaflet"
sequence: "102"
---

## Basic

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/leaflet/basic/'" |
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

## Geometry

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/leaflet/geometry/'" |
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

## Layer

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/leaflet/layer/'" |
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

## GeoJSON

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/leaflet/geojson/'" |
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

## Draw

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/leaflet/draw/'" |
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

## API

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/leaflet/api/'" |
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

### Leaflet

- [Leaflet](https://leafletjs.com/index.html)
- [lsieun/learn-leaflet](https://github.com/lsieun/learn-leaflet)

### API

- [Leaflet API reference](https://leafletjs.com/reference.html)
    - [L.map](https://leafletjs.com/reference.html#map)


- [Leaflet 进阶知识点](https://blog.csdn.net/sinat_31213021/category_10975037.html)
    - [《Leaflet 进阶知识点》- L.polygon 多边形绘制详解](https://blog.csdn.net/sinat_31213021/article/details/119612744)

### Leaflet Draw

- [Leaflet Draw API reference](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html)
- [Leaflet-Geoman](https://github.com/geoman-io/leaflet-geoman)

The latest version of `leaflet.draw`:

- [https://cdnjs.com/libraries/leaflet.draw](https://cdnjs.com/libraries/leaflet.draw)
