---
title: "Grafana"
sequence: "101"
---

## Config

{%
assign filtered_posts = site.apm |
where_exp: "item", "item.url contains '/apm/grafana/config/'" |
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

- [Grafana Labs](https://grafana.com/)
    - [Dashboards](https://grafana.com/grafana/dashboards/)
    - [Plugins](https://grafana.com/grafana/plugins/)
