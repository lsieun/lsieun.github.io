---
title: "Axios"
sequence: "201"
---

{%
assign filtered_posts = site.front-end |
where_exp: "item", "item.url contains '/front-end/axios/'" |
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
