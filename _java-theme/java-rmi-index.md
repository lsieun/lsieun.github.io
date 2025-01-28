---
title: "Java RMI"
sequence: "rmi"
---

Java Remote Method Invocation

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/rmi/'" |
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


