---
title: "Echarts"
sequence: "201"
---

## Content

### Basic

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/echarts/basic/'" |
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

- [Apache ECharts](https://echarts.apache.org)
  - [Handbook](https://echarts.apache.org/handbook/en/get-started/)
  - [Examples](https://echarts.apache.org/examples/en/index.html)
  - [API](https://echarts.apache.org/en/api.html#echarts)

