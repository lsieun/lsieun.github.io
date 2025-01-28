---
title: "SuperMap"
sequence: "121"
---

## Leaflet

{% 
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/supermap/leaflet/'" |
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

- [SuperMap iClient for Leaflet](https://iclient.supermap.io/en/web/introduction/leaflet.html)
  - [SuperMap iClient for Leaflet](https://iclient.supermap.io/en/web/introduction/leafletDevelop.html)
      - [Drawing symbols and graphics](https://iclient.supermap.io/en/web/introduction/leafletDevelop.html#drawSymbolsAndGraphs)
- [iServer](https://iclient.supermap.io/en/examples/leaflet/examples.html#iServer)

示例：

- [多边形编辑](https://iclient.supermap.io/en/examples/leaflet/editor.html#snapAndModify)

Leaflet示例

- [示例](https://github.com/SuperMap/iClient-JavaScript/tree/master/examples/leaflet)
