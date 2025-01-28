---
title: "Properties"
sequence: "java-properties"
---



{%
assign filtered_posts = site.java |
where_exp: "item", "item.path contains 'java/properties/'" |
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
