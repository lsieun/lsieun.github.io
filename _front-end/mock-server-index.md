---
title: "Mock Server"
sequence: "201"
---

## MirageJS

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/mock-server/miragejs/'" |
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

## JSON Server

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/mock-server/json-server/'" |
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

- [Github: json-server](https://github.com/typicode/json-server)
