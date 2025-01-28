---
title: "GeoJSON"
sequence: "101"
---

## Basic

{%
assign filtered_posts = site.gis |
where_exp: "item", "item.url contains '/gis/geojson/'" |
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

- [Github: GeoLatte](https://github.com/GeoLatte/)
  - [GeoLatte/geolatte-geom](https://github.com/GeoLatte/geolatte-geom)

从GeoJson到Java对象

- [Spring Boot(MVC)下空间字段(Geometry)与geojson的自动转换](https://www.codeleading.com/article/9920678678/)

从Java对象到数据库

- [数据库Geometry字段操作](https://blog.csdn.net/God_Father_kao/article/details/121329256)，通过这个页面，我学会了使用JDBC读取相应的Geometry信息
- [Java 操作Gis geometry类型数据](https://github.com/lovebetterworld/postgres/blob/48119fd3518d37770bb0b134223b9825b8585b63/6.PostgreSQL%20PostGIS%20GIST/12.Java%20PostgreSQL%20Geometry%E5%BA%94%E7%94%A8/Java%20%E6%93%8D%E4%BD%9Cgis%20geometry%E7%B1%BB%E5%9E%8B%E6%95%B0%E6%8D%AE.md)
- [Mybatis-plus读取和保存geometry数据](https://blog.csdn.net/zhangkaixuan456/article/details/121235428)
- [mybatis支持mysql的geometry类型字段](https://www.jianshu.com/p/3b42ff717750)
- [扩展mybatis和通用mapper，支持mysql的geometry类型字段](https://www.cnblogs.com/lookup/p/11523409.html)
- [mybatis读写数据库 geometry类型数据](https://blog.csdn.net/s_hloo/article/details/111311022)
- [mybatis-plus 读写空间数据 geometry类型](https://blog.csdn.net/qq_41722795/article/details/119600604)
- [mybatis读写数据库 geometry类型数据](https://codeantenna.com/a/iBy59n9uan)
- [Using GEOMETRY and GEOGRAPHY Data Types in JDBC](https://www.vertica.com/docs/9.2.x/HTML/Content/Authoring/AnalyzingData/Geospatial/GeospatialAnalytics/UsingGEOMETRYAndGEOGRAPHYDataTypesInJDBC.htm)

