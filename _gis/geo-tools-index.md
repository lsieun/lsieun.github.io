---
title: "GeoTools"
sequence: "101"
---

```text
<dependency>
  <groupId>org.geolatte</groupId>
  <artifactId>geolatte-geojson</artifactId>
  <version>1.8.0</version>
</dependency>
```

- This `geoLatte-geom` library offers a geometry model that conforms to the OGC Simple Features for SQL specification.
- This `geoLatte-geojson` library provides a Jackson module for serializing Geometry objects to GeoJson specification.

两者的关系：`geoLatte-geojson` 是依赖 `geoLatte-geom` 类库的。

## Basic

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/geotools/'" |
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

- [GeoTools](https://geotools.org/)
