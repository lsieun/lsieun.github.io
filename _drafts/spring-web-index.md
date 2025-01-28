---
title: "Spring MVC"
image: /assets/images/spring-mvc/spring-mvc-cover.png
permalink: /spring-web.html
---

A Spring MVC is a Java framework which is used to build web applications. It follows the Model-View-Controller design pattern.

## Annotation

{%
assign filtered_posts = site.spring-mvc |
where_exp: "item", "item.url contains '/spring-mvc/annotation/'" |
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

## References

- [REST with Spring Tutorial](https://www.baeldung.com/rest-with-spring-series)
