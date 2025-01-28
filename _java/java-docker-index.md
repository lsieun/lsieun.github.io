---
title: "Docker"
sequence: "101"
---

## Content

{%
assign filtered_posts = site.java |
where_exp: "item", "item.url contains '/java/docker/'" |
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

- [Build your Java image](https://docs.docker.com/language/java/build-images/)
- [A Docker Guide for Java](https://www.baeldung.com/docker-java-api)
