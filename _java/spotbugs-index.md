---
title: "SpotBugs"
sequence: "101"
---

## Content

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/spotbugs/'" |
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
